import React, { useState } from 'react';

interface DateRangePickerProps {
    onDateChange: (startDate: string, endDate: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        if (endDate) {
            onDateChange(e.target.value, endDate);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        if (startDate) {
            onDateChange(startDate, e.target.value);
        }
    };

    return (
        <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
             <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">عرض التقارير من</label>
            <input 
                type="date" 
                value={startDate}
                onChange={handleStartDateChange}
                className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
             <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">إلى</label>
             <input 
                type="date" 
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
        </div>
    );
};

export default DateRangePicker;
