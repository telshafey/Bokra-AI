

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { Branch, EmployeeProfile } from '../types';

interface BranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (nameKey: string, managerId: string) => void;
    branchToEdit: Branch | null;
    employees: EmployeeProfile[];
}

const BranchModal: React.FC<BranchModalProps> = ({ isOpen, onClose, onSave, branchToEdit, employees }) => {
    const [nameKey, setNameKey] = useState('');
    const [selectedManagerId, setSelectedManagerId] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (branchToEdit) {
                // FIX: Changed property access from `name` to `nameKey` to match the `Branch` type definition.
                setNameKey(branchToEdit.nameKey);
                const currentManager = employees.find(e => e.branchId === branchToEdit.id && e.role === 'Branch Admin');
                setSelectedManagerId(currentManager?.id || '');
            } else {
                setNameKey('');
                setSelectedManagerId('');
            }
        }
    }, [branchToEdit, isOpen, employees]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nameKey.trim()) {
            onSave(nameKey.trim(), selectedManagerId);
        }
    };

    const modalTitle = branchToEdit ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد';
    const potentialManagers = employees.filter(e => e.isEmployee);

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
                        <label htmlFor="branchName" className="block text-sm font-medium text-slate-700 mb-1">اسم الفرع (أو مفتاح الترجمة)</label>
                        <input
                            id="branchName"
                            type="text"
                            value={nameKey}
                            onChange={(e) => setNameKey(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="مثال: فرع المعادي أو branches.maadi"
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label htmlFor="branchManager" className="block text-sm font-medium text-slate-700 mb-1">مسؤول الفرع (Admin)</label>
                        <select
                            id="branchManager"
                            value={selectedManagerId}
                            onChange={(e) => setSelectedManagerId(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="">لا يوجد مسؤول معين</option>
                            {potentialManagers.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.title})
                                </option>
                            ))}
                        </select>
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

export default BranchModal;