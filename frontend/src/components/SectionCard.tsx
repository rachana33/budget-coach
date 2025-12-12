import React from 'react'
import clsx from 'clsx'

interface SectionCardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  actions,
  children,
  className,
}) => {
  return (
    <section
      className={clsx(
        'rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/40 backdrop-blur',
        className,
      )}
    >
      {(title || subtitle || actions) && (
        <header className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {typeof title === 'string' ? (
              <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
            ) : (
              title
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="space-y-4 lg:space-y-6">{children}</div>
    </section>
  )
}

export default SectionCard
