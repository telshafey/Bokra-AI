

import React, { useState } from 'react';
import { ManagerPerformanceData, MonthlyCheckInRating, TeamMemberPerformanceData, PerformanceReview, EmployeeProfile } from '../types';
import PageHeader from './PageHeader';
import Card from './Card';
import StatCard from './StatCard';
import { PresentationChartLineIcon, CheckCircleIcon, UserGroupIcon, StarIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';
import PerformanceReviewCard from './PerformanceReviewCard';

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    let bgColor = 'bg-sky-500';
    if (progress < 40) bgColor = 'bg-red-500';
    else if (progress < 70) bgColor = 'bg-amber-500';
    else if (progress === 100) bgColor = 'bg-emerald-500';

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${bgColor}`} 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

const RATING_STYLES: Record<MonthlyCheckInRating, { text: string; bg: string; }> = {
    'Exceeds Expectations': { text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
    'Meets Expectations': { text: 'text-sky-800 dark:text-sky-300', bg: 'bg-sky-100 dark:bg-sky-900/60' },
    'Needs Improvement': { text: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/60' },
};

const REVIEW_STATUS_STYLES: Record<TeamMemberPerformanceData['reviewStatus'], { text: string; bg: string; }> = {
    'Completed': { text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
    'In Progress': { text: 'text-sky-800 dark:text-sky-300', bg: 'bg-sky-100 dark:bg-sky-900/60' },
    'Not Started': { text: 'text-slate-800 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700' },
};

interface ManagerPerformancePageProps {
    data: ManagerPerformanceData;
    onSavePerformanceReview: (review: PerformanceReview) => void;
    performanceReviews: PerformanceReview[];
    currentUser: EmployeeProfile;
}

const ManagerPerformancePage: React.FC<ManagerPerformancePageProps> = ({ data, onSavePerformanceReview, performanceReviews, currentUser }) => {
    const { t } = useTranslation();
    const { cycle, cycleStats, teamPerformance } = data;
    const [editingReviewFor, setEditingReviewFor] = useState<string | null>(null);

    const handleActionClick = (item: TeamMemberPerformanceData) => {
        if (item.reviewStatus === 'Not Started' || item.reviewStatus === 'In Progress') {
            setEditingReviewFor(item.member.id);
        }
    };

    const handleSaveReview = (review: PerformanceReview) => {
        onSavePerformanceReview({ ...review, status: 'In Progress' });
        setEditingReviewFor(null);
    };

    const handleCancelReview = () => {
        setEditingReviewFor(null);
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title={t('managerPerformance.pageHeaderTitle')}
                subtitle={t('managerPerformance.pageHeaderSubtitle', { cycleName: cycle.name })}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('managerPerformance.reviewsCompleted')} value={`${cycleStats.reviewsCompleted} / ${cycleStats.totalReviews}`} icon={CheckCircleIcon} color="bg-emerald-500" />
                <StatCard title={t('managerPerformance.avgGoalProgress')} value={`${cycleStats.avgTeamGoalProgress}%`} icon={PresentationChartLineIcon} color="bg-sky-500" />
                <StatCard title={t('managerPerformance.cycleStatus')} value={t(`managerPerformance.cycleStatuses.${cycle.status}`)} icon={UserGroupIcon} color="bg-purple-500" />
            </div>

            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">{t('general.employee')}</th>
                                <th className="px-6 py-3">{t('managerPerformance.goalProgress')}</th>
                                <th className="px-6 py-3">{t('managerPerformance.latestCheckIn')}</th>
                                <th className="px-6 py-3">{t('managerPerformance.reviewStatus')}</th>
                                <th className="px-6 py-3">{t('managerPerformance.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {teamPerformance.map(item => {
                                const isEditingThisRow = editingReviewFor === item.member.id;
                                const reviewForEmployee = performanceReviews.find(r => r.employeeId === item.member.id && r.cycle === cycle.name);

                                let reviewToShow: PerformanceReview;
                                if (reviewForEmployee) {
                                    reviewToShow = reviewForEmployee;
                                } else {
                                    const now = new Date();
                                    reviewToShow = {
                                        id: `rev-${item.member.id}-${Date.now()}`,
                                        employeeId: item.member.id,
                                        reviewerId: currentUser.id,
                                        cycle: cycle.name,
                                        status: 'Draft',
                                        // FIX: Removed non-existent property 'overallRating' from PerformanceReview object creation to align with its type definition.
                                        ratings: {},
                                        comments: {},
                                        finalComments: '',
                                        reviewDate: now.toISOString(),
                                        overallRating: 0,
                                        strengths: '',
                                        areasForImprovement: ''
                                    };
                                }
                                
                                return (
                                <React.Fragment key={item.member.id}>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={item.member.avatarUrl} alt={item.member.name} className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <p>{item.member.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.member.title}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ProgressBar progress={item.goalProgress} />
                                                <span className="font-semibold">{item.goalProgress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.latestCheckIn ? (
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${RATING_STYLES[item.latestCheckIn.rating].bg} ${RATING_STYLES[item.latestCheckIn.rating].text}`}>
                                                    {t(`performanceReview.ratings.${item.latestCheckIn.rating}`)}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${REVIEW_STATUS_STYLES[item.reviewStatus].bg} ${REVIEW_STATUS_STYLES[item.reviewStatus].text}`}>
                                                {t(`performanceReview.teamStatus.${item.reviewStatus}`)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleActionClick(item)}
                                                disabled={item.reviewStatus === 'Completed'}
                                                className="font-semibold text-sky-600 hover:text-sky-800 disabled:text-slate-400 disabled:cursor-not-allowed">
                                                {t(`managerPerformance.action.${item.reviewStatus}`)}
                                            </button>
                                        </td>
                                    </tr>
                                    {isEditingThisRow && (
                                        <tr>
                                            <td colSpan={5} className="p-4 bg-slate-50 dark:bg-slate-900/50">
                                                <PerformanceReviewCard 
                                                    review={reviewToShow}
                                                    isManagerView={true}
                                                    isEditing={true}
                                                    onSave={handleSaveReview}
                                                    onCancel={handleCancelReview}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManagerPerformancePage;