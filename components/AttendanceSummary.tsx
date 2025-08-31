
import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationTriangleIcon } from './icons/Icons';
import StatCard from './StatCard';

interface AttendanceSummaryProps {
    presentDays: number;
    absentDays: number;
    overtimeHours: number;
    lateDays: number;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ presentDays, absentDays, overtimeHours, lateDays }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="أيام الحضور" value={`${presentDays} يوم`} icon={CheckCircleIcon} color="bg-emerald-500" />
            <StatCard title="أيام الغياب" value={`${absentDays} يوم`} icon={XCircleIcon} color="bg-red-500" />
            <StatCard title="ساعات إضافية" value={`${overtimeHours.toFixed(1)} ساعة`} icon={ClockIcon} color="bg-sky-500" />
            <StatCard title="أيام التأخير" value={`${lateDays} يوم`} icon={ExclamationTriangleIcon} color="bg-amber-500" />
        </div>
    )
}

export default AttendanceSummary;
