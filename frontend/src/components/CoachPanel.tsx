import React from 'react'
import SectionCard from './SectionCard'
import { CoachResponse } from '../types'
import { formatCurrency } from '../utils/format'

interface CoachPanelProps {
  coach: CoachResponse | null
  loading: boolean
  monthLabel: string
}

const CoachPanel: React.FC<CoachPanelProps> = ({ coach, loading, monthLabel }) => {
  return (
    <SectionCard
      title="Coach insights"
      subtitle={`Guidance for ${monthLabel}`}
      actions={
        loading ? (
          <span className="text-xs text-brand-200">Generating advice…</span>
        ) : coach ? (
          <span className="text-xs text-slate-400">{coach.insights.length} focus areas</span>
        ) : null
      }
    >
      {loading && (
        <div className="rounded-xl border border-brand-400/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
          Hang tight, brewing practical nudges for you.
        </div>
      )}

      {!loading && !coach && (
        <p className="text-sm text-slate-400">
          No insights available yet. Log some transactions and refresh the coach to see personalised pointers.
        </p>
      )}

      {coach && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4">
            <p className="text-sm leading-relaxed text-slate-200">{coach.summary}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Key watchpoints
            </h3>
            <div className="space-y-3">
              {coach.insights.map((insight) => (
                <div
                  key={insight.title}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">{insight.title}</h4>
                      <p className="mt-1 text-sm text-slate-300">{insight.detail}</p>
                    </div>
                    {insight.estimated_monthly_savings ? (
                      <span className="rounded-md bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Save {formatCurrency(insight.estimated_monthly_savings)}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {coach.action_items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Action checklist
              </h3>
              <ul className="space-y-2">
                {coach.action_items.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-start gap-3 rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
                  >
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  )
}

export default CoachPanel
