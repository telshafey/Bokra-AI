
import React from 'react';
import type { Course, CourseStatus, CourseCategory, ManagerApprovalStatus, EmployeeCourse, ExternalCourseVenue } from '../types';
import { BookOpenIcon, ClockIcon, InformationCircleIcon, LinkIcon, MapPinIcon } from './icons/Icons';

const CATEGORY_STYLES: Record<CourseCategory, { text: string; bg: string; }> = {
    'Technical': { text: 'text-sky-800', bg: 'bg-sky-100' },
    'Soft Skills': { text: 'text-amber-800', bg: 'bg-amber-100' },
    'Compliance': { text: 'text-red-800', bg: 'bg-red-100' },
    'Leadership': { text: 'text-purple-800', bg: 'bg-purple-100' },
};

const STATUS_TRANSLATION: Record<CourseStatus, string> = {
    'Not Started': 'لم تبدأ',
    'In Progress': 'قيد التنفيذ',
    'Completed': 'مكتملة',
};

const APPROVAL_STATUS_STYLES: Record<ManagerApprovalStatus, { text: string; bg: string; }> = {
    'Pending': { text: 'text-amber-800', bg: 'bg-amber-100' },
    'Approved': { text: 'text-emerald-800', bg: 'bg-emerald-100' },
    'Rejected': { text: 'text-red-800', bg: 'bg-red-100' },
    'NotSubmitted': { text: 'text-slate-800', bg: 'bg-slate-100' },
};

const APPROVAL_STATUS_TRANSLATION: Record<ManagerApprovalStatus, string> = {
    'Pending': 'بانتظار الموافقة',
    'Approved': 'تمت الموافقة',
    'Rejected': 'مرفوضة',
    'NotSubmitted': 'لم تقدم',
};

const VENUE_TRANSLATION: Record<ExternalCourseVenue, string> = {
    'Online': 'عبر الإنترنت',
    'On-site': 'في موقع العميل',
    'Training Center': 'مركز تدريب',
};


const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    let bgColor = progress === 100 ? 'bg-emerald-500' : 'bg-sky-500';

    return (
        <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
                className={`h-2 rounded-full transition-all duration-500 ${bgColor}`} 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

interface CourseCardProps {
    course: Course & Partial<EmployeeCourse>;
    onUpdateProgress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onUpdateProgress = () => {} }) => {
    const categoryStyle = CATEGORY_STYLES[course.category];
    const progress = course.progress ?? 0;
    const status = course.status ?? 'Not Started';
    const isAssigned = !!course.employeeId;
    const isExternal = course.type === 'External';

    const approvalStatus = course.managerApprovalStatus || 'NotSubmitted';
    const approvalStyle = APPROVAL_STATUS_STYLES[approvalStatus];

    const ActionButton = () => {
        if (!isAssigned) {
             return <button className="w-full bg-slate-300 text-slate-500 font-bold py-2 px-4 rounded-lg cursor-not-allowed" disabled>{isExternal ? 'دورة خارجية' : 'دورة داخلية'}</button>;
        }

        if (status === 'Completed') {
            return <button className="w-full bg-slate-400 text-white font-bold py-2 px-4 rounded-lg" disabled>تم الإكمال</button>;
        }
        
        if (isExternal) {
            return <button onClick={onUpdateProgress} className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700">تحديث التقدم وتقديم الشهادة</button>;
        }
        
        // Internal Course
        return <button className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700">{status === 'In Progress' ? 'أكمل الدورة' : 'ابدأ الآن'}</button>;
    };


    return (
        <div className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col group/card ${isExternal ? 'bg-emerald-50 border border-emerald-200' : 'bg-white'}`}>
            <div className="p-5 flex-1 relative">
                <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${categoryStyle.bg} ${categoryStyle.text}`}>
                        {course.category}
                    </span>
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isExternal ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                        {isExternal ? 'دورة خارجية' : 'دورة داخلية'}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 h-14">{course.title}</h3>
                
                {isExternal && course.provider && (
                    <div className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <span>مقدمة من: {course.provider}</span>
                        {course.url && (
                             <a href={course.url} target="_blank" rel="noopener noreferrer" title="زيارة رابط الدورة" className="text-sky-600 hover:text-sky-800">
                                <LinkIcon className="w-4 h-4"/>
                            </a>
                        )}
                    </div>
                )}
                
                {isExternal && course.venue && (
                     <div className="text-xs text-slate-600 mb-2 flex items-center gap-1.5">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{VENUE_TRANSLATION[course.venue]} {course.locationDetails && `(${course.locationDetails})`}</span>
                    </div>
                )}

                <p className="text-xs text-slate-500 line-clamp-2 h-8">{course.description}</p>
                 
                {isAssigned && isExternal && (
                    <div className="mt-3">
                         <span className={`px-2 py-1 text-xs font-bold rounded-full ${approvalStyle.bg} ${approvalStyle.text}`}>
                           الحالة: {APPROVAL_STATUS_TRANSLATION[approvalStatus]}
                        </span>
                    </div>
                )}
                
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-black bg-opacity-75 text-white p-4 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
                    {course.learningObjectives && course.learningObjectives.length > 0 ? (
                        <>
                            <h4 className="font-bold mb-2">الأهداف التعليمية:</h4>
                            <ul className="list-disc list-inside text-xs space-y-1">
                                {course.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                            </ul>
                        </>
                    ) : (
                        <p className="text-sm text-center">لا توجد أهداف محددة لهذه الدورة.</p>
                    )}
                </div>
            </div>

            <div className="border-t border-slate-100 p-4 space-y-3">
                 <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4" />
                        <span>{course.durationHours > 0 ? `${course.durationHours} ساعات` : 'غير محدد'}</span>
                    </div>
                    {course.type === 'Internal' && (
                         <div className="flex items-center gap-1.5">
                            <BookOpenIcon className="w-4 h-4" />
                            <span>{course.modules?.length || 0} وحدات</span>
                        </div>
                    )}
                 </div>
                 
                 {isAssigned && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-slate-600">{STATUS_TRANSLATION[status]}</span>
                            <span className="text-xs font-bold text-sky-700">{progress}%</span>
                        </div>
                        <ProgressBar progress={progress} />
                    </div>
                 )}
            </div>

             <div className="p-4 pt-0">
                <ActionButton />
            </div>
        </div>
    );
};

export default CourseCard;
