import React, { useMemo, useState } from 'react'
import SectionCard from './SectionCard'
import { normalizeCategoryKey } from '../utils/categories'
import { formatCurrency } from '../utils/format'

interface CategoryLimitsPanelProps {
  categories: string[]
  limits: Record<string, { label: string; amount: number }>
  onSaveLimit: (label: string, amount: number) => void
  onRemoveLimit: (key: string) => void
}

const CategoryLimitsPanel: React.FC<CategoryLimitsPanelProps> = ({
  categories,
  limits,
  onSaveLimit,
  onRemoveLimit,
}) => {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState<number | ''>('')

  const sortedLimits = useMemo(
    () =>
      Object.entries(limits).sort(([, a], [, b]) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }),
      ),
    [limits],
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = label.trim()
    if (!trimmed || amount === '' || amount < 0) return
    onSaveLimit(trimmed, Number(amount))
    setLabel('')
    setAmount('')
  }

  return (
    <SectionCard
      title="Category limits"
      subtitle="Set a ceiling for the categories you care about most"
    >
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Category
          </span>
          <input
            list="category-limit-suggestions"
            placeholder="e.g., Dining Out"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            required
          />
          <datalist id="category-limit-suggestions">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Monthly limit (USD)
          </span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value === '' ? '' : Number(event.target.value))}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            required
          />
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
          >
            Save limit
          </button>
        </div>
      </form>

      {sortedLimits.length > 0 && (
        <div className="mt-4 space-y-2">
          {sortedLimits.map(([key, limit]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
            >
              <div>
                <p className="font-medium text-slate-100">{limit.label}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Limit {formatCurrency(limit.amount)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveLimit(key)}
                className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

export default CategoryLimitsPanel
