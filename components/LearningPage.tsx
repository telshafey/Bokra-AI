import React, { useMemo, useState } from 'react';
import type { EmployeeProfile, Course, EmployeeCourse, CourseStatus } from '../types';
import CourseCard from './CourseCard';
import { SparklesIcon, PlusCircleIcon } from './icons/Icons';
import RegisterExternalCourseModal from './RegisterExternalCourseModal';
import SubmitCourseReportModal from './SubmitCourseReportModal';

interface LearningPageProps {
    currentUser: EmployeeProfile;
    allCourses: Course[];
    employeeCourses: EmployeeCourse[];
    onRegisterExternalCourse: (courseData: { title: string; provider: string; url: string; }) => void;
    onSubmitCourseUpdate: (courseId: string, updateData: { status: CourseStatus; notes: string; certificate?: File | null }) => void;
}

const LearningPage: React.FC<LearningPageProps> = ({ currentUser, allCourses, employeeCourses, onRegisterExternalCourse, onSubmitCourseUpdate }) => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [reportingCourse, setReportingCourse] = useState<(Course & EmployeeCourse) | null>(null);

    const enrichedEmployeeCourses = useMemo(() => {
        return employeeCourses.map(ec => {
            const courseDetails = allCourses.find(c => c.id === ec.courseId);
            if (!courseDetails) return null;
            return {
                ...courseDetails,
                ...ec,
            };
        }).filter(Boolean) as (Course & EmployeeCourse)[];
    }, [allCourses, employeeCourses]);
    
    const assignedCourses = enrichedEmployeeCourses;
    const libraryCourses = allCourses.filter(c => !employeeCourses.some(ec => ec.courseId === c.id));

    // Simple AI recommendation logic for demonstration
    const recommendedCourses = useMemo(() => {
        return libraryCourses.filter(c => {
            if (currentUser.department === 'تكنولوجيا المعلومات' && c.category === 'Technical') {
                return true;
            }
            if (currentUser.role === 'Team Lead' && c.category === 'Leadership') {
                return true;
            }
            return false;
        }).slice(0, 2); // Show top 2 recommendations
    }, [libraryCourses, currentUser]);
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">خطة التطوير الخاصة بي</h1>
                    <p className="text-slate-500 mt-1">دوراتك المعينة والمقترحة لتنمية مهاراتك.</p>
                </div>
                 <button 
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>تسجيل دورة خارجية</span>
                </button>
            </div>

            {/* Assigned Courses */}
            <section>
                <h2 className="text-2xl font-semibold text-slate-700 mb-4 border-b pb-2">دوراتي الحالية</h2>
                 {assignedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignedCourses.map(course => (
                            <CourseCard key={course.id} course={course} onUpdateProgress={() => setReportingCourse(course)} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <h3 className="text-xl font-bold text-slate-600">لا توجد دورات معينة لك حاليًا.</h3>
                        <p className="text-slate-500 mt-2">تصفح مكتبة الدورات أو قم بتسجيل دورة خارجية لبدء رحلتك التعليمية.</p>
                    </div>
                )}
            </section>

            {/* AI Recommended Courses */}
            {recommendedCourses.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-4">
                         <SparklesIcon className="w-8 h-8 text-sky-500" />
                         <h2 className="text-2xl font-semibold text-slate-700">دورات مقترحة لك</h2>
                    </div>
                     <div className="bg-sky-50 p-6 rounded-xl border border-sky-200">
                        <p className="text-sky-800 mb-4">بناءً على دورك كـ "{currentUser.title}"، نقترح عليك هذه الدورات لتعزيز مهاراتك:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recommendedCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Course Library */}
            <section>
                <h2 className="text-2xl font-semibold text-slate-700 mb-4 border-b pb-2">مكتبة الدورات الداخلية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraryCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </section>

            <RegisterExternalCourseModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onRegister={onRegisterExternalCourse}
            />

            {reportingCourse && (
                <SubmitCourseReportModal
                    isOpen={!!reportingCourse}
                    onClose={() => setReportingCourse(null)}
                    course={reportingCourse}
                    onSubmit={onSubmitCourseUpdate}
                />
            )}
        </div>
    );
};

export default LearningPage;