import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { EmployeeProfile } from '../types';

const SENTIMENT_LEVELS = [
    { name: 'مرتفع (4-5)', min: 4, max: 5, color: '#10b981' },
    { name: 'متوسط (3-3.9)', min: 3, max: 3.99, color: '#0ea5e9' },
    { name: 'منخفض (1-2.9)', min: 1, max: 2.99, color: '#ef4444' },
];

const SentimentAnalysis: React.FC<{ teamMembers: EmployeeProfile[] }> = ({ teamMembers }) => {

    const analysis = useMemo(() => {
        if (teamMembers.length === 0) {
            return {
                averageSentiment: 0,
                distribution: [],
            };
        }

        const totalScore = teamMembers.reduce((acc, member) => acc + member.satisfactionSurveyScore, 0);
        const averageSentiment = parseFloat((totalScore / teamMembers.length).toFixed(1));

        const distribution = SENTIMENT_LEVELS.map(level => ({
            name: level.name,
            value: teamMembers.filter(m => m.satisfactionSurveyScore >= level.min && m.satisfactionSurveyScore <= level.max).length,
            color: level.color,
        })).filter(item => item.value > 0);

        return { averageSentiment, distribution };
    }, [teamMembers]);

    const getSentimentColor = (score: number) => {
        if (score >= 4) return 'text-emerald-500';
        if (score >= 3) return 'text-sky-500';
        return 'text-red-500';
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg h-full">
            <h2 className="text-xl font-bold mb-4 text-slate-700">تحليل المعنويات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-40px)]">
                 <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-base font-semibold text-slate-600 mb-2">متوسط معنويات الفريق</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-slate-200"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className={getSentimentColor(analysis.averageSentiment)}
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${analysis.averageSentiment * 20}, 100`}
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute flex flex-col">
                             <span className={`text-4xl font-bold ${getSentimentColor(analysis.averageSentiment)}`}>{analysis.averageSentiment}</span>
                             <span className="text-sm text-slate-500">من 5</span>
                        </div>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-base font-semibold text-slate-600 mb-2 text-center">توزيع المعنويات</h3>
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={analysis.distribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {analysis.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend 
                                iconSize={10}
                                layout="vertical" 
                                verticalAlign="middle" 
                                align="right" 
                                wrapperStyle={{ fontFamily: 'Cairo, sans-serif', fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>
    );
};

export default SentimentAnalysis;
