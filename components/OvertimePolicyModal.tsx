import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { OvertimePolicy } from '../types';

interface OvertimePolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (policy: OvertimePolicy) => void;
    policyToEdit: OvertimePolicy | null;
}

const OvertimePolicyModal: React.FC<OvertimePolicyModalProps> = ({ isOpen, onClose, onSave, policyToEdit }) => {
    const getInitialState = (): OvertimePolicy => ({
        id: `overtime-policy-${Date.now()}`,
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
            setPolicy(policyToEdit || getInitialState());
        }
    }, [isOpen, policyToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setPolicy(p => ({ ...p, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(policy);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{policyToEdit ? 'تعديل سياسة الوقت الإضافي' : 'إنشاء سياسة وقت إضافي جديدة'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        type="text"
                        value={policy.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        placeholder="اسم السياسة"
                        required
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">أقل مدة للاحتساب (دقائق)</label>
                             <input name="minOvertimeInMinutes" type="number" value={policy.minOvertimeInMinutes} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">معامل اليوم العادي</label>
                             <input name="overtimeRateNormal" type="number" step="0.1" value={policy.overtimeRateNormal} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">معامل العطلات</label>
                             <input name="overtimeRateHoliday" type="number" step="0.1" value={policy.overtimeRateHoliday} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2">
                        <input name="allowOvertime" type="checkbox" checked={policy.allowOvertime} onChange={handleChange} className="form-checkbox h-5 w-5 text-sky-600 rounded" />
                        <span>السماح بالوقت الإضافي</span>
                    </label>

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
