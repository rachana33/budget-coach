import React, { useEffect, useMemo, useState } from 'react'
import { api } from './lib/api'
import {
  Account,
  AccountCreateInput,
  CoachResponse,
  MicroHabitsResponse,
  MonthlyOverview,
  RecurringExpense,
  RecurringExpenseCreateInput,
  Transaction,
  TransactionCreateInput,
} from './types'
import {
  MOCK_ACCOUNTS,
  MOCK_COACH,
  MOCK_GOALS,
  MOCK_MICRO_HABITS,
  MOCK_OVERVIEW,
  MOCK_RECURRING,
  MOCK_TRANSACTIONS,
} from './mockData'
import Dashboard from './components/Dashboard'
import SetupPanel from './components/SetupPanel'
import TransactionPanel from './components/TransactionPanel'
import CoachPanel from './components/CoachPanel'
import CategoryLimitsPanel from './components/CategoryLimitsPanel'
import { normalizeCategoryKey } from './utils/categories'
import AddDataModal from './components/AddDataModal'
import TransactionListPanel from './components/TransactionListPanel'
import GoalsPanel, { type Goal, type GoalCreateInput } from './components/GoalsPanel'
import GoalProjectionModal from './components/GoalProjectionModal'
import ProfilePanel from './components/ProfilePanel'
import RangeInsightsModal from './components/RangeInsightsModal'

const DEFAULT_MONTH = '2025-11'

type CoachResponseType = CoachResponse | null
type CategoryLimitMap = Record<string, { label: string; amount: number }>

