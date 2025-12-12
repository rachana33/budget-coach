from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/recurring-expenses", tags=["recurring_expenses"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[schemas.RecurringExpense])
def list_recurring_expenses(db: Session = Depends(get_db)):
    return db.query(models.RecurringExpense).all()


@router.post("/", response_model=schemas.RecurringExpense)
def create_recurring_expense(
    exp: schemas.RecurringExpenseCreate, db: Session = Depends(get_db)
):
    db_exp = models.RecurringExpense(**exp.dict())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp
