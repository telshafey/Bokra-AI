import React, { useState, useMemo } from 'react';
import { EmployeeProfile, AttendanceRecord, AttendancePolicy, ExternalTask } from '../types';
import CalendarView from './CalendarView';
import AttendanceSummary from './AttendanceSummary';
import AttendanceLogTable from './AttendanceLogTable';
import { useTranslation } from './contexts/LanguageContext';

interface AttendancePageProps {
  currentUser: EmployeeProfile;
  attendanceRecords: AttendanceRecord[];
  policy: AttendancePolicy | null;
  externalTasks: ExternalTask[];
}

const AttendancePage: React.FC<AttendancePageProps> = ({ currentUser, attendanceRecords, policy, externalTasks }) => {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());

    const recordsForMonth = useMemo(() => {
        return attendanceRecords.filter(r => {
            const recordDate = new Date(r.date);
            return recordDate.getFullYear() === currentDate.getFullYear() && recordDate.getMonth() === currentDate.getMonth();
        });
    }, [attendanceRecords, currentDate]);
    
    const summaryData = useMemo(() => {
        return recordsForMonth.reduce((acc, record) => {
            if (record.status === 'Present') acc.presentDays++;
            if (record.status === 'Absent') acc.absentDays++;
            if (record.overtime) acc.overtimeHours += record.overtime;
            if (record.firstCheckIn && policy && (new Date(`1970-01-01T${record.firstCheckIn}:00`).getTime() > new Date(`1970-01-01T09:${String(policy.gracePeriodInMinutes).padStart(2, '0')}:00`).getTime())) {
                acc.lateDays++;
            }
            return acc;
        }, { presentDays: 0, absentDays: 0, overtimeHours: 0, lateDays: 0 });
    }, [recordsForMonth, policy]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('pageTitles.myAttendance')}</h1>
                {/* Month navigator can be added here */}
            </div>
            
            <AttendanceSummary {...summaryData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                     <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t('attendance.logTitle', { month: currentDate.toLocaleDateString('ar-EG', { month: 'long'}), year: currentDate.getFullYear() })}</h2>
                    <AttendanceLogTable records={recordsForMonth} infractions={[]} policy={policy} externalTasks={externalTasks} />
                </div>
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                     <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t('attendance.monthCalendar')}</h2>
                    <CalendarView records={recordsForMonth} year={currentDate.getFullYear()} month={currentDate.getMonth()} />
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
