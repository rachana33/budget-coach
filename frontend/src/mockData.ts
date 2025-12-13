import { Account, CoachResponse, Goal, MicroHabitsResponse, MonthlyOverview, RecurringExpense, Transaction } from './types'

export const MOCK_ACCOUNTS: Account[] = [
    {
        id: 101,
        name: 'Chase Sapphire',
        type: 'card',
        issuer: 'Chase',
        credit_limit: 15000,
    },
    {
        id: 102,
        name: 'Checking Account',
        type: 'bank',
    },
]

export const MOCK_RECURRING: RecurringExpense[] = [
    {
        id: 201,
        name: 'Netflix',
        amount: 15.99,
        billing_cycle: 'monthly',
        category: 'Entertainment',
    },
    {
        id: 202,
        name: 'Gym Membership',
        amount: 50.00,
        billing_cycle: 'monthly',
        category: 'Health',
    },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 301,
        date: '2025-11-01',
        amount: 12.50,
        category: 'Food & Dining',
        description: 'Coffee Shop',
        account_id: 101,
    },
    {
        id: 302,
        date: '2025-11-05',
        amount: 120.00,
        category: 'Groceries',
        description: 'Whole Foods',
        account_id: 101,
    },
    {
        id: 303,
        date: '2025-11-10',
        amount: 45.00,
        category: 'Transport',
        description: 'Uber',
        account_id: 101,
    },
]

export const MOCK_OVERVIEW: MonthlyOverview = {
    month: '2025-11',
    income: 5000,
    expenses: 243.49,
    savings: 4756.51,
    fixed_expenses: 65.99,
    variable_expenses: 177.50,
    category_breakdown: {
        'Food & Dining': 12.50,
        'Groceries': 120.00,
        'Transport': 45.00,
        'Entertainment': 15.99,
        'Health': 50.00,
    },
}

export const MOCK_MICRO_HABITS: MicroHabitsResponse = {
    month: '2025-11',
    micro_habits: [
        {
            category: 'Food & Dining',
            total_spent: 125,
            transaction_count: 5,
            average_amount: 25,
            suggested_reduction_percent: 10,
            estimated_savings: 12.5,
        },
    ],
}

export const MOCK_GOALS: Goal[] = [
    {
        id: 401,
        title: 'New Laptop',
        target_amount: 2000,
        goal_type: 'purchase',
        created_at: '2025-01-01',
        current_progress: 500,
        priority: 1,
    },
]

export const MOCK_COACH: CoachResponse = {
    month: '2025-11',
    summary: 'You are on track with your budget this month. Great job keeping dining expenses low!',
    insights: [
        {
            title: 'Coffee Spending',
            detail: 'You spent less on coffee this week compared to last week.',
            estimated_monthly_savings: 20,
        },
    ],
    action_items: ['Consider putting the extra savings into your Laptop goal.'],
}
