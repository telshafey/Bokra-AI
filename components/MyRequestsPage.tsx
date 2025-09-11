import React, { useState, useMemo } from 'react';
import type { HRRequest, RequestStatus, EmployeeProfile, LeaveRequest, AttendanceAdjustmentRequest, LeavePermitRequest, PettyCashRequest, ApprovalHistoryEntry } from '../types';
import { useRequestContext } from './contexts/RequestContext';
import { useTranslation } from './contexts/LanguageContext';
import { PlusCircleIcon, DocumentTextIcon, BanknotesIcon, ClockIcon, BriefcaseIcon, ChevronDownIcon } from './icons/Icons';
import Card from './Card';
import PageHeader from './PageHeader';
import RequestLeaveModal from './RequestLeaveModal';
import AttendanceAdjustmentModal from './AttendanceAdjustmentModal';
import LeavePermitModal from './LeavePermitModal';
import PettyCashRequestModal from './PettyCashRequestModal';

const STATUS_BADGE: Record<RequestStatus, string> = {
    Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
};

const REQUEST_TYPE_ICONS: Record<HRRequest['type'], React.FC<React.SVGProps<SVGSVGElement>>> = {
    Leave: BriefcaseIcon,
    AttendanceAdjustment: ClockIcon,
    LeavePermit: ClockIcon,
    PettyCash: BanknotesIcon,
    DataUpdate: DocumentTextIcon,
};


interface MyRequestsPageProps {
    currentUser: EmployeeProfile;
}

