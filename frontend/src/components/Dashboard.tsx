import React, { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type Plugin,
} from 'chart.js'

import SectionCard from './SectionCard'
import StatsCard from './StatsCard'
import TransactionPanel from './TransactionPanel'
import { MicroHabitsResponse, MonthlyOverview, Transaction } from '../types'
import { formatCurrency, formatNumber } from '../utils/format'
import { normalizeCategoryKey } from '../utils/categories'

interface DashboardProps {
  monthLabel: string
  month: string
  overview: MonthlyOverview | null
  microHabits: MicroHabitsResponse | null
  transactions: Transaction[]
  limits?: Record<string, { label: string; amount: number }>
  coach?: any
  loadingCoach?: boolean
  onRangeChange?: (startMonth: string, endMonth: string) => void
  onMonthChange?: (month: string) => void
  onAddAccount?: () => void
  onAddRecurring?: () => void
  onAddTransaction?: () => void
  onManageLimits?: () => void
  onManageGoals?: () => void
  onViewTrends?: () => void
  onToggleCoach?: () => void
  coachVisible?: boolean
}

const COLORS = ['#4c6ef5', '#4263eb', '#364fc7', '#748ffc', '#5c7cfa', '#3b5bdb']

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const Dashboard: React.FC<DashboardProps> = ({
  monthLabel,
  month,
  overview,
  microHabits,
  transactions,
  limits = {},
  coach,
  loadingCoach = false,
  onRangeChange,
  onMonthChange,
  onAddAccount,
  onAddRecurring,
  onAddTransaction,
  onManageLimits,
  onManageGoals,
  onViewTrends,
  onToggleCoach,
  coachVisible = false,
}) => {
  const [rangeMode, setRangeMode] = useState(false)
  const [startMonth, setStartMonth] = useState('')
  const [endMonth, setEndMonth] = useState('')
  const categoryData = useMemo(() => {
    if (!overview) return []
    return Object.entries(overview.category_breakdown).map(([category, value]) => ({
      category,
      value,
      key: normalizeCategoryKey(category),
    }))
  }, [overview])

  const categorySeries = useMemo(() => {
    return categoryData
      .map((item) => {
        const limitEntry = limits[item.key]
        const limit = limitEntry?.amount ?? null
        const overLimit = limit !== null && item.value > limit
        return {
          ...item,
          limit,
          overLimit,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [categoryData, limits])

  const categoryChartData: ChartData<'bar'> = useMemo(() => {
    return {
      labels: categorySeries.map((item) => item.category),
      datasets: [
        {
          label: 'Spending',
          data: categorySeries.map((item) => item.value),
          borderRadius: {
            topLeft: 16,
            topRight: 16,
            bottomLeft: 4,
            bottomRight: 4,
          },
          borderSkipped: false,
          barPercentage: 0.75,
          categoryPercentage: 0.85,
          backgroundColor: categorySeries.map((item, index) =>
            item.overLimit ? '#f87171' : COLORS[index % COLORS.length],
          ),
          hoverBackgroundColor: categorySeries.map((item, index) =>
            item.overLimit ? '#fca5a5' : COLORS[index % COLORS.length],
          ),
          borderWidth: 0,
        },
      ],
    }
  }, [categorySeries])

  const categoryLimitPlugin: Plugin<'bar'> = useMemo(
    () => ({
      id: 'categoryLimitLabels',
      afterDatasetsDraw: (chart) => {
        const ctx = chart.ctx
        const dataset = chart.data.datasets[0]
        if (!dataset) return
        const meta = chart.getDatasetMeta(0)
        ctx.save()
        meta.data.forEach((barElement: any, index: number) => {
          const rawValue = dataset.data[index]
          if (rawValue == null) return
          const dataValue = Array.isArray(rawValue) ? rawValue[0] : Number(rawValue)
          const valueLabel = formatCurrency(dataValue)
          const entry = categorySeries[index]
          const limit = entry?.limit ?? null
          const overLimit = entry?.overLimit ?? false
          const props = barElement.getProps(['x', 'y', 'base', 'height'], true)
          const base = Number(props.base)
          const x = Number(props.x)
          const y = Number(props.y)
          const height = Number(props.height)
          const isZero = dataValue === 0
          const textY = isZero ? base - 12 : y - 12
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          ctx.font = '600 12px "Inter", system-ui'
          ctx.fillStyle = '#f8fafc'
          ctx.fillText(valueLabel, x, textY)
          if (limit !== null) {
            ctx.font = '500 11px "Inter", system-ui'
            ctx.fillStyle = overLimit ? '#f87171' : '#94a3b8'
            ctx.fillText(
              `${overLimit ? 'Over' : 'Limit'} ${formatCurrency(limit)}`,
              x,
              textY - 16,
            )
          }
        })
        ctx.restore()
      },
    }),
    [categorySeries],
  )

  const categoryChartOptions = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'x',
      animation: {
        duration: 800,
        easing: 'easeInOutQuart',
        delay: (context) => {
          let delay = 0
          if (context.type === 'data' && context.mode === 'default') {
            delay = context.dataIndex * 80
          }
          return delay
        },
      },
      layout: {
        padding: {
          right: 16,
          left: 16,
          top: 48,
          bottom: 8,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: '#e2e8f0',
            font: {
              size: 13,
              family: 'Inter, system-ui, sans-serif',
            },
            padding: 8,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(148, 163, 184, 0.15)',
            drawBorder: false,
            lineWidth: 1,
          },
          border: {
            display: false,
          },
          ticks: {
            color: '#94a3b8',
            callback: (value) => `$${formatNumber(Number(value))}`,
            font: {
              size: 11,
              family: 'Inter, system-ui, sans-serif',
            },
            padding: 12,
          },
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderColor: 'rgba(148, 163, 184, 0.3)',
          borderWidth: 1,
          padding: 14,
          cornerRadius: 8,
          titleFont: {
            size: 13,
            family: 'Inter, system-ui, sans-serif',
          },
          bodyFont: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          displayColors: true,
          boxWidth: 12,
          boxHeight: 12,
          boxPadding: 6,
          callbacks: {
            label: (context) => {
              const limit = categorySeries[context.dataIndex]?.limit ?? null
              const parts = [`Spent: ${formatCurrency(Number(context.parsed.y))}`]
              if (limit !== null) {
                parts.push(`Limit: ${formatCurrency(limit)}`)
                const remaining = limit - Number(context.parsed.y)
                if (remaining < 0) {
                  parts.push(`⚠️ Over by ${formatCurrency(Math.abs(remaining))}`)
                } else {
                  parts.push(`✓ ${formatCurrency(remaining)} remaining`)
                }
              }
              return parts
            },
          },
        },
      },
    }),
    [categorySeries],
  )

  const categoryLimitStatus = useMemo(() => {
    if (!overview) return []
    return Object.entries(limits).map(([key, limit]) => {
      const spent = overview.category_breakdown[limit.label] ?? 0
      const delta = spent - limit.amount
      return {
        key,
        label: limit.label,
        limit: limit.amount,
        spent,
        delta,
        isOver: delta > 0,
      }
    })
  }, [limits, overview])

  const microHabitItems = microHabits?.micro_habits ?? []

  const handleApplyRange = () => {
    if (onRangeChange && startMonth && endMonth) {
      onRangeChange(startMonth, endMonth)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {onRangeChange && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rangeMode}
                onChange={(e) => setRangeMode(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
              <span className="text-sm font-medium text-slate-300">Multi-month insights</span>
            </label>
            {rangeMode && (
              <>
                <label className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">From</span>
                  <input
                    type="month"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">To</span>
                  <input
                    type="month"
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </label>
                <button
                  onClick={handleApplyRange}
                  disabled={!startMonth || !endMonth}
                  className="rounded-md bg-brand-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40"
                >
                  Apply range
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Monthly income"
          value={overview ? formatCurrency(overview.income) : '—'}
          sublabel={`Expected inflow for ${monthLabel}`}
        />
        <StatsCard
          label="Total spend"
          value={overview ? formatCurrency(overview.expenses) : '—'}
          intent="negative"
          sublabel="Includes fixed + variable"
        />
        <StatsCard
          label="Fixed commitments"
          value={overview ? formatCurrency(overview.fixed_expenses) : '—'}
          sublabel="Recurring + EMIs"
        />
        <StatsCard
          label="Savings potential"
          value={overview ? formatCurrency(overview.savings) : '—'}
          intent={overview && overview.savings >= 0 ? 'positive' : 'negative'}
          sublabel="Income minus expenses"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-300">Focus month</label>
          {onMonthChange && (
            <select
              value={month}
              onChange={(e) => onMonthChange(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              {Array.from({ length: 24 }, (_, i) => {
                const date = new Date()
                date.setMonth(date.getMonth() - (23 - i))
                const value = date.toISOString().slice(0, 7)
                const label = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              })}
            </select>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onAddAccount && (
            <button
              onClick={onAddAccount}
              className="rounded-md border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              ＋ Account
            </button>
          )}
          {onAddRecurring && (
            <button
              onClick={onAddRecurring}
              className="rounded-md border border-amber-500/60 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/20"
            >
              ＋ Recurring
            </button>
          )}
          {onAddTransaction && (
            <button
              onClick={onAddTransaction}
              className="rounded-md border border-brand-500/60 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-200 transition hover:bg-brand-500/20"
            >
              ＋ Transaction
            </button>
          )}
          {onManageLimits && (
            <button
              onClick={onManageLimits}
              className="rounded-md border border-rose-500/60 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
            >
              Category Limits
            </button>
          )}
          {onManageGoals && (
            <button
              onClick={onManageGoals}
              className="rounded-md border border-purple-500/60 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/20"
            >
              Financial Goals
            </button>
          )}
          {onViewTrends && (
            <button
              onClick={onViewTrends}
              className="rounded-md border border-cyan-500/60 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
            >
              📈 View Trends
            </button>
          )}
        </div>
      </div>

      <SectionCard
        title="Spending distribution"
        subtitle={`What ${monthLabel} looks like by category`}
      >
        {overview ? (
          <div className="w-full" style={{ height: '420px' }}>
            {categorySeries.length === 0 ? (
              <p className="text-sm text-slate-400">
                Add transactions to see category level breakdown.
              </p>
            ) : (
              <Bar data={categoryChartData} options={categoryChartOptions} plugins={[categoryLimitPlugin]} />
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Loading overview…</p>
        )}
      </SectionCard>

      {onToggleCoach && (
        <div className="flex justify-center">
          <button
            onClick={onToggleCoach}
            className="rounded-lg border border-brand-500/60 bg-brand-500/10 px-6 py-3 text-sm font-semibold text-brand-200 transition hover:bg-brand-500/20"
          >
            {coachVisible ? '✕ Hide AI Coach' : '✨ Show AI Coach'}
          </button>
        </div>
      )}

      {coachVisible && (
        <SectionCard title="AI Coach Insights" subtitle={`Personalized guidance for ${monthLabel}`}>
          {loadingCoach ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-slate-400">Analyzing your finances...</div>
            </div>
          ) : coach ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Summary</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">{coach.summary}</p>
              </div>

              {coach.insights && coach.insights.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Key Insights</h3>
                  {coach.insights.map((insight: any, idx: number) => (
                    <div key={idx} className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-slate-100">{insight.title}</h4>
                        {insight.estimated_monthly_savings && (
                          <span className="rounded bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300">
                            Save ${insight.estimated_monthly_savings.toFixed(0)}/mo
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{insight.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              {coach.action_items && coach.action_items.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Action Items</h3>
                  <ul className="space-y-2">
                    {coach.action_items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="mt-0.5 text-brand-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Click the button above to get AI-powered insights.</p>
          )}
        </SectionCard>
      )}

      {categoryLimitStatus.length > 0 && (
        <SectionCard
          title="Category limits watchlist"
          subtitle="Compare your actual spend with the limits you've set"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {categoryLimitStatus.map((item) => (
              <div
                key={item.key}
                className={`rounded-xl border px-4 py-3 ${
                  item.isOver
                    ? 'border-rose-500/50 bg-rose-500/10'
                    : 'border-slate-800/70 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                  <span
                    className={`text-xs font-semibold uppercase tracking-[0.25em] ${
                      item.isOver ? 'text-rose-300' : 'text-emerald-300'
                    }`}
                  >
                    {item.isOver ? 'Over' : 'On track'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Spent</span>
                  <span className={item.isOver ? 'text-rose-300' : 'text-slate-100'}>
                    {formatCurrency(item.spent)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Limit</span>
                  <span className="text-slate-100">{formatCurrency(item.limit)}</span>
                </div>
                <div className="mt-3 text-xs text-slate-400">
                  {item.isOver ? (
                    <span>
                      Over by <span className="font-semibold text-rose-300">{formatCurrency(item.delta)}</span>
                    </span>
                  ) : (
                    <span>
                      {formatCurrency(Math.abs(item.delta))} remaining this month.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Micro habit leaks" subtitle="Places to trim without feeling deprived">
        {microHabitItems.length === 0 ? (
          <p className="text-sm text-slate-400">
            No micro habits detected yet. Log more day-to-day purchases to help the coach
            identify patterns.
          </p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {microHabitItems.map((habit) => (
              <div
                key={habit.category}
                className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      {habit.category}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {habit.transaction_count} purchases · avg {formatCurrency(habit.average_amount)}
                    </p>
                  </div>
                  <span className="rounded-md bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-200">
                    {habit.suggested_reduction_percent}% trim
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total spend</span>
                  <span className="font-medium text-slate-100">
                    {formatCurrency(habit.total_spent)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Potential save</span>
                  <span className="font-medium text-emerald-400">
                    {formatCurrency(habit.estimated_savings)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

    </div>
  )
}

export default Dashboard
