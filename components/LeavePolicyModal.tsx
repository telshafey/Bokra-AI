import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { LeavePolicy, EmployeeProfile, Branch } from '../types';

interface LeavePolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (policy: LeavePolicy) => void;
    policyToEdit: LeavePolicy | null;
    currentUser: EmployeeProfile;
    branches: Branch[];
}

const LeavePolicyModal: React.FC<LeavePolicyModalProps> = ({ isOpen, onClose, onSave, policyToEdit, currentUser, branches }) => {
    
    const getInitialState = (): LeavePolicy => ({
        id: `leave-policy-${Date.now()}`,
        name: '',
        scope: 'company',
        status: 'Active',
        annualLeaveBalance: 21,
        sickLeaveBalance: 15,
        casualLeaveBalance: 7,
    });
    
    const [policy, setPolicy] = useState<LeavePolicy>(getInitialState());

    useEffect(() => {
        if (isOpen) {
             if (policyToEdit) {
                setPolicy(policyToEdit);
            } else {
                const initialState = getInitialState();
                if (currentUser.role === 'Branch Admin' || currentUser.role === 'Admin') {
                    initialState.scope = 'branch';
                    initialState.branchId = currentUser.branchId;
                }
                setPolicy(initialState);
            }
        }
    }, [isOpen, policyToEdit, currentUser]);

    if (!isOpen) return null;

    const handleChange = (field: keyof LeavePolicy, value: any) => {
        setPolicy(p => ({ ...p, [field]: Number.isInteger(Number(value)) ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(policy);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{policyToEdit ? 'تعديل سياسة الإجازات' : 'إنشاء سياسة إجازات جديدة'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم السياسة</label>
                            <input
                                type="text"
                                value={policy.name}
                                onChange={e => handleChange('name', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg"
                                required
                            />
                        </div>
                         {currentUser.role !== 'Branch Admin' && currentUser.role !== 'Admin' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">نطاق السياسة</label>
                                <select 
                                    value={policy.scope} 
                                    onChange={e => handleChange('scope', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                                >
                                    <option value="company">عام للشركة</option>
                                    <option value="branch">خاص بفرع</option>
                                </select>
                            </div>
                        ) : (
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">نطاق السياسة</label>
                                <input type="text" value={`خاص بـ ${currentUser.branchName}`} readOnly className="w-full p-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500" />
                            </div>
                        )}
                    </div>
                    {policy.scope === 'branch' && currentUser.role !== 'Branch Admin' && currentUser.role !== 'Admin' && (
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اختر الفرع</label>
                            <select
                                value={policy.branchId || ''}
                                onChange={e => handleChange('branchId', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                                required={policy.scope === 'branch'}
                            >
                                <option value="">-- اختر فرع --</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">رصيد السنوية</label>
                            <input type="number" value={policy.annualLeaveBalance} onChange={e => handleChange('annualLeaveBalance', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">رصيد المرضية</label>
                            <input type="number" value={policy.sickLeaveBalance} onChange={e => handleChange('sickLeaveBalance', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">رصيد العارضة</label>
                            <input type="number" value={policy.casualLeaveBalance} onChange={e => handleChange('casualLeaveBalance', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ السياسة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeavePolicyModal;