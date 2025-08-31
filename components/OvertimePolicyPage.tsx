
import React, { useState, useMemo } from 'react';
import type { OvertimePolicy, EmployeeProfile, Branch } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, UserGroupIcon, ClockIcon, BanknotesIcon } from './icons/Icons';
import OvertimePolicyModal from './OvertimePolicyModal';
import AssignOvertimePolicyModal from './AssignOvertimePolicyModal';
import PageHeader from './PageHeader';
import Card from './Card';
import ActionBar from './ActionBar';

interface OvertimePolicyPageProps {
    overtimePolicies: OvertimePolicy[];
    employees: EmployeeProfile[];
    onSaveOvertimePolicy: (policy: OvertimePolicy) => void;
    onDeleteOvertimePolicy: (policyId: string) => void;
    onBulkAssignOvertimePolicy: (policyId: string, employeeIds: string[]) => void;
    currentUser: EmployeeProfile;
    branches: Branch[];
    onUpdatePolicyStatus: (policyId: string, type: 'attendance' | 'leave' | 'overtime', newStatus: 'Active' | 'Rejected') => void;
}

const STATUS_STYLES: Record<'Active' | 'PendingApproval', { text: string; bg: string; }> = {
    Active: { text: 'text-emerald-800', bg: 'bg-emerald-100' },
    PendingApproval: { text: 'text-amber-800', bg: 'bg-amber-100' },
};

const OvertimePolicyPage: React.FC<OvertimePolicyPageProps> = ({
    overtimePolicies,
    employees,
    onSaveOvertimePolicy,
    onDeleteOvertimePolicy,
    onBulkAssignOvertimePolicy,
    currentUser,
    branches,
    onUpdatePolicyStatus
}) => {
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<OvertimePolicy | null>(null);
    const [assigningPolicy, setAssigningPolicy] = useState<OvertimePolicy | null>(null);

    const visiblePolicies = useMemo(() => {
        if (currentUser.role === 'Branch Admin' || currentUser.role === 'Admin') {
            return overtimePolicies.filter(p => p.scope === 'company' || p.branchId === currentUser.branchId);
        }
        return overtimePolicies;
    }, [overtimePolicies, currentUser]);

    const employeesForAssignment = (policy: OvertimePolicy) => {
        if (policy.scope === 'branch') {
            return employees.filter(e => e.branchId === policy.branchId);
        }
        return employees;
    };

    const handleOpenAddModal = () => {
        setEditingPolicy(null);
        setIsPolicyModalOpen(true);
    };

    const handleOpenEditModal = (policy: OvertimePolicy) => {
        setEditingPolicy(policy);
        setIsPolicyModalOpen(true);
    };

    const handleDelete = (policyId: string) => {
        if (confirm('هل أنت متأكد من رغبتك في حذف هذه السياسة؟ سيتم إلغاء تعيينها من جميع الموظفين.')) {
            onDeleteOvertimePolicy(policyId);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="إدارة سياسات الوقت الإضافي"
                subtitle="إدارة سياسات وشروط الأجر الإضافي للموظفين."
            />

            <ActionBar>
                 <div/>
                 <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>سياسة جديدة</span>
                </button>
            </ActionBar>

            <Card title="سياسات الوقت الإضافي" paddingClass="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visiblePolicies.map(policy => {
                        const assignedEmployeesCount = employees.filter(e => e.overtimePolicyId === policy.id).length;
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
                                    <div className="border-t border-slate-200 pt-4 space-y-3 text-sm">
                                        <div className="flex items-center text-slate-600">
                                            <ClockIcon className="w-5 h-5 text-sky-500 mr-2" />
                                            <span>أقل مدة للاحتساب:</span>
                                            <strong className="mr-2 text-slate-800">{policy.minOvertimeInMinutes} دقيقة</strong>
                                        </div>
                                         <div className="flex items-center text-slate-600">
                                            <BanknotesIcon className="w-5 h-5 text-emerald-500 mr-2" />
                                            <span>معدل الأجر (العادي):</span>
                                            <strong className="mr-2 text-slate-800">{policy.overtimeRateNormal * 100}%</strong>
                                        </div>
                                        <div className="flex items-center text-slate-600">
                                            <BanknotesIcon className="w-5 h-5 text-emerald-500 mr-2" />
                                            <span>معدل الأجر (العطلات):</span>
                                            <strong className="mr-2 text-slate-800">{policy.overtimeRateHoliday * 100}%</strong>
                                        </div>
                                    </div>
                                    {currentUser.role === 'Super Admin' && policy.status === 'PendingApproval' && (
                                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end gap-2">
                                            <button onClick={() => onUpdatePolicyStatus(policy.id, 'overtime', 'Rejected')} className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">رفض</button>
                                            <button onClick={() => onUpdatePolicyStatus(policy.id, 'overtime', 'Active')} className="text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-md">موافقة</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {assigningPolicy && (
                <AssignOvertimePolicyModal
                    isOpen={!!assigningPolicy}
                    onClose={() => setAssigningPolicy(null)}
                    policy={assigningPolicy}
                    employees={employeesForAssignment(assigningPolicy)}
                    onAssign={onBulkAssignOvertimePolicy}
                />
            )}

            <OvertimePolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                onSave={onSaveOvertimePolicy}
                policyToEdit={editingPolicy}
                currentUser={currentUser}
                branches={branches}
            />
        </div>
    );
};

export default OvertimePolicyPage;
