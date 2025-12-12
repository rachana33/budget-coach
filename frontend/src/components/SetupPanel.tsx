import React, { useMemo, useState } from 'react'
import SectionCard from './SectionCard'
import { Account, AccountCreateInput, RecurringExpense, RecurringExpenseCreateInput } from '../types'

const ACCOUNT_TYPES: AccountCreateInput['type'][] = ['card', 'bank', 'loan']
const DEFAULT_CATEGORIES = ['Housing', 'Utilities', 'Food', 'Transport', 'Shopping', 'Subscriptions']

interface SetupPanelProps {
  accounts: Account[]
  recurring: RecurringExpense[]
  onCreateAccount: (payload: AccountCreateInput) => Promise<void>
  onCreateRecurring: (payload: RecurringExpenseCreateInput) => Promise<void>
  showAccounts?: boolean
  showRecurring?: boolean
}

const SetupPanel: React.FC<SetupPanelProps> = ({
  accounts,
  recurring,
  onCreateAccount,
  onCreateRecurring,
  showAccounts = true,
  showRecurring = true,
}) => {
  const [accountForm, setAccountForm] = useState<AccountCreateInput>({
    name: '',
    type: 'card',
    issuer: '',
    credit_limit: undefined,
    loan_principal: undefined,
    loan_interest_rate: undefined,
    emi_amount: undefined,
  })
  const [recurringForm, setRecurringForm] = useState<RecurringExpenseCreateInput>({
    name: '',
    amount: 0,
    billing_cycle: 'monthly',
    category: 'Housing',
  })
  const [loadingAccount, setLoadingAccount] = useState(false)
  const [loadingRecurring, setLoadingRecurring] = useState(false)

  const loanFieldsVisible = accountForm.type === 'loan'
  const creditFieldsVisible = accountForm.type === 'card'

  const monthlyRecurringTotal = useMemo(() => {
    if (!showRecurring) return 0
    return recurring.reduce((sum, item) => sum + item.amount, 0)
  }, [recurring, showRecurring])

  const resetAccountForm = () => {
    setAccountForm({
      name: '',
      type: 'card',
      issuer: '',
      credit_limit: undefined,
      loan_principal: undefined,
      loan_interest_rate: undefined,
      emi_amount: undefined,
    })
  }

  const resetRecurringForm = () => {
    setRecurringForm({
      name: '',
      amount: 0,
      billing_cycle: 'monthly',
      category: 'Housing',
    })
  }

  const handleAccountSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoadingAccount(true)
    try {
      const payload: AccountCreateInput = {
        ...accountForm,
        issuer: accountForm.issuer?.trim() || undefined,
        credit_limit: creditFieldsVisible ? accountForm.credit_limit ?? undefined : undefined,
        loan_principal: loanFieldsVisible ? accountForm.loan_principal ?? undefined : undefined,
        loan_interest_rate: loanFieldsVisible ? accountForm.loan_interest_rate ?? undefined : undefined,
        emi_amount: loanFieldsVisible ? accountForm.emi_amount ?? undefined : undefined,
      }
      await onCreateAccount(payload)
      resetAccountForm()
    } finally {
      setLoadingAccount(false)
    }
  }

  const handleRecurringSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!recurringForm.name.trim()) return
    setLoadingRecurring(true)
    try {
      const payload: RecurringExpenseCreateInput = {
        ...recurringForm,
        name: recurringForm.name.trim(),
        amount: Number(recurringForm.amount) || 0,
      }
      await onCreateRecurring(payload)
      resetRecurringForm()
    } finally {
      setLoadingRecurring(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {showAccounts && (
        <SectionCard
          title="Accounts"
          subtitle="Cards, loans, and bank accounts you track"
          actions={<span className="text-xs text-slate-400">{accounts.length} linked</span>}
        >
        <form className="space-y-4" onSubmit={handleAccountSubmit}>
          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Name
              </span>
              <input
                required
                type="text"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                placeholder="Chase Sapphire"
                value={accountForm.name}
                onChange={(event) => setAccountForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Type
              </span>
              <select
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                value={accountForm.type}
                onChange={(event) =>
                  setAccountForm((prev) => ({ ...prev, type: event.target.value as typeof prev.type }))
                }
              >
                {ACCOUNT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Issuer
              </span>
              <input
                type="text"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                placeholder="Bank or provider"
                value={accountForm.issuer ?? ''}
                onChange={(event) => setAccountForm((prev) => ({ ...prev, issuer: event.target.value }))}
              />
            </label>
          </div>

          {creditFieldsVisible && (
            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Credit limit
                </span>
                <input
                  type="number"
                  min={0}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  value={accountForm.credit_limit ?? ''}
                  onChange={(event) =>
                    setAccountForm((prev) => ({ ...prev, credit_limit: Number(event.target.value) }))
                  }
                />
              </label>
            </div>
          )}

          {loanFieldsVisible && (
            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Principal
                </span>
                <input
                  type="number"
                  min={0}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  value={accountForm.loan_principal ?? ''}
                  onChange={(event) =>
                    setAccountForm((prev) => ({ ...prev, loan_principal: Number(event.target.value) }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Interest (%)
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  value={accountForm.loan_interest_rate ?? ''}
                  onChange={(event) =>
                    setAccountForm((prev) => ({ ...prev, loan_interest_rate: Number(event.target.value) }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Monthly payment
                </span>
                <input
                  type="number"
                  min={0}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  value={accountForm.emi_amount ?? ''}
                  onChange={(event) =>
                    setAccountForm((prev) => ({ ...prev, emi_amount: Number(event.target.value) }))
                  }
                />
              </label>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingAccount}
              className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40"
            >
              {loadingAccount ? 'Saving...' : 'Add account'}
            </button>
          </div>
        </form>

        <div className="space-y-2 text-sm text-slate-300">
          {accounts.length === 0 ? (
            <p className="text-sm text-slate-500">No accounts yet. Add one above.</p>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-100">{account.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {account.type}
                    {account.issuer ? ` · ${account.issuer}` : ''}
                  </p>
                </div>
                {account.emi_amount ? (
                  <span className="text-xs text-slate-400">Payment ${account.emi_amount?.toLocaleString('en-US')}</span>
                ) : null}
              </div>
            ))
          )}
        </div>
        </SectionCard>
      )}

      {showRecurring && (
        <SectionCard
          title="Recurring commitments"
          subtitle="Rent, utilities, subscriptions"
          actions={
            <span className="text-xs text-slate-400">
              ${monthlyRecurringTotal.toLocaleString('en-US')} per month
            </span>
          }
        >
        <form className="space-y-4" onSubmit={handleRecurringSubmit}>
          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Name</span>
              <input
                required
                type="text"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                placeholder="Rent"
                value={recurringForm.name}
                onChange={(event) => setRecurringForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Amount (monthly)
              </span>
              <input
                required
                type="number"
                min={0}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                value={recurringForm.amount}
                onChange={(event) =>
                  setRecurringForm((prev) => ({ ...prev, amount: Number(event.target.value) }))
                }
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Category
              </span>
              <select
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                value={recurringForm.category}
                onChange={(event) =>
                  setRecurringForm((prev) => ({ ...prev, category: event.target.value }))
                }
              >
                {DEFAULT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingRecurring}
              className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40"
            >
              {loadingRecurring ? 'Saving...' : 'Add recurring expense'}
            </button>
          </div>
        </form>

        <div className="space-y-2 text-sm text-slate-300">
          {recurring.length === 0 ? (
            <p className="text-sm text-slate-500">No recurring commitments logged yet.</p>
          ) : (
            recurring.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-100">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {item.category}
                  </p>
                </div>
                <span className="text-xs text-slate-300">${item.amount.toLocaleString('en-US')}</span>
              </div>
            ))
          )}
        </div>
        </SectionCard>
      )}
    </div>
  )
}

export default SetupPanel
