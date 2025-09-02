import React from 'react';
import { ManagerPerformanceData, MonthlyCheckInRating, TeamMemberPerformanceData } from '../types';
import PageHeader from './PageHeader';
import Card from './Card';
import StatCard from './StatCard';
import { PresentationChartLineIcon, CheckCircleIcon, UserGroupIcon, StarIcon } from './icons/Icons';

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

const RATING_TRANSLATION: Record<MonthlyCheckInRating, string> = {
    'Exceeds Expectations': 'يفوق التوقعات',
    'Meets Expectations': 'يلبي التوقعات',
    'Needs Improvement': 'يحتاج إلى تحسين',
};

const REVIEW_STATUS_STYLES: Record<TeamMemberPerformanceData['reviewStatus'], { text: string; bg: string; }> = {
    'Completed': { text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
    'In Progress': { text: 'text-sky-800 dark:text-sky-300', bg: 'bg-sky-100 dark:bg-sky-900/60' },
    'Not Started': { text: 'text-slate-800 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700' },
};

interface ManagerPerformancePageProps {
    data: ManagerPerformanceData;
}

const ManagerPerformancePage: React.FC<ManagerPerformancePageProps> = ({ data }) => {
    const { cycle, cycleStats, teamPerformance } = data;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="إدارة الأداء"
                subtitle={`نظرة عامة على أداء الفريق لدورة: ${cycle.name}`}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="اكتمال المراجعات" value={`${cycleStats.reviewsCompleted} / ${cycleStats.totalReviews}`} icon={CheckCircleIcon} color="bg-emerald-500" />
                <StatCard title="متوسط إنجاز الأهداف" value={`${cycleStats.avgTeamGoalProgress}%`} icon={PresentationChartLineIcon} color="bg-sky-500" />
                <StatCard title="حالة الدورة الحالية" value={cycle.status === 'Active' ? 'نشطة' : 'مغلقة'} icon={UserGroupIcon} color="bg-purple-500" />
            </div>

            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">الموظف</th>
                                <th className="px-6 py-3">تقدم الأهداف</th>
                                <th className="px-6 py-3">آخر متابعة شهرية</th>
                                <th className="px-6 py-3">حالة المراجعة</th>
                                <th className="px-6 py-3">إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamPerformance.map(item => (
                                <tr key={item.member.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                                        <div className="flex items-center gap-3">
                                            <img src={item.member.avatarUrl} alt={item.member.name} className="w-10 h-10 rounded-full"/>
                                            <div>
                                                <p>{item.member.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.member.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24"><ProgressBar progress={item.goalProgress} /></div>
                                            <span className="font-semibold">{item.goalProgress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.latestCheckIn ? (
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${RATING_STYLES[item.latestCheckIn.rating].bg} ${RATING_STYLES[item.latestCheckIn.rating].text}`}>
                                                <StarIcon className="w-3 h-3 inline-block ml-1"/>
                                                {RATING_TRANSLATION[item.latestCheckIn.rating]}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${REVIEW_STATUS_STYLES[item.reviewStatus].bg} ${REVIEW_STATUS_STYLES[item.reviewStatus].text}`}>
                                            {item.reviewStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="font-medium text-sky-600 dark:text-sky-400 hover:underline">
                                            {item.reviewStatus === 'Completed' ? 'عرض التقييم' : 'بدء التقييم'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManagerPerformancePage;