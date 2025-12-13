import json
import re
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from openai import OpenAI
from sqlalchemy.orm import Session

from .. import schemas
from ..config import get_settings
from ..database import SessionLocal
from .analytics import calculate_monthly_overview, find_micro_habits

router = APIRouter(prefix="/coach", tags=["coach"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _format_prompt(overview: schemas.MonthlyOverview, micro_habits: List[schemas.MicroHabit]) -> str:
    overview_payload = overview.dict()
    micro_payload = [habit.dict() for habit in micro_habits]

    prompt = (
        "You are a helpful personal finance coach. "
        "Using the provided structured data, craft friendly, specific, and practical guidance.\n"
        "Return a JSON object with keys: summary (string), insights (list of objects with"
        " title, detail, estimated_monthly_savings), and action_items (list of strings).\n"
        "Avoid shaming; focus on actionable advice and realistic habit tweaks."
    )

    prompt += "\n\nStructured data:\n"
    prompt += json.dumps(
        {
            "monthly_overview": overview_payload,
            "micro_habits": micro_payload,
        },
        indent=2,
    )

    prompt += (
        "\n\nGuidelines:\n"
        "- Highlight the most impactful categories or patterns.\n"
        "- When estimating savings, provide numeric values in the JSON.\n"
        "- Offer no more than 5 action items.\n"
        "- If data is sparse, give general-yet-practical budgeting tips.\n"
        "Respond strictly with JSON only, no extra prose."
    )

    return prompt


def _extract_json_payload(text: str) -> Optional[dict]:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        candidate = match.group(0)
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            return None

    return None


@router.post("/", response_model=schemas.CoachResponse)
def generate_coach_response(
    month: str = Query(..., description="YYYY-MM"),
    db: Session = Depends(get_db),
):
    overview = calculate_monthly_overview(db, month)
    micro_habits = find_micro_habits(db, month)

    settings = get_settings()
    
    # Check if API key is configured
    if not settings.openai_api_key:
        raise HTTPException(
            status_code=503,
            detail="AI coach feature is not available. OpenAI API key is not configured."
        )
    
    client = OpenAI(api_key=settings.openai_api_key)

    prompt = _format_prompt(overview, micro_habits)

    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
    except Exception as exc:  # pragma: no cover - external API failures
        raise HTTPException(status_code=502, detail=f"AI provider error: {exc}")

    try:
        content = response.choices[0].message.content
        parsed = _extract_json_payload(content)
        if parsed is None:
            raise ValueError("Model response was not valid JSON")
    except Exception as exc:  # pragma: no cover - unexpected response format
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {exc}")

    insights_payload = parsed.get("insights", [])
    action_items = parsed.get("action_items", [])
    summary = parsed.get("summary", "")

    insights: List[schemas.CoachInsight] = []
    for item in insights_payload:
        title = item.get("title") or "Insight"
        detail = item.get("detail") or ""
        estimated_savings = item.get("estimated_monthly_savings")
        if isinstance(estimated_savings, str):
            try:
                estimated_savings = float(estimated_savings)
            except ValueError:
                estimated_savings = None
        insights.append(
            schemas.CoachInsight(
                title=title,
                detail=detail,
                estimated_monthly_savings=estimated_savings,
            )
        )

    action_items = [str(item) for item in action_items][:5]

    return schemas.CoachResponse(
        month=month,
        summary=summary,
        insights=insights,
        action_items=action_items,
    )
