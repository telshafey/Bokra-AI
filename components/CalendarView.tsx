
import React from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';

const STATUS_STYLES: Record<AttendanceStatus, string> = {
    Present: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200',
    Absent: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
    Leave: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200',
    Holiday: 'bg-sky-100 text-sky-800 hover:bg-sky-200 border-sky-200',
    Weekend: 'bg-slate-100 text-slate-500',
};

interface CalendarViewProps {
    records: AttendanceRecord[];
    year: number;
    month: number; // 0-indexed
}

const CalendarView: React.FC<CalendarViewProps> = ({ records, year, month }) => {
    const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    const recordsMap = new Map(records.map(r => [new Date(r.date).getDate(), r.status]));

    const date = new Date(year, month, 1);
    const firstDayOfMonth = date.getDay(); // 0=Sun, 1=Mon...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = Array.from({ length: firstDayOfMonth }, () => ({ day: null, status: null }));
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = new Date(year, month, i).getDay();
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday or Saturday
        calendarDays.push({ day: i, status: recordsMap.get(i) || (isWeekend ? 'Weekend' : null) });
    }

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const currentDay = today.getDate();

    return (
        <div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-2">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((dayInfo, index) => {
                    const isToday = isCurrentMonth && dayInfo.day === currentDay;
                    let dayClasses = `w-full aspect-square flex items-center justify-center rounded-lg font-semibold cursor-pointer transition-colors text-sm border`;
                    
                    if (dayInfo.day === null) {
                        dayClasses += ' bg-transparent border-transparent';
                    } else if (dayInfo.status) {
                        dayClasses += ` ${STATUS_STYLES[dayInfo.status]}`;
                    } else {
                        dayClasses += ' bg-slate-50 text-slate-700 hover:bg-slate-200 border-slate-100';
                    }

                    if (isToday) {
                        dayClasses += ' ring-2 ring-sky-500';
                    }

                    return (
                        <div key={index} className={dayClasses}>
                            {dayInfo.day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
