import React from 'react';
import type { HRRequest, PendingRequest, RequestStatus } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons/Icons';

interface PendingRequestsProps {
    requests: PendingRequest[];
    onAction: (requestId: number, newStatus: RequestStatus) => void;
}

// FIX: Added a helper function to derive a display string from the union type.
const getRequestDetailsText = (request: HRRequest): string => {
    switch (request.type) {
        case 'Leave':
            return `إجازة ${request.leaveType}: ${request.reason}`;
        case 'AttendanceAdjustment':
            return `${request.adjustmentType === 'LateArrival' ? 'عذر تأخير' : 'انصراف مبكر'}: ${request.reason}`;
        case 'LeavePermit':
            return `إذن انصراف: ${request.reason}`;
        // FIX: Removed non-existent 'Certificate' case to align with HRRequest type.
        case 'DataUpdate':
            return request.details;
        default:
            return 'تفاصيل غير متاحة';
    }
}


const PendingRequests: React.FC<PendingRequestsProps> = ({ requests, onAction }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-slate-700">طلبات تحتاج لموافقتك</h2>
            <div className="space-y-4">
                {requests.length > 0 ? requests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-4">
                            <img src={request.employeeAvatarUrl} alt={request.employeeName} className="w-12 h-12 rounded-full object-cover"/>
                            <div>
                                <p className="font-semibold text-slate-800">{request.employeeName}</p>
                                <p className="text-sm text-slate-500">{getRequestDetailsText(request)}</p>
                                <p className="text-xs text-slate-400">
                                    {new Date(request.submissionDate).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => onAction(request.id, 'Rejected')}
                                className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600"
                                title="رفض"
                            >
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => onAction(request.id, 'Approved')}
                                className="p-2 rounded-full text-slate-400 hover:bg-emerald-100 hover:text-emerald-600"
                                title="موافقة"
                            >
                                <CheckCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 text-slate-500">
                        <p className="font-semibold text-lg">لا توجد طلبات معلقة.</p>
                        <p className="text-sm">لقد قمت بمراجعة جميع الطلبات.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingRequests;