import React from 'react';
interface SectionCardProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}
declare const SectionCard: React.FC<SectionCardProps>;
export default SectionCard;
