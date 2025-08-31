
import React from 'react';
import { XMarkIcon, CalendarIcon, BriefcaseIcon } from './icons/Icons';
import type { AttentionItem, RequestStatus, LeaveRequest } from '../types';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: AttentionItem | null;
    onAction: (requestId: number, newStatus: RequestStatus) => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, item, onAction }) => {
    if (!isOpen || !item || !item.context) return null;

    const { employee, overlappingLeaves } = item.context;
    const request = item.request as LeaveRequest;

    const annualLeaveBalance = employee.leaveBalances.find(b => b.type === 'Annual');

    const handleAction = (status: RequestStatus) => {
        onAction(item.request.id, status);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">مراجعة طلب إجازة</h2>
                        <p className="text-sm text-slate-500">للموظف: {employee.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Request Details */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-700">تفاصيل الطلب</h3>
                        <div className="p-4 bg-slate-50 rounded-lg">
                             <p><strong>النوع:</strong> {item.text}</p>
                             <p><strong>الفترة:</strong> من {new Date(request.startDate).toLocaleDateString('ar-EG-u-nu-latn')} إلى {new Date(request.endDate).toLocaleDateString('ar-EG-u-nu-latn')} ({request.duration} أيام)</p>
                             <p><strong>السبب:</strong> {request.reason}</p>
                        </div>
                        {annualLeaveBalance && (
                            <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg">
                                <h4 className="font-semibold text-sky-800 mb-1">رصيد الإجازات السنوية للموظف</h4>
                                <p className="text-sky-700">
                                    الرصيد المتبقي: <strong className="text-lg">{annualLeaveBalance.balance - annualLeaveBalance.used}</strong> يوم
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Right Column: Overlapping Leaves */}
                    <div className="space-y-4">
                         <h3 className="font-bold text-slate-700 flex items-center gap-2"><CalendarIcon className="w-5 h-5"/> تداخل الإجازات مع الفريق</h3>
                         <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg max-h-60 overflow-y-auto">
                            {overlappingLeaves.length > 0 ? (
                                <ul className="space-y-3">
                                    {overlappingLeaves.map((leave, index) => (
                                        <li key={index} className="flex items-center gap-3 text-sm">
                                            <img src={leave.avatarUrl} alt={leave.employeeName} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-semibold text-slate-800">{leave.employeeName}</p>
                                                <p className="text-xs text-slate-500">
                                                    {leave.startDate} - {leave.endDate}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-600 text-center py-4">لا يوجد تداخل في الإجازات مع أعضاء الفريق الآخرين خلال هذه الفترة.</p>
                            )}
                         </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-4 border-t">
                    <button onClick={() => handleAction('Rejected')} className="py-2 px-6 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200">رفض</button>
                    <button onClick={() => handleAction('Approved')} className="py-2 px-6 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-sm">موافقة</button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;