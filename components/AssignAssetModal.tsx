
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { Asset, EmployeeProfile } from '../types';

interface AssignAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assetId: string, employeeId: string | null) => void;
    asset: Asset;
    employees: EmployeeProfile[];
}

const AssignAssetModal: React.FC<AssignAssetModalProps> = ({ isOpen, onClose, onSave, asset, employees }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(asset.assignedToId);

    useEffect(() => {
        if (isOpen) {
            setSelectedEmployeeId(asset.assignedToId);
        }
    }, [isOpen, asset]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(asset.id, selectedEmployeeId);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">تسليم/استلام عهدة</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">العهدة المحددة:</p>
                    <p className="font-bold text-slate-800">{asset.name} ({asset.serialNumber})</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">تسليم لموظف</label>
                        <select
                            value={selectedEmployeeId || ''}
                            onChange={e => setSelectedEmployeeId(e.target.value || null)}
                            className="w-full p-2 border rounded-lg bg-slate-50"
                        >
                            <option value="">-- استلام (إرجاع للمخزن) --</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-emerald-600 text-white rounded-lg">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignAssetModal;
