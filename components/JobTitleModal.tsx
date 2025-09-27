

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { JobTitle } from '../types';

interface JobTitleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (jobTitle: JobTitle) => void;
    jobTitleToEdit: JobTitle | null;
    parentId: string | null;
}

const JobTitleModal: React.FC<JobTitleModalProps> = ({ isOpen, onClose, onSave, jobTitleToEdit, parentId }) => {
    const [nameKey, setNameKey] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNameKey(jobTitleToEdit?.nameKey || '');
        }
    }, [isOpen, jobTitleToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nameKey.trim()) {
            const jobTitleData: JobTitle = {
                id: jobTitleToEdit?.id || `jt-${Date.now()}`,
                nameKey: nameKey.trim(),
                parentId: jobTitleToEdit?.parentId ?? parentId,
            };
            onSave(jobTitleData);
            onClose();
        }
    };

    const modalTitle = jobTitleToEdit ? 'تعديل المسمى الوظيفي' : 'إضافة مسمى وظيفي جديد';

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{modalTitle}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="jobTitleName" className="block text-sm font-medium text-slate-700 mb-1">اسم المنصب (أو مفتاح الترجمة)</label>
                        <input
                            id="jobTitleName"
                            type="text"
                            value={nameKey}
                            onChange={(e) => setNameKey(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="مثال: مهندس برمجيات أو jobTitles.se"
                            required
                            autoFocus
                            spellCheck="true"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">
                            إلغاء
                        </button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobTitleModal;