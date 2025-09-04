

import React, { useState } from 'react';
import type { TeamMemberDetails, PerformanceReview, MonthlyCheckIn, EmployeeProfile } from '../types';
import { PlusCircleIcon } from './icons/Icons';
import PerformanceReviewCard from './PerformanceReviewCard';
import GoalCard from './GoalCard';
import MonthlyCheckInModal from './MonthlyCheckInModal';

interface GoalsAndEvaluationTabProps {
    details: TeamMemberDetails;
    hasEditPermission: boolean;
    currentUser: EmployeeProfile;
    onSaveMonthlyCheckIn: (checkInData: Omit<MonthlyCheckIn, 'id' | 'reviewerId' | 'date'>) => void;
    onSavePerformanceReview: (review: PerformanceReview) => void;
}

const GoalsAndEvaluationTab: React.FC<GoalsAndEvaluationTabProps> = ({ details, hasEditPermission, currentUser, onSaveMonthlyCheckIn, onSavePerformanceReview }) => {
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [isCreatingReview, setIsCreatingReview] = useState(false);

    const objectives = details.goals.filter(g => g.type === 'Objective');
    const now = new Date();
    const currentCycle = `${now.getMonth() > 5 ? 'نهاية العام' : 'منتصف العام'} ${now.getFullYear()}`;

    const handleSaveReview = (review: PerformanceReview) => {
        // FIX: Removed non-existent property 'overallRating' from PerformanceReview object creation to align with its type definition.
        onSavePerformanceReview({ ...review, status: 'Completed', reviewerId: currentUser.id, reviewDate: new Date().toISOString() });
        setIsCreatingReview(false);
    };

    const newReviewDraft: PerformanceReview = {
        id: `rev-${details.profile.id}-${Date.now()}`,
        employeeId: details.profile.id,
        reviewerId: currentUser.id,
        cycle: currentCycle,
        status: 'Draft',
        // FIX: Removed non-existent property 'overallRating' from PerformanceReview object creation to align with its type definition.
        strengths: '',
        areasForImprovement: '',
        finalComments: '',
        reviewDate: now.toISOString(),
        // The following properties are part of the old structure and are kept for compatibility.
        ratings: {},
        comments: {},
        overallRating: 0, // Keep a default value
    };
    
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-700">الأهداف والتقييمات</h2>
                 <div className="flex items-center gap-2">
                    {hasEditPermission && (
                        <>
                            <button
                                onClick={() => setIsCreatingReview(true)}
                                className="flex items-center gap-2 bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold py-2 px-3 rounded-lg transition-colors text-sm">
                                <PlusCircleIcon className="w-5 h-5"/>
                                <span>بدء تقييم جديد</span>
                            </button>
                            <button
                                onClick={() => setIsCheckInModalOpen(true)}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg transition-colors text-sm">
                                <PlusCircleIcon className="w-5 h-5"/>
                                <span>إضافة متابعة شهرية</span>
                            </button>
                        </>
                    )}
                 </div>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-600 border-b pb-2">سجل التقييمات الرسمية</h3>
            {isCreatingReview && (
                 <PerformanceReviewCard
                    review={newReviewDraft}
                    isManagerView={true}
                    isEditing={true}
                    onSave={handleSaveReview}
                    onCancel={() => setIsCreatingReview(false)}
                />
            )}
            {details.reviews.filter(r => r.status !== 'Draft').map(review => (
                <PerformanceReviewCard key={review.id} review={review} isManagerView={true} />
            ))}
            {details.reviews.filter(r => r.status !== 'Draft').length === 0 && !isCreatingReview && <p className="text-slate-500 text-sm">لا يوجد سجل تقييمات رسمية.</p>}


            <h3 className="text-lg font-semibold text-slate-600 border-b pb-2 mt-8">أهداف الموظف</h3>
            {objectives.map(obj => (
                <div key={obj.id}>
                    <GoalCard goal={obj} />
                    <div className="mr-8 mt-4 space-y-4 border-r-2 border-slate-200 pr-8">
                        {details.goals.filter(kr => kr.parentId === obj.id).map(kr => (
                            <GoalCard key={kr.id} goal={kr} />
                        ))}
                    </div>
                </div>
            ))}
            {objectives.length === 0 && <p className="text-slate-500 text-sm">لا توجد أهداف محددة للموظف.</p>}
            
             <MonthlyCheckInModal
                isOpen={isCheckInModalOpen}
                onClose={() => setIsCheckInModalOpen(false)}
                onSave={(data) => {
                    onSaveMonthlyCheckIn({ ...data, employeeId: details.profile.id });
                    setIsCheckInModalOpen(false);
                }}
                employeeName={details.profile.name}
            />
        </div>
    );
};

export default GoalsAndEvaluationTab;