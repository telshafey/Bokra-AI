
import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from './icons/Icons';
import type { LeaveRequest, LeaveType } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface RequestLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'employeeId'>) => void;
}

const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    const isExamLeave = leaveType === 'Exam';

    useEffect(() => {
        if (leaveType === 'NewbornRegistration' && startDate) {
            setEndDate(startDate);
        }
    }, [leaveType, startDate]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!startDate || !endDate) {
            alert(t('alerts.formErrors.requiredFields'));
            return;
        }

        if (isExamLeave && !attachment) {
            alert(t('alerts.formErrors.fileRequiredForExam'));
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
        
        if (duration <= 0) {
            alert(t('alerts.formErrors.endDateAfterStart'));
            return;
        }
        
        onSubmit({
            leaveType,
            startDate,
            endDate,
            reason,
            duration,
            attachmentUrl: attachment?.name
        });

        // Reset form and close modal
        setLeaveType('Annual');
        setStartDate('');
        setEndDate('');
        setReason('');
        setAttachment(null);
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
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('leave.modalTitle')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="leaveType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('leave.leaveType')}</label>
                        <select
                            id="leaveType"
                            value={leaveType}
                            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="Annual">{t('leaveTypes.Annual')}</option>
                            <option value="Sick">{t('leaveTypes.Sick')}</option>
                            <option value="Casual">{t('leaveTypes.Casual')}</option>
                            <option value="NewbornRegistration">{t('leaveTypes.NewbornRegistration')}</option>
                            <option value="Exam">{t('leaveTypes.Exam')}</option>
                            <option value="Unpaid">{t('leaveTypes.Unpaid')}</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('leave.startDate')}</label>
                            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('leave.endDate')}</label>
                            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white" disabled={leaveType === 'NewbornRegistration'} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('leave.reason')}</label>
                        <textarea
                            id="reason"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white"
                            placeholder={t('leave.reasonPlaceholder')}
                            spellCheck="true"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t('leave.attachFile')} {isExamLeave ? <span className="text-red-500 font-bold">{t('leave.attachFileRequired')}</span> : `(${t('leave.attachFileOptional')})`}
                        </label>
                        <label htmlFor="attachment" className="cursor-pointer bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-sky-500 hover:text-sky-600">
                           <ArrowUpTrayIcon className="w-8 h-8 mb-1"/>
                           <span className="text-sm">{attachment ? attachment.name : t('leave.attachFilePrompt')}</span>
                           <input id="attachment" type="file" className="hidden" onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-500">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">{t('leave.submitRequest')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestLeaveModal;