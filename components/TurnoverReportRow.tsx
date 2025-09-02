
import React, { useState } from 'react';
import { EmployeeProfile, TurnoverAnalysisResult, TurnoverRiskLevel } from '../types';
import { getTurnoverPrediction } from '../services/turnoverService';
import { useTranslation } from './contexts/LanguageContext';

const RISK_STYLES: Record<TurnoverRiskLevel, { text: string; bg: string; }> = {
    Low: { text: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    Medium: { text: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/50' },
    High: { text: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/50' },
    Unknown: { text: 'text-slate-800 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700' },
};

interface TurnoverReportRowProps {
    employee: EmployeeProfile;
}

const TurnoverReportRow: React.FC<TurnoverReportRowProps> = ({ employee }) => {
    const { t, language } = useTranslation();
    const [analysis, setAnalysis] = useState<TurnoverAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        const result = await getTurnoverPrediction(employee, language);
        setAnalysis(result);
        setIsLoading(false);
    };
    
    return (
         <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap align-top">
                <div className="flex items-center gap-3">
                    <img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p>{employee.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{employee.title}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('turnover.aiAnalyzing')}</span>
                    </div>
                ) : analysis ? (
                    <div className="space-y-2">
                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${RISK_STYLES[analysis.riskLevel].bg} ${RISK_STYLES[analysis.riskLevel].text}`}>
                            {t('turnover.riskLevelLabel')}: {t(`turnover.riskLevels.${analysis.riskLevel}`)} ({analysis.riskScore}%)
                        </span>
                        <ul className="list-disc pr-4 text-xs text-slate-600 dark:text-slate-300">
                            {analysis.keyFactors.map((factor, i) => <li key={i}>{factor}</li>)}
                        </ul>
                    </div>
                ) : (
                    <button onClick={handleAnalyze} className="bg-sky-600 text-white font-semibold py-1 px-3 rounded-md text-sm hover:bg-sky-700">
                        {t('turnover.generateButton')}
                    </button>
                )}
            </td>
        </tr>
    );
};

export default TurnoverReportRow;
