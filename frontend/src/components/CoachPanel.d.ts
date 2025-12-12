import React from 'react';
import { CoachResponse } from '../types';
interface CoachPanelProps {
    coach: CoachResponse | null;
    loading: boolean;
    monthLabel: string;
}
declare const CoachPanel: React.FC<CoachPanelProps>;
export default CoachPanel;
