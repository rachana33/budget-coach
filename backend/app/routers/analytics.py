from collections import defaultdict
from datetime import datetime
from typing import List, Tuple

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/analytics", tags=["analytics"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _month_range(month: str) -> Tuple[datetime, datetime]:
    year, mon = map(int, month.split("-"))
    start = datetime(year, mon, 1)
    if mon == 12:
        end = datetime(year + 1, 1, 1)
    else:
        end = datetime(year, mon + 1, 1)
    return start, end


def calculate_monthly_overview(db: Session, month: str) -> schemas.MonthlyOverview:
    start, end = _month_range(month)

    txs = (
        db.query(models.Transaction)
        .filter(models.Transaction.date >= start,
                models.Transaction.date < end)
        .all()
    )

    income = 0.0
    expenses = 0.0
    category_breakdown = defaultdict(float)

    for tx in txs:
        if tx.amount >= 0:
            income += tx.amount
        else:
            expenses += -tx.amount
            category_breakdown[tx.category] += -tx.amount

    fixed_expenses = 0.0

    recs = db.query(models.RecurringExpense).all()
    for r in recs:
        fixed_expenses += r.amount

    loan_accounts = (
        db.query(models.Account)
        .filter(models.Account.type == "loan",
                models.Account.emi_amount.isnot(None))
        .all()
    )
    emi_total = sum(a.emi_amount or 0.0 for a in loan_accounts)
    fixed_expenses += emi_total

    variable_expenses = max(expenses - fixed_expenses, 0.0)
    savings = income - expenses

    return schemas.MonthlyOverview(
        month=month,
        income=income,
        expenses=expenses,
        savings=savings,
        fixed_expenses=fixed_expenses,
        variable_expenses=variable_expenses,
        category_breakdown=dict(category_breakdown),
    )


def find_micro_habits(db: Session, month: str) -> List[schemas.MicroHabit]:
    start, end = _month_range(month)

    txs = (
        db.query(models.Transaction)
        .filter(models.Transaction.date >= start,
                models.Transaction.date < end,
                models.Transaction.amount < 0)
        .all()
    )

    by_cat = defaultdict(list)
    for tx in txs:
        by_cat[tx.category].append(-tx.amount)

    micro_habits: List[schemas.MicroHabit] = []
    for cat, amounts in by_cat.items():
        count = len(amounts)
        total = sum(amounts)
        avg = total / count if count else 0.0

        if count < 3 or avg > 200:
            continue

        reduction_percent = 30.0
        estimated_savings = total * (reduction_percent / 100.0)

        micro_habits.append(
            schemas.MicroHabit(
                category=cat,
                total_spent=total,
                transaction_count=count,
                average_amount=avg,
                suggested_reduction_percent=reduction_percent,
                estimated_savings=estimated_savings,
            )
        )

    return micro_habits


@router.get("/overview", response_model=schemas.MonthlyOverview)
def monthly_overview(
    month: str = Query(..., description="YYYY-MM"),
    db: Session = Depends(get_db),
):
    return calculate_monthly_overview(db, month)


@router.get("/micro-habits", response_model=schemas.MicroHabitsResponse)
def micro_habits(
    month: str = Query(..., description="YYYY-MM"),
    db: Session = Depends(get_db),
):
    micro_habits_list = find_micro_habits(db, month)
    return schemas.MicroHabitsResponse(month=month, micro_habits=micro_habits_list)


@router.get("/range", response_model=schemas.RangeOverview)
def range_overview(
    start_month: str = Query(..., description="YYYY-MM"),
    end_month: str = Query(..., description="YYYY-MM"),
    db: Session = Depends(get_db),
):
    """
    Aggregate analytics across a date range.
    """
    start_year, start_mon = map(int, start_month.split("-"))
    end_year, end_mon = map(int, end_month.split("-"))

    if (end_year, end_mon) < (start_year, start_mon):
        raise HTTPException(
            status_code=400,
            detail="End month must be the same as or after the start month.",
        )
    start_date = datetime(start_year, start_mon, 1)
    if end_mon == 12:
        end_date = datetime(end_year + 1, 1, 1)
    else:
        end_date = datetime(end_year, end_mon + 1, 1)

    txs = (
        db.query(models.Transaction)
        .filter(models.Transaction.date >= start_date, models.Transaction.date < end_date)
        .all()
    )

    if not txs:
        # Return empty data structure if no transactions found
        return schemas.RangeOverview(
            start_date=start_month,
            end_date=end_month,
            total_income=0.0,
            total_expenses=0.0,
            net_savings=0.0,
            category_breakdown={},
            monthly_trend=[],
        )

    total_income = 0.0
    total_expenses = 0.0
    category_breakdown = defaultdict(float)
    monthly_data = defaultdict(lambda: {"income": 0.0, "expenses": 0.0})

    for tx in txs:
        month_key = tx.date.strftime("%Y-%m")
        if tx.amount >= 0:
            total_income += tx.amount
            monthly_data[month_key]["income"] += tx.amount
        else:
            total_expenses += -tx.amount
            monthly_data[month_key]["expenses"] += -tx.amount
            category_breakdown[tx.category] += -tx.amount

    net_savings = total_income - total_expenses
    monthly_trend = [
        schemas.RangeTrendMonth(month=k, income=v["income"], expenses=v["expenses"])
        for k, v in sorted(monthly_data.items())
    ]

    return schemas.RangeOverview(
        start_date=start_month,
        end_date=end_month,
        total_income=total_income,
        total_expenses=total_expenses,
        net_savings=net_savings,
        category_breakdown=dict(category_breakdown),
        monthly_trend=monthly_trend,
    )
