
import React, { useState, useMemo } from 'react';
import type { EmployeeProfile, UserRole, Branch, NewUserPayload, AttendancePolicy, LeavePolicy, JobTitle, CompensationPackage, OvertimePolicy } from '../types';
// FIX: Import ChevronDownIcon.
import { PencilIcon, XCircleIcon, PlusCircleIcon, ArrowPathIcon, InformationCircleIcon, ChevronUpIcon, ArrowsUpDownIcon, ChevronDownIcon } from './icons/Icons';
import UserModal from './UserModal';
import PageHeader from './PageHeader';
import Card from './Card';
import ActionBar from './ActionBar';
import BulkAssignPolicyModal from './BulkAssignPolicyModal';


type SortableKeys = 'name' | 'title' | 'branchName' | 'employmentStatus';

const RoleEditor: React.FC<{ 
    currentRole: UserRole; 
    onSave: (newRole: UserRole) => void; 
}> = ({ currentRole, onSave }) => {
    const [role, setRole] = useState<UserRole>(currentRole);
    
    const handleSave = () => {
        if (role !== currentRole) {
            onSave(role);
        }
    };
    
    const allRoles: UserRole[] = ['Super Admin', 'Admin', 'Branch Admin', 'General Manager', 'HR Manager', 'HR Specialist', 'Finance Manager', 'Team Lead', 'Employee'];


    return (
        <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            onBlur={handleSave} // Save when focus is lost
            className="p-1 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold w-full"
        >
            {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
    );
};

interface SystemAdminPageProps {
  allUsers: EmployeeProfile[];
  branches: Branch[];
  attendancePolicies: AttendancePolicy[];
  overtimePolicies: OvertimePolicy[];
  leavePolicies: LeavePolicy[];
  jobTitles: JobTitle[];
  compensationPackages: CompensationPackage[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onDeactivateUser: (userId: string) => void;
  onReactivateUser: (userId: string) => void;
  onAddNewUser: (newUser: NewUserPayload) => void;
  onUpdateUser: (userId: string, updatedData: NewUserPayload) => void;
  onBulkDeactivateUsers: (userIds: string[]) => void;
  onBulkAssignAttendancePolicy: (policyId: string, employeeIds: string[]) => void;
  onBulkAssignOvertimePolicy: (policyId: string, employeeIds: string[]) => void;
  onBulkAssignLeavePolicy: (policyId: string, employeeIds: string[]) => void;
}

const SystemAdminPage: React.FC<SystemAdminPageProps> = ({ allUsers, branches, attendancePolicies, overtimePolicies, leavePolicies, jobTitles, compensationPackages, onUpdateUserRole, onDeactivateUser, onReactivateUser, onAddNewUser, onUpdateUser, onBulkDeactivateUsers, onBulkAssignAttendancePolicy, onBulkAssignOvertimePolicy, onBulkAssignLeavePolicy }) => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<EmployeeProfile | null>(null);
    const [branchFilter, setBranchFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: 'asc' | 'desc' } | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [isBulkPolicyModalOpen, setIsBulkPolicyModalOpen] = useState(false);


    const managers = useMemo(() => 
        allUsers.filter(u => ['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'].includes(u.role)),
        [allUsers]
    );

    const sortedAndFilteredUsers = useMemo(() => {
        let filteredUsers = allUsers.filter(user => {
            const branchMatch = branchFilter === 'all' || user.branchId === branchFilter;
            const statusMatch = statusFilter === 'all' || (statusFilter === 'active' && user.employmentStatus !== 'Inactive') || (statusFilter === 'inactive' && user.employmentStatus === 'Inactive');
            return branchMatch && statusMatch;
        });

        if (sortConfig) {
            filteredUsers.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filteredUsers;
    }, [allUsers, branchFilter, statusFilter, sortConfig]);

    const handleSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleToggleSelect = (userId: string) => {
        setSelectedUserIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const handleToggleSelectAll = () => {
        if (selectedUserIds.size === sortedAndFilteredUsers.length) {
            setSelectedUserIds(new Set());
        } else {
            setSelectedUserIds(new Set(sortedAndFilteredUsers.map(u => u.id)));
        }
    };

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
    };

    const handleOpenEditModal = (user: EmployeeProfile) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };
    
    const handleSaveUser = (userData: NewUserPayload) => {
        if (editingUser) {
            onUpdateUser(editingUser.id, userData);
        } else {
            onAddNewUser(userData);
        }
        setIsUserModalOpen(false);
    };

    const handleBulkDeactivate = () => {
        if (confirm(`هل أنت متأكد من رغبتك في إلغاء تفعيل ${selectedUserIds.size} مستخدم؟`)) {
            onBulkDeactivateUsers(Array.from(selectedUserIds));
            setSelectedUserIds(new Set());
        }
    };
    
    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
        }
        return sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="إدارة الموظفين"
                subtitle="عرض وتعديل بيانات جميع الموظفين في النظام."
            />
            
            <ActionBar>
                 <div className="flex items-center gap-2 flex-wrap">
                    <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg bg-slate-50 text-sm">
                        <option value="all">كل الفروع</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg bg-slate-50 text-sm">
                        <option value="all">كل الحالات</option>
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                    </select>
                </div>
                 <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>إضافة مستخدم</span>
                </button>
            </ActionBar>

            {selectedUserIds.size > 0 && (
                <div className="bg-sky-100 p-3 rounded-lg flex justify-between items-center mb-6">
                    <span className="text-sky-800 font-semibold">{selectedUserIds.size} مستخدم محدد</span>
                    <div className="flex gap-2">
                        <button onClick={() => setIsBulkPolicyModalOpen(true)} className="bg-white text-sky-700 font-semibold px-3 py-1 rounded-md text-sm border border-sky-200 hover:bg-sky-50">تعيين سياسة</button>
                        <button onClick={handleBulkDeactivate} className="bg-red-500 text-white font-semibold px-3 py-1 rounded-md text-sm hover:bg-red-600">إلغاء تفعيل</button>
                    </div>
                </div>
            )}

            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="p-4"><input type="checkbox" className="form-checkbox h-5 w-5 rounded text-sky-600" onChange={handleToggleSelectAll} checked={selectedUserIds.size === sortedAndFilteredUsers.length && sortedAndFilteredUsers.length > 0} /></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('name')} className="flex items-center gap-1">المستخدم {getSortIcon('name')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('title')} className="flex items-center gap-1">المسمى الوظيفي {getSortIcon('title')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('branchName')} className="flex items-center gap-1">الفرع {getSortIcon('branchName')}</button></th>
                                <th scope="col" className="px-6 py-3">سياسة الحضور</th>
                                <th scope="col" className="px-6 py-3">الدور</th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('employmentStatus')} className="flex items-center gap-1">الحالة {getSortIcon('employmentStatus')}</button></th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredUsers.map((user) => (
                                <tr key={user.id} className={`border-b hover:bg-slate-50 ${selectedUserIds.has(user.id) ? 'bg-sky-50' : ''}`}>
                                    <td className="p-4"><input type="checkbox" className="form-checkbox h-5 w-5 rounded text-sky-600" onChange={() => handleToggleSelect(user.id)} checked={selectedUserIds.has(user.id)} /></td>
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <span>{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.title}</td>
                                    <td className="px-6 py-4">{user.branchName || '-'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span>{user.attendancePolicyName || '-'}</span>
                                            {user.attendancePolicyName && user.attendancePolicyName !== 'N/A' && (
                                                <div className="relative group">
                                                    <InformationCircleIcon className="w-4 h-4 text-slate-400 cursor-pointer" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                        فترة السماح: {attendancePolicies.find(p => p.id === user.attendancePolicyId)?.gracePeriodInMinutes} دقيقة
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 min-w-[150px]"><RoleEditor currentRole={user.role} onSave={(newRole) => onUpdateUserRole(user.id, newRole)} /></td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.employmentStatus === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>{user.employmentStatus === 'Inactive' ? 'غير نشط' : 'نشط'}</span></td>
                                    <td className="px-6 py-4 flex items-center gap-1">
                                         <button onClick={() => handleOpenEditModal(user)} className="p-2 rounded-full text-slate-400 hover:bg-sky-100 hover:text-sky-600" title="تعديل"><PencilIcon className="w-5 h-5" /></button>
                                        {user.employmentStatus !== 'Inactive' ? (
                                            <button onClick={() => onDeactivateUser(user.id)} disabled={!user.isEmployee} className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 disabled:text-slate-300 disabled:hover:bg-transparent" title="إلغاء التفعيل"><XCircleIcon className="w-6 h-6" /></button>
                                        ) : (
                                            <button onClick={() => onReactivateUser(user.id)} className="p-2 rounded-full text-slate-400 hover:bg-emerald-100 hover:text-emerald-600" title="إعادة تفعيل"><ArrowPathIcon className="w-6 h-6" /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <UserModal 
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSave={handleSaveUser}
                userToEdit={editingUser}
                branches={branches.filter(b => b.status === 'Active')}
                managers={managers}
                attendancePolicies={attendancePolicies}
                overtimePolicies={overtimePolicies}
                leavePolicies={leavePolicies}
                jobTitles={jobTitles}
                compensationPackages={compensationPackages}
            />
            <BulkAssignPolicyModal
                isOpen={isBulkPolicyModalOpen}
                onClose={() => setIsBulkPolicyModalOpen(false)}
                employees={allUsers.filter(u => selectedUserIds.has(u.id))}
                attendancePolicies={attendancePolicies}
                overtimePolicies={overtimePolicies}
                leavePolicies={leavePolicies}
                onAssignAttendance={onBulkAssignAttendancePolicy}
                onAssignOvertime={onBulkAssignOvertimePolicy}
                onAssignLeave={onBulkAssignLeavePolicy}
            />
        </div>
    );
};

export default SystemAdminPage;