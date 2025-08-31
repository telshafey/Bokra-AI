
import React, { useState } from 'react';
import type { Course } from '../types';
import CourseCard from './CourseCard';
import { PlusCircleIcon } from './icons/Icons';
import CourseCreationModal from './CourseCreationModal';

interface LearningManagementPageProps {
    allCourses: Course[];
    onSaveCourse: (newCourse: Course) => void;
}

const LearningManagementPage: React.FC<LearningManagementPageProps> = ({ allCourses, onSaveCourse }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">إدارة التدريب والتطوير</h1>
                    <p className="text-slate-500 mt-1">إنشاء وإدارة الدورات التدريبية المتاحة للموظفين.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>إنشاء دورة جديدة</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {allCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

            <CourseCreationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveCourse}
            />
        </div>
    );
};

export default LearningManagementPage;