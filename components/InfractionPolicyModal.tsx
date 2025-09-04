


import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';
import type { AttendancePolicy, LatenessTier } from '../types';

interface InfractionPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (policy: AttendancePolicy) => void;
    policyToEdit: AttendancePolicy | null;
}

const InfractionPolicyModal: React.FC<InfractionPolicyModalProps> = ({ isOpen, onClose, onSave, policyToEdit }) => {
    const getInitialState = (): AttendancePolicy => ({
        id: `policy-${Date.now()}`,
        name: '',
        scope: 'company',
        status: 'Active',
        gracePeriodInMinutes: 15,
        latenessTiers: [{ id: `tier-${Date.now()}`, fromMinutes: 16, toMinutes: 30, penaltyHours: 0.5 }],
        absenceRules: [],
        earlyLeaveTiers: [],
        maxPermitsPerMonth: 3,
        minPermitDurationMinutes: 60,
        maxPermitDurationHours: 4,
        breakDurationHours: 1,
        workLocationIds: [],
    });
    
    const [policy, setPolicy] = useState<AttendancePolicy>(getInitialState());

    useEffect(() => {
        if (isOpen) {
            setPolicy(policyToEdit || getInitialState());
        }
    }, [isOpen, policyToEdit]);

    if (!isOpen) return null;

    const handlePolicyChange = (field: keyof AttendancePolicy, value: any) => {
        setPolicy(p => ({ ...p, [field]: value }));
    };
    
    const handleTierChange = (index: number, field: keyof LatenessTier, value: any) => {
        const newTiers = [...policy.latenessTiers];
        const tier = newTiers[index] as any;
        tier[field] = Number(value);
        setPolicy(p => ({ ...p, latenessTiers: newTiers }));
    };
    
    const handleAddTier = () => {
        const lastTier = policy.latenessTiers[policy.latenessTiers.length - 1];
        const newTier: LatenessTier = {
            id: `tier-${Date.now()}`,
            fromMinutes: lastTier ? lastTier.toMinutes + 1 : 1,
            toMinutes: lastTier ? lastTier.toMinutes + 15 : 15,
            penaltyHours: lastTier ? lastTier.penaltyHours + 0.5 : 0.5,
        };
        setPolicy(p => ({ ...p, latenessTiers: [...p.latenessTiers, newTier] }));
    };

    const handleRemoveTier = (index: number) => {
        setPolicy(p => ({ ...p, latenessTiers: p.latenessTiers.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(policy);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{policyToEdit ? 'تعديل سياسة الحضور' : 'إنشاء سياسة حضور جديدة'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم السياسة</label>
                        <input
                            type="text"
                            value={policy.name}
                            onChange={e => handlePolicyChange('name', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                            required
                            spellCheck="true"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">فترة السماح (دقائق)</label>
                             <input type="number" value={policy.gracePeriodInMinutes} onChange={e => handlePolicyChange('gracePeriodInMinutes', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                    
                    {/* Lateness Tiers Section */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-700">شرائح جزاءات التأخير</h3>
                        {policy.latenessTiers.map((tier, index) => (
                            <div key={tier.id} className="p-3 bg-slate-50 rounded-lg border flex items-center gap-3">
                               <div className="flex items-center gap-2 flex-1">
                                    <label className="text-sm">من</label>
                                    <input type="number" value={tier.fromMinutes} onChange={e => handleTierChange(index, 'fromMinutes', e.target.value)} className="w-20 p-1.5 border border-slate-300 rounded text-sm" />
                                     <label className="text-sm">إلى</label>
                                    <input type="number" value={tier.toMinutes} onChange={e => handleTierChange(index, 'toMinutes', e.target.value)} className="w-20 p-1.5 border border-slate-300 rounded text-sm" />
                                    <label className="text-sm">دقيقة، يتم خصم</label>
                                    <input type="number" step="0.1" value={tier.penaltyHours} onChange={e => handleTierChange(index, 'penaltyHours', e.target.value)} className="w-20 p-1.5 border border-slate-300 rounded text-sm" />
                                     <label className="text-sm">ساعة</label>
                               </div>
                                <button type="button" onClick={() => handleRemoveTier(index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <button type="button" onClick={handleAddTier} className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-800">
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

export default InfractionPolicyModal;