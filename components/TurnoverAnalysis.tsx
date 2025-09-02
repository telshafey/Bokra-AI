
import React, { useState, useEffect } from 'react';
import { getTurnoverPrediction } from '../services/turnoverService';
import type { EmployeeProfile, TurnoverAnalysisResult, TurnoverRiskLevel } from '../types';
import { PresentationChartLineIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

const RISK_STYLES: Record<TurnoverRiskLevel, { text: string; bg: string; border: string; }> = {
    Low: { text: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/50', border: 'border-emerald-500 dark:border-emerald-700' },
    Medium: { text: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/50', border: 'border-amber-500 dark:border-amber-700' },
    High: { text: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/50', border: 'border-red-500 dark:border-red-700' },
    Unknown: { text: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-700', border: 'border-slate-500 dark:border-slate-600' },
};

const TurnoverAnalysis: React.FC<{ employee: EmployeeProfile }> = ({ employee }) => {
    const { t, language } = useTranslation();
    const [analysis, setAnalysis] = useState<TurnoverAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when employee changes
    useEffect(() => {
        setAnalysis(null);
        setIsLoading(false);
    }, [employee.id]);

    const handleAnalyze = async () => {
        setIsLoading(true);
        const result = await getTurnoverPrediction(employee, language);
        setAnalysis(result);
        setIsLoading(false);
    };
    
    const riskStyles = analysis ? RISK_STYLES[analysis.riskLevel] : RISK_STYLES['Unknown'];

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t('turnover.title')}</h2>
            
            {analysis && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`md:col-span-1 p-6 rounded-xl flex flex-col items-center justify-center text-center ${riskStyles.bg} border-2 ${riskStyles.border}`}>
                         <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{t('turnover.expectedRiskLevel')}</h3>
                         <p className={`text-4xl font-bold ${riskStyles.text}`}>{t(`turnover.riskLevels.${analysis.riskLevel}`)}</p>
                         <p className={`text-lg font-semibold ${riskStyles.text}`}>({analysis.riskScore}%)</p>
                    </div>
                     <div className="md:col-span-2 bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                         <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">{t('turnover.keyFactors')}</h3>
                         <ul className="space-y-2 list-disc pr-5">
                            {analysis.keyFactors.map((factor, index) => (
                                <li key={index} className="text-sm text-slate-700 dark:text-slate-300">{factor}</li>
                            ))}
                         </ul>
                    </div>
                </div>
            )}
           
            {!analysis && (
                 <div className="text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                    {isLoading ? (
                        <div>
                            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{t('turnover.aiAnalyzing')}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('turnover.pleaseWait')}</p>
                        </div>
                    ) : (
                         <>
                            <PresentationChartLineIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('turnover.proactiveAnalysis')}</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto my-2">{t('turnover.description')}</p>
                            <button 
                                onClick={handleAnalyze}
                                className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                            >
                                {t('turnover.generateButton')}
                            </button>
                        </>
                    )}
                </div>
            )}

            {analysis && !isLoading && (
                 <div className="text-center mt-6">
                     <button 
                        onClick={handleAnalyze}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-5 rounded-lg transition-colors text-sm dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        {t('turnover.regenerateButton')}
                    </button>
                </div>
            )}
           
        </div>
    );
};

export default TurnoverAnalysis;
