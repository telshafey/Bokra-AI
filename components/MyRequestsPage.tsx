// FIX: Implemented the MyRequestsPage component.
import React, { useState, useMemo } from 'react';
import type { HRRequest, RequestStatus } from '../types';
import { PlusCircleIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

const STATUS_BADGE: Record<RequestStatus, string> = {
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
};

const MyRequestsPage: React.FC<{ allRequests: HRRequest[], currentUserId: string }> = ({ allRequests, currentUserId }) => {
    const { t, language } = useTranslation();
    const [filter, setFilter] = useState<RequestStatus | 'All'>('All');
    
    const myRequests = useMemo(() => {
        let requests = allRequests.filter(r => r.employeeId === currentUserId);
        if (filter !== 'All') {
            requests = requests.filter(r => r.status === filter);
        }
        return requests;
    }, [allRequests, currentUserId, filter]);

    const getRequestDetails = (request: HRRequest) => {
        switch (request.type) {
            case 'Leave':
                return t('myRequests.detailsFormat.leave', { startDate: request.startDate, endDate: request.endDate, duration: request.duration, reason: request.reason });
            case 'AttendanceAdjustment':
                const type = request.adjustmentType === 'LateArrival' ? t('myRequests.detailsFormat.late') : t('myRequests.detailsFormat.early');
                return t('myRequests.detailsFormat.attendance', { type, date: request.date, reason: request.reason });
            case 'LeavePermit':
                 return t('myRequests.detailsFormat.permit', { date: request.date, startTime: request.startTime, endTime: request.endTime, reason: request.reason });
            case 'PettyCash':
                 return t('myRequests.detailsFormat.pettyCash', { amount: request.amount, description: request.description });
            default:
                return 'No details';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('pageTitles.myRequests')}</h1>
                {/* Button to open a new request modal would go here */}
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-2 mb-4 border-b pb-4 dark:border-slate-700">
                    <button onClick={() => setFilter('All')} className={`px-3 py-1 rounded-full text-sm font-semibold ${filter === 'All' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>{t('myRequests.filterAll')}</button>
                    <button onClick={() => setFilter('Pending')} className={`px-3 py-1 rounded-full text-sm font-semibold ${filter === 'Pending' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>{t('myRequests.filterPending')}</button>
                    <button onClick={() => setFilter('Approved')} className={`px-3 py-1 rounded-full text-sm font-semibold ${filter === 'Approved' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>{t('myRequests.filterApproved')}</button>
                    <button onClick={() => setFilter('Rejected')} className={`px-3 py-1 rounded-full text-sm font-semibold ${filter === 'Rejected' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>{t('myRequests.filterRejected')}</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="py-2">{t('myRequests.table.requestType')}</th>
                                <th className="py-2">{t('myRequests.table.submissionDate')}</th>
                                <th className="py-2">{t('myRequests.table.details')}</th>
                                <th className="py-2">{t('myRequests.table.status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myRequests.map(req => (
                                <tr key={req.id} className="border-b dark:border-slate-700">
                                    <td className="py-3 font-semibold">{t(`myRequests.requestTypes.${req.type}`)}</td>
                                    <td className="py-3">{new Date(req.submissionDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</td>
                                    <td className="py-3 max-w-sm truncate" title={getRequestDetails(req)}>{getRequestDetails(req)}</td>
                                    <td className="py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_BADGE[req.status]}`}>{t(`requestStatus.${req.status}`)}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {myRequests.length === 0 && (
                        <div className="text-center py-16">
                            <p className="font-semibold text-slate-600 dark:text-slate-300">{t('myRequests.noRequests')}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('myRequests.tryDifferentFilter')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRequestsPage;
