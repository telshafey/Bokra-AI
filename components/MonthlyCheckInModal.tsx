
import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons';
import { MonthlyCheckIn, MonthlyCheckInRating } from '../types';

interface MonthlyCheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { month: number, year: number, rating: MonthlyCheckInRating, notes: string }) => void;
    employeeName: string;
}

const MonthlyCheckInModal: React.FC<MonthlyCheckInModalProps> = ({ isOpen, onClose, onSave, employeeName }) => {
    const [rating, setRating] = useState<MonthlyCheckInRating>('Meets Expectations');
    const [notes, setNotes] = useState('');
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!notes.trim()) {
            alert('يرجى كتابة ملاحظات التقييم.');
            return;
        }
        const now = new Date();
        onSave({
            month: now.getMonth(),
            year: now.getFullYear(),
            rating,
            notes
        });
        // Reset form
        setRating('Meets Expectations');
        setNotes('');
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
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">إضافة متابعة شهرية</h2>
                        <p className="text-sm text-slate-500">للموظف: {employeeName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-slate-700 mb-1">التقييم العام للشهر</label>
                        <select
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value as MonthlyCheckInRating)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="Exceeds Expectations">يفوق التوقعات</option>
                            <option value="Meets Expectations">يلبي التوقعات</option>
                            <option value="Needs Improvement">يحتاج إلى تحسين</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">ملاحظات المدير</label>
                        <textarea
                            id="notes"
                            rows={5}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="اكتب ملاحظاتك حول أداء الموظف خلال هذا الشهر..."
                            required
                            spellCheck="true"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm hover:shadow-md">حفظ المتابعة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MonthlyCheckInModal;