import React, { useState } from 'react';
import type { LeaveBalance, LeaveRequest, RequestStatus, LeaveType, EmployeeProfile } from '../types';
import { CalendarIcon, BriefcaseIcon, ClockIcon, XCircleIcon, PlusCircleIcon, UserPlusIcon, AcademicCapIcon, ArrowDownTrayIcon } from './icons/Icons';
import RequestLeaveModal from './RequestLeaveModal';
import Card from './Card';
import ActionBar from './ActionBar';
import { useRequestContext } from './contexts/RequestContext';
import { useTranslation } from './contexts/LanguageContext';


const LEAVE_TYPE_ICONS: Record<LeaveType, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'Annual': CalendarIcon,
    'Sick': BriefcaseIcon,
    'Casual': ClockIcon,
    'Unpaid': XCircleIcon,
    'NewbornRegistration': UserPlusIcon,
    'Exam': AcademicCapIcon,
}

const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
    'Annual': 'bg-sky-500',
    'Sick': 'bg-emerald-500',
    'Casual': 'bg-amber-500',
    'Unpaid': 'bg-slate-500',
    'NewbornRegistration': 'bg-indigo-500',
    'Exam': 'bg-purple-500',
}

const STATUS_BADGE: Record<RequestStatus, string> = {
    Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
};

const BalanceCard: React.FC<{ balance: LeaveBalance; t: (key: string) => string }> = ({ balance, t }) => {
    const Icon = LEAVE_TYPE_ICONS[balance.type];
    const color = LEAVE_TYPE_COLORS[balance.type];
    const unit = balance.type === 'NewbornRegistration' ? t('leave.balanceCard.timesUnit') : t('leave.balanceCard.dayUnit');

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{balance.typeName}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {balance.balance - balance.used} <span className="text-sm font-normal">/ {balance.balance} {unit}</span>
                </p>
            </div>
        </div>
    )
};

interface LeavePageProps {
    currentUser: EmployeeProfile;
}

const LeavePage: React.FC<LeavePageProps> = ({ currentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { leaveRequests, handleNewLeaveRequest } = useRequestContext();
    const { t } = useTranslation();
    
    const userLeaveRequests = leaveRequests.filter(r => r.employeeId === currentUser.id);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentUser.leaveBalances.map(balance => <BalanceCard key={balance.type} balance={balance} t={t} />)}
            </div>
            
            <ActionBar>
                <div /> 
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>{t('leave.newRequest')}</span>
                </button>
            </ActionBar>

            <Card title={t('leave.balanceHistory')} paddingClass="p-0">
                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('leave.leaveType')}</th>
                                <th scope="col" className="px-6 py-3">{t('leave.startDate')}</th>
                                <th scope="col" className="px-6 py-3">{t('leave.endDate')}</th>
                                <th scope="col" className="px-6 py-3">{t('leave.duration')}</th>
                                <th scope="col" className="px-6 py-3">{t('general.status')}</th>
                                <th scope="col" className="px-6 py-3">{t('leave.reason')}</th>
                                <th scope="col" className="px-6 py-3">{t('leave.attachments')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userLeaveRequests.map((request) => (
                                <tr key={request.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 odd:bg-white dark:odd:bg-slate-800 even:bg-slate-50 dark:even:bg-slate-800/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                                        {t(`leaveTypes.${request.leaveType}`)}
                                    </td>
                                    <td className="px-6 py-4">{new Date(request.startDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                    <td className="px-6 py-4">{new Date(request.endDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                    <td className="px-6 py-4">{request.duration} {t('general.days')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[request.status]}`}>
                                            {t(`requestStatus.${request.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={request.reason}>
                                        {request.reason}
                                    </td>
                                     <td className="px-6 py-4">
                                        {request.attachmentUrl ? (
                                            <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline" title={request.attachmentUrl}>
                                                <ArrowDownTrayIcon className="w-5 h-5 mx-auto" />
                                            </a>
                                        ) : (
                                            '-'
                                        )}
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
                onSubmit={(data) => handleNewLeaveRequest({...data, employeeId: currentUser.id})}
            />

        </div>
    );
};

export default LeavePage;
