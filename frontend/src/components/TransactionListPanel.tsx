import React, { useMemo, useState } from 'react'
import SectionCard from './SectionCard'
import { Transaction, Goal } from '../types'
import { formatCurrency } from '../utils/format'
import { normalizeCategoryKey } from '../utils/categories'

interface TransactionListPanelProps {
  transactions: Transaction[]
  limits?: Record<string, { label: string; amount: number }>
  goals?: Goal[]
  onUpdate?: (id: number, payload: Partial<Transaction>) => Promise<void>
  onDelete?: (id: number) => Promise<void>
}

const TransactionListPanel: React.FC<TransactionListPanelProps> = ({
  transactions,
  limits = {},
  goals = [],
  onUpdate,
  onDelete,
}) => {
  const goalMap = useMemo(() => {
    const map = new Map<number, string>()
    goals.forEach((goal) => map.set(goal.id, goal.title))
    return map
  }, [goals])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const set = new Set<string>()
    transactions.forEach((tx) => set.add(tx.category))
    return ['all', ...Array.from(set).sort()]
  }, [transactions])

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [transactions])

  const groupedTransactions = useMemo(() => {
    const filtered =
      filterCategory === 'all'
        ? sortedTransactions
        : sortedTransactions.filter((tx) => tx.category === filterCategory)

    const grouped = new Map<string, Transaction[]>()
    filtered.forEach((tx) => {
      const key = tx.category
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(tx)
    })

    return Array.from(grouped.entries())
      .map(([category, txs]) => ({
        category,
        transactions: txs,
        total: txs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
      }))
      .sort((a, b) => b.total - a.total)
  }, [sortedTransactions, filterCategory])

  const handleDelete = async (id: number) => {
    if (onDelete) {
      await onDelete(id)
    }
    setDeleteConfirmId(null)
  }

  return (
    <SectionCard
      title="All transactions"
      subtitle="View, edit, and manage your transaction history by category"
      actions={
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All categories' : cat}
            </option>
          ))}
        </select>
      }
    >
      {groupedTransactions.length === 0 ? (
        <p className="text-sm text-slate-400">No transactions found.</p>
      ) : (
        <div className="max-h-[600px] space-y-6 overflow-y-auto pr-2">
          {groupedTransactions.map(({ category, transactions: txs, total }) => {
            const categoryKey = normalizeCategoryKey(category)
            const limit = limits[categoryKey]
            const isOver = limit && total > limit.amount

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">{category}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {txs.length} transaction{txs.length !== 1 ? 's' : ''} · Total{' '}
                      <span className={isOver ? 'font-semibold text-rose-300' : 'text-slate-300'}>
                        {formatCurrency(total)}
                      </span>
                      {limit && (
                        <span className="ml-2 text-slate-500">
                          / {formatCurrency(limit.amount)} limit
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {txs.map((tx) => {
                    const isExpense = tx.amount < 0
                    const isDeleting = deleteConfirmId === tx.id
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/60 px-4 py-3 text-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500">
                              {new Date(tx.date).toLocaleDateString()}
                            </span>
                            <span className="text-slate-200">
                              {tx.description || '—'}
                            </span>
                            {tx.goal_id && goalMap.has(tx.goal_id) && (
                              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300">
                                🎯 {goalMap.get(tx.goal_id)}
                              </span>
                            )}
                            {tx.tags && (
                              <span className="rounded bg-slate-800/60 px-2 py-0.5 text-xs text-slate-400">
                                {tx.tags}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`font-semibold ${
                              isExpense ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {formatCurrency(Math.abs(tx.amount))}
                          </span>
                          {onDelete && (
                            <div className="flex items-center gap-2">
                              {isDeleting ? (
                                <>
                                  <button
                                    onClick={() => handleDelete(tx.id)}
                                    className="rounded border border-rose-500/60 px-2 py-1 text-xs text-rose-300 transition hover:bg-rose-500/20"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(tx.id)}
                                  className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </SectionCard>
  )
}

export default TransactionListPanel
