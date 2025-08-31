import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { AttendanceAdjustmentRequest, AttendanceAdjustmentType } from '../types';

interface AttendanceAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
// FIX: Corrected the onSubmit prop type to match what the form actually provides.
    onSubmit: (newRequest: Omit<AttendanceAdjustmentRequest, 'id' | 'status' | 'employeeId' | 'type' | 'submissionDate'>) => void;
}

const AttendanceAdjustmentModal: React.FC<AttendanceAdjustmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [adjustmentType, setAdjustmentType] = useState<AttendanceAdjustmentType>('LateArrival');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!date || !time || !reason.trim()) {
            alert("يرجى تعبئة جميع الحقول المطلوبة.");
            return;
        }
        
        onSubmit({
            adjustmentType,
            date,
            time,
            reason,
        });

        // Reset form and close modal
        setAdjustmentType('LateArrival');
        setDate(new Date().toISOString().split('T')[0]);
        setTime('');
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
                    <h2 className="text-2xl font-bold text-slate-800">تقديم عذر حضور</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">نوع الطلب</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="adjustmentType" 
                                    value="LateArrival"
                                    checked={adjustmentType === 'LateArrival'}
                                    onChange={() => setAdjustmentType('LateArrival')}
                                    className="form-radio h-4 w-4 text-sky-600"
                                />
                                <span className="text-sm font-medium text-slate-800">عذر تأخير صباحي</span>
                            </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="adjustmentType" 
                                    value="EarlyDeparture"
                                    checked={adjustmentType === 'EarlyDeparture'}
                                    onChange={() => setAdjustmentType('EarlyDeparture')}
                                    className="form-radio h-4 w-4 text-sky-600"
                                />
                                <span className="text-sm font-medium text-slate-800">إذن انصراف مبكر</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">تاريخ الواقعة</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-1">
                                {adjustmentType === 'LateArrival' ? 'وقت الحضور الفعلي' : 'وقت الانصراف الفعلي'}
                            </label>
                            <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
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
                            placeholder="اذكر سبب التأخير أو الانصراف المبكر..."
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

export default AttendanceAdjustmentModal;
