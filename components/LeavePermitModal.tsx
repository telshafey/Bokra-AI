
import React, { useState, useMemo } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { LeavePermitRequest, AttendancePolicy } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface LeavePermitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newRequest: Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'durationHours' | 'employeeId'>) => void;
    attendancePolicy?: AttendancePolicy;
    permitRequests: LeavePermitRequest[];
}

const LeavePermitModal: React.FC<LeavePermitModalProps> = ({ isOpen, onClose, onSubmit, attendancePolicy, permitRequests }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [reason, setReason] = useState('');
    
    const usedPermitsThisMonth = useMemo(() => {
        if (!attendancePolicy) return 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return permitRequests.filter(p => {
            const permitDate = new Date(p.date);
            return p.status !== 'Rejected' && permitDate.getMonth() === currentMonth && permitDate.getFullYear() === currentYear;
        }).length;
    }, [permitRequests, attendancePolicy]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!date || !startTime || !endTime || !reason.trim()) {
            alert(t('alerts.formErrors.requiredFields'));
            return;
        }
        
        if (startTime >= endTime) {
            alert(t('alerts.formErrors.endDateAfterStart'));
            return;
        }

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const durationMinutes = durationHours * 60;
        
        if (attendancePolicy) {
            if (durationMinutes < attendancePolicy.minPermitDurationMinutes || durationHours > attendancePolicy.maxPermitDurationHours) {
                alert(t('alerts.formErrors.permitPolicyViolation'));
                return;
            }
        }


        onSubmit({
            date,
            startTime,
            endTime,
            reason,
        });

        // Reset form and close modal
        setDate(new Date().toISOString().split('T')[0]);
        setStartTime('');
        setEndTime('');
        setReason('');
        onClose();
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('leave.permitModalTitle')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                {attendancePolicy && (
                    <div className="mb-4 p-3 bg-sky-50 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 rounded-lg text-sm text-center">
                       {t('leave.permitUsage', { used: usedPermitsThisMonth, max: attendancePolicy.maxPermitsPerMonth })}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="permit_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('leave.permitDate')}</label>
                        <input type="date" id="permit_date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="permit_startTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('leave.fromTime')}</label>
                            <input type="time" id="permit_startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white" required />
                        </div>
                        <div>
                            <label htmlFor="permit_endTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('leave.toTime')}</label>
                            <input type="time" id="permit_endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white" required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="permit_reason" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('leave.reason')}</label>
                        <textarea
                            id="permit_reason"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white"
                            placeholder={t('leave.permitReasonPlaceholder')}
                            required
                            spellCheck="true"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-500">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm hover:shadow-md">{t('leave.submitRequest')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeavePermitModal;