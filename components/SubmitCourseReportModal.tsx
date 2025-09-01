
import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from './icons/Icons';
import type { Course, EmployeeCourse, CourseStatus } from '../types';

interface SubmitCourseReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course & EmployeeCourse;
    onSubmit: (courseId: string, updateData: { status: CourseStatus; notes: string; certificate?: File | null; result?: string; performanceRating?: number; }) => void;
}

const SubmitCourseReportModal: React.FC<SubmitCourseReportModalProps> = ({ isOpen, onClose, course, onSubmit }) => {
    const [status, setStatus] = useState<CourseStatus>(course.status);
    const [notes, setNotes] = useState('');
    const [certificate, setCertificate] = useState<File | null>(null);
    const [result, setResult] = useState('');
    const [performanceRating, setPerformanceRating] = useState<number>(5);


    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!notes) {
            alert("يرجى كتابة ملاحظات حول تقدمك.");
            return;
        }
        onSubmit(course.id, { status, notes, certificate, result, performanceRating });
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">تحديث التقدم</h2>
                        <p className="text-sm text-slate-500">{course.title}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="courseStatus" className="block text-sm font-medium text-slate-700 mb-1">الحالة الحالية</label>
                        <select
                            id="courseStatus"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as CourseStatus)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="In Progress">قيد التنفيذ</option>
                            <option value="Completed">مكتملة</option>
                        </select>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="result" className="block text-sm font-medium text-slate-700 mb-1">النتيجة</label>
                           <input type="text" id="result" value={result} onChange={e => setResult(e.target.value)} placeholder="مثال: ناجح، 95/100" className="w-full p-2 border rounded-lg"/>
                        </div>
                        <div>
                           <label htmlFor="performanceRating" className="block text-sm font-medium text-slate-700 mb-1">تقييم الأداء (1-5)</label>
                           <input type="number" id="performanceRating" min="1" max="5" value={performanceRating} onChange={e => setPerformanceRating(Number(e.target.value))} className="w-full p-2 border rounded-lg"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">ملاحظات للمدير</label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="مثال: أكملت الوحدة الثانية، وأرفقت شهادة الحضور..."
                            required
                        ></textarea>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">إرفاق شهادة أو إثبات (اختياري)</label>
                        <label htmlFor="certificate" className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 hover:border-sky-500 hover:text-sky-600">
                           <ArrowUpTrayIcon className="w-8 h-8 mb-1"/>
                           <span className="text-sm">{certificate ? certificate.name : 'انقر للتحميل أو اسحب الملف هنا'}</span>
                           <input id="certificate" type="file" className="hidden" onChange={(e) => setCertificate(e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">إرسال للمراجعة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitCourseReportModal;
