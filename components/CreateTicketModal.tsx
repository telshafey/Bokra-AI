import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons';
import { SupportTicket, TicketCategory, TicketPriority } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (ticketData: Omit<SupportTicket, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt' | 'messages'>) => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onCreate }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<TicketCategory>('Other');
    const [priority, setPriority] = useState<TicketPriority>('Medium');
    const [description, setDescription] = useState('');

    const categories: TicketCategory[] = ['Payroll', 'Leave Balance', 'Technical Support', 'Policy Question', 'Other'];
    const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            alert("يرجى إدخال عنوان ووصف للتذكرة.");
            return;
        }
        onCreate({ title, category, priority, description });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{t('supportTickets.createModal.title')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('supportTickets.createModal.category')}</label>
                            <select value={category} onChange={e => setCategory(e.target.value as TicketCategory)} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50">
                                {categories.map(cat => <option key={cat} value={cat}>{t(`supportTickets.createModal.categories.${cat}`)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('supportTickets.createModal.priority')}</label>
                            <select value={priority} onChange={e => setPriority(e.target.value as TicketPriority)} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50">
                                {priorities.map(prio => <option key={prio} value={prio}>{t(`supportTickets.createModal.priorities.${prio}`)}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('supportTickets.createModal.subject')}</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                            placeholder={t('supportTickets.createModal.subjectPlaceholder')}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('supportTickets.createModal.description')}</label>
                        <textarea
                            rows={6}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                            placeholder={t('supportTickets.createModal.descriptionPlaceholder')}
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg font-semibold">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700">{t('supportTickets.createModal.submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketModal;
