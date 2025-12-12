import React, { useEffect } from 'react'
import SetupPanel from './SetupPanel'
import TransactionPanel from './TransactionPanel'
import CategoryLimitsPanel from './CategoryLimitsPanel'
import GoalsPanel, { type Goal, type GoalCreateInput } from './GoalsPanel'
import {
  Account,
  AccountCreateInput,
  RecurringExpense,
  RecurringExpenseCreateInput,
  Transaction,
  TransactionCreateInput,
} from '../types'

export interface CategoryLimitMap {
  [key: string]: {
    label: string
    amount: number
  }
}

interface AddDataModalProps {
  open: boolean
  onClose: () => void
  modalType?: 'account' | 'recurring' | 'transaction' | 'limit' | 'goals' | null
  month: string
  monthLabel: string
  accounts: Account[]
  recurring: RecurringExpense[]
  transactions: Transaction[]
  categories: string[]
  limits: CategoryLimitMap
  goals?: Goal[]
  goalTransactions?: Record<number, number>
  monthlySurplus?: number
  onCreateAccount: (payload: AccountCreateInput) => Promise<void>
  onCreateRecurring: (payload: RecurringExpenseCreateInput) => Promise<void>
  onCreateTransaction: (payload: TransactionCreateInput) => Promise<void>
  onSaveLimit: (label: string, amount: number) => void
  onRemoveLimit: (key: string) => void
  onCreateGoal?: (payload: GoalCreateInput) => Promise<void>
  onDeleteGoal?: (id: number) => Promise<void>
  onViewProjection?: (id: number) => void
}

const AddDataModal: React.FC<AddDataModalProps> = ({
  open,
  onClose,
  modalType = null,
  month,
  monthLabel,
  accounts,
  recurring,
  transactions,
  categories,
  limits,
  goals = [],
  goalTransactions = {},
  monthlySurplus = 0,
  onCreateAccount,
  onCreateRecurring,
  onCreateTransaction,
  onSaveLimit,
  onRemoveLimit,
  onCreateGoal,
  onDeleteGoal,
  onViewProjection,
}) => {
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 shadow-[0_40px_120px_rgba(15,23,42,0.6)]"
        onClick={handleContainerClick}
      >
        <header className="flex items-center justify-between border-b border-slate-800/80 px-8 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-300/80">
              {modalType === 'account' && 'Add account'}
              {modalType === 'recurring' && 'Add recurring expense'}
              {modalType === 'transaction' && 'Add transaction'}
              {modalType === 'limit' && 'Category limits'}
              {modalType === 'goals' && 'Financial goals'}
              {!modalType && 'Data cockpit'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">
              {modalType === 'account' && 'Bank, card, or loan account'}
              {modalType === 'recurring' && 'Subscription or fixed expense'}
              {modalType === 'transaction' && 'Income or expense transaction'}
              {modalType === 'limit' && 'Manage spending limits by category'}
              {modalType === 'goals' && 'Track savings and loan payoff targets'}
              {!modalType && 'Add & update your finances'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Month in focus: <span className="text-slate-200">{monthLabel}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
            aria-label="Close add data modal"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
          {!modalType && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <SetupPanel
                  accounts={accounts}
                  recurring={recurring}
                  onCreateAccount={onCreateAccount}
                  onCreateRecurring={onCreateRecurring}
                  showAccounts
                  showRecurring={false}
                />
              </div>
              <div className="space-y-6">
                <TransactionPanel
                  monthLabel={monthLabel}
                  month={month}
                  accounts={accounts}
                  transactions={transactions}
                  onCreateTransaction={onCreateTransaction}
                  limits={limits}
                  goals={goals}
                />
                <CategoryLimitsPanel
                  categories={categories}
                  limits={limits}
                  onSaveLimit={onSaveLimit}
                  onRemoveLimit={onRemoveLimit}
                />
                <SetupPanel
                  accounts={accounts}
                  recurring={recurring}
                  onCreateAccount={onCreateAccount}
                  onCreateRecurring={onCreateRecurring}
                  showAccounts={false}
                  showRecurring
                />
              </div>
            </div>
          )}

          {modalType === 'account' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Add new account
                </h3>
                <SetupPanel
                  accounts={accounts}
                  recurring={recurring}
                  onCreateAccount={onCreateAccount}
                  onCreateRecurring={onCreateRecurring}
                  showAccounts
                  showRecurring={false}
                />
              </div>
            </div>
          )}

          {modalType === 'recurring' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Add recurring expense
                </h3>
                <SetupPanel
                  accounts={accounts}
                  recurring={recurring}
                  onCreateAccount={onCreateAccount}
                  onCreateRecurring={onCreateRecurring}
                  showAccounts={false}
                  showRecurring
                />
              </div>
            </div>
          )}

          {modalType === 'transaction' && (
            <TransactionPanel
              monthLabel={monthLabel}
              month={month}
              accounts={accounts}
              transactions={transactions}
              onCreateTransaction={onCreateTransaction}
              limits={limits}
              goals={goals}
            />
          )}

          {modalType === 'limit' && (
            <CategoryLimitsPanel
              categories={categories}
              limits={limits}
              onSaveLimit={onSaveLimit}
              onRemoveLimit={onRemoveLimit}
            />
          )}

          {modalType === 'goals' && onCreateGoal && onDeleteGoal && (
            <GoalsPanel
              goals={goals}
              accounts={accounts}
              goalTransactions={goalTransactions}
              monthlySurplus={monthlySurplus}
              onCreateGoal={onCreateGoal}
              onDeleteGoal={onDeleteGoal}
              onViewProjection={onViewProjection}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AddDataModal
