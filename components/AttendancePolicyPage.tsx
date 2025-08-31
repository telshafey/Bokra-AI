
import React, { useState, useMemo } from 'react';
import type { AttendancePolicy, EmployeeProfile, Branch, WorkLocation } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, UserGroupIcon, ClockIcon, BuildingOfficeIcon } from './icons/Icons';
import AttendancePolicyModal from './AttendancePolicyModal';
import AssignPolicyModal from './AssignPolicyModal';
import WorkLocationModal from './WorkLocationModal';
import PageHeader from './PageHeader';
import Card from './Card';
import ActionBar from './ActionBar';

interface AttendancePolicyPageProps {
    attendancePolicies: AttendancePolicy[];
    employees: EmployeeProfile[];
    onSaveAttendancePolicy: (policy: AttendancePolicy) => void;
    onDeleteAttendancePolicy: (policyId: string) => void;
    onBulkAssignAttendancePolicy: (policyId: string, employeeIds: string[]) => void;
    currentUser: EmployeeProfile;
    branches: Branch[];
    onUpdatePolicyStatus: (policyId: string, type: 'attendance' | 'leave' | 'overtime', newStatus: 'Active' | 'Rejected') => void;
    workLocations: WorkLocation[];
    onAddWorkLocation: (location: Omit<WorkLocation, 'id'>) => void;
    onUpdateWorkLocation: (location: WorkLocation) => void;
}

const STATUS_STYLES: Record<'Active' | 'PendingApproval', { text: string; bg: string; }> = {
    Active: { text: 'text-emerald-800', bg: 'bg-emerald-100' },
    PendingApproval: { text: 'text-amber-800', bg: 'bg-amber-100' },
};

const AttendancePolicyPage: React.FC<AttendancePolicyPageProps> = ({
    attendancePolicies,
    employees,
    onSaveAttendancePolicy,
    onDeleteAttendancePolicy,
    onBulkAssignAttendancePolicy,
    currentUser,
    branches,
    onUpdatePolicyStatus,
    workLocations,
    onAddWorkLocation,
    onUpdateWorkLocation,
}) => {
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<AttendancePolicy | null>(null);
    const [assigningPolicy, setAssigningPolicy] = useState<AttendancePolicy | null>(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<WorkLocation | null>(null);


    const visiblePolicies = useMemo(() => {
        if (currentUser.role === 'Branch Admin' || currentUser.role === 'Admin') {
            return attendancePolicies.filter(p => p.scope === 'company' || p.branchId === currentUser.branchId);
        }
        return attendancePolicies;
    }, [attendancePolicies, currentUser]);

    const employeesForAssignment = (policy: AttendancePolicy) => {
        if (policy.scope === 'branch') {
            return employees.filter(e => e.branchId === policy.branchId);
        }
        return employees;
    };

    const handleOpenAddModal = () => {
        setEditingPolicy(null);
        setIsPolicyModalOpen(true);
    };

    const handleOpenEditModal = (policy: AttendancePolicy) => {
        setEditingPolicy(policy);
        setIsPolicyModalOpen(true);
    };

    const handleDelete = (policyId: string) => {
        if (confirm('هل أنت متأكد من رغبتك في حذف هذه السياسة؟ سيتم إلغاء تعيينها من جميع الموظفين.')) {
            onDeleteAttendancePolicy(policyId);
        }
    };

    const handleSaveLocation = (locationData: WorkLocation | Omit<WorkLocation, 'id'>) => {
        if ('id' in locationData) {
            onUpdateWorkLocation(locationData);
        } else {
            onAddWorkLocation(locationData);
        }
    };
    
    const locationCardAction = (
        <button onClick={() => { setEditingLocation(null); setIsLocationModalOpen(true); }} className="p-2 rounded-full text-sky-600 hover:bg-sky-100">
            <PlusCircleIcon className="w-6 h-6"/>
        </button>
    );

    return (
        <div className="space-y-6">
            <PageHeader 
                title="إدارة سياسات الحضور"
                subtitle="إدارة سياسات الحضور، المخالفات، ومواقع العمل المعتمدة."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ActionBar>
                        <div />
                         <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg">
                            <PlusCircleIcon className="w-5 h-5" />
                            <span>سياسة جديدة</span>
                        </button>
                    </ActionBar>
                    <Card title="سياسات الحضور والانصراف" paddingClass="p-6">
                        <div className="space-y-6">
                            {visiblePolicies.map(policy => {
                                const assignedEmployeesCount = employees.filter(e => e.attendancePolicyId === policy.id).length;
                                return (
                                    <div key={policy.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
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
                                         {currentUser.role === 'Super Admin' && policy.status === 'PendingApproval' && (
                                            <div className="mb-4 pt-4 border-t border-slate-200 flex justify-end gap-2">
                                                <button onClick={() => onUpdatePolicyStatus(policy.id, 'attendance', 'Rejected')} className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">رفض</button>
                                                <button onClick={() => onUpdatePolicyStatus(policy.id, 'attendance', 'Active')} className="text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-md">موافقة</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card title="إدارة مواقع العمل" className="sticky top-6">
                        <div className="absolute top-4 left-4">{locationCardAction}</div>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {workLocations.map(loc => (
                                <div key={loc.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-800">{loc.name}</p>
                                        <p className="text-xs text-slate-500">النطاق: {loc.radiusMeters} متر</p>
                                    </div>
                                    <button onClick={() => { setEditingLocation(loc); setIsLocationModalOpen(true); }} className="p-1 text-slate-400 hover:text-sky-600">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {assigningPolicy && (
                <AssignPolicyModal
                    isOpen={!!assigningPolicy}
                    onClose={() => setAssigningPolicy(null)}
                    policy={assigningPolicy}
                    employees={employeesForAssignment(assigningPolicy)}
                    onAssign={onBulkAssignAttendancePolicy}
                />
            )}

            <AttendancePolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                onSave={onSaveAttendancePolicy}
                policyToEdit={editingPolicy}
                currentUser={currentUser}
                branches={branches}
                workLocations={workLocations}
            />

            <WorkLocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSave={handleSaveLocation}
                locationToEdit={editingLocation}
            />
        </div>
    );
};

export default AttendancePolicyPage;
