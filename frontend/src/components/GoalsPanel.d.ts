import React from 'react';
import { Goal, GoalCreateInput } from '../types';
export type { Goal, GoalCreateInput };
interface GoalsPanelProps {
    goals: Goal[];
    accounts: Array<{
        id: number;
        name: string;
        type: string;
    }>;
    goalTransactions?: Record<number, number>;
    monthlySurplus?: number;
    onCreateGoal: (payload: GoalCreateInput) => Promise<void>;
    onDeleteGoal: (id: number) => Promise<void>;
    onViewProjection?: (id: number) => void;
}
declare const GoalsPanel: React.FC<GoalsPanelProps>;
export default GoalsPanel;
