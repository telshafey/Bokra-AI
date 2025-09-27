// FIX: Implemented the RequestLeaveModal component.
import React, { useState } from 'react';
import type { LeaveType } from '../types';
import { XMarkIcon, ArrowUpTrayIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

interface RequestLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { leaveType: LeaveType; startDate: string; endDate: string; reason: string; attachment?: File | null }) => void;
}

const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ leaveType, startDate, endDate, reason, attachment });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('leave.modalTitle')}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400 dark:text-slate-300" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('leave.leaveType')}</label>
                            <select value={leaveType} onChange={e => setLeaveType(e.target.value as LeaveType)} className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-700 dark:border-slate-600">
                                <option value="Annual">{t('leaveTypes.Annual')}</option>
                                <option value="Casual">{t('leaveTypes.Casual')}</option>
                                <option value="Sick">{t('leaveTypes.Sick')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('leave.startDate')}</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('leave.endDate')}</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('leave.reason')}</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder={t('leave.reasonPlaceholder')} required></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('leave.attachFile')} <span className="text-xs text-slate-400">{t('leave.attachFileOptional')}</span></label>
                        <label htmlFor="attachment" className="cursor-pointer bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 hover:border-primary-500 hover:text-primary-600">
                           <ArrowUpTrayIcon className="w-8 h-8 mb-1"/>
                           <span className="text-sm">{attachment ? attachment.name : t('leave.attachFilePrompt')}</span>
                           <input id="attachment" type="file" className="hidden" onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} />
                        </label>
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

export default RequestLeaveModal;
