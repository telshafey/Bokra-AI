

import React, { useState, useMemo } from 'react';
import type { HRRequest, RequestStatus, RequestType, EmployeeProfile, LeavePermitRequest, PettyCashRequest } from '../types';
import { BriefcaseIcon, DocumentTextIcon, IdentificationIcon, ClockIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon, PlusCircleIcon, BanknotesIcon } from './icons/Icons';
import Card from './Card';
import ActionBar from './ActionBar';
import RequestLeaveModal from './RequestLeaveModal';
import AttendanceAdjustmentModal from './AttendanceAdjustmentModal';
import LeavePermitModal from './LeavePermitModal';
import PettyCashRequestModal from './PettyCashRequestModal';
import { useRequestContext } from './contexts/RequestContext';
import { usePoliciesContext } from './contexts/PoliciesContext';
import { useTranslation } from './contexts/LanguageContext';


type FilterStatus = 'All' | RequestStatus;
type SortableKeys = 'type' | 'submissionDate' | 'status';

const STATUS_BADGE: Record<RequestStatus, string> = {
    Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
};

const REQUEST_TYPE_ICONS: Record<RequestType, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }> = {
    Leave: { icon: BriefcaseIcon, color: 'text-sky-500 dark:text-sky-400' },
    DataUpdate: { icon: IdentificationIcon, color: 'text-amber-500 dark:text-amber-400' },
    AttendanceAdjustment: { icon: ClockIcon, color: 'text-purple-500 dark:text-purple-400' },
    LeavePermit: { icon: ClockIcon, color: 'text-indigo-500 dark:text-indigo-400' },
    PettyCash: { icon: BanknotesIcon, color: 'text-emerald-500 dark:text-emerald-400' },
};

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; count: number }> = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
            isActive 
                ? 'bg-sky-600 text-white shadow' 
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
        }`}
    >
        {label}
        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-sky-700' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200'}`}>
            {count}
        </span>
    </button>
);

const formatCurrency = (amount: number, lang: 'ar' | 'en') => {
    const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
    }).format(amount);
};


const RequestDetails: React.FC<{ request: HRRequest; t: (key: string, replacements?: { [key: string]: any }) => string; lang: 'ar' | 'en' }> = ({ request, t, lang }) => {
    const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
    const formatDate = (date: string) => new Date(date).toLocaleDateString(locale);

    switch (request.type) {
        case 'Leave':
            return <span>{t('myRequests.detailsFormat.leave', { startDate: formatDate(request.startDate), endDate: formatDate(request.endDate), duration: request.duration, reason: request.reason })}</span>;
        case 'AttendanceAdjustment':
            const adjType = t(`myRequests.detailsFormat.${request.adjustmentType === 'LateArrival' ? 'late' : 'early'}`);
            return <span>{t('myRequests.detailsFormat.attendance', { type: adjType, date: formatDate(request.date), reason: request.reason })}</span>;
        case 'LeavePermit':
            return <span>{t('myRequests.detailsFormat.permit', { date: formatDate(request.date), startTime: request.startTime, endTime: request.endTime, reason: request.reason })}</span>;
        case 'DataUpdate':
            return <span>{request.details}</span>;
        case 'PettyCash':
            return <span>{t('myRequests.detailsFormat.pettyCash', { amount: formatCurrency(request.amount, lang), description: request.description })}</span>;
        default:
            return <span>-</span>
    }
}

interface MyRequestsPageProps {
    requests: HRRequest[];
    currentUser: EmployeeProfile;
}

