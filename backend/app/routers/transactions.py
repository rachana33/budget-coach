from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/transactions", tags=["transactions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[schemas.Transaction])
def list_transactions(
    month: Optional[str] = Query(None, description="YYYY-MM"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Transaction)

    if month:
        year, mon = map(int, month.split("-"))
        start = datetime(year, mon, 1)
        if mon == 12:
            end = datetime(year + 1, 1, 1)
        else:
            end = datetime(year, mon + 1, 1)
        query = query.filter(models.Transaction.date >= start,
                             models.Transaction.date < end)

    return query.order_by(models.Transaction.date.desc()).all()


@router.post("/", response_model=schemas.Transaction)
def create_transaction(
    tx: schemas.TransactionCreate, db: Session = Depends(get_db)
):
    data = tx.dict()
    if data.get("date") is None:
        data["date"] = datetime.utcnow()
    db_tx = models.Transaction(**data)
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx


@router.put("/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(
    transaction_id: int,
    tx_update: schemas.TransactionCreate,
    db: Session = Depends(get_db),
):
    db_tx = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_tx:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Transaction not found")
    for key, value in tx_update.dict(exclude_unset=True).items():
        setattr(db_tx, key, value)
    db.commit()
    db.refresh(db_tx)
    return db_tx


@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_tx = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_tx:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(db_tx)
    db.commit()
    return {"message": "Transaction deleted"}
