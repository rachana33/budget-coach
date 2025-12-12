import React, { useState } from 'react'
import SectionCard from './SectionCard'
import { Account, RecurringExpense } from '../types'
import { formatCurrency } from '../utils/format'

interface ProfilePanelProps {
  accounts: Account[]
  recurringExpenses: RecurringExpense[]
  onDeleteAccount: (id: number) => Promise<void>
  onDeleteRecurring: (id: number) => Promise<void>
  onExportData: () => void
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  accounts,
  recurringExpenses,
  onDeleteAccount,
  onDeleteRecurring,
  onExportData,
}) => {
  const [deleteAccountId, setDeleteAccountId] = useState<number | null>(null)
  const [deleteRecurringId, setDeleteRecurringId] = useState<number | null>(null)

  const handleDeleteAccount = async (id: number) => {
    await onDeleteAccount(id)
    setDeleteAccountId(null)
  }

  const handleDeleteRecurring = async (id: number) => {
    await onDeleteRecurring(id)
    setDeleteRecurringId(null)
  }

  const totalMonthlyIncome = accounts
    .filter((acc) => acc.type === 'bank')
    .reduce((sum, acc) => sum + (acc.credit_limit || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Profile & settings"
        subtitle="Manage your accounts, income, and data"
        actions={
          <button
            onClick={onExportData}
            className="rounded-md border border-brand-500/60 px-3 py-1.5 text-xs font-semibold text-brand-200 transition hover:bg-brand-500/20"
          >
            Export data
          </button>
        }
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Monthly income
            </h3>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {formatCurrency(totalMonthlyIncome)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Total expected monthly income from all sources
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Accounts" subtitle="Manage your bank accounts, credit cards, and loans">
        {accounts.length === 0 ? (
          <p className="text-sm text-slate-400">No accounts added yet.</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => {
              const isDeleting = deleteAccountId === account.id
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/60 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-semibold text-slate-100">{account.name}</h4>
                      <span className="rounded bg-slate-800/60 px-2 py-0.5 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {account.type}
                      </span>
                    </div>
                    {account.issuer && (
                      <p className="mt-1 text-xs text-slate-400">Issuer: {account.issuer}</p>
                    )}
                    {account.credit_limit && (
                      <p className="mt-1 text-xs text-slate-300">
                        {account.type === 'card' ? 'Credit limit' : 'Balance'}:{' '}
                        {formatCurrency(account.credit_limit)}
                      </p>
                    )}
                    {account.loan_principal && (
                      <div className="mt-2 space-y-1 text-xs text-slate-300">
                        <p>Principal: {formatCurrency(account.loan_principal)}</p>
                        <p>Interest rate: {account.loan_interest_rate}%</p>
                        {account.emi_amount && <p>EMI: {formatCurrency(account.emi_amount)}</p>}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    {isDeleting ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="rounded border border-rose-500/60 px-3 py-1 text-xs text-rose-300 transition hover:bg-rose-500/20"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteAccountId(null)}
                          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteAccountId(account.id)}
                        className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Recurring expenses"
        subtitle="Manage your subscriptions and fixed monthly costs"
      >
        {recurringExpenses.length === 0 ? (
          <p className="text-sm text-slate-400">No recurring expenses added yet.</p>
        ) : (
          <div className="space-y-3">
            {recurringExpenses.map((expense) => {
              const isDeleting = deleteRecurringId === expense.id
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/60 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-semibold text-slate-100">{expense.name}</h4>
                      <span className="rounded bg-slate-800/60 px-2 py-0.5 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {expense.category}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="text-slate-300">
                        {formatCurrency(expense.amount)} / {expense.billing_cycle}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {isDeleting ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteRecurring(expense.id)}
                          className="rounded border border-rose-500/60 px-3 py-1 text-xs text-rose-300 transition hover:bg-rose-500/20"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteRecurringId(null)}
                          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteRecurringId(expense.id)}
                        className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>
    </div>
  )
}

export default ProfilePanel
