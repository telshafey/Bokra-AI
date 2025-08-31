
import React, { useState, useMemo } from 'react';
import type { LeavePolicy, EmployeeProfile, Branch } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, UserGroupIcon } from './icons/Icons';
import LeavePolicyModal from './LeavePolicyModal';
import AssignLeavePolicyModal from './AssignLeavePolicyModal';
import PageHeader from './PageHeader';
import Card from './Card';
import ActionBar from './ActionBar';

interface LeavePolicyPageProps {
    leavePolicies: LeavePolicy[];
    employees: EmployeeProfile[];
    onSaveLeavePolicy: (policy: LeavePolicy) => void;
    onDeleteLeavePolicy: (policyId: string) => void;
    onBulkAssignLeavePolicy: (policyId: string, employeeIds: string[]) => void;
    currentUser: EmployeeProfile;
    branches: Branch[];
    onUpdatePolicyStatus: (policyId: string, type: 'attendance' | 'leave' | 'overtime', newStatus: 'Active' | 'Rejected') => void;
}

const STATUS_STYLES: Record<'Active' | 'PendingApproval', { text: string; bg: string; }> = {
    Active: { text: 'text-emerald-800', bg: 'bg-emerald-100' },
    PendingApproval: { text: 'text-amber-800', bg: 'bg-amber-100' },
};

const LeavePolicyPage: React.FC<LeavePolicyPageProps> = ({
    leavePolicies,
    employees,
    onSaveLeavePolicy,
    onDeleteLeavePolicy,
    onBulkAssignLeavePolicy,
    currentUser,
    branches,
    onUpdatePolicyStatus
}) => {
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
    const [assigningPolicy, setAssigningPolicy] = useState<LeavePolicy | null>(null);

    const visiblePolicies = useMemo(() => {
        if (currentUser.role === 'Branch Admin' || currentUser.role === 'Admin') {
            return leavePolicies.filter(p => p.scope === 'company' || p.branchId === currentUser.branchId);
        }
        return leavePolicies;
    }, [leavePolicies, currentUser]);

    const employeesForAssignment = (policy: LeavePolicy) => {
        if (policy.scope === 'branch') {
            return employees.filter(e => e.branchId === policy.branchId);
        }
        return employees;
    };

    const handleOpenAddModal = () => {
        setEditingPolicy(null);
        setIsPolicyModalOpen(true);
    };

    const handleOpenEditModal = (policy: LeavePolicy) => {
        setEditingPolicy(policy);
        setIsPolicyModalOpen(true);
    };

    const handleDelete = (policyId: string) => {
        if (confirm('هل أنت متأكد من رغبتك في حذف سياسة الإجازات هذه؟')) {
            onDeleteLeavePolicy(policyId);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="إدارة سياسات الإجازات"
                subtitle="إدارة سياسات أرصدة الإجازات السنوية، المرضية، والعارضة."
            />

            <ActionBar>
                <div/>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>سياسة جديدة</span>
                </button>
            </ActionBar>

            <Card title="سياسات الإجازات" paddingClass="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visiblePolicies.map(policy => {
                        const assignedEmployeesCount = employees.filter(e => e.leavePolicyId === policy.id).length;
                        return (
                            <div key={policy.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">{policy.name}</h3>
                                            <div className="flex items-center gap-2 flex-wrap mt-2">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${policy.scope === 'company' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'}`}>
                                                    {policy.scope === 'company' ? 'عام للشركة' : `خاص بـ ${branches.find(b => b.id === policy.branchId)?.name || 'فرع'}`}
                                                </span>
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_STYLES[policy.status].bg} ${STATUS_STYLES[policy.status].text}`}>
                                                    {policy.status === 'Active' ? 'نشط' : 'بانتظار الموافقة'}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs text-slate-500 mt-2">
                                                <UserGroupIcon className="w-4 h-4 ml-1.5" />
                                                <span>{assignedEmployeesCount} موظفين معينين</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => setAssigningPolicy(policy)} disabled={policy.status !== 'Active'} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 rounded-full disabled:text-slate-300 disabled:hover:bg-transparent" title="تعيين للموظفين">
                                                <UserGroupIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleOpenEditModal(policy)} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-100 rounded-full" title="تعديل">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(policy.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full" title="حذف">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 pt-4 grid grid-cols-3 gap-4 text-sm text-center">
                                        <div>
                                            <p className="text-slate-500">السنوية</p>
                                            <p className="font-bold text-lg text-slate-800">{policy.annualLeaveBalance} <span className="text-xs">يوم</span></p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">المرضية</p>
                                            <p className="font-bold text-lg text-slate-800">{policy.sickLeaveBalance} <span className="text-xs">يوم</span></p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">العارضة</p>
                                            <p className="font-bold text-lg text-slate-800">{policy.casualLeaveBalance} <span className="text-xs">يوم</span></p>
                                        </div>
                                    </div>
                                    {currentUser.role === 'Super Admin' && policy.status === 'PendingApproval' && (
                                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end gap-2">
                                            <button onClick={() => onUpdatePolicyStatus(policy.id, 'leave', 'Rejected')} className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">رفض</button>
                                            <button onClick={() => onUpdatePolicyStatus(policy.id, 'leave', 'Active')} className="text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-md">موافقة</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {assigningPolicy && (
                <AssignLeavePolicyModal
                    isOpen={!!assigningPolicy}
                    onClose={() => setAssigningPolicy(null)}
                    policy={assigningPolicy}
                    employees={employeesForAssignment(assigningPolicy)}
                    onAssign={onBulkAssignLeavePolicy}
                />
            )}
            
            <LeavePolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                onSave={onSaveLeavePolicy}
                policyToEdit={editingPolicy}
                currentUser={currentUser}
                branches={branches}
            />
        </div>
    );
};

export default LeavePolicyPage;
