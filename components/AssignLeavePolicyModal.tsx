import React, { useState, useEffect, useMemo } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { LeavePolicy, EmployeeProfile } from '../types';

interface AssignLeavePolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    policy: LeavePolicy;
    employees: EmployeeProfile[];
    onAssign: (policyId: string, employeeIds: string[]) => void;
}

const AssignLeavePolicyModal: React.FC<AssignLeavePolicyModalProps> = ({ isOpen, onClose, policy, employees, onAssign }) => {
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            const initialSelection = new Set(
                employees.filter(e => e.leavePolicyId === policy.id).map(e => e.id)
            );
            setSelectedEmployeeIds(initialSelection);
        }
    }, [isOpen, policy, employees]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [employees, searchTerm]);

    if (!isOpen) return null;

    const handleToggleEmployee = (employeeId: string) => {
        setSelectedEmployeeIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(employeeId)) {
                newSet.delete(employeeId);
            } else {
                newSet.add(employeeId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedEmployeeIds.size === filteredEmployees.length) {
            setSelectedEmployeeIds(new Set());
        } else {
            setSelectedEmployeeIds(new Set(filteredEmployees.map(e => e.id)));
        }
    };

    const handleSubmit = () => {
        onAssign(policy.id, Array.from(selectedEmployeeIds));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">تعيين سياسة إجازات: "{policy.name}"</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                
                <input
                    type="text"
                    placeholder="ابحث عن موظف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg mb-4"
                />

                <div className="flex-1 overflow-y-auto border-t border-b py-2">
                    <div className="px-4 py-2 flex items-center bg-slate-50 rounded-t-lg">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-sky-600 rounded"
                            checked={filteredEmployees.length > 0 && selectedEmployeeIds.size === filteredEmployees.length}
                            onChange={handleSelectAll}
                        />
                        <label className="mr-3 font-semibold text-slate-700">تحديد الكل</label>
                    </div>
                    {filteredEmployees.map(emp => (
                        <div key={emp.id} className="flex items-center p-3 border-b hover:bg-slate-50">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-sky-600 rounded"
                                checked={selectedEmployeeIds.has(emp.id)}
                                onChange={() => handleToggleEmployee(emp.id)}
                            />
                            <div className="mr-3">
                                <p className="font-semibold text-slate-800">{emp.name}</p>
                                <p className="text-xs text-slate-500">{emp.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                    <button type="button" onClick={handleSubmit} className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ التعيينات</button>
                </div>
            </div>
        </div>
    );
};

export default AssignLeavePolicyModal;
