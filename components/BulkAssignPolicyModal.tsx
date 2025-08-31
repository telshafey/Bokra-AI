
import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { EmployeeProfile, AttendancePolicy, OvertimePolicy, LeavePolicy } from '../types';

interface BulkAssignPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    employees: EmployeeProfile[];
    attendancePolicies: AttendancePolicy[];
    overtimePolicies: OvertimePolicy[];
    leavePolicies: LeavePolicy[];
    onAssignAttendance: (policyId: string, employeeIds: string[]) => void;
    onAssignOvertime: (policyId: string, employeeIds: string[]) => void;
    onAssignLeave: (policyId: string, employeeIds: string[]) => void;
}

const BulkAssignPolicyModal: React.FC<BulkAssignPolicyModalProps> = ({
    isOpen,
    onClose,
    employees,
    attendancePolicies,
    overtimePolicies,
    leavePolicies,
    onAssignAttendance,
    onAssignOvertime,
    onAssignLeave,
}) => {
    const [selectedAttendancePolicy, setSelectedAttendancePolicy] = useState('');
    const [selectedOvertimePolicy, setSelectedOvertimePolicy] = useState('');
    const [selectedLeavePolicy, setSelectedLeavePolicy] = useState('');

    if (!isOpen) return null;

    const employeeIds = employees.map(e => e.id);

    const handleSave = () => {
        if (selectedAttendancePolicy) {
            onAssignAttendance(selectedAttendancePolicy, employeeIds);
        }
        if (selectedOvertimePolicy) {
            onAssignOvertime(selectedOvertimePolicy, employeeIds);
        }
        if (selectedLeavePolicy) {
            onAssignLeave(selectedLeavePolicy, employeeIds);
        }
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">تعيين سياسة جماعية</h2>
                        <p className="text-sm text-slate-500">سيتم تطبيق السياسات المختارة على {employees.length} موظفين.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">سياسة الحضور</label>
                        <select
                            value={selectedAttendancePolicy}
                            onChange={e => setSelectedAttendancePolicy(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                        >
                            <option value="">-- عدم التغيير --</option>
                            {attendancePolicies.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">سياسة الوقت الإضافي</label>
                        <select
                            value={selectedOvertimePolicy}
                            onChange={e => setSelectedOvertimePolicy(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                        >
                            <option value="">-- عدم التغيير --</option>
                            {overtimePolicies.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">سياسة الإجازات</label>
                        <select
                            value={selectedLeavePolicy}
                            onChange={e => setSelectedLeavePolicy(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                        >
                            <option value="">-- عدم التغيير --</option>
                            {leavePolicies.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-4 border-t">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">
                        إلغاء
                    </button>
                    <button type="button" onClick={handleSave} className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">
                        حفظ وتعيين
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkAssignPolicyModal;