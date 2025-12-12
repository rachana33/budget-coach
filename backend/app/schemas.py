from datetime import datetime
from typing import Optional, List, Dict

from pydantic import BaseModel


class AccountBase(BaseModel):
    name: str
    type: str
    issuer: Optional[str] = None
    credit_limit: Optional[float] = None
    loan_principal: Optional[float] = None
    loan_interest_rate: Optional[float] = None
    emi_amount: Optional[float] = None


class AccountCreate(AccountBase):
    pass


class Account(AccountBase):
    id: int

    class Config:
        orm_mode = True


class RecurringExpenseBase(BaseModel):
    name: str
    amount: float
    billing_cycle: str = "monthly"
    category: str


class RecurringExpenseCreate(RecurringExpenseBase):
    pass


class RecurringExpense(RecurringExpenseBase):
    id: int

    class Config:
        orm_mode = True


class TransactionBase(BaseModel):
    account_id: Optional[int] = None
    date: Optional[datetime] = None
    amount: float
    category: str
    description: Optional[str] = None
    tags: Optional[str] = None
    goal_id: Optional[int] = None


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int

    class Config:
        orm_mode = True


class MonthlyOverview(BaseModel):
    month: str
    income: float
    expenses: float
    savings: float
    fixed_expenses: float
    variable_expenses: float
    category_breakdown: Dict[str, float]


class MicroHabit(BaseModel):
    category: str
    total_spent: float
    transaction_count: int
    average_amount: float
    suggested_reduction_percent: float
    estimated_savings: float


class MicroHabitsResponse(BaseModel):
    month: str
    micro_habits: List[MicroHabit]


class CoachInsight(BaseModel):
    title: str
    detail: str
    estimated_monthly_savings: Optional[float] = None


class CoachResponse(BaseModel):
    month: str
    summary: str
    insights: List[CoachInsight]
    action_items: List[str]


class GoalBase(BaseModel):
    title: str
    target_amount: float
    goal_type: str  # 'purchase' or 'loan_payoff'
    target_date: Optional[datetime] = None
    monthly_contribution: Optional[float] = None
    loan_account_id: Optional[int] = None
    priority: Optional[int] = 1
    desired_monthly: Optional[float] = None


class GoalCreate(GoalBase):
    pass


class Goal(GoalBase):
    id: int
    created_at: datetime
    current_progress: float = 0.0
    desired_monthly: Optional[float] = None
    priority: int = 1

    class Config:
        orm_mode = True


class RangeTrendMonth(BaseModel):
    month: str
    income: float
    expenses: float


class RangeOverview(BaseModel):
    start_date: str
    end_date: str
    total_income: float
    total_expenses: float
    net_savings: float
    category_breakdown: Dict[str, float]
    monthly_trend: List[RangeTrendMonth]


class GoalPlanAllocation(BaseModel):
    goal_id: int
    title: str
    priority: int
    desired_monthly: Optional[float] = None
    suggested_allocation: float


class GoalPlanResponse(BaseModel):
    monthly_surplus: float
    total_desired: float
    allocations: List[GoalPlanAllocation]


class GoalContribution(BaseModel):
    goal_id: int
    month: str
    amount: float


class GoalContributionResponse(BaseModel):
    month: str
    contributions: List[GoalContribution]


class GoalSummary(BaseModel):
    goal: Goal
    month: str
    transaction_contribution: float
    desired_monthly: Optional[float] = None
    remaining_amount: float
    projected_completion: Optional[str] = None