const MyRequestsPage: React.FC<MyRequestsPageProps> = ({ requests, currentUser }) => {
    const { t, language } = useTranslation();
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: 'asc' | 'desc' } | null>({ key: 'submissionDate', direction: 'desc' });
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
    const [isPettyCashModalOpen, setIsPettyCashModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const { handleNewLeaveRequest, handleNewAttendanceAdjustmentRequest, handleNewLeavePermitRequest, handleNewPettyCashRequest } = useRequestContext();
    const { attendancePolicies } = usePoliciesContext();
    const userAttendancePolicy = attendancePolicies.find(p => p.id === currentUser.attendancePolicyId);

    const sortedAndFilteredRequests = useMemo(() => {
        let filtered = requests;
        if (activeFilter !== 'All') {
            filtered = requests.filter(req => req.status === activeFilter);
        }
        
        if (sortConfig !== null) {
            return [...filtered].sort((a, b) => {
                let aValue: string | number = a[sortConfig.key];
                let bValue: string | number = b[sortConfig.key];

                if(sortConfig.key === 'submissionDate') {
                    aValue = new Date(aValue as string).getTime();
                    bValue = new Date(bValue as string).getTime();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [activeFilter, requests, sortConfig]);
    
    const requestCounts = useMemo(() => ({
        All: requests.length,
        Pending: requests.filter(r => r.status === 'Pending').length,
        Approved: requests.filter(r => r.status === 'Approved').length,
        Rejected: requests.filter(r => r.status === 'Rejected').length,
    }), [requests]);

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

    const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(true);
        setIsDropdownOpen(false);
    };

    return (
        <div className="space-y-6">
            <ActionBar>
                 <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                        <PlusCircleIcon className="w-6 h-6"/>
                        <span>{t('myRequests.newRequest')}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg z-20">
                            <a href="#" onClick={(e) => { e.preventDefault(); openModal(setIsLeaveModalOpen); }} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t('myRequests.newLeave')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); openModal(setIsPermitModalOpen); }} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t('myRequests.newPermit')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); openModal(setIsAdjustmentModalOpen); }} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t('myRequests.newExcuse')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); openModal(setIsPettyCashModalOpen); }} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">{t('myRequests.newPettyCash')}</a>
                        </div>
                    )}
                </div>
                 <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-full">
                    <FilterButton label={t('myRequests.filterAll')} isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')} count={requestCounts.All} />
                    <FilterButton label={t('myRequests.filterPending')} isActive={activeFilter === 'Pending'} onClick={() => setActiveFilter('Pending')} count={requestCounts.Pending} />
                    <FilterButton label={t('myRequests.filterApproved')} isActive={activeFilter === 'Approved'} onClick={() => setActiveFilter('Approved')} count={requestCounts.Approved} />
                    <FilterButton label={t('myRequests.filterRejected')} isActive={activeFilter === 'Rejected'} onClick={() => setActiveFilter('Rejected')} count={requestCounts.Rejected} />
                </div>
            </ActionBar>

            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('type')} className="flex items-center gap-1">{t('myRequests.table.requestType')} {getSortIcon('type')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('submissionDate')} className="flex items-center gap-1">{t('myRequests.table.submissionDate')} {getSortIcon('submissionDate')}</button></th>
                                <th scope="col" className="px-6 py-3">{t('myRequests.table.details')}</th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('status')} className="flex items-center gap-1">{t('myRequests.table.status')} {getSortIcon('status')}</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredRequests.map((request) => {
                                const typeInfo = REQUEST_TYPE_ICONS[request.type];
                                const Icon = typeInfo.icon;
                                return (
                                    <tr key={request.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 odd:bg-white dark:odd:bg-slate-800 even:bg-slate-50 dark:even:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-6 h-6 ${typeInfo.color}`} />
                                                <span>{t(`myRequests.requestTypes.${request.type}`)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(request.submissionDate).toLocaleDateString(language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <RequestDetails request={request} t={t} lang={language} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[request.status]}`}>
                                                {t(`requestStatus.${request.status}`)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {sortedAndFilteredRequests.length === 0 && (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            <p className="font-semibold text-lg">{t('myRequests.noRequests')}</p>
                            <p className="text-sm">{t('myRequests.tryDifferentFilter')}</p>
                        </div>
                    )}
                </div>
            </Card>

             <RequestLeaveModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                onSubmit={(data) => handleNewLeaveRequest({...data, employeeId: currentUser.id})}
            />
            <AttendanceAdjustmentModal
                isOpen={isAdjustmentModalOpen}
                onClose={() => setIsAdjustmentModalOpen(false)}
                onSubmit={(data) => handleNewAttendanceAdjustmentRequest({...data, employeeId: currentUser.id})}
            />
            <LeavePermitModal
                isOpen={isPermitModalOpen}
                onClose={() => setIsPermitModalOpen(false)}
                onSubmit={(data) => handleNewLeavePermitRequest({...data, employeeId: currentUser.id})}
                attendancePolicy={userAttendancePolicy}
                permitRequests={requests.filter(r => r.type === 'LeavePermit') as LeavePermitRequest[]}
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