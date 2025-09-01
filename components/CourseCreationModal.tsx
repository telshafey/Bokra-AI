
import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { Course, CourseCategory, ExternalCourseVenue } from '../types';

interface CourseCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newCourse: Course) => void;
}

const CourseCreationModal: React.FC<CourseCreationModalProps> = ({ isOpen, onClose, onSave }) => {
    
    // Common fields
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<CourseCategory>('Technical');
    const [duration, setDuration] = useState(8);
    const [description, setDescription] = useState('');

    // External course fields
    const [provider, setProvider] = useState('');
    const [url, setUrl] = useState('');
    const [venue, setVenue] = useState<ExternalCourseVenue>('Online');
    const [locationDetails, setLocationDetails] = useState('');
    
    const resetState = () => {
        setTitle('');
        setCategory('Technical');
        setDuration(8);
        setDescription('');
        setProvider('');
        setUrl('');
        setVenue('Online');
        setLocationDetails('');
    };

    const handleClose = () => {
        resetState();
        onClose();
    };
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        const newCourse: Course = {
            id: `c-ext-${Date.now()}`,
            title,
            category,
            durationHours: duration,
            description,
            isMandatory: false,
            type: 'External',
            provider,
            url,
            venue,
            locationDetails,
        };

        onSave(newCourse);
        handleClose();
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 pt-16" onClick={handleClose}>
            <form onSubmit={handleSave} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">إضافة دورة خارجية</h2>
                    <button type="button" onClick={handleClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان الدورة" className="w-full p-2 border border-slate-300 rounded-lg md:col-span-2" required />
                        <input type="text" value={provider} onChange={e => setProvider(e.target.value)} placeholder="مقدم الدورة (Coursera, Udemy, etc.)" className="w-full p-2 border border-slate-300 rounded-lg" />
                        <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} placeholder="المدة (ساعات)" className="w-full p-2 border border-slate-300 rounded-lg"/>
                        <select value={venue} onChange={e => setVenue(e.target.value as ExternalCourseVenue)} className="w-full p-2 border rounded-lg bg-white">
                            <option value="Online">عبر الإنترنت</option>
                            <option value="Training Center">مركز تدريب</option>
                            <option value="On-site">في موقع العميل</option>
                        </select>
                         <input type="text" value={locationDetails} onChange={e => setLocationDetails(e.target.value)} placeholder="تفاصيل المكان (رابط، اسم المعهد، ...)" className="w-full p-2 border border-slate-300 rounded-lg"/>
                        <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="رابط الدورة" className="w-full p-2 border border-slate-300 rounded-lg md:col-span-2" />
                    </div>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف موجز للدورة" rows={4} className="w-full p-2 border border-slate-300 rounded-lg" />
                </div>
                <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                    <button type="button" onClick={handleClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                    <button type="submit" className="py-2 px-6 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-sm">
                        حفظ الدورة
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseCreationModal;
