import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';
import type { LeavePolicy, AnnualLeaveTier } from '../types';

interface LeavePolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (policy: LeavePolicy) => void;
    policyToEdit: LeavePolicy | null;
}

const LeavePolicyModal: React.FC<LeavePolicyModalProps> = ({ isOpen, onClose, onSave, policyToEdit }) => {
    const getInitialState = (): LeavePolicy => ({
        id: `leave-policy-${Date.now()}`,
        name: '',
        scope: 'company',
        status: 'Active',
        newEmployeeBalance: 15,
        newEmployeeEligibilityMonths: 6,
        annualLeaveTiers: [{ id: `tier-${Date.now()}`, afterYears: 1, days: 21 }],
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
            setPolicy(policyToEdit || getInitialState());
        }
    }, [isOpen, policyToEdit]);

    if (!isOpen) return null;

    const handlePolicyChange = (field: keyof LeavePolicy, value: any) => {
        setPolicy(p => ({ ...p, [field]: value }));
    };

    const handleTierChange = (index: number, field: keyof AnnualLeaveTier, value: any) => {
        const newTiers = [...policy.annualLeaveTiers];
        const tier = newTiers[index] as any;
        tier[field] = Number(value);
        setPolicy(p => ({ ...p, annualLeaveTiers: newTiers }));
    };
    
    const handleAddTier = () => {
        const lastTier = policy.annualLeaveTiers[policy.annualLeaveTiers.length - 1];
        const newTier: AnnualLeaveTier = {
            id: `tier-${Date.now()}`,
            afterYears: lastTier ? lastTier.afterYears + 1 : 1,
            days: lastTier ? lastTier.days + 1 : 22,
        };
        setPolicy(p => ({ ...p, annualLeaveTiers: [...p.annualLeaveTiers, newTier] }));
    };

    const handleRemoveTier = (index: number) => {
        setPolicy(p => ({ ...p, annualLeaveTiers: p.annualLeaveTiers.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(policy);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{policyToEdit ? 'تعديل سياسة الإجازات' : 'إنشاء سياسة إجازات جديدة'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        value={policy.name}
                        onChange={e => handlePolicyChange('name', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        placeholder="اسم السياسة"
                        required
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">رصيد الموظف الجديد (يوم)</label>
                             <input type="number" value={policy.newEmployeeBalance} onChange={e => handlePolicyChange('newEmployeeBalance', Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">أحقية الإجازة بعد (شهر)</label>
                             <input type="number" value={policy.newEmployeeEligibilityMonths} onChange={e => handlePolicyChange('newEmployeeEligibilityMonths', Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">رصيد الإجازة العارضة (يوم)</label>
                             <input type="number" value={policy.casualLeaveBalance} onChange={e => handlePolicyChange('casualLeaveBalance', Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-700">شرائح الإجازة السنوية</h3>
                        {policy.annualLeaveTiers.map((tier, index) => (
                            <div key={tier.id} className="p-3 bg-slate-50 rounded-lg border flex items-center gap-3">
                               <div className="flex items-center gap-2 flex-1">
                                    <label className="text-sm">بعد</label>
                                    <input type="number" value={tier.afterYears} onChange={e => handleTierChange(index, 'afterYears', e.target.value)} className="w-20 p-1.5 border rounded text-sm" />
                                    <label className="text-sm">سنوات، يستحق</label>
                                    <input type="number" value={tier.days} onChange={e => handleTierChange(index, 'days', e.target.value)} className="w-20 p-1.5 border rounded text-sm" />
                                     <label className="text-sm">يوم</label>
                               </div>
                                <button type="button" onClick={() => handleRemoveTier(index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <button type="button" onClick={handleAddTier} className="flex items-center gap-2 text-sm font-semibold text-sky-600">
                            <PlusCircleIcon className="w-5 h-5" />
                            <span>إضافة شريحة جديدة</span>
                        </button>
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
