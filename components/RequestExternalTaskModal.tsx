
import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

interface RequestExternalTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: { title: string; description: string; date: string; startTime: string; endTime: string; }) => void;
}

const RequestExternalTaskModal: React.FC<RequestExternalTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date || !startTime || !endTime) {
            alert(t('alerts.formErrors.requiredFields'));
            return;
        }
        onSubmit({ title, description, date, startTime, endTime });
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{t('myTasks.modal.title')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('myTasks.modal.taskTitle')}</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" required spellCheck="true" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('myTasks.modal.date')}</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('myTasks.modal.startTime')}</label>
                            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('myTasks.modal.endTime')}</label>
                            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('myTasks.modal.description')}</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded-lg" spellCheck="true" />
                    </div>
                     <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg font-semibold hover:bg-slate-200">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700">{t('myTasks.modal.submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestExternalTaskModal;