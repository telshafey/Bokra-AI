

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
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            // FIX: Changed property access from `name` to `nameKey` to match the `JobTitle` type definition.
            setName(jobTitleToEdit?.nameKey || '');
        }
    }, [isOpen, jobTitleToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            const jobTitleData: JobTitle = {
                id: jobTitleToEdit?.id || `jt-${Date.now()}`,
                // FIX: Changed property from `name` to `nameKey` to align with the `JobTitle` type definition.
                nameKey: name.trim(),
                parentId: jobTitleToEdit?.parentId ?? parentId,
            };
            onSave(jobTitleData);
            onClose();
        }
    };

    const modalTitle = jobTitleToEdit ? 'تعديل المسمى الوظيفي' : 'إضافة مسمى وظيفي جديد';

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
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
                        <label htmlFor="jobTitleName" className="block text-sm font-medium text-slate-700 mb-1">اسم المنصب</label>
                        <input
                            id="jobTitleName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="مثال: مهندس برمجيات"
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