const RequestRow: React.FC<{request: HRRequest; getRequestDetails: (req: HRRequest) => string; t: (key: string) => string;}> = ({request, getRequestDetails, t}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = REQUEST_TYPE_ICONS[request.type];
    const hasHistory = request.approvalHistory && request.approvalHistory.length > 0;

    return (
        <>
            <tr className="border-b dark:border-slate-700">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-3">
                         <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <span>{t(`myRequests.requestTypes.${request.type}`)}</span>
                    </div>
                </td>
                <td className="px-6 py-4">{new Date(request.submissionDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                <td className="px-6 py-4 max-w-sm truncate" title={getRequestDetails(request)}>{getRequestDetails(request)}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_BADGE[request.status]}`}>{t(`requestStatus.${request.status}`)}</span>
                </td>
                <td className="px-6 py-4">{request.status === 'Pending' ? 'المدير المباشر' : '-'}</td>
                 <td className="px-6 py-4">
                    {hasHistory && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </td>
            </tr>
            {isExpanded && hasHistory && (
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <td colSpan={6} className="p-4">
                        <h4 className="font-semibold mb-2">سجل الموافقات:</h4>
                        <ul className="space-y-2">
                            {request.approvalHistory.map((entry: ApprovalHistoryEntry) => (
                                <li key={entry.timestamp} className="flex items-start gap-3 text-sm">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${entry.status === 'Approved' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                    <div>
                                        <p>
                                            <span className="font-bold">{entry.approverName}</span>
                                            <span className={`mx-2 font-semibold ${entry.status === 'Approved' ? 'text-emerald-600' : 'text-red-600'}`}>{entry.status === 'Approved' ? 'وافق على' : 'رفض'}</span>
                                            الطلب
                                        </p>
                                        {entry.notes && <p className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 p-2 rounded-md mt-1">"{entry.notes}"</p>}
                                        <p className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString('ar-EG')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </td>
                </tr>
            )}
        </>
    );
};


const MyRequestsPage: React.FC<MyRequestsPageProps> = ({ currentUser }) => {
    const { t } = useTranslation();
    const { 
        leaveRequests, 
        attendanceAdjustmentRequests, 
        leavePermitRequests, 
        pettyCashRequests,
        handleNewLeaveRequest,
        handleNewAttendanceAdjustmentRequest,
        handleNewLeavePermitRequest,
        handleNewPettyCashRequest
    } = useRequestContext();

    const [filter, setFilter] = useState<RequestStatus | 'All'>('All');
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
    const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
    const [isPettyCashModalOpen, setIsPettyCashModalOpen] = useState(false);

    const allUserRequests = useMemo(() => {
        const requests: HRRequest[] = [
            ...leaveRequests.filter(r => r.employeeId === currentUser.id),
            ...attendanceAdjustmentRequests.filter(r => r.employeeId === currentUser.id),
            ...leavePermitRequests.filter(r => r.employeeId === currentUser.id),
            ...pettyCashRequests.filter(r => r.employeeId === currentUser.id),
        ];
        return requests.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [leaveRequests, attendanceAdjustmentRequests, leavePermitRequests, pettyCashRequests, currentUser.id]);

    const filteredRequests = useMemo(() => {
        if (filter === 'All') return allUserRequests;
        return allUserRequests.filter(r => r.status === filter);
    }, [allUserRequests, filter]);

    const getRequestDetails = (request: HRRequest): string => {
        switch(request.type) {
            case 'Leave': return t('myRequests.detailsFormat.leave', { startDate: new Date(request.startDate).toLocaleDateString('ar-EG'), endDate: new Date(request.endDate).toLocaleDateString('ar-EG'), duration: request.duration, reason: request.reason });
            case 'AttendanceAdjustment': return t('myRequests.detailsFormat.attendance', { type: request.adjustmentType === 'LateArrival' ? t('myRequests.detailsFormat.late') : t('myRequests.detailsFormat.early'), date: new Date(request.date).toLocaleDateString('ar-EG'), reason: request.reason });
            case 'LeavePermit': return t('myRequests.detailsFormat.permit', { date: new Date(request.date).toLocaleDateString('ar-EG'), startTime: request.startTime, endTime: request.endTime, reason: request.reason });
            case 'PettyCash': return t('myRequests.detailsFormat.pettyCash', { amount: request.amount, description: request.description });
            default: return '';
        }
    };
    
    const pageAction = (
        <div className="relative group">
            <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg">
                <PlusCircleIcon className="w-5 h-5" />
                <span>{t('myRequests.newRequest')}</span>
            </button>
             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <a href="#" onClick={() => setIsLeaveModalOpen(true)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t('myRequests.newLeave')}</a>
                <a href="#" onClick={() => setIsPermitModalOpen(true)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t('myRequests.newPermit')}</a>
                <a href="#" onClick={() => setIsExcuseModalOpen(true)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t('myRequests.newExcuse')}</a>
                <a href="#" onClick={() => setIsPettyCashModalOpen(true)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t('myRequests.newPettyCash')}</a>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader title={t('pageTitles.myRequests')} subtitle="تتبع جميع طلباتك وحالتها." actionButton={pageAction} />

            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(status => (
                    <button 
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md flex-1 transition-colors ${filter === status ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        {t(`myRequests.filter${status}`)}
                    </button>
                ))}
            </div>

            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">{t('myRequests.table.requestType')}</th>
                                <th className="px-6 py-3">{t('myRequests.table.submissionDate')}</th>
                                <th className="px-6 py-3">{t('myRequests.table.details')}</th>
                                <th className="px-6 py-3">{t('myRequests.table.status')}</th>
                                <th className="px-6 py-3">{t('myRequests.table.nextApprover')}</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => (
                                <RequestRow key={req.id} request={req} getRequestDetails={getRequestDetails} t={t} />
                            ))}
                        </tbody>
                    </table>
                    {filteredRequests.length === 0 && (
                        <div className="text-center p-12">
                            <p className="font-semibold text-slate-600 dark:text-slate-300">{t('myRequests.noRequests')}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('myRequests.tryDifferentFilter')}</p>
                        </div>
                    )}
                </div>
            </Card>

             <RequestLeaveModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                onSubmit={(data) => handleNewLeaveRequest({...data, employeeId: currentUser.id})}
            />
            <LeavePermitModal
                isOpen={isPermitModalOpen}
                onClose={() => setIsPermitModalOpen(false)}
                onSubmit={(data) => handleNewLeavePermitRequest({ ...data, employeeId: currentUser.id })}
                permitRequests={leavePermitRequests.filter(r => r.employeeId === currentUser.id)}
            />
            <AttendanceAdjustmentModal
                isOpen={isExcuseModalOpen}
                onClose={() => setIsExcuseModalOpen(false)}
                onSubmit={(data) => handleNewAttendanceAdjustmentRequest({ ...data, employeeId: currentUser.id })}
            />
            <PettyCashRequestModal
                isOpen={isPettyCashModalOpen}
                onClose={() => setIsPettyCashModalOpen(false)}
                onSubmit={(data) => handleNewPettyCashRequest({ ...data, employeeId: currentUser.id })}
            />
        </div>
    );
};

export default MyRequestsPage;