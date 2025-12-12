import React from 'react';
interface StatsCardProps {
    label: string;
    value: string;
    sublabel?: string;
    intent?: 'default' | 'positive' | 'negative';
    className?: string;
}
declare const StatsCard: React.FC<StatsCardProps>;
export default StatsCard;
