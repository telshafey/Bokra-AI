import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { HRRequest, RequestStatus } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: HRRequest | null;
    // FIX: Changed newStatus type from RequestStatus to be more specific, as an action can only result in approval or rejection.
    onAction: (requestId: string, newStatus: 'Approved' | 'Rejected', notes: string) => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, request, onAction }) => {
    const { t } = useTranslation();
    const [notes, setNotes] = useState('');
    const [action, setAction] = useState<RequestStatus | null>(null);
    
    useEffect(() => {
        if (!isOpen) {
            setNotes('');
            setAction(null);
        }
    }, [isOpen]);

    if (!isOpen || !request) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: Changed type assertion to be more specific to 'Approved' | 'Rejected'.
        const finalAction = (e.nativeEvent as SubmitEvent).submitter?.dataset.action as 'Approved' | 'Rejected';
        if (finalAction) {
            onAction(request.id, finalAction, notes);
            onClose();
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">اتخاذ إجراء على الطلب</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            ملاحظات (اختياري)
                        </label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white"
                            placeholder="اكتب سبب الموافقة أو الرفض هنا..."
                            spellCheck="true"
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-4 border-t dark:border-slate-700">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-500">
                        {t('general.cancel')}
                    </button>
                    <button type="submit" data-action="Rejected" className="py-2 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-sm">
                        رفض
                    </button>
                    <button type="submit" data-action="Approved" className="py-2 px-6 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-sm">
                        موافقة
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApprovalModal;