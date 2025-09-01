import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from './icons/Icons';
import type { LeaveRequest, LeaveType } from '../types';

interface RequestLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
// FIX: Corrected the onSubmit prop type to match what the form actually provides, excluding properties added by the parent handler.
    onSubmit: (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'type' | 'submissionDate'>) => void;
}

const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!startDate || !endDate) {
            alert("يرجى تحديد تاريخ البدء والانتهاء");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
        
        if (duration <= 0) {
            alert("تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء");
            return;
        }
        
        onSubmit({
            leaveType,
            startDate,
            endDate,
            reason,
            duration,
        } as Omit<LeaveRequest, 'id' | 'status' | 'type' | 'submissionDate'>);

        // Reset form and close modal
        setLeaveType('Annual');
        setStartDate('');
        setEndDate('');
        setReason('');
        setAttachment(null);
        onClose();
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">تقديم طلب إجازة</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="leaveType" className="block text-sm font-medium text-slate-700 mb-1">نوع الإجازة</label>
                        <select
                            id="leaveType"
                            value={leaveType}
                            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="Annual">سنوية</option>
                            <option value="Sick">مرضية</option>
                            <option value="Casual">عارضة</option>
                            <option value="Unpaid">بدون أجر</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">تاريخ البدء</label>
                            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">تاريخ الانتهاء</label>
                            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">السبب</label>
                        <textarea
                            id="reason"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="اذكر سبب طلب الإجازة..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">إرفاق ملف (اختياري)</label>
                        <label htmlFor="attachment" className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 hover:border-sky-500 hover:text-sky-600">
                           <ArrowUpTrayIcon className="w-8 h-8 mb-1"/>
                           <span className="text-sm">{attachment ? attachment.name : 'انقر للتحميل أو اسحب الملف هنا'}</span>
                           <input id="attachment" type="file" className="hidden" onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">إرسال الطلب</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestLeaveModal;