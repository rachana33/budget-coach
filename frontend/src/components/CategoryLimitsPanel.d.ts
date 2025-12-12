import React from 'react';
interface CategoryLimitsPanelProps {
    categories: string[];
    limits: Record<string, {
        label: string;
        amount: number;
    }>;
    onSaveLimit: (label: string, amount: number) => void;
    onRemoveLimit: (key: string) => void;
}
declare const CategoryLimitsPanel: React.FC<CategoryLimitsPanelProps>;
export default CategoryLimitsPanel;
