import React, { useState } from 'react';
import type { PettyCashRequest } from '../types';
import { XMarkIcon, ArrowUpTrayIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

interface PettyCashRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { category: PettyCashRequest['category']; date: string; amount: number; description: string; attachment?: File | null }) => void;
}

const PettyCashRequestModal: React.FC<PettyCashRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [category, setCategory] = useState<PettyCashRequest['category']>('Transportation');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ category, date, amount: Number(amount), description, attachment });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('expenses.modal.title')}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400 dark:text-slate-300" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                            <label className="block text-sm font-medium mb-1">{t('expenses.modal.date')}</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('expenses.modal.category')}</label>
                            <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 border rounded-lg bg-slate-50">
                                <option value="Transportation">{t('expenses.categories.Transportation')}</option>
                                <option value="OfficeSupplies">{t('expenses.categories.OfficeSupplies')}</option>
                                <option value="ClientMeeting">{t('expenses.categories.ClientMeeting')}</option>
                                <option value="Other">{t('expenses.categories.Other')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('expenses.modal.amount')}</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded-lg" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('expenses.modal.description')}</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-2 border rounded-lg" placeholder={t('expenses.modal.descriptionPlaceholder')} required></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('expenses.modal.attachment')}</label>
                        <label htmlFor="attachment-petty-cash" className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 hover:border-primary-500 hover:text-primary-600">
                           <ArrowUpTrayIcon className="w-8 h-8 mb-1"/>
                           <span className="text-sm">{attachment ? attachment.name : t('expenses.modal.attachmentPrompt')}</span>
                           <input id="attachment-petty-cash" type="file" className="hidden" onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg font-semibold">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">{t('expenses.modal.submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PettyCashRequestModal;
