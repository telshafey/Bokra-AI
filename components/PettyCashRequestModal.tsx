
import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from './icons/Icons';
import type { PettyCashRequest, PettyCashCategory } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface PettyCashRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newRequest: Omit<PettyCashRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'employeeId'>) => void;
}

const PettyCashRequestModal: React.FC<PettyCashRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState<PettyCashCategory>('Transportation');
    const [amount, setAmount] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    const categories: PettyCashCategory[] = ['Transportation', 'OfficeSupplies', 'ClientMeeting', 'Other'];

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !category || amount === '' || amount <= 0 || !description.trim()) {
            alert(t('alerts.formErrors.requiredFields'));
            return;
        }
        
        onSubmit({
            date,
            category,
            amount,
            description,
            attachmentUrl: attachment?.name,
        });

        // Reset form and close modal
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('Transportation');
        setAmount('');
        setDescription('');
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
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('expenses.modal.title')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('expenses.modal.date')}</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white" required />
                        </div>
                         <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('expenses.modal.category')}</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as PettyCashCategory)}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{t(`expenses.categories.${cat}`)}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('expenses.modal.amount')}</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white" required min="0.01" step="0.01" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('expenses.modal.description')}</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:text-white"
                            placeholder={t('expenses.modal.descriptionPlaceholder')}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('expenses.modal.attachment')}</label>
                        <label htmlFor="attachment" className="cursor-pointer bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-sky-500 hover:text-sky-600">
                           <ArrowUpTrayIcon className="w-8 h-8 mb-1"/>
                           <span className="text-sm">{attachment ? attachment.name : t('expenses.modal.attachmentPrompt')}</span>
                           <input id="attachment" type="file" className="hidden" onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-500">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm hover:shadow-md">{t('expenses.modal.submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PettyCashRequestModal;
