import React from 'react';
import type { Goal, GoalStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from './icons/Icons'; // Example icons
import { useTranslation } from './contexts/LanguageContext';

const STATUS_STYLES: Record<GoalStatus, { text: string; bg: string; icon?: React.FC<React.SVGProps<SVGSVGElement>> }> = {
    'On Track': { text: 'text-sky-800', bg: 'bg-sky-100' },
    'At Risk': { text: 'text-amber-800', bg: 'bg-amber-100' },
    'Off Track': { text: 'text-red-800', bg: 'bg-red-100' },
    'Completed': { text: 'text-emerald-800', bg: 'bg-emerald-100' },
    'Draft': { text: 'text-slate-800', bg: 'bg-slate-100' },
};


const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    let bgColor = 'bg-sky-500';
    if (progress < 40) bgColor = 'bg-red-500';
    else if (progress < 70) bgColor = 'bg-amber-500';
    else if (progress === 100) bgColor = 'bg-emerald-500';

    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${bgColor}`} 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

interface GoalCardProps {
    goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
    const { t, language } = useTranslation();
    const isObjective = goal.type === 'Objective';
    const statusStyle = STATUS_STYLES[goal.status];
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';

    return (
        <div className={`p-4 rounded-lg shadow-sm transition-shadow hover:shadow-md ${isObjective ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className={`font-bold ${isObjective ? 'text-lg text-slate-800' : 'text-md text-slate-700'}`}>
                        {goal.title}
                    </h3>
                    {isObjective && goal.description && (
                        <p className="text-sm text-slate-500 mt-1">{goal.description}</p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {t(`goalCard.statuses.${goal.status}`)}
                    </span>
                     <p className="text-xs text-slate-500">
                        {t('goalCard.dueDate')}: {new Date(goal.dueDate).toLocaleDateString(locale, { month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
                <span className="text-sm font-bold text-slate-600">{goal.progress}%</span>
                <ProgressBar progress={goal.progress} />
            </div>
        </div>
    );
};

export default GoalCard;
