


import React, { useState, useEffect } from 'react';
import type { PerformanceReview, ReviewStatus } from '../types';
import { SparklesIcon } from './icons/Icons';
import { generateFeedbackWithAI } from '../services/performanceService';
import { useTranslation } from './contexts/LanguageContext';

const RATING_STYLES = [
    'text-red-500', 'text-red-500', 'text-amber-500', 'text-emerald-500', 'text-emerald-600'
];

interface AIFeedbackButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

const AIFeedbackButton: React.FC<AIFeedbackButtonProps> = ({ onClick, isLoading }) => {
    const { t } = useTranslation();
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            className="absolute top-2 left-2 flex items-center gap-1.5 text-xs bg-sky-100 text-sky-700 font-semibold px-2 py-1 rounded-md hover:bg-sky-200 disabled:bg-slate-200 disabled:text-slate-500 transition-colors dark:bg-sky-900/50 dark:text-sky-300 dark:hover:bg-sky-900"
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <SparklesIcon className="w-4 h-4" />
            )}
            <span>{isLoading ? t('performanceReview.aiLoading') : t('performanceReview.aiImprove')}</span>
        </button>
    );
};


interface ReviewFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (value: string) => void;
    onGenerate: () => Promise<void>;
    isLoading: boolean;
}

const ReviewField: React.FC<ReviewFieldProps> = ({ label, value, isEditing, onChange, onGenerate, isLoading }) => {
    const { t } = useTranslation();
    if (!isEditing) {
        return (
            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">{label}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{value}</p>
            </div>
        )
    }
    
    return (
         <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <div className="relative">
                <textarea
                    rows={4}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                    placeholder={t('performanceReview.notesPlaceholder')}
                    spellCheck="true"
                />
                <AIFeedbackButton onClick={onGenerate} isLoading={isLoading} />
            </div>
        </div>
    );
};


interface PerformanceReviewCardProps {
    review: PerformanceReview;
    isManagerView?: boolean;
    isEditing?: boolean;
    onSave?: (updatedReview: PerformanceReview) => void;
    onCancel?: () => void;
}

const PerformanceReviewCard: React.FC<PerformanceReviewCardProps> = ({ review, isManagerView = false, isEditing: initialIsEditing = false, onSave = () => {}, onCancel = () => {} }) => {
    const { t, language } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(initialIsEditing);
    const [editedReview, setEditedReview] = useState(review);
    const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setEditedReview(review);
    }, [review]);
    
    useEffect(() => {
        setIsEditing(initialIsEditing);
    }, [initialIsEditing]);

    const STATUS_STYLES: Record<ReviewStatus, { text: string; bg: string; }> = {
        'Completed': { text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
        'In Progress': { text: 'text-sky-800 dark:text-sky-300', bg: 'bg-sky-100 dark:bg-sky-900/60' },
        'Draft': { text: 'text-slate-800 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-700' },
    };
    const statusStyle = STATUS_STYLES[review.status];
    
    const handleGenerate = async (field: keyof PerformanceReview['comments'] | 'finalComments' | 'strengths' | 'areasForImprovement') => {
        if (typeof (editedReview as any)[field] !== 'string' || !(editedReview as any)[field]) return;
        
        setAiLoading(prev => ({ ...prev, [field]: true }));
        const improvedText = await generateFeedbackWithAI((editedReview as any)[field] as string, language);
        setEditedReview(prev => ({...prev, [field]: improvedText }));
        setAiLoading(prev => ({ ...prev, [field]: false }));
    };

    const handleSaveClick = () => {
        onSave(editedReview);
        setIsEditing(false); // Assume save completes the edit
    };

    const handleCancelClick = () => {
        setEditedReview(review); // Revert changes
        onCancel();
        setIsEditing(false);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex justify-between items-center cursor-pointer" onClick={() => !isEditing && setIsExpanded(!isExpanded)}>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{review.cycle}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {review.status === 'Completed' ? `${t('performanceReview.reviewDate')}: ${new Date(review.reviewDate).toLocaleDateString('ar-EG-u-nu-latn')}` : `${t('performanceReview.reviewer')}: ${'أحمد المصري'}`}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {review.status === 'Completed' && (
                        <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t('performanceReview.overallRating')}</p>
                            {/* FIX: Corrected property access to `overallRating` which is now available on the PerformanceReview type. */}
                            <p className={`font-bold text-2xl ${RATING_STYLES[review.overallRating - 1]}`}>{review.overallRating}/5</p>
                        </div>
                    )}
                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {t(`performanceReview.status.${review.status}`)}
                    </span>
                </div>
            </div>

            {/* Collapsible/Editable Content */}
            {(isExpanded || isEditing) && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    <ReviewField 
                        label={t('performanceReview.strengths')}
                        value={editedReview.strengths}
                        isEditing={isEditing}
                        onChange={(val) => setEditedReview(p => ({...p, strengths: val}))}
                        onGenerate={() => handleGenerate('strengths')}
                        isLoading={aiLoading['strengths']}
                    />
                     <ReviewField 
                        label={t('performanceReview.areasForImprovement')}
                        value={editedReview.areasForImprovement}
                        isEditing={isEditing}
                        onChange={(val) => setEditedReview(p => ({...p, areasForImprovement: val}))}
                        onGenerate={() => handleGenerate('areasForImprovement')}
                        isLoading={aiLoading['areasForImprovement']}
                    />
                     <ReviewField 
                        label={t('performanceReview.finalComments')}
                        value={editedReview.finalComments}
                        isEditing={isEditing}
                        onChange={(val) => setEditedReview(p => ({...p, finalComments: val}))}
                        onGenerate={() => handleGenerate('finalComments')}
                        isLoading={aiLoading['finalComments']}
                    />

                    {isEditing && (
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={handleCancelClick} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">{t('general.cancel')}</button>
                            <button type="button" onClick={handleSaveClick} className="py-2 px-6 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-sm hover:shadow-md">{t('performanceReview.save')}</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PerformanceReviewCard;