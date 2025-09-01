import React, { useState, useMemo } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { LeavePermitRequest, AttendancePolicy } from '../types';

interface LeavePermitModalProps {
    isOpen: boolean;
    onClose: () => void;
    // FIX: Corrected the onSubmit prop type to match what the form actually provides, excluding properties added by the parent handler.
    onSubmit: (newRequest: Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'durationHours'>) => void;
    attendancePolicy?: AttendancePolicy;
    permitRequests: LeavePermitRequest[];
}

const LeavePermitModal: React.FC<LeavePermitModalProps> = ({ isOpen, onClose, onSubmit, attendancePolicy, permitRequests }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [reason, setReason] = useState('');
    
    const usedPermitsThisMonth = useMemo(() => {
        if (!attendancePolicy) return 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return permitRequests.filter(p => {
            const permitDate = new Date(p.date);
            return p.status !== 'Rejected' && permitDate.getMonth() === currentMonth && permitDate.getFullYear() === currentYear;
        }).length;
    }, [permitRequests, attendancePolicy]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!date || !startTime || !endTime || !reason.trim()) {
            alert("يرجى تعبئة جميع الحقول المطلوبة.");
            return;
        }
        
        if (startTime >= endTime) {
            alert("وقت الانتهاء يجب أن يكون بعد وقت البدء.");
            return;
        }

        onSubmit({
            date,
            startTime,
            endTime,
            reason,
        } as Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'durationHours'>);

        // Reset form and close modal
        setDate(new Date().toISOString().split('T')[0]);
        setStartTime('');
        setEndTime('');
        setReason('');
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
                    <h2 className="text-2xl font-bold text-slate-800">طلب إذن انصراف (مسبق)</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                {attendancePolicy && (
                    <div className="mb-4 p-3 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg text-sm text-center">
                        لقد استخدمت <span className="font-bold">{usedPermitsThisMonth}</span> من <span className="font-bold">{attendancePolicy.maxPermitsPerMonth}</span> أذونات هذا الشهر.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="permit_date" className="block text-sm font-medium text-slate-700 mb-1">تاريخ الإذن</label>
                        <input type="date" id="permit_date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="permit_startTime" className="block text-sm font-medium text-slate-700 mb-1">من الساعة</label>
                            <input type="time" id="permit_startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                        </div>
                        <div>
                            <label htmlFor="permit_endTime" className="block text-sm font-medium text-slate-700 mb-1">إلى الساعة</label>
                            <input type="time" id="permit_endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="permit_reason" className="block text-sm font-medium text-slate-700 mb-1">السبب</label>
                        <textarea
                            id="permit_reason"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="اذكر سبب طلب الإذن..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm hover:shadow-md">إرسال الطلب</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeavePermitModal;