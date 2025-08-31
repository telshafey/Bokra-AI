import React, { useState } from 'react';
import { XMarkIcon, SparklesIcon, DocumentTextIcon } from './icons/Icons';
import { generateCourseOutlineWithAI } from '../services/learningService';
import type { Course, CourseCategory, CourseOutline, CourseType } from '../types';

interface CourseCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newCourse: Course) => void;
}

const CourseCreationModal: React.FC<CourseCreationModalProps> = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [courseType, setCourseType] = useState<CourseType>('Internal');
    
    // Common fields
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<CourseCategory>('Technical');
    const [duration, setDuration] = useState(8);
    const [description, setDescription] = useState('');

    // External course fields
    const [provider, setProvider] = useState('');
    const [url, setUrl] = useState('');

    // AI generation state
    const [generatedOutline, setGeneratedOutline] = useState<CourseOutline | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const resetState = () => {
        setStep(1);
        setCourseType('Internal');
        setTitle('');
        setCategory('Technical');
        setDuration(8);
        setDescription('');
        setProvider('');
        setUrl('');
        setGeneratedOutline(null);
        setIsLoading(false);
        setError(null);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };
    
    const handleGenerateOutline = async () => {
        if (!title.trim()) {
            setError('الرجاء إدخال عنوان للدورة أولاً.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const outline = await generateCourseOutlineWithAI(title);
            setGeneratedOutline(outline);
            setDescription(outline.description); // Pre-fill description
        } catch (err) {
            setError('فشل في إنشاء محتوى الدورة. يرجى المحاولة مرة أخرى.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSave = () => {
        if (!title) return;

        let newCourse: Course;

        if (courseType === 'Internal' && generatedOutline) {
            newCourse = {
                id: `c-${Date.now()}`,
                title,
                category,
                durationHours: duration,
                description: generatedOutline.description,
                learningObjectives: generatedOutline.learningObjectives,
                isMandatory: false,
                type: 'Internal',
                modules: generatedOutline.modules.map((mod, index) => ({
                    id: `m-${Date.now()}-${index}`,
                    title: mod.title,
                    topics: mod.topics
                }))
            };
        } else { // External
            newCourse = {
                id: `c-ext-${Date.now()}`,
                title,
                category,
                durationHours: duration,
                description,
                isMandatory: false,
                type: 'External',
                provider,
                url,
            };
        }

        onSave(newCourse);
        handleClose();
    };

    if (!isOpen) return null;

    const renderStep1 = () => (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">إنشاء دورة جديدة</h2>
            <p className="text-slate-500 mb-6">اختر طريقة إنشاء الدورة التدريبية.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => { setCourseType('Internal'); setStep(2); }} className="p-6 border-2 border-slate-200 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all text-center">
                    <SparklesIcon className="w-12 h-12 text-sky-500 mx-auto mb-2"/>
                    <h3 className="font-bold text-slate-800">إنشاء بالذكاء الاصطناعي</h3>
                    <p className="text-sm text-slate-500">أدخل العنوان ودع Gemini ينشئ لك هيكل الدورة.</p>
                </button>
                 <button onClick={() => { setCourseType('External'); setStep(2); }} className="p-6 border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center">
                    <DocumentTextIcon className="w-12 h-12 text-emerald-500 mx-auto mb-2"/>
                    <h3 className="font-bold text-slate-800">إضافة دورة خارجية</h3>
                    <p className="text-sm text-slate-500">أضف دورة تدريبية من مزود خارجي (مثل Coursera) يدويًا.</p>
                </button>
            </div>
        </div>
    );
    
    const renderStep2 = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{courseType === 'Internal' ? 'إنشاء دورة بالذكاء الاصطناعي' : 'إضافة دورة خارجية'}</h2>
                <button onClick={handleClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
            </div>
            {courseType === 'Internal' ? renderInternalForm() : renderExternalForm()}
             <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                <button type="button" onClick={handleClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                <button type="button" onClick={handleSave} disabled={courseType === 'Internal' && !generatedOutline} className="py-2 px-6 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed">
                    حفظ الدورة
                </button>
            </div>
        </>
    );

    const renderExternalForm = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان الدورة" className="w-full p-2 border border-slate-300 rounded-lg md:col-span-2" required />
                <input type="text" value={provider} onChange={e => setProvider(e.target.value)} placeholder="مقدم الدورة (Coursera, Udemy, etc.)" className="w-full p-2 border border-slate-300 rounded-lg" />
                <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} placeholder="المدة (ساعات)" className="w-full p-2 border border-slate-300 rounded-lg"/>
                <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="رابط الدورة" className="w-full p-2 border border-slate-300 rounded-lg md:col-span-2" />
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف موجز للدورة" rows={4} className="w-full p-2 border border-slate-300 rounded-lg" />
        </div>
    );
    
    const renderInternalForm = () => (
         <div className="space-y-4">
            <div className="p-4 bg-slate-50 border rounded-lg">
                <label className="block text-sm font-medium text-slate-700 mb-1">الخطوة 1: أدخل تفاصيل الدورة الأساسية</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الدورة (مثال: مقدمة في التسويق الرقمي)" className="w-full p-2 border border-slate-300 rounded-lg md:col-span-2" disabled={isLoading} />
                    <select value={category} onChange={e => setCategory(e.target.value as CourseCategory)} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                        <option value="Technical">تقنية</option>
                        <option value="Soft Skills">مهارات شخصية</option>
                        <option value="Leadership">قيادة</option>
                        <option value="Compliance">امتثال</option>
                    </select>
                    <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} placeholder="المدة (ساعات)" className="w-full p-2 border border-slate-300 rounded-lg"/>
                </div>
            </div>
            <div className="text-center">
                <button onClick={handleGenerateOutline} disabled={isLoading || !title} className="flex items-center justify-center gap-2 w-full md:w-auto mx-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md disabled:bg-slate-400">
                     {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-6 h-6" />}
                    <span>{isLoading ? 'جاري الإنشاء...' : 'الخطوة 2: إنشاء محتوى الدورة بالذكاء الاصطناعي'}</span>
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            {generatedOutline && (
                <div className="mt-6 p-4 border-t-2 border-sky-500 bg-white space-y-4 animate-fade-in">
                     <h3 className="text-xl font-bold text-slate-800">محتوى الدورة المقترح</h3>
                    <div>
                        <h4 className="font-semibold text-slate-700">الوصف:</h4>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">{generatedOutline.description}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-700">الأهداف التعليمية:</h4>
                        <ul className="list-disc pr-5 space-y-1 text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
                            {generatedOutline.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 pt-16" onClick={handleClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {step === 1 ? renderStep1() : renderStep2()}
            </div>
        </div>
    );
};

export default CourseCreationModal;