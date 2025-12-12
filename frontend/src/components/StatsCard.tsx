import React from 'react'
import clsx from 'clsx'

interface StatsCardProps {
  label: string
  value: string
  sublabel?: string
  intent?: 'default' | 'positive' | 'negative'
  className?: string
}

const intentClasses: Record<Exclude<StatsCardProps['intent'], undefined>, string> = {
  default: 'text-slate-200',
  positive: 'text-emerald-400',
  negative: 'text-rose-400',
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  sublabel,
  intent = 'default',
  className,
}) => {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-800/70 bg-slate-900/80 p-4 shadow-inner shadow-slate-950/40',
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className={clsx('mt-2 text-2xl font-semibold', intentClasses[intent])}>{value}</p>
      {sublabel && <p className="mt-1 text-xs text-slate-400">{sublabel}</p>}
    </div>
  )
}

export default StatsCard
