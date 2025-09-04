

import React from 'react';
import type { PerformanceReview, MonthlyCheckIn, MonthlyCheckInRating } from '../types';
import PerformanceReviewCard from './PerformanceReviewCard';
import { useTranslation } from './contexts/LanguageContext';

const RATING_STYLES: Record<MonthlyCheckInRating, { text: string; bg: string; border: string }> = {
    'Exceeds Expectations': { text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/50', border: 'border-emerald-300 dark:border-emerald-700' },
    'Meets Expectations': { text: 'text-sky-800 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-900/50', border: 'border-sky-300 dark:border-sky-700' },
    'Needs Improvement': { text: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/50', border: 'border-amber-300 dark:border-amber-700' },
};


interface PerformancePageProps {
    reviews: PerformanceReview[];
    monthlyCheckIns: MonthlyCheckIn[];
}

const PerformancePage: React.FC<PerformancePageProps> = ({ reviews, monthlyCheckIns }) => {
    const { t, language } = useTranslation();
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';

    return (
        <div className="space-y-8">
            <div>
                 <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t('performancePage.title')}</h1>
                 
                 {/* Monthly Check-ins Section */}
                 <div className="mb-8">
                     <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">{t('performancePage.monthlyCheckinsTitle')}</h2>
                     {monthlyCheckIns.length > 0 ? (
                         <div className="space-y-4">
                             {monthlyCheckIns.map(checkIn => {
                                // FIX: Added a return statement to the map function to correctly render JSX elements, which resolves multiple type errors.
                                const ratingStyle = RATING_STYLES[checkIn.rating];
                                const monthName = new Date(checkIn.year, checkIn.month).toLocaleDateString(locale, { month: 'long' });
                                return (
                                <div key={checkIn.id} className={`p-4 rounded-lg border-l-4 ${ratingStyle.bg} ${ratingStyle.border}`}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t('performancePage.checkinFor', { month: monthName, year: checkIn.year })}</h3>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${ratingStyle.bg} ${ratingStyle.text}`}>{t(`performanceReview.ratings.${checkIn.rating}`)}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap">{checkIn.notes}</p>
                                </div>
                                );
                            })}
                         </div>
                     ) : (
                        <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <p className="font-semibold text-slate-600 dark:text-slate-200">{t('performancePage.noCheckins')}</p>
                        </div>
                     )}
                 </div>

                 {/* Formal Reviews Section */}
                 <div>
                      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">{t('performancePage.reviewsTitle')}</h2>
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map(review => <PerformanceReviewCard key={review.id} review={review} />)}
                        </div>
                      ) : (
                         <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-slate-600">{t('performancePage.noReviews')}</h3>
                            <p className="text-slate-500 mt-2">{t('performancePage.noReviewsSubtitle')}</p>
                        </div>
                      )}
                 </div>
            </div>
        </div>
    );
};

// FIX: Added a default export to resolve the module import error in App.tsx.
export default PerformancePage;
