import React, { useMemo, useState } from 'react'
import SectionCard from './SectionCard'
import { formatCurrency } from '../utils/format'
import { Goal, GoalCreateInput } from '../types'

export type { Goal, GoalCreateInput }

interface GoalsPanelProps {
  goals: Goal[]
  accounts: Array<{ id: number; name: string; type: string }>
  goalTransactions?: Record<number, number>
  monthlySurplus?: number
  onCreateGoal: (payload: GoalCreateInput) => Promise<void>
  onDeleteGoal: (id: number) => Promise<void>
  onViewProjection?: (id: number) => void
}

const GoalsPanel: React.FC<GoalsPanelProps> = ({
  goals,
  accounts,
  goalTransactions = {},
  monthlySurplus = 0,
  onCreateGoal,
  onDeleteGoal,
  onViewProjection,
}) => {
  const [form, setForm] = useState<GoalCreateInput>({
    title: '',
    target_amount: 0,
    goal_type: 'purchase',
    target_date: null,
    monthly_contribution: null,
    loan_account_id: null,
  })
  const [loading, setLoading] = useState(false)

  const loanAccounts = accounts.filter((acc) => acc.type === 'loan')

  const totalTargeted = useMemo(() => goals.reduce((sum, goal) => sum + (goal.desired_monthly ?? 0), 0), [goals])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      await onCreateGoal(form)
      setForm({
        title: '',
        target_amount: 0,
        goal_type: 'purchase',
        target_date: null,
        monthly_contribution: null,
        loan_account_id: null,
      })
    } finally {
      setLoading(false)
    }
  }

  const suggestedAllocations = useMemo(() => {
    if (!monthlySurplus || monthlySurplus <= 0) return []
    const totalDesired = goals.reduce((sum, goal) => sum + (goal.desired_monthly ?? 0), 0)
    if (totalDesired === 0) return goals.map((goal) => ({ goal, allocation: monthlySurplus / goals.length }))
    return goals.map((goal) => {
      const desired = goal.desired_monthly ?? 0
      const ratio = desired / totalDesired
      return { goal, allocation: monthlySurplus * ratio }
    })
  }, [goals, monthlySurplus])

  return (
    <SectionCard title="Financial goals" subtitle="Track savings targets and loan payoff plans">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Goal title
            </span>
            <input
              required
              type="text"
              placeholder="e.g., New laptop"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Type
            </span>
            <select
              value={form.goal_type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  goal_type: e.target.value as 'purchase' | 'loan_payoff',
                }))
              }
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="purchase">Purchase / Savings</option>
              <option value="loan_payoff">Loan Payoff</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Target amount (USD)
            </span>
            <input
              required
              type="number"
              min={0}
              step="0.01"
              value={form.target_amount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, target_amount: Number(e.target.value) }))
              }
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Monthly contribution
            </span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.monthly_contribution ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  monthly_contribution: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
        </div>

        {form.goal_type === 'loan_payoff' && (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Loan account
            </span>
            <select
              value={form.loan_account_id ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  loan_account_id: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="">Select loan account</option>
              {loanAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40"
          >
            {loading ? 'Creating...' : 'Add goal'}
          </button>
        </div>
      </form>

      {monthlySurplus > 0 && goals.length > 0 && (
        <div className="mt-6 rounded-xl border border-brand-600/40 bg-brand-500/10 p-4">
          <p className="text-sm font-semibold text-brand-100">
            Suggested allocation for ${formatCurrency(monthlySurplus)} surplus this month
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {suggestedAllocations.map(({ goal, allocation }) => (
              <div key={goal.id} className="flex items-center justify-between">
                <span>{goal.title}</span>
                <span>{formatCurrency(allocation)}</span>
              </div>
            ))}
          </div>
          {totalTargeted > 0 && (
            <p className="mt-2 text-xs text-brand-200">
              Based on desired contributions totaling {formatCurrency(totalTargeted)} across goals.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {goals.length === 0 ? (
          <p className="text-sm text-slate-400">No goals yet. Add one above to start tracking.</p>
        ) : (
          goals.map((goal) => {
            const progress = (goal.current_progress / goal.target_amount) * 100
            const monthlyContribution = goal.desired_monthly ?? goal.monthly_contribution ?? null
            const transactionContribution = goalTransactions[goal.id] ?? 0
            const effectiveMonthly = monthlyContribution || transactionContribution || null
            return (
              <div
                key={goal.id}
                className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-100">{goal.title}</h4>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {goal.goal_type === 'purchase' ? 'Savings goal' : 'Loan payoff'}
                    </p>
                    {goal.target_date && (
                      <p className="mt-1 text-xs text-slate-400">
                        Target date: {new Date(goal.target_date).toLocaleDateString()}
                      </p>
                    )}
                    {effectiveMonthly && (
                      <p className="mt-1 text-xs text-slate-400">
                        Monthly plan: {formatCurrency(effectiveMonthly)}
                        {transactionContribution && !monthlyContribution ? ' (tracked from transactions)' : ''}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    {onViewProjection && (
                      <button
                        onClick={() => onViewProjection(goal.id)}
                        className="rounded border border-brand-500/60 px-3 py-1 text-xs text-brand-200 transition hover:bg-brand-500/20"
                      >
                        View projection
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span className="font-medium text-slate-300">
                      {formatCurrency(goal.current_progress)} / {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
                {goal.goal_type === 'loan_payoff' && goal.loan_account_id && (
                  <p className="mt-3 text-xs text-slate-400">
                    Linked loan account ID: {goal.loan_account_id}
                  </p>
                )}
                {transactionContribution > 0 && (
                  <p className="mt-1 text-xs text-slate-400">
                    This month’s contributions from transactions: {formatCurrency(transactionContribution)}
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>
    </SectionCard>
  )
}

export default GoalsPanel
