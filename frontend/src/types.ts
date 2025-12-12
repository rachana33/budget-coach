export interface Account {
  id: number
  name: string
  type: 'card' | 'bank' | 'loan'
  issuer?: string | null
  credit_limit?: number | null
  loan_principal?: number | null
  loan_interest_rate?: number | null
  emi_amount?: number | null
}

export interface RecurringExpense {
  id: number
  name: string
  amount: number
  billing_cycle: string
  category: string
}

export interface Transaction {
  id: number
  account_id?: number | null
  date: string
  amount: number
  category: string
  description?: string | null
  tags?: string | null
  goal_id?: number | null
}

export interface MonthlyOverview {
  month: string
  income: number
  expenses: number
  savings: number
  fixed_expenses: number
  variable_expenses: number
  category_breakdown: Record<string, number>
}

export interface MicroHabit {
  category: string
  total_spent: number
  transaction_count: number
  average_amount: number
  suggested_reduction_percent: number
  estimated_savings: number
}

export interface MicroHabitsResponse {
  month: string
  micro_habits: MicroHabit[]
}

export interface CoachInsight {
  title: string
  detail: string
  estimated_monthly_savings?: number | null
}

export interface CoachResponse {
  month: string
  summary: string
  insights: CoachInsight[]
  action_items: string[]
}

export interface AccountCreateInput {
  name: string
  type: 'card' | 'bank' | 'loan'
  issuer?: string
  credit_limit?: number | null
  loan_principal?: number | null
  loan_interest_rate?: number | null
  emi_amount?: number | null
}

export interface RecurringExpenseCreateInput {
  name: string
  amount: number
  billing_cycle: string
  category: string
}

export interface TransactionCreateInput {
  account_id?: number | null
  date?: string
  amount: number
  category: string
  description?: string
  tags?: string
  goal_id?: number | null
}

export interface Goal {
  id: number
  title: string
  target_amount: number
  goal_type: 'purchase' | 'loan_payoff'
  target_date?: string | null
  monthly_contribution?: number | null
  loan_account_id?: number | null
  created_at: string
  current_progress: number
  desired_monthly?: number | null
  priority: number
}

export interface GoalCreateInput {
  title: string
  target_amount: number
  goal_type: 'purchase' | 'loan_payoff'
  target_date?: string | null
  monthly_contribution?: number | null
  loan_account_id?: number | null
  desired_monthly?: number | null
  priority?: number | null
}

export interface GoalPlanAllocation {
  goal_id: number
  title: string
  priority: number
  desired_monthly?: number | null
  suggested_allocation: number
}

export interface GoalPlanResponse {
  monthly_surplus: number
  total_desired: number
  allocations: GoalPlanAllocation[]
}

export interface GoalSummary {
  goal: Goal
  month: string
  transaction_contribution: number
  desired_monthly?: number | null
  remaining_amount: number
  projected_completion?: string | null
}
