

import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';
import type { LeavePolicy, EmployeeProfile, Branch, AnnualLeaveTier } from '../types';

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
        status: 'PendingApproval',
        newEmployeeBalance: 15,
        newEmployeeEligibilityMonths: 6,
        annualLeaveTiers: [
            { id: `tier-${Date.now()}-1`, afterYears: 1, days: 21 },
            { id: `tier-${Date.now()}-2`, afterYears: 10, days: 30 },
        ],
        specialAnnualLeave: {
            over50YearsOld: 30,
            specialNeeds: 45,
        },
        maternityLeaveMonths: 4,
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
        setPolicy(p => ({ ...p, [field]: Number.isInteger(Number(value)) && typeof value !== 'string' ? Number(value) : value }));
    };
    
    const handleSpecialChange = (field: keyof LeavePolicy['specialAnnualLeave'], value: number) => {
        setPolicy(p => ({ ...p, specialAnnualLeave: { ...p.specialAnnualLeave, [field]: value } }));
    };

    const handleTierChange = (index: number, field: keyof AnnualLeaveTier, value: number) => {
        const newTiers = [...policy.annualLeaveTiers];
        const tier = { ...newTiers[index] };
        (tier as any)[field] = value;
        newTiers[index] = tier;
        setPolicy(p => ({ ...p, annualLeaveTiers: newTiers }));
    };

    const handleAddTier = () => {
        const newTier: AnnualLeaveTier = {
            id: `tier-${Date.now()}`,
            afterYears: 0,
            days: 0,
        };
        setPolicy(p => ({ ...p, annualLeaveTiers: [...p.annualLeaveTiers, newTier] }));
    };

    const handleRemoveTier = (index: number) => {
        setPolicy(p => ({ ...p, annualLeaveTiers: p.annualLeaveTiers.filter((_, i) => i !== index) }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(policy);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{policyToEdit ? 'تعديل سياسة الإجازات' : 'إنشاء سياسة إجازات جديدة'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={policy.name} onChange={e => handleChange('name', e.target.value)} className="w-full p-2 border rounded-lg col-span-2" placeholder="اسم السياسة" required />
                        {currentUser.role !== 'Branch Admin' && currentUser.role !== 'Admin' ? (
                            <select value={policy.scope} onChange={e => handleChange('scope', e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50">
                                <option value="company">عام للشركة</option><option value="branch">خاص بفرع</option>
                            </select>
                        ) : <input type="text" value={`خاص بـ ${currentUser.branchName}`} readOnly className="w-full p-2 border rounded-lg bg-slate-100 text-slate-500" />}
                        {policy.scope === 'branch' && currentUser.role !== 'Branch Admin' && currentUser.role !== 'Admin' && (
                            <select value={policy.branchId || ''} onChange={e => handleChange('branchId', e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50" required={policy.scope === 'branch'}>
                                <option value="">-- اختر فرع --</option>{branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        )}
                    </div>

                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
                        <h3 className="font-bold text-slate-700">قواعد الموظف الجديد</h3>
                        <div className="flex items-center gap-2 text-sm">
                            يستحق الموظف <input type="number" value={policy.newEmployeeBalance} onChange={e => handleChange('newEmployeeBalance', Number(e.target.value))} className="w-20 p-1 border rounded" /> يوم إجازة سنوية بعد مرور <input type="number" value={policy.newEmployeeEligibilityMonths} onChange={e => handleChange('newEmployeeEligibilityMonths', Number(e.target.value))} className="w-20 p-1 border rounded" /> أشهر من تاريخ التعيين.
                        </div>
                    </div>
                    
                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
                        <h3 className="font-bold text-slate-700">شرائح الإجازة السنوية</h3>
                        {policy.annualLeaveTiers.map((tier, index) => (
                             <div key={tier.id} className="flex items-center gap-2 text-sm">
                                بعد مرور <input type="number" value={tier.afterYears} onChange={e => handleTierChange(index, 'afterYears', Number(e.target.value))} className="w-20 p-1 border rounded" /> سنوات، يصبح الرصيد <input type="number" value={tier.days} onChange={e => handleTierChange(index, 'days', Number(e.target.value))} className="w-20 p-1 border rounded" /> يوم.
                                <button type="button" onClick={() => handleRemoveTier(index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddTier} className="flex items-center gap-2 text-sm font-semibold text-sky-600"><PlusCircleIcon className="w-5 h-5" /><span>إضافة شريحة</span></button>
                    </div>

                     <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
                        <h3 className="font-bold text-slate-700">الأرصدة الخاصة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                             <div className="flex items-center gap-2">للموظفين فوق 50 عامًا: <input type="number" value={policy.specialAnnualLeave.over50YearsOld} onChange={e => handleSpecialChange('over50YearsOld', Number(e.target.value))} className="w-20 p-1 border rounded" /> يوم</div>
                             <div className="flex items-center gap-2">لذوي الاحتياجات الخاصة: <input type="number" value={policy.specialAnnualLeave.specialNeeds} onChange={e => handleSpecialChange('specialNeeds', Number(e.target.value))} className="w-20 p-1 border rounded" /> يوم</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">رصيد الإجازة العارضة (أيام)</label>
                            <input type="number" value={policy.casualLeaveBalance} onChange={e => handleChange('casualLeaveBalance', Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">رصيد إجازة الوضع (أشهر)</label>
                            <input type="number" value={policy.maternityLeaveMonths} onChange={e => handleChange('maternityLeaveMonths', Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ السياسة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeavePolicyModal;