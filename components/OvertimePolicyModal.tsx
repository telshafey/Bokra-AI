import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { OvertimePolicy, EmployeeProfile, Branch } from '../types';

interface OvertimePolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (policy: OvertimePolicy) => void;
    policyToEdit: OvertimePolicy | null;
    currentUser: EmployeeProfile;
    branches: Branch[];
}

const OvertimePolicyModal: React.FC<OvertimePolicyModalProps> = ({ isOpen, onClose, onSave, policyToEdit, currentUser, branches }) => {
    
    const getInitialState = (): OvertimePolicy => ({
        id: `ot-policy-${Date.now()}`,
        name: '',
        scope: 'company',
        status: 'Active',
        allowOvertime: true,
        minOvertimeInMinutes: 30,
        overtimeRateNormal: 1.5,
        overtimeRateHoliday: 2,
    });
    
    const [policy, setPolicy] = useState<OvertimePolicy>(getInitialState());

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

    const handleChange = (field: keyof OvertimePolicy, value: any) => {
        setPolicy(p => ({ ...p, [field]: value }));
    };

    const handleCheckboxChange = (field: keyof OvertimePolicy, checked: boolean) => {
        setPolicy(p => ({ ...p, [field]: checked }));
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
                    <h2 className="text-2xl font-bold text-slate-800">{policyToEdit ? 'تعديل سياسة الوقت الإضافي' : 'إنشاء سياسة وقت إضافي جديدة'}</h2>
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
                    <div className="pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={policy.allowOvertime}
                                onChange={(e) => handleCheckboxChange('allowOvertime', e.target.checked)}
                                className="form-checkbox h-5 w-5 text-sky-600 rounded"
                            />
                            <span className="text-sm font-medium text-slate-700">السماح بالوقت الإضافي</span>
                        </label>
                    </div>

                    {policy.allowOvertime && (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">أقل مدة للاحتساب (دقائق)</label>
                                <input type="number" value={policy.minOvertimeInMinutes} onChange={e => handleChange('minOvertimeInMinutes', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">معدل الأجر العادي (x)</label>
                                <input type="number" step="0.01" value={policy.overtimeRateNormal} onChange={e => handleChange('overtimeRateNormal', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">معدل أجر العطلات (x)</label>
                                <input type="number" step="0.01" value={policy.overtimeRateHoliday} onChange={e => handleChange('overtimeRateHoliday', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ السياسة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OvertimePolicyModal;
