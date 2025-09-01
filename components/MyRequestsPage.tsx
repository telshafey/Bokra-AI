import React, { useState, useMemo } from 'react';
import type { HRRequest, RequestStatus, RequestType } from '../types';
import { BriefcaseIcon, DocumentTextIcon, IdentificationIcon, ClockIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';
import Card from './Card';
import ActionBar from './ActionBar';

type FilterStatus = 'All' | RequestStatus;
type SortableKeys = 'type' | 'submissionDate' | 'status';

const STATUS_BADGE: Record<RequestStatus, string> = {
    Approved: 'bg-emerald-100 text-emerald-800',
    Pending: 'bg-amber-100 text-amber-800',
    Rejected: 'bg-red-100 text-red-800',
};

const STATUS_TRANSLATION: Record<RequestStatus, string> = {
    Approved: 'موافق عليه',
    Pending: 'قيد الانتظار',
    Rejected: 'مرفوض',
};

const REQUEST_TYPE_INFO: Record<RequestType, { translation: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }> = {
    Leave: { translation: 'طلب إجازة', icon: BriefcaseIcon, color: 'text-sky-500' },
    Certificate: { translation: 'طلب شهادة', icon: DocumentTextIcon, color: 'text-emerald-500' },
    DataUpdate: { translation: 'تحديث بيانات', icon: IdentificationIcon, color: 'text-amber-500' },
    AttendanceAdjustment: { translation: 'طلب تعديل حضور', icon: ClockIcon, color: 'text-purple-500' },
    LeavePermit: { translation: 'طلب إذن انصراف', icon: ClockIcon, color: 'text-indigo-500' },
};

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; count: number }> = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
            isActive 
                ? 'bg-sky-600 text-white shadow' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
        }`}
    >
        {label}
        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-sky-700' : 'bg-slate-200 text-slate-600'}`}>
            {count}
        </span>
    </button>
);

const RequestDetails: React.FC<{ request: HRRequest }> = ({ request }) => {
    switch (request.type) {
        case 'Leave':
            return <span>من {request.startDate} إلى {request.endDate} ({request.duration} أيام) - {request.reason}</span>;
        case 'AttendanceAdjustment':
            return <span>{request.adjustmentType === 'LateArrival' ? 'عذر تأخير' : 'انصراف مبكر'} بتاريخ {request.date} - {request.reason}</span>;
        case 'LeavePermit':
            return <span>بتاريخ {request.date} من {request.startTime} إلى {request.endTime} - {request.reason}</span>;
        case 'Certificate':
        case 'DataUpdate':
            return <span>{request.details}</span>;
        default:
            return <span>-</span>
    }
}

interface MyRequestsPageProps {
    requests: HRRequest[];
}

const MyRequestsPage: React.FC<MyRequestsPageProps> = ({ requests }) => {
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: 'asc' | 'desc' } | null>({ key: 'submissionDate', direction: 'desc' });

    const sortedAndFilteredRequests = useMemo(() => {
        let filtered = requests;
        if (activeFilter !== 'All') {
            filtered = requests.filter(req => req.status === activeFilter);
        }
        
        if (sortConfig !== null) {
            // FIX: Create a shallow copy to avoid mutating state, and explicitly type sort values to handle numbers from date conversion.
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

    return (
        <div className="space-y-6">
            <ActionBar>
                <div>
                    <p className="text-sm text-slate-500">عرض وتتبع جميع طلباتك المقدمة لقسم الموارد البشرية.</p>
                </div>
                 <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-full">
                    <FilterButton label="الكل" isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')} count={requestCounts.All} />
                    <FilterButton label="قيد الانتظار" isActive={activeFilter === 'Pending'} onClick={() => setActiveFilter('Pending')} count={requestCounts.Pending} />
                    <FilterButton label="موافق عليه" isActive={activeFilter === 'Approved'} onClick={() => setActiveFilter('Approved')} count={requestCounts.Approved} />
                    <FilterButton label="مرفوض" isActive={activeFilter === 'Rejected'} onClick={() => setActiveFilter('Rejected')} count={requestCounts.Rejected} />
                </div>
            </ActionBar>

            {/* Requests Table */}
            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('type')} className="flex items-center gap-1">نوع الطلب {getSortIcon('type')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('submissionDate')} className="flex items-center gap-1">تاريخ التقديم {getSortIcon('submissionDate')}</button></th>
                                <th scope="col" className="px-6 py-3">التفاصيل</th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('status')} className="flex items-center gap-1">الحالة {getSortIcon('status')}</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredRequests.map((request) => {
                                const typeInfo = REQUEST_TYPE_INFO[request.type];
                                const Icon = typeInfo.icon;
                                return (
                                    <tr key={request.id} className="border-b hover:bg-slate-50 odd:bg-white even:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-6 h-6 ${typeInfo.color}`} />
                                                <span>{typeInfo.translation}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(request.submissionDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <RequestDetails request={request} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[request.status]}`}>
                                                {STATUS_TRANSLATION[request.status]}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {sortedAndFilteredRequests.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p className="font-semibold text-lg">لا توجد طلبات تطابق هذا الفلتر.</p>
                            <p className="text-sm">حاول تحديد فلتر مختلف لعرض طلباتك.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default MyRequestsPage;