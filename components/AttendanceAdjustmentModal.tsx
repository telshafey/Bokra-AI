import React, { useState } from 'react';
import type { AttendanceAdjustmentRequest } from '../types';
import { XMarkIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

interface AttendanceAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { adjustmentType: 'LateArrival' | 'EarlyDeparture', date: string, actualTime: string, reason: string }) => void;
}

const AttendanceAdjustmentModal: React.FC<AttendanceAdjustmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [adjustmentType, setAdjustmentType] = useState<'LateArrival' | 'EarlyDeparture'>('LateArrival');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [actualTime, setActualTime] = useState('');
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ adjustmentType, date, actualTime, reason });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('leave.excuseModalTitle')}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400 dark:text-slate-300" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">{t('leave.requestType')}</label>
                        <select value={adjustmentType} onChange={e => setAdjustmentType(e.target.value as any)} className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-700 dark:border-slate-600">
                            <option value="LateArrival">{t('leave.lateArrivalExcuse')}</option>
                            <option value="EarlyDeparture">{t('leave.earlyDeparturePermission')}</option>
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium mb-1">{t('leave.eventDate')}</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{adjustmentType === 'LateArrival' ? t('leave.actualTimeIn') : t('leave.actualTimeOut')}</label>
                            <input type="time" value={actualTime} onChange={e => setActualTime(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('leave.reason')}</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder={t('leave.excuseReasonPlaceholder')} required></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg font-semibold">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">{t('leave.submitRequest')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AttendanceAdjustmentModal;