const App: React.FC = () => {
  const [month, setMonth] = useState<string>(DEFAULT_MONTH)
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS)
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(MOCK_RECURRING)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [overview, setOverview] = useState<MonthlyOverview | null>(MOCK_OVERVIEW)
  const [microHabits, setMicroHabits] = useState<MicroHabitsResponse | null>(MOCK_MICRO_HABITS)
  const [coach, setCoach] = useState<CoachResponseType>(MOCK_COACH)
  const [loadingCoach, setLoadingCoach] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coachVisible, setCoachVisible] = useState(false)
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimitMap>({})
  const [addDataOpen, setAddDataOpen] = useState(false)
  const [modalType, setModalType] = useState<'account' | 'recurring' | 'transaction' | 'limit' | 'goals' | null>(null)
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS)
  const [projectionGoalId, setProjectionGoalId] = useState<number | null>(null)
  const [rangeInsightsOpen, setRangeInsightsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard')
  const [isDemoMode, setIsDemoMode] = useState(true)

  const monthLabel = useMemo(() => {
    const date = new Date(`${month}-01T00:00:00`)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
    })
  }, [month])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem('budget-coach-category-limits')
      if (stored) {
        setCategoryLimits(JSON.parse(stored))
      }
    } catch (err) {
      console.warn('Failed to load saved limits', err)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem('budget-coach-category-limits', JSON.stringify(categoryLimits))
    } catch (err) {
      console.warn('Failed to persist category limits', err)
    }
  }, [categoryLimits])

  const fetchAccounts = async () => {
    const res = await api.get<Account[]>('/accounts/')
    setAccounts(res.data)
  }

  const fetchRecurring = async () => {
    const res = await api.get<RecurringExpense[]>('/recurring-expenses/')
    setRecurringExpenses(res.data)
  }

  const fetchTransactions = async (targetMonth: string) => {
    const res = await api.get<Transaction[]>('/transactions/', {
      params: { month: targetMonth },
    })
    setTransactions(res.data)
  }

  const fetchOverview = async (targetMonth: string) => {
    const res = await api.get<MonthlyOverview>('/analytics/overview', {
      params: { month: targetMonth },
    })
    setOverview(res.data)
  }

  const fetchMicroHabits = async (targetMonth: string) => {
    const res = await api.get<MicroHabitsResponse>('/analytics/micro-habits', {
      params: { month: targetMonth },
    })
    setMicroHabits(res.data)
  }

  const fetchGoals = async () => {
    const res = await api.get<Goal[]>('/goals/')
    setGoals(res.data)
  }

  const fetchCoach = async (targetMonth: string) => {
    setLoadingCoach(true)
    setError(null)
    try {
      const res = await api.post<CoachResponse>('/coach/', null, {
        params: { month: targetMonth },
      })
      setCoach(res.data)
    } catch (err: any) {
      console.error('coach error', err)
      setError(err?.response?.data?.detail ?? 'Failed to fetch coach response')
      if (!isDemoMode) {
        setCoach(null)
      }
    } finally {
      setLoadingCoach(false)
    }
  }

  const refreshAll = async (targetMonth: string) => {
    await Promise.all([
      fetchAccounts(),
      fetchRecurring(),
      fetchTransactions(targetMonth),
      fetchOverview(targetMonth),
      fetchMicroHabits(targetMonth),
    ])
  }

  useEffect(() => {
    Promise.all([refreshAll(month), fetchGoals()])
      .then(() => {
        setError(null)
        setIsDemoMode(false)
      })
      .catch((err) => {
        console.error('month change failed', err)
        setError('Backend unavailable. Using demo data.')
      })
  }, [month])

  useEffect(() => {
    if (!coachVisible) {
      setCoach(null)
      return
    }
    fetchCoach(month).catch((err) => {
      console.error('coach fetch failed', err)
    })
  }, [coachVisible, month])

  const handleCreateAccount = async (payload: AccountCreateInput) => {
    await api.post<Account>('/accounts/', payload)
    await fetchAccounts()
  }

  const handleCreateRecurring = async (payload: RecurringExpenseCreateInput) => {
    await api.post<RecurringExpense>('/recurring-expenses/', payload)
    await fetchRecurring()
    await fetchOverview(month)
  }

  const handleCreateTransaction = async (payload: TransactionCreateInput) => {
    await api.post<Transaction>('/transactions/', payload)
    await refreshAll(month)
    if (coachVisible) {
      await fetchCoach(month)
    }
  }

  const handleDeleteTransaction = async (id: number) => {
    await api.delete(`/transactions/${id}`)
    await refreshAll(month)
  }

  const handleCreateGoal = async (payload: GoalCreateInput) => {
    await api.post<Goal>('/goals/', payload)
    await fetchGoals()
  }

  const handleDeleteGoal = async (id: number) => {
    await api.delete(`/goals/${id}`)
    await fetchGoals()
  }

  const handleDeleteAccount = async (id: number) => {
    await api.delete(`/accounts/${id}`)
    await fetchAccounts()
  }

  const handleDeleteRecurring = async (id: number) => {
    await api.delete(`/recurring-expenses/${id}`)
    await fetchRecurring()
  }

  const handleExportData = () => {
    const data = {
      accounts,
      recurringExpenses,
      transactions,
      categoryLimits,
      goals,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget-coach-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveLimit = (label: string, amount: number) => {
    const key = normalizeCategoryKey(label)
    setCategoryLimits((prev) => ({
      ...prev,
      [key]: {
        label: label.trim(),
        amount,
      },
    }))
  }

  const handleRemoveLimit = (key: string) => {
    setCategoryLimits((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    if (overview) {
      Object.keys(overview.category_breakdown).forEach((category) => set.add(category))
    }
    transactions.forEach((transaction) => set.add(transaction.category))
    Object.values(categoryLimits).forEach((limit) => set.add(limit.label))
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }, [overview, transactions, categoryLimits])

  const handleAskCoach = () => {
    setCoachVisible(true)
  }

  const handleHideCoach = () => {
    setCoachVisible(false)
    setCoach(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300/80">
              Your AI-powered spending guide
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50 lg:text-4xl">
              Budget Coach
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${activeTab === 'dashboard'
                ? 'bg-brand-500 text-white'
                : 'border border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${activeTab === 'profile'
                ? 'bg-brand-500 text-white'
                : 'border border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      {isDemoMode && (
        <div className="bg-indigo-900/30 border-b border-indigo-500/30 px-6 py-2">
          <div className="mx-auto max-w-7xl flex items-center justify-between text-xs text-indigo-200">
            <span>Viewing Sample Data • Connecting to backend...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-auto mt-4 max-w-7xl px-6">
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            monthLabel={monthLabel}
            month={month}
            overview={overview}
            microHabits={microHabits}
            transactions={transactions}
            limits={categoryLimits}
            coach={coach}
            loadingCoach={loadingCoach}
            onMonthChange={setMonth}
            onAddAccount={() => {
              setModalType('account')
              setAddDataOpen(true)
            }}
            onAddRecurring={() => {
              setModalType('recurring')
              setAddDataOpen(true)
            }}
            onAddTransaction={() => {
              setModalType('transaction')
              setAddDataOpen(true)
            }}
            onManageLimits={() => {
              setModalType('limit')
              setAddDataOpen(true)
            }}
            onManageGoals={() => {
              setModalType('goals')
              setAddDataOpen(true)
            }}
            onViewTrends={() => setRangeInsightsOpen(true)}
            onToggleCoach={() => setCoachVisible((prev) => !prev)}
            coachVisible={coachVisible}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePanel
            accounts={accounts}
            recurringExpenses={recurringExpenses}
            onDeleteAccount={handleDeleteAccount}
            onDeleteRecurring={handleDeleteRecurring}
            onExportData={handleExportData}
          />
        )}

        {activeTab === 'dashboard' && (
          <TransactionListPanel
            transactions={transactions}
            limits={categoryLimits}
            goals={goals}
            onDelete={handleDeleteTransaction}
          />
        )}
      </main>
      <AddDataModal
        open={addDataOpen}
        onClose={() => {
          setAddDataOpen(false)
          setModalType(null)
        }}
        modalType={modalType}
        month={month}
        monthLabel={monthLabel}
        accounts={accounts}
        recurring={recurringExpenses}
        transactions={transactions}
        categories={availableCategories}
        limits={categoryLimits}
        goals={goals}
        onCreateAccount={handleCreateAccount}
        onCreateRecurring={handleCreateRecurring}
        onCreateTransaction={handleCreateTransaction}
        onSaveLimit={handleSaveLimit}
        onRemoveLimit={handleRemoveLimit}
        onCreateGoal={handleCreateGoal}
        onDeleteGoal={handleDeleteGoal}
        onViewProjection={(id) => setProjectionGoalId(id)}
      />
      <GoalProjectionModal goalId={projectionGoalId} onClose={() => setProjectionGoalId(null)} />
      <RangeInsightsModal open={rangeInsightsOpen} onClose={() => setRangeInsightsOpen(false)} />
    </div>
  )
}

export default App
