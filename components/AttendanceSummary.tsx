

import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationTriangleIcon } from './icons/Icons';
import StatCard from './StatCard';
import { useTranslation } from './contexts/LanguageContext';

interface AttendanceSummaryProps {
    presentDays: number;
    absentDays: number;
    overtimeHours: number;
    lateDays: number;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ presentDays, absentDays, overtimeHours, lateDays }) => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title={t('attendance.presentDays')} value={`${presentDays} ${t('general.day')}`} icon={CheckCircleIcon} color="bg-emerald-500" />
            <StatCard title={t('attendance.absentDays')} value={`${absentDays} ${t('general.day')}`} icon={XCircleIcon} color="bg-red-500" />
            <StatCard title={t('attendance.overtimeHours')} value={`${overtimeHours.toFixed(1)} ${t('general.hour')}`} icon={ClockIcon} color="bg-sky-500" />
            <StatCard title={t('attendance.lateDays')} value={`${lateDays} ${t('general.day')}`} icon={ExclamationTriangleIcon} color="bg-amber-500" />
        </div>
    )
}

export default AttendanceSummary;
