
import React, { useState, useMemo } from 'react';
import type { OvertimePolicy, EmployeeProfile, Branch } from '../types';
import { PlusCircleIcon, PencilIcon, ArchiveBoxIcon, UserGroupIcon, ClockIcon, BanknotesIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';
import OvertimePolicyModal from './OvertimePolicyModal';
import AssignOvertimePolicyModal from './AssignOvertimePolicyModal';
import PageHeader from './PageHeader';
import Card from './Card';
import ActionBar from './ActionBar';
import { useTranslation } from './contexts/LanguageContext';

type SortableKeys = 'name' | 'scope';

interface OvertimePolicyPageProps {
    overtimePolicies: OvertimePolicy[];
    employees: EmployeeProfile[];
    onSaveOvertimePolicy: (policy: OvertimePolicy) => void;
    onArchivePolicy: (policyId: string) => void;
    onBulkAssignPolicy: (policyId: string, employeeIds: string[]) => void;
    onBulkArchivePolicies: (policyIds: string[]) => void;
    currentUser: EmployeeProfile;
    branches: Branch[];
    onUpdatePolicyStatus: (policyId: string, type: 'attendance' | 'leave' | 'overtime', newStatus: 'Active' | 'Rejected') => void;
}

const STATUS_STYLES: Record<OvertimePolicy['status'], { text: string; bg: string; }> = {
    Active: { text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
    PendingApproval: { text: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/60' },
    Archived: { text: 'text-slate-800 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-700' },
    Rejected: { text: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/60' },
};

const OvertimePolicyPage: React.FC<OvertimePolicyPageProps> = ({
    overtimePolicies,
    employees,
    onSaveOvertimePolicy,
    onArchivePolicy,
    onBulkAssignPolicy,
    onBulkArchivePolicies,
    currentUser,
    branches,
    onUpdatePolicyStatus
}) => {
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<OvertimePolicy | null>(null);
    const [assigningPolicy, setAssigningPolicy] = useState<OvertimePolicy | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: 'asc' | 'desc' } | null>(null);
    const [selectedPolicyIds, setSelectedPolicyIds] = useState<Set<string>>(new Set());
    const { t } = useTranslation();


    const visiblePolicies = useMemo(() => {
        let policies = overtimePolicies;
        if (currentUser.role === 'Branch Admin' || currentUser.role === 'Admin') {
            policies = policies.filter(p => p.scope === 'company' || p.branchId === currentUser.branchId);
        }

        if (sortConfig !== null) {
            policies.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return policies;
    }, [overtimePolicies, currentUser, sortConfig]);

    const handleSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
        return sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
    };

    const handleToggleSelect = (policyId: string) => {
        setSelectedPolicyIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(policyId)) newSet.delete(policyId);
            else newSet.add(policyId);
            return newSet;
        });
    };

    const handleToggleSelectAll = () => {
        if (selectedPolicyIds.size === visiblePolicies.length) {
            setSelectedPolicyIds(new Set());
        } else {
            setSelectedPolicyIds(new Set(visiblePolicies.map(p => p.id)));
        }
    };

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

    const handleArchive = (policyId: string) => {
        if (confirm('هل أنت متأكد من رغبتك في أرشفة هذه السياسة؟')) {
            onArchivePolicy(policyId);
        }
    };
    
    const handleBulkArchive = () => {
        if (confirm(`هل أنت متأكد من رغبتك في أرشفة ${selectedPolicyIds.size} سياسات؟`)) {
            onBulkArchivePolicies(Array.from(selectedPolicyIds));
            setSelectedPolicyIds(new Set());
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

            {selectedPolicyIds.size > 0 && (
                <div className="bg-sky-100 dark:bg-sky-900/50 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-sky-800 dark:text-sky-300 font-semibold">{selectedPolicyIds.size} سياسات محددة</span>
                    <button onClick={handleBulkArchive} className="bg-amber-500 text-white font-semibold px-3 py-1 rounded-md text-sm hover:bg-amber-600">أرشفة المحدد</button>
                </div>
            )}
            
            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="p-4"><input type="checkbox" onChange={handleToggleSelectAll} checked={selectedPolicyIds.size === visiblePolicies.length && visiblePolicies.length > 0} /></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('name')} className="flex items-center gap-1">الاسم {getSortIcon('name')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('scope')} className="flex items-center gap-1">النطاق {getSortIcon('scope')}</button></th>
                                <th className="px-6 py-3">المعينون</th>
                                <th className="px-6 py-3">الحالة</th>
                                <th className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                             {visiblePolicies.map(policy => {
                                const assignedEmployeesCount = employees.filter(e => e.overtimePolicyId === policy.id).length;
                                return (
                                <tr key={policy.id} className="border-b dark:border-slate-700">
                                    <td className="p-4"><input type="checkbox" checked={selectedPolicyIds.has(policy.id)} onChange={() => handleToggleSelect(policy.id)} /></td>
                                    <td className="px-6 py-4 font-semibold dark:text-slate-200">{policy.name}</td>
                                    {/* FIX: Replaced property access from `name` to `nameKey` and wrapped it in the translation function to match the type definition. */}
                                    <td className="px-6 py-4">{policy.scope === 'company' ? 'عام للشركة' : `خاص بـ ${t(branches.find(b => b.id === policy.branchId)?.nameKey || 'فرع')}`}</td>
                                    <td className="px-6 py-4">{assignedEmployeesCount}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[policy.status].bg} ${STATUS_STYLES[policy.status].text}`}>{policy.status === 'Active' ? 'نشط' : (policy.status === 'Archived' ? 'مؤرشفة' : 'بانتظار الموافقة')}</span></td>
                                    <td className="px-6 py-4 flex items-center gap-1">
                                        <button onClick={() => setAssigningPolicy(policy)} disabled={policy.status !== 'Active'} className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full disabled:text-slate-300 dark:disabled:text-slate-600" title="تعيين"><UserGroupIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleOpenEditModal(policy)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-full" title="تعديل"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleArchive(policy.id)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-full" title="أرشفة"><ArchiveBoxIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {assigningPolicy && (
                <AssignOvertimePolicyModal
                    isOpen={!!assigningPolicy}
                    onClose={() => setAssigningPolicy(null)}
                    policy={assigningPolicy}
                    employees={employeesForAssignment(assigningPolicy)}
                    onAssign={onBulkAssignPolicy}
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
