import React from 'react';
import { MicroHabitsResponse, MonthlyOverview, Transaction } from '../types';
interface DashboardProps {
    monthLabel: string;
    month: string;
    overview: MonthlyOverview | null;
    microHabits: MicroHabitsResponse | null;
    transactions: Transaction[];
    limits?: Record<string, {
        label: string;
        amount: number;
    }>;
    coach?: any;
    loadingCoach?: boolean;
    onRangeChange?: (startMonth: string, endMonth: string) => void;
    onMonthChange?: (month: string) => void;
    onAddAccount?: () => void;
    onAddRecurring?: () => void;
    onAddTransaction?: () => void;
    onManageLimits?: () => void;
    onManageGoals?: () => void;
    onViewTrends?: () => void;
    onToggleCoach?: () => void;
    coachVisible?: boolean;
}
declare const Dashboard: React.FC<DashboardProps>;
export default Dashboard;
