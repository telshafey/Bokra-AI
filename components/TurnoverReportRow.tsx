import React, { useState } from 'react';
import { EmployeeProfile, TurnoverAnalysisResult, TurnoverRiskLevel } from '../types';
import { getTurnoverPrediction } from '../services/turnoverService';

const RISK_STYLES: Record<TurnoverRiskLevel, { text: string; bg: string; }> = {
    Low: { text: 'text-emerald-800', bg: 'bg-emerald-100' },
    Medium: { text: 'text-amber-800', bg: 'bg-amber-100' },
    High: { text: 'text-red-800', bg: 'bg-red-100' },
    Unknown: { text: 'text-slate-800', bg: 'bg-slate-100' },
};

const RISK_TRANSLATION: Record<TurnoverRiskLevel, string> = {
    Low: 'منخفض',
    Medium: 'متوسط',
    High: 'مرتفع',
    Unknown: 'غير معروف',
}

interface TurnoverReportRowProps {
    employee: EmployeeProfile;
}

const TurnoverReportRow: React.FC<TurnoverReportRowProps> = ({ employee }) => {
    const [analysis, setAnalysis] = useState<TurnoverAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        const result = await getTurnoverPrediction(employee);
        setAnalysis(result);
        setIsLoading(false);
    };
    
    return (
         <tr className="bg-white border-b hover:bg-slate-50">
            <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap align-top">
                <div className="flex items-center gap-3">
                    <img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p>{employee.name}</p>
                        <p className="text-xs text-slate-500">{employee.title}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-slate-500">
                        <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري التحليل...</span>
                    </div>
                ) : analysis ? (
                    <div className="space-y-2">
                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${RISK_STYLES[analysis.riskLevel].bg} ${RISK_STYLES[analysis.riskLevel].text}`}>
                            مستوى الخطر: {RISK_TRANSLATION[analysis.riskLevel]} ({analysis.riskScore}%)
                        </span>
                        <ul className="list-disc pr-4 text-xs text-slate-600">
                            {analysis.keyFactors.map((factor, i) => <li key={i}>{factor}</li>)}
                        </ul>
                    </div>
                ) : (
                    <button onClick={handleAnalyze} className="bg-sky-600 text-white font-semibold py-1 px-3 rounded-md text-sm hover:bg-sky-700">
                        توليد التحليل
                    </button>
                )}
            </td>
        </tr>
    );
};

export default TurnoverReportRow;