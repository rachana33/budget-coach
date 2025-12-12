import React, { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { formatCurrency } from '../utils/format'
import { api } from '../lib/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

interface RangeInsightsModalProps {
  open: boolean
  onClose: () => void
}

interface RangeData {
  start_date: string
  end_date: string
  total_income: number
  total_expenses: number
  net_savings: number
  category_breakdown: Record<string, number>
  monthly_trend: Array<{
    month: string
    income: number
    expenses: number
  }>
}

const RangeInsightsModal: React.FC<RangeInsightsModalProps> = ({ open, onClose }) => {
  const [startMonth, setStartMonth] = useState('')
  const [endMonth, setEndMonth] = useState('')
  const [rangeData, setRangeData] = useState<RangeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const invalidRange = Boolean(
    startMonth && endMonth && endMonth < startMonth,
  )

  const handleStartMonthChange = (value: string) => {
    setStartMonth(value)
    if (value && endMonth && endMonth < value) {
      setEndMonth(value)
    }
    setError(null)
  }

  const handleEndMonthChange = (value: string) => {
    setEndMonth(value)
    if (startMonth && value && value < startMonth) {
      setError('End month cannot be before the start month.')
    } else {
      setError(null)
    }
  }

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const fetchRangeData = async () => {
    if (!startMonth || !endMonth) {
      setError('Please select both start and end months')
      return
    }

    if (invalidRange) {
      setError('End month must be the same as or after the start month.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/analytics/range', {
        params: {
          start_month: startMonth,
          end_month: endMonth,
        },
      })
      setRangeData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const trendChartData = rangeData
    ? {
        labels: rangeData.monthly_trend.map((m) => m.month),
        datasets: [
          {
            label: 'Income',
            data: rangeData.monthly_trend.map((m) => m.income),
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
          },
          {
            label: 'Expenses',
            data: rangeData.monthly_trend.map((m) => m.expenses),
            borderColor: '#f87171',
            backgroundColor: 'rgba(248, 113, 113, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
          },
        ],
      }
    : null

  const categoryChartData = rangeData
    ? {
        labels: Object.keys(rangeData.category_breakdown).sort(
          (a, b) => rangeData.category_breakdown[b] - rangeData.category_breakdown[a],
        ),
        datasets: [
          {
            label: 'Total Spending',
            data: Object.keys(rangeData.category_breakdown)
              .sort((a, b) => rangeData.category_breakdown[b] - rangeData.category_breakdown[a])
              .map((cat) => rangeData.category_breakdown[cat]),
            backgroundColor: [
              '#4c6ef5',
              '#4263eb',
              '#364fc7',
              '#748ffc',
              '#5c7cfa',
              '#3b5bdb',
              '#7950f2',
              '#9775fa',
            ],
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      }
    : null

  const trendChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 13,
            family: 'Inter, system-ui, sans-serif',
          },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 8,
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        titleFont: {
          size: 13,
          family: 'Inter, system-ui, sans-serif',
        },
        bodyFont: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
        },
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => formatCurrency(Number(value)),
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
    },
  }

  const categoryChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
      delay: (context) => {
        return context.dataIndex * 60
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 8,
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        callbacks: {
          label: (context) => {
            return `Total: ${formatCurrency(context.parsed.x)}`
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => formatCurrency(Number(value)),
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#e2e8f0',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
    },
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 shadow-[0_40px_120px_rgba(15,23,42,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-800/80 px-8 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-300/80">
              Range insights
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">
              Multi-month spending trends & analysis
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
            aria-label="Close range insights modal"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-300">From</span>
              <select
                value={startMonth}
                onChange={(e) => handleStartMonthChange(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="">Select month</option>
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
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-300">To</span>
              <select
                value={endMonth}
                onChange={(e) => handleEndMonthChange(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="">Select month</option>
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
            </label>
            <button
              onClick={fetchRangeData}
              disabled={loading || !startMonth || !endMonth || invalidRange}
              className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40"
            >
              {loading ? 'Loading...' : 'Analyze range'}
            </button>
          </div>

          {invalidRange && (
            <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
              End month must be the same as or after the start month.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {rangeData && rangeData.monthly_trend.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-300">No data found for this period</p>
                <p className="mt-2 text-sm text-slate-400">
                  There are no transactions between {rangeData.start_date} and {rangeData.end_date}.
                </p>
                <p className="mt-4 text-sm text-slate-400">
                  Try selecting a different date range or add some transactions first.
                </p>
              </div>
            </div>
          )}

          {rangeData && rangeData.monthly_trend.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Total income
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">
                    {formatCurrency(rangeData.total_income)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Total expenses
                  </p>
                  <p className="mt-2 text-2xl font-bold text-rose-400">
                    {formatCurrency(rangeData.total_expenses)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Net savings</p>
                  <p
                    className={`mt-2 text-2xl font-bold ${
                      rangeData.net_savings >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrency(rangeData.net_savings)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Income vs Expenses trend
                </h3>
                <div style={{ height: '320px' }}>
                  {trendChartData && <Line data={trendChartData} options={trendChartOptions} />}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Category breakdown
                </h3>
                <div style={{ height: '400px' }}>
                  {categoryChartData && (
                    <Bar data={categoryChartData} options={categoryChartOptions} />
                  )}
                </div>
              </div>
            </div>
          )}

          {!rangeData && !loading && !error && (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-slate-400">
                Select a date range and click "Analyze range" to view insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RangeInsightsModal
