import React from 'react';
import { Course, EmployeeCourse } from '../types';
import { AcademicCapIcon } from './icons/Icons';

interface LearningProgressWidgetProps {
    activeCourse: (Course & EmployeeCourse) | null;
    setActivePage: (page: string) => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
            className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
        ></div>
    </div>
);

const LearningProgressWidget: React.FC<LearningProgressWidgetProps> = ({ activeCourse, setActivePage }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <AcademicCapIcon className="w-8 h-8 text-sky-500" />
                    <h2 className="text-xl font-bold text-slate-700">متابعة التعلم</h2>
                </div>
                {activeCourse ? (
                    <div>
                        <p className="text-sm text-slate-500 mb-1">أكمل دورتك الحالية:</p>
                        <h3 className="font-bold text-slate-800 mb-3">{activeCourse.title}</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-sm font-bold text-sky-600">{activeCourse.progress}%</span>
                            <ProgressBar progress={activeCourse.progress} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="font-semibold text-slate-700">ليس لديك دورات نشطة حاليًا.</p>
                        <p className="text-sm text-slate-500 mt-1">ابدأ رحلتك التعليمية من صفحة التطوير.</p>
                    </div>
                )}
            </div>
            <button
                onClick={() => setActivePage('التطوير والتدريب')}
                className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors mt-4"
            >
                {activeCourse ? 'أكمل الدورة الآن' : 'اذهب إلى صفحة التدريب'}
            </button>
        </div>
    );
};

export default LearningProgressWidget;