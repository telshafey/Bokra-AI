

import React from 'react';
import { EmployeeProfile, HRRequest, RequestStatus } from '../types';
import { UserGroupIcon, BriefcaseIcon, DocumentTextIcon } from './icons/Icons';
import PendingRequests from './PendingRequests';
import BranchAttendancePieChart from './BranchAttendancePieChart';
import { useTranslation } from './contexts/LanguageContext';

interface BranchAdminPageProps {
  branchEmployees: EmployeeProfile[];
  branchPendingRequests: HRRequest[];
  onAction: (requestId: number, newStatus: RequestStatus) => void;
  currentUser: EmployeeProfile;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div className={`p-4 rounded-full ${color}`}>
            <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
            <p className="text-slate-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const BranchAdminPage: React.FC<BranchAdminPageProps> = ({ branchEmployees, branchPendingRequests, onAction, currentUser }) => {
  
    const { t } = useTranslation();
    // Dummy data for on leave count
    const onLeaveToday = branchEmployees.length > 5 ? 2 : 1;
    
    const stats = [
        { title: 'إجمالي الموظفين بالفرع', value: branchEmployees.length, icon: UserGroupIcon, color: 'bg-sky-500' },
        { title: 'في إجازة اليوم', value: onLeaveToday, icon: BriefcaseIcon, color: 'bg-emerald-500' },
        { title: 'طلبات معلقة', value: branchPendingRequests.length, icon: DocumentTextIcon, color: 'bg-amber-500' },
    ];
    
    const pendingRequestsWithDetails = branchPendingRequests.map(req => {
        const employee = branchEmployees.find(emp => emp.id === req.employeeId);
        return {
            ...req,
            employeeName: employee?.name || 'Unknown',
            employeeAvatarUrl: employee?.avatarUrl || '',
        }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">إدارة {currentUser.branchName}</h1>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Pending Requests */}
                <div className="lg:col-span-2">
                    <PendingRequests requests={pendingRequestsWithDetails} onAction={onAction} />
                </div>
                
                {/* Attendance Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-slate-700">حالة الحضور اليوم</h2>
                    <div className="h-64">
                         <BranchAttendancePieChart 
                            present={branchEmployees.length - onLeaveToday - 1} 
                            onLeave={onLeaveToday} 
                            absent={1} 
                         />
                    </div>
                </div>
            </div>

             {/* Branch Employees Table */}
            <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-slate-700">موظفو الفرع</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">الموظف</th>
                                <th scope="col" className="px-6 py-3">المسمى الوظيفي</th>
                                <th scope="col" className="px-6 py-3">القسم</th>
                                <th scope="col" className="px-6 py-3">المدير المباشر</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branchEmployees.map((employee) => (
                                <tr key={employee.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full" />
                                            <span>{employee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{employee.title}</td>
                                    {/* FIX: Replaced property access from `department` to `departmentKey` to match the type definition, and wrapped it in the translation function. */}
                                    <td className="px-6 py-4">{t('departments.' + employee.departmentKey)}</td>
                                    <td className="px-6 py-4">{employee.manager || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BranchAdminPage;