
import React, { useState } from 'react';
import type { HRRequest, PendingRequest, RequestStatus } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons/Icons';
import ApprovalModal from './ApprovalModal';

interface PendingRequestsProps {
    requests: PendingRequest[];
    onAction: (requestId: string, newStatus: 'Approved' | 'Rejected', notes: string) => void;
}

const getRequestDetailsText = (request: HRRequest): string => {
    switch (request.type) {
        case 'Leave':
            return `إجازة ${request.leaveType}: ${request.reason}`;
        case 'AttendanceAdjustment':
            return `${request.adjustmentType === 'LateArrival' ? 'عذر تأخير' : 'انصراف مبكر'}: ${request.reason}`;
        case 'LeavePermit':
            return `إذن انصراف: ${request.reason}`;
        case 'DataUpdate':
            return request.details;
        case 'PettyCash':
             return `مصروفات نثرية: ${request.description}`;
        default:
            return 'تفاصيل غير متاحة';
    }
}

const PendingRequests: React.FC<PendingRequestsProps> = ({ requests, onAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<HRRequest | null>(null);

    const handleOpenModal = (request: HRRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedRequest(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">طلبات تحتاج لموافقتك</h2>
                <div className="space-y-4">
                    {requests.length > 0 ? requests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <img src={request.employeeAvatarUrl} alt={request.employeeName} className="w-12 h-12 rounded-full object-cover"/>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{request.employeeName}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{getRequestDetailsText(request)}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        {new Date(request.submissionDate).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleOpenModal(request)}
                                    className="font-semibold text-sm bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 py-1.5 px-4 rounded-lg"
                                    title="اتخاذ إجراء"
                                >
                                    مراجعة
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <p className="font-semibold text-lg">لا توجد طلبات معلقة.</p>
                            <p className="text-sm">لقد قمت بمراجعة جميع الطلبات.</p>
                        </div>
                    )}
                </div>
            </div>
             <ApprovalModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                request={selectedRequest}
                onAction={onAction}
            />
        </>
    );
};

export default PendingRequests;