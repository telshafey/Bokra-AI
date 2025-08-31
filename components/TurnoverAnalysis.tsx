import React, { useState, useEffect } from 'react';
import { getTurnoverPrediction } from '../services/turnoverService';
import type { EmployeeProfile, TurnoverAnalysisResult, TurnoverRiskLevel } from '../types';
import { PresentationChartLineIcon } from './icons/Icons';

const RISK_STYLES: Record<TurnoverRiskLevel, { text: string; bg: string; border: string; }> = {
    Low: { text: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-500' },
    Medium: { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-500' },
    High: { text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-500' },
    Unknown: { text: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-500' },
};

const RISK_TRANSLATION: Record<TurnoverRiskLevel, string> = {
    Low: 'منخفض',
    Medium: 'متوسط',
    High: 'مرتفع',
    Unknown: 'غير معروف',
}

const TurnoverAnalysis: React.FC<{ employee: EmployeeProfile }> = ({ employee }) => {
    const [analysis, setAnalysis] = useState<TurnoverAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when employee changes
    useEffect(() => {
        setAnalysis(null);
        setIsLoading(false);
    }, [employee.id]);

    const handleAnalyze = async () => {
        setIsLoading(true);
        const result = await getTurnoverPrediction(employee);
        setAnalysis(result);
        setIsLoading(false);
    };
    
    const riskStyles = analysis ? RISK_STYLES[analysis.riskLevel] : RISK_STYLES['Unknown'];

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-700">تحليل احتمالية ترك العمل (AI)</h2>
            
            {analysis && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`md:col-span-1 p-6 rounded-xl flex flex-col items-center justify-center text-center ${riskStyles.bg} border-2 ${riskStyles.border}`}>
                         <h3 className="text-sm font-semibold text-slate-600 mb-2">مستوى الخطر المتوقع</h3>
                         <p className={`text-4xl font-bold ${riskStyles.text}`}>{RISK_TRANSLATION[analysis.riskLevel]}</p>
                         <p className={`text-lg font-semibold ${riskStyles.text}`}>({analysis.riskScore}%)</p>
                    </div>
                     <div className="md:col-span-2 bg-slate-50 p-6 rounded-xl">
                         <h3 className="font-bold text-slate-800 mb-3">العوامل الرئيسية المؤثرة</h3>
                         <ul className="space-y-2 list-disc pr-5">
                            {analysis.keyFactors.map((factor, index) => (
                                <li key={index} className="text-sm text-slate-700">{factor}</li>
                            ))}
                         </ul>
                    </div>
                </div>
            )}
           
            {!analysis && (
                 <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-xl">
                    {isLoading ? (
                        <div>
                            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="font-semibold text-slate-700">يقوم الذكاء الاصطناعي بتحليل البيانات...</p>
                            <p className="text-sm text-slate-500">قد يستغرق هذا بضع ثوانٍ.</p>
                        </div>
                    ) : (
                         <>
                            <PresentationChartLineIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                            <h3 className="text-lg font-bold text-slate-800">تحليل استباقي للمخاطر</h3>
                            <p className="text-slate-500 max-w-md mx-auto my-2">استخدم نموذج الذكاء الاصطناعي لتحليل العوامل المختلفة وتوقع احتمالية ترك الموظف للعمل، مما يساعدك على اتخاذ إجراءات وقائية.</p>
                            <button 
                                onClick={handleAnalyze}
                                className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                            >
                                توليد التحليل
                            </button>
                        </>
                    )}
                </div>
            )}

            {analysis && !isLoading && (
                 <div className="text-center mt-6">
                     <button 
                        onClick={handleAnalyze}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-5 rounded-lg transition-colors text-sm"
                    >
                        إعادة توليد التحليل
                    </button>
                </div>
            )}
           
        </div>
    );
};

export default TurnoverAnalysis;