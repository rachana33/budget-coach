from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # card, bank, loan
    issuer = Column(String, nullable=True)
    credit_limit = Column(Float, nullable=True)

    loan_principal = Column(Float, nullable=True)
    loan_interest_rate = Column(Float, nullable=True)
    emi_amount = Column(Float, nullable=True)

    transactions = relationship("Transaction", back_populates="account")


class RecurringExpense(Base):
    __tablename__ = "recurring_expenses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    billing_cycle = Column(String, default="monthly")
    category = Column(String, nullable=False)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)
    tags = Column(String, nullable=True)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=True)

    account = relationship("Account", back_populates="transactions")
    goal = relationship("Goal", back_populates="transactions")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    goal_type = Column(String, nullable=False)  # 'purchase' or 'loan_payoff'
    target_date = Column(DateTime, nullable=True)
    monthly_contribution = Column(Float, nullable=True)
    loan_account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    current_progress = Column(Float, default=0.0)
    priority = Column(Integer, default=1)
    desired_monthly = Column(Float, nullable=True)

    class Config:
        orm_mode = True

    transactions = relationship("Transaction", back_populates="goal")
