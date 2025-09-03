
import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';
import type { AttendancePolicy, LatenessTier, EmployeeProfile, Branch, EarlyLeaveTier, WorkLocation } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface AttendancePolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (policy: AttendancePolicy) => void;
    policyToEdit: AttendancePolicy | null;
    currentUser: EmployeeProfile;
    branches: Branch[];
    workLocations: WorkLocation[];
}

const AttendancePolicyModal: React.FC<AttendancePolicyModalProps> = ({ isOpen, onClose, onSave, policyToEdit, currentUser, branches, workLocations }) => {
    const { t } = useTranslation();
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

    const handleEarlyLeaveTierChange = (index: number, field: keyof EarlyLeaveTier, value: any) => {
        const newTiers = [...policy.earlyLeaveTiers];
        const tier = newTiers[index] as any;
        tier[field] = Number(value);
        setPolicy(p => ({ ...p, earlyLeaveTiers: newTiers }));
    };

    const handleAddEarlyLeaveTier = () => {
        const lastTier = policy.earlyLeaveTiers[policy.earlyLeaveTiers.length - 1];
        const newTier: EarlyLeaveTier = {
            id: `el-tier-${Date.now()}`,
            fromMinutes: lastTier ? lastTier.toMinutes + 1 : 1,
            toMinutes: lastTier ? lastTier.toMinutes + 15 : 15,
            penaltyHours: lastTier ? lastTier.penaltyHours + 0.5 : 0.5,
        };
        setPolicy(p => ({ ...p, earlyLeaveTiers: [...p.earlyLeaveTiers, newTier] }));
    };

    const handleRemoveEarlyLeaveTier = (index: number) => {
        setPolicy(p => ({ ...p, earlyLeaveTiers: p.earlyLeaveTiers.filter((_, i) => i !== index) }));
    };
    
    const handleLocationToggle = (locationId: string) => {
        setPolicy(p => {
            const newIds = new Set(p.workLocationIds);
            if (newIds.has(locationId)) {
                newIds.delete(locationId);
            } else {
                newIds.add(locationId);
            }
            return { ...p, workLocationIds: Array.from(newIds) };
        });
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
                    <h2 className="text-2xl font-bold text-slate-800">{policyToEdit ? 'تعديل سياسة الحضور' : 'إنشاء سياسة حضور جديدة'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم السياسة</label>
                            <input
                                type="text"
                                value={policy.name}
                                onChange={e => handlePolicyChange('name', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg"
                                required
                            />
                        </div>
                         {currentUser.role !== 'Branch Admin' && currentUser.role !== 'Admin' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">نطاق السياسة</label>
                                <select 
                                    value={policy.scope} 
                                    onChange={e => handlePolicyChange('scope', e.target.value)}
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
                                onChange={e => handlePolicyChange('branchId', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                                required={policy.scope === 'branch'}
                            >
                                <option value="">-- اختر فرع --</option>
                                {/* FIX: Replaced property access from `name` to `nameKey` and wrapped it in the translation function to match the type definition. */}
                                {branches.map(b => <option key={b.id} value={b.id}>{t(b.nameKey)}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">فترة السماح للتأخير (دقائق)</label>
                            <input type="number" value={policy.gracePeriodInMinutes} onChange={e => handlePolicyChange('gracePeriodInMinutes', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">مدة الراحة (ساعات)</label>
                            <input type="number" step="0.1" value={policy.breakDurationHours} onChange={e => handlePolicyChange('breakDurationHours', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                         </div>
                    </div>
                    
                    {/* Work Locations Section */}
                     <div className="space-y-3 border-t pt-4">
                        <h3 className="text-lg font-semibold text-slate-700">مواقع العمل المسموح بها</h3>
                        <div className="max-h-40 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2 p-2 border rounded-lg">
                            {workLocations.map(loc => (
                                <label key={loc.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={policy.workLocationIds.includes(loc.id)}
                                        onChange={() => handleLocationToggle(loc.id)}
                                        className="form-checkbox h-4 w-4 text-sky-600 rounded"
                                    />
                                    <span className="text-sm">{loc.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Lateness Tiers Section */}
                    <div className="space-y-3 border-t pt-4">
                        <h3 className="text-lg font-semibold text-slate-700">شرائح جزاءات التأخير</h3>
                        {policy.latenessTiers.map((tier, index) => (
                            <div key={tier.id} className="p-3 bg-slate-50 rounded-lg border flex items-center gap-3">
                               <div className="flex items-center gap-2 flex-1">
                                    <label className="text-sm">من</label>
                                    <input type="number" value={tier.fromMinutes} onChange={e => handleTierChange(index, 'fromMinutes', e.target.value)} className="w-20 p-1.5 border border-slate-300 rounded text-sm" />
                                     <label className="text-sm">إلى</label>
                                    <input type="number" value={tier.toMinutes} onChange={e => handleTierChange(index, 'toMinutes', e.target.value)} className="w-20 p-1.5 border border-slate-300 rounded text-sm" />
                                    <label className="text-sm">دقيقة تأخير، يتم خصم</label>
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
                            <span>إضافة شريحة تأخير</span>
                        </button>
                    </div>

                    {/* Early Leave Tiers Section */}
                    <div className="space-y-3 border-t pt-4">
                        <h3 className="text-lg font-semibold text-slate-700">شرائح جزاءات الانصراف المبكر</h3>
                        {policy.earlyLeaveTiers.map((tier, index) => (
                            <div key={tier.id} className="p-3 bg-slate-50 rounded-lg border flex items-center gap-3">
                               <div className="flex items-center gap-2 flex-1">
                                    <label className="text-sm">من</label>
                                    <input type="number" value={tier.fromMinutes} onChange={e => handleEarlyLeaveTierChange(index, 'fromMinutes', e.target.value)} className="w-20 p-1.5 border border-slate-300 rounded text-sm" />
                                     <label className="text-sm">إلى</label>
                                    <input type="number" value={tier.toMinutes} onChange={e => handleEarlyLeaveTierChange(index, 'toMinutes', e.target.value)} className="w-20 p-1.5 border border-slate-300 rounded text-sm" />
                                    <label className="text-sm">دقيقة انصراف مبكر، يتم خصم</label>
                                    <input type="number" step="0.1" value={tier.penaltyHours} onChange={e => handleEarlyLeaveTierChange(index, 'penaltyHours', e.target.value)} className="w-20 p-1.5 border border-slate-300 rounded text-sm" />
                                     <label className="text-sm">ساعة</label>
                               </div>
                                <button type="button" onClick={() => handleRemoveEarlyLeaveTier(index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <button type="button" onClick={handleAddEarlyLeaveTier} className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-800">
                            <PlusCircleIcon className="w-5 h-5" />
                            <span>إضافة شريحة انصراف مبكر</span>
                        </button>
                    </div>

                    {/* Leave Permit Rules Section */}
                    <div className="space-y-3 border-t pt-4">
                        <h3 className="text-lg font-semibold text-slate-700">قواعد أذونات الانصراف</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الحد الأقصى شهرياً</label>
                                <input type="number" value={policy.maxPermitsPerMonth} onChange={e => handlePolicyChange('maxPermitsPerMonth', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">أقل مدة (دقائق)</label>
                                <input type="number" value={policy.minPermitDurationMinutes} onChange={e => handlePolicyChange('minPermitDurationMinutes', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">أقصى مدة (ساعات)</label>
                                <input type="number" value={policy.maxPermitDurationHours} onChange={e => handlePolicyChange('maxPermitDurationHours', Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg" />
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ السياسة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AttendancePolicyModal;
