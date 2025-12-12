import React, { useMemo, useState } from 'react'
import SectionCard from './SectionCard'
import { Account, Goal, Transaction, TransactionCreateInput } from '../types'
import { normalizeCategoryKey } from '../utils/categories'
import { formatCurrency } from '../utils/format'

const EXPENSE_CATEGORIES = [
  'Rent & Housing',
  'Utilities',
  'Groceries',
  'Eating Out',
  'Transport',
  'Shopping',
  'Subscriptions',
  'Health',
  'Travel',
  'Miscellaneous',
]

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Refund',
  'Other Income',
]

interface TransactionPanelProps {
  monthLabel: string
  month: string
  accounts: Account[]
  transactions: Transaction[]
  onCreateTransaction: (payload: TransactionCreateInput) => Promise<void>
  limits?: Record<string, { label: string; amount: number }>
  goals?: Goal[]
}

const TransactionPanel: React.FC<TransactionPanelProps> = ({
  monthLabel,
  month,
  accounts,
  transactions,
  onCreateTransaction,
  limits = {},
  goals = [],
}) => {
  const [form, setForm] = useState<TransactionCreateInput>({
    account_id: undefined,
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    category: 'Eating Out',
    description: '',
    tags: '',
    goal_id: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [kind, setKind] = useState<'expense' | 'income'>('expense')

  const handleKindChange = (newKind: 'expense' | 'income') => {
    setKind(newKind)
    setForm((prev) => ({
      ...prev,
      category: newKind === 'income' ? 'Salary' : 'Eating Out',
    }))
  }

  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) => transaction.date.startsWith(month))
  }, [transactions, month])

  const totalSpend = monthTransactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)

  const totalIncome = monthTransactions
    .filter((transaction) => transaction.amount >= 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const spendByCategory = useMemo(() => {
    const map = new Map<string, number>()
    monthTransactions.forEach((transaction) => {
      if (transaction.amount < 0) {
        const key = normalizeCategoryKey(transaction.category)
        map.set(key, (map.get(key) ?? 0) + Math.abs(transaction.amount))
      }
    })
    return map
  }, [monthTransactions])

  const currentCategoryKey = normalizeCategoryKey(form.category)
  const categoryLimit = limits[currentCategoryKey]
  const categorySpent = categoryLimit ? spendByCategory.get(currentCategoryKey) ?? 0 : 0
  const categoryRemaining = categoryLimit ? categoryLimit.amount - categorySpent : null
  const categoryOver = categoryRemaining !== null && categoryRemaining < 0

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const payload: TransactionCreateInput = {
        ...form,
        amount: (() => {
          const raw = Number(form.amount) || 0
          if (raw === 0) return 0
          return kind === 'expense' ? -Math.abs(raw) : Math.abs(raw)
        })(),
        account_id: form.account_id || undefined,
        description: form.description?.trim() || undefined,
        tags: form.tags?.trim() || undefined,
        goal_id: form.goal_id || undefined,
      }

      await onCreateTransaction(payload)
      setForm((prev) => ({
        ...prev,
        amount: 0,
        description: '',
        tags: '',
        goal_id: undefined,
      }))
      setKind('expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard
      title="Quick log"
      subtitle={`Capture ${monthLabel} transactions and cash flow`}
      actions={
        <div className="flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:gap-4">
          <span>Income: {formatCurrency(totalIncome)}</span>
          <span>Spend: {formatCurrency(totalSpend)}</span>
          {categoryLimit && (
            <span className={categoryOver ? 'text-rose-300 font-semibold' : 'text-emerald-300'}>
              {categoryOver
                ? `Over ${formatCurrency(Math.abs(categoryRemaining))} in ${categoryLimit.label}`
                : `${formatCurrency(categoryRemaining ?? 0)} remaining in ${categoryLimit.label}`}
            </span>
          )}
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Amount
              </span>
              <input
                type="number"
                step="0.01"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                value={form.amount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))
                }
                required
              />
              <div className="mt-2 flex gap-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => handleKindChange('expense')}
                  className={`rounded-md px-2 py-1 font-semibold transition ${
                    kind === 'expense'
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-400/60'
                      : 'border border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleKindChange('income')}
                  className={`rounded-md px-2 py-1 font-semibold transition ${
                    kind === 'income'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/60'
                      : 'border border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Income
                </button>
              </div>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Date
              </span>
              <input
                type="date"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Category</span>
            <select
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            >
              {(kind === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Account</span>
            <select
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              value={form.account_id ?? ''}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  account_id: event.target.value ? Number(event.target.value) : undefined,
                }))
              }
            >
              <option value="">Cash / unspecified</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>

          {goals.length > 0 && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Goal (optional)
              </span>
              <select
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                value={form.goal_id ?? ''}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    goal_id: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
              >
                <option value="">Unassigned</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500">
                Tag income or savings deposits to track goal progress automatically
              </span>
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Description
            </span>
            <input
              type="text"
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              placeholder="e.g., Zomato lunch"
              value={form.description ?? ''}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Tags</span>
            <input
              type="text"
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              placeholder="food, weekend"
              value={form.tags ?? ''}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40"
          >
            {loading ? 'Logging…' : 'Log transaction'}
          </button>
        </div>
      </form>
    </SectionCard>
  )
}

export default TransactionPanel
