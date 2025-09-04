
import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons';

interface RegisterExternalCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (courseData: { title: string; provider: string; url: string; }) => void;
}

const RegisterExternalCourseModal: React.FC<RegisterExternalCourseModalProps> = ({ isOpen, onClose, onRegister }) => {
    const [title, setTitle] = useState('');
    const [provider, setProvider] = useState('');
    const [url, setUrl] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !provider) {
            alert("يرجى إدخال عنوان الدورة والمقدم.");
            return;
        }
        onRegister({ title, provider, url });
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
                    <h2 className="text-2xl font-bold text-slate-800">تسجيل دورة تدريبية خارجية</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="courseTitle" className="block text-sm font-medium text-slate-700 mb-1">عنوان الدورة</label>
                        <input
                            id="courseTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="مثال: Python for Everybody"
                            required
                            spellCheck="true"
                        />
                    </div>
                     <div>
                        <label htmlFor="courseProvider" className="block text-sm font-medium text-slate-700 mb-1">المقدم</label>
                        <input
                            id="courseProvider"
                            type="text"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="مثال: Coursera, Udemy"
                            required
                            spellCheck="true"
                        />
                    </div>
                     <div>
                        <label htmlFor="courseUrl" className="block text-sm font-medium text-slate-700 mb-1">رابط الدورة (اختياري)</label>
                        <input
                            id="courseUrl"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="https://..."
                            spellCheck="false"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">إرسال لطلب الموافقة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterExternalCourseModal;