from typing import List, Optional, Tuple
from datetime import datetime
from dateutil.relativedelta import relativedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/goals", tags=["goals"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _month_bounds(month: str) -> Tuple[datetime, datetime]:
    year, mon = map(int, month.split("-"))
    start = datetime(year, mon, 1)
    if mon == 12:
        end = datetime(year + 1, 1, 1)
    else:
        end = datetime(year, mon + 1, 1)
    return start, end


def _goal_delta(goal: models.Goal, amount: float) -> float:
    """Return the delta to apply to goal.current_progress based on transaction amount."""
    if goal.goal_type == "loan_payoff":
        return -amount
    return amount


@router.get("/", response_model=List[schemas.Goal])
def list_goals(db: Session = Depends(get_db)):
    goals = db.query(models.Goal).all()
    # Calculate current_progress from tagged transactions
    for goal in goals:
        transactions = db.query(models.Transaction).filter(models.Transaction.goal_id == goal.id).all()
        total = sum(abs(tx.amount) for tx in transactions if tx.amount > 0)
        goal.current_progress = total
    return goals


@router.post("/", response_model=schemas.Goal)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    payload = goal.dict(exclude_unset=True)
    if payload.get("priority") is None:
        payload["priority"] = 1
    db_goal = models.Goal(**payload)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


@router.get("/{goal_id}", response_model=schemas.Goal)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    # Calculate current_progress from tagged transactions
    transactions = db.query(models.Transaction).filter(models.Transaction.goal_id == goal.id).all()
    total = sum(abs(tx.amount) for tx in transactions if tx.amount > 0)
    goal.current_progress = total
    return goal


@router.put("/{goal_id}", response_model=schemas.Goal)
def update_goal(goal_id: int, goal_update: schemas.GoalCreate, db: Session = Depends(get_db)):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    for key, value in goal_update.dict(exclude_unset=True).items():
        setattr(db_goal, key, value)
    db.commit()
    db.refresh(db_goal)
    return db_goal


@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(db_goal)
    db.commit()
    return {"message": "Goal deleted"}


@router.get("/{goal_id}/projection")
def get_goal_projection(goal_id: int, db: Session = Depends(get_db)):
    """
    Calculate loan payoff or savings goal projection with monthly breakdown.
    """
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    if goal.goal_type == "loan_payoff" and goal.loan_account_id:
        account = db.query(models.Account).filter(models.Account.id == goal.loan_account_id).first()
        if not account or not account.loan_principal or not account.loan_interest_rate:
            raise HTTPException(status_code=400, detail="Loan account data incomplete")

        principal = account.loan_principal
        annual_rate = account.loan_interest_rate / 100.0
        monthly_rate = annual_rate / 12.0
        monthly_payment = goal.monthly_contribution or account.emi_amount or 0.0

        if monthly_payment <= 0:
            raise HTTPException(status_code=400, detail="Monthly payment must be positive")

        # Amortization schedule
        balance = principal
        months = 0
        schedule = []
        total_interest = 0.0

        while balance > 0 and months < 600:  # cap at 50 years
            interest_payment = balance * monthly_rate
            principal_payment = monthly_payment - interest_payment
            if principal_payment <= 0:
                raise HTTPException(status_code=400, detail="Payment too low to cover interest")
            balance -= principal_payment
            if balance < 0:
                principal_payment += balance
                balance = 0
            total_interest += interest_payment
            months += 1
            if months <= 12 or months % 6 == 0:  # sample every 6 months after first year
                schedule.append({
                    "month": months,
                    "balance": round(balance, 2),
                    "principal_paid": round(principal_payment, 2),
                    "interest_paid": round(interest_payment, 2),
                })

        payoff_date = datetime.utcnow() + relativedelta(months=months)

        return {
            "goal_id": goal.id,
            "goal_type": "loan_payoff",
            "total_months": months,
            "payoff_date": payoff_date.isoformat(),
            "total_interest": round(total_interest, 2),
            "total_paid": round(principal + total_interest, 2),
            "schedule": schedule,
        }

    elif goal.goal_type == "purchase":
        target = goal.target_amount
        current = goal.current_progress
        monthly = goal.monthly_contribution or 0.0

        if monthly <= 0:
            raise HTTPException(status_code=400, detail="Monthly contribution must be positive")

        remaining = target - current
        months_needed = int((remaining / monthly) + 0.5) if monthly > 0 else 0
        target_date_calc = datetime.utcnow() + relativedelta(months=months_needed)

        schedule = []
        accumulated = current
        for m in range(1, months_needed + 1):
            accumulated += monthly
            if m <= 12 or m % 3 == 0:
                schedule.append({
                    "month": m,
                    "accumulated": round(min(accumulated, target), 2),
                })

        return {
            "goal_id": goal.id,
            "goal_type": "purchase",
            "months_needed": months_needed,
            "target_date": target_date_calc.isoformat(),
            "current_progress": round(current, 2),
            "remaining": round(remaining, 2),
            "schedule": schedule,
        }

    else:
        raise HTTPException(status_code=400, detail="Unsupported goal type or missing data")


