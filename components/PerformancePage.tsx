import React from 'react';
import type { PerformanceReview, MonthlyCheckIn, MonthlyCheckInRating } from '../types';
import PerformanceReviewCard from './PerformanceReviewCard';

const RATING_STYLES: Record<MonthlyCheckInRating, { text: string; bg: string; border: string }> = {
    'Exceeds Expectations': { text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/50', border: 'border-emerald-300 dark:border-emerald-700' },
    'Meets Expectations': { text: 'text-sky-800 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-900/50', border: 'border-sky-300 dark:border-sky-700' },
    'Needs Improvement': { text: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/50', border: 'border-amber-300 dark:border-amber-700' },
};

const RATING_TRANSLATION: Record<MonthlyCheckInRating, string> = {
    'Exceeds Expectations': 'يفوق التوقعات',
    'Meets Expectations': 'يلبي التوقعات',
    'Needs Improvement': 'يحتاج إلى تحسين',
};


interface PerformancePageProps {
    reviews: PerformanceReview[];
    monthlyCheckIns: MonthlyCheckIn[];
}

const PerformancePage: React.FC<PerformancePageProps> = ({ reviews, monthlyCheckIns }) => {

    return (
        <div className="space-y-8">
            <div>
                 <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">التقييمات والمتابعة</h1>
                 
                 {/* Monthly Check-ins Section */}
                 <div className="mb-8">
                     <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">سجل المتابعة الشهرية</h2>
                     {monthlyCheckIns.length > 0 ? (
                         <div className="space-y-4">
                             {monthlyCheckIns.map(checkIn => {
                                const ratingStyle = RATING_STYLES[checkIn.rating];
                                const monthName = new Date(checkIn.year, checkIn.month).toLocaleString('ar-EG', { month: 'long' });
                                 return(
                                    <div key={checkIn.id} className={`p-4 rounded-lg border-l-4 ${ratingStyle.border} ${ratingStyle.bg}`}>
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-slate-800 dark:text-slate-200">متابعة شهر {monthName} {checkIn.year}</p>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${ratingStyle.bg} ${ratingStyle.text}`}>{RATING_TRANSLATION[checkIn.rating]}</span>
                                        </div>
                                        <blockquote className="mt-2 text-sm text-slate-600 dark:text-slate-300 border-r-2 border-slate-300 dark:border-slate-600 pr-3">
                                            {checkIn.notes}
                                        </blockquote>
                                    </div>
                                 );
                             })}
                         </div>
                     ) : (
                         <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <p className="text-slate-500 dark:text-slate-400">لا يوجد سجل متابعة شهرية حتى الآن.</p>
                        </div>
                     )}
                 </div>

                 <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">التقييمات الرسمية</h2>
                 {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <PerformanceReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">لا يوجد سجل تقييمات رسمية.</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">سيظهر تقييمك هنا بعد اكتماله من قبل مديرك.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default PerformancePage;