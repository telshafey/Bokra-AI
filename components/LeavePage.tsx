
import React, { useState } from 'react';
import { LEAVE_TYPE_TRANSLATION } from '../constants';
import type { LeaveBalance, LeaveRequest, RequestStatus, LeaveType, EmployeeProfile } from '../types';
import { CalendarIcon, BriefcaseIcon, ClockIcon, XCircleIcon, PlusCircleIcon } from './icons/Icons';
import RequestLeaveModal from './RequestLeaveModal';
import Card from './Card';
import ActionBar from './ActionBar';


const LEAVE_TYPE_ICONS: Record<LeaveType, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'Annual': CalendarIcon,
    'Sick': BriefcaseIcon,
    'Casual': ClockIcon,
    'Unpaid': XCircleIcon,
}

const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
    'Annual': 'bg-sky-500',
    'Sick': 'bg-emerald-500',
    'Casual': 'bg-amber-500',
    'Unpaid': 'bg-slate-500',
}

const STATUS_BADGE: Record<RequestStatus, string> = {
    Approved: 'bg-emerald-100 text-emerald-800',
    Pending: 'bg-amber-100 text-amber-800',
    Rejected: 'bg-red-100 text-red-800',
};

const STATUS_TRANSLATION: Record<RequestStatus, string> = {
    Approved: 'موافق عليه',
    Pending: 'قيد الانتظار',
    Rejected: 'مرفوض',
}

const BalanceCard: React.FC<{ balance: LeaveBalance }> = ({ balance }) => {
    const Icon = LEAVE_TYPE_ICONS[balance.type];
    const color = LEAVE_TYPE_COLORS[balance.type];

    return (
        <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
                <p className="text-slate-500 text-sm">{balance.typeName}</p>
                <p className="text-xl font-bold text-slate-800">
                    {balance.balance - balance.used} <span className="text-sm font-normal">/ {balance.balance} يوم</span>
                </p>
            </div>
        </div>
    )
};

interface LeavePageProps {
    currentUser: EmployeeProfile;
    userLeaveRequests: LeaveRequest[];
    onSubmitRequest: (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'type' | 'submissionDate'>) => void;
}

const LeavePage: React.FC<LeavePageProps> = ({ currentUser, userLeaveRequests, onSubmitRequest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentUser.leaveBalances.map(balance => <BalanceCard key={balance.type} balance={balance} />)}
            </div>
            
            <ActionBar>
                <div /> 
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>طلب إجازة جديد</span>
                </button>
            </ActionBar>

            <Card title="سجل الإجازات" paddingClass="p-0">
                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">نوع الإجازة</th>
                                <th scope="col" className="px-6 py-3">تاريخ البدء</th>
                                <th scope="col" className="px-6 py-3">تاريخ الانتهاء</th>
                                <th scope="col" className="px-6 py-3">المدة</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">السبب</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userLeaveRequests.map((request) => (
                                <tr key={request.id} className="border-b hover:bg-slate-50 odd:bg-white even:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {LEAVE_TYPE_TRANSLATION[request.leaveType]}
                                    </td>
                                    <td className="px-6 py-4">{new Date(request.startDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                    <td className="px-6 py-4">{new Date(request.endDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                    <td className="px-6 py-4">{request.duration} أيام</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[request.status]}`}>
                                            {STATUS_TRANSLATION[request.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={request.reason}>
                                        {request.reason}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <RequestLeaveModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(data) => onSubmitRequest({...data, employeeId: currentUser.id})}
            />

        </div>
    );
};

export default LeavePage;
