import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { formatCurrency } from '../utils/format'
import { api } from '../lib/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface GoalProjectionModalProps {
  goalId: number | null
  onClose: () => void
}

interface ProjectionData {
  goal_id: number
  goal_type: 'purchase' | 'loan_payoff'
  total_months?: number
  months_needed?: number
  payoff_date?: string
  target_date?: string
  total_interest?: number
  total_paid?: number
  current_progress?: number
  remaining?: number
  schedule: Array<{
    month: number
    balance?: number
    principal_paid?: number
    interest_paid?: number
    accumulated?: number
  }>
}

const GoalProjectionModal: React.FC<GoalProjectionModalProps> = ({ goalId, onClose }) => {
  const [projection, setProjection] = useState<ProjectionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!goalId) return

    const fetchProjection = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/goals/${goalId}/projection`)
        setProjection(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.detail || err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProjection()
  }, [goalId])

  if (!goalId) return null

  const chartData =
    projection && projection.schedule.length > 0
      ? {
          labels: projection.schedule.map((s) => `Month ${s.month}`),
          datasets: [
            {
              label:
                projection.goal_type === 'loan_payoff' ? 'Remaining balance' : 'Accumulated savings',
              data: projection.schedule.map((s) =>
                projection.goal_type === 'loan_payoff' ? s.balance ?? 0 : s.accumulated ?? 0,
              ),
              borderColor: projection.goal_type === 'loan_payoff' ? '#f87171' : '#34d399',
              backgroundColor:
                projection.goal_type === 'loan_payoff'
                  ? 'rgba(248, 113, 113, 0.1)'
                  : 'rgba(52, 211, 153, 0.1)',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        }
      : null

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        borderWidth: 1,
        padding: 12,
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
            const value = context.parsed.y ?? 0
            return `${context.dataset.label}: ${formatCurrency(value)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
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
          color: 'rgba(148, 163, 184, 0.15)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          callback: (value) => `$${Number(value).toLocaleString()}`,
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
    },
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          Close
        </button>

        <h2 className="text-2xl font-bold text-slate-100">Goal projection</h2>
        <p className="mt-1 text-sm text-slate-400">
          {projection?.goal_type === 'loan_payoff'
            ? 'Loan payoff timeline and interest breakdown'
            : 'Savings accumulation timeline'}
        </p>

        {loading && <p className="mt-6 text-sm text-slate-400">Loading projection...</p>}
        {error && <p className="mt-6 text-sm text-rose-400">Error: {error}</p>}

        {projection && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {projection.goal_type === 'loan_payoff' ? (
                <>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Total months
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-100">
                      {projection.total_months}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Total interest
                    </p>
                    <p className="mt-2 text-2xl font-bold text-rose-400">
                      {formatCurrency(projection.total_interest ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total paid</p>
                    <p className="mt-2 text-2xl font-bold text-slate-100">
                      {formatCurrency(projection.total_paid ?? 0)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Months needed
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-100">
                      {projection.months_needed}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Current progress
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-400">
                      {formatCurrency(projection.current_progress ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Remaining</p>
                    <p className="mt-2 text-2xl font-bold text-slate-100">
                      {formatCurrency(projection.remaining ?? 0)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {chartData && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Projection timeline
                </h3>
                <div style={{ height: '320px' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            )}

            {projection.goal_type === 'loan_payoff' && projection.payoff_date && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-200">
                  <strong>Projected payoff date:</strong>{' '}
                  {new Date(projection.payoff_date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {projection.goal_type === 'purchase' && projection.target_date && (
              <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
                <p className="text-sm text-brand-200">
                  <strong>Target date:</strong>{' '}
                  {new Date(projection.target_date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GoalProjectionModal