@router.get("/summary", response_model=List[schemas.GoalSummary])
def goal_summary(
    month: str = Query(..., description="YYYY-MM"),
    db: Session = Depends(get_db),
):
    start, end = _month_bounds(month)
    goals = db.query(models.Goal).order_by(models.Goal.priority, models.Goal.id).all()
    summaries: List[schemas.GoalSummary] = []

    for goal in goals:
        tx_query = (
            db.query(models.Transaction)
            .filter(models.Transaction.goal_id == goal.id)
            .filter(models.Transaction.date >= start, models.Transaction.date < end)
        )
        transactions = tx_query.all()

        if goal.goal_type == "loan_payoff":
            transaction_contribution = sum(-tx.amount for tx in transactions if tx.amount < 0)
        else:
            transaction_contribution = sum(tx.amount for tx in transactions if tx.amount > 0)

        remaining = max(goal.target_amount - (goal.current_progress or 0.0), 0.0)
        monthly_target = goal.desired_monthly or goal.monthly_contribution or 0.0
        projected_completion: Optional[str] = None
        if monthly_target > 0 and remaining > 0:
            months_left = int((remaining / monthly_target) + 0.999)
            projected_date = datetime.utcnow() + relativedelta(months=months_left)
            projected_completion = projected_date.isoformat()

        summaries.append(
            schemas.GoalSummary(
                goal=goal,
                month=month,
                transaction_contribution=round(transaction_contribution, 2),
                desired_monthly=goal.desired_monthly,
                remaining_amount=round(remaining, 2),
                projected_completion=projected_completion,
            )
        )

    return summaries


@router.get("/plan", response_model=schemas.GoalPlanResponse)
def goal_plan(
    monthly_surplus: float = Query(..., description="Amount available for goals this month"),
    db: Session = Depends(get_db),
):
    goals = db.query(models.Goal).order_by(models.Goal.priority, models.Goal.id).all()
    positive_desired = sum(max(goal.desired_monthly or 0.0, 0.0) for goal in goals)
    allocations: List[schemas.GoalPlanAllocation] = []

    for goal in goals:
        desired = max(goal.desired_monthly or 0.0, 0.0)
        if positive_desired > 0 and desired > 0:
            allocation = monthly_surplus * (desired / positive_desired)
        elif positive_desired > 0:
            allocation = 0.0
        else:
            allocation = monthly_surplus / len(goals) if goals else 0.0

        allocations.append(
            schemas.GoalPlanAllocation(
                goal_id=goal.id,
                title=goal.title,
                priority=goal.priority,
                desired_monthly=goal.desired_monthly,
                suggested_allocation=round(allocation, 2),
            )
        )

    total_desired = sum(goal.desired_monthly or 0.0 for goal in goals)

    return schemas.GoalPlanResponse(
        monthly_surplus=monthly_surplus,
        total_desired=total_desired,
        allocations=allocations,
    )
