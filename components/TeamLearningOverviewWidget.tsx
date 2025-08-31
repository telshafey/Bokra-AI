import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TeamLearningStat } from '../types';

interface TeamLearningOverviewWidgetProps {
  stats: TeamLearningStat[];
}

const TeamLearningOverviewWidget: React.FC<TeamLearningOverviewWidgetProps> = ({ stats }) => {
    
    const getProgressColor = (progress: number) => {
        if (progress >= 75) return '#10b981'; // emerald
        if (progress >= 40) return '#0ea5e9'; // sky
        return '#f59e0b'; // amber
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-slate-700">نظرة عامة على تدريب الفريق</h2>
          <div className="h-64">
             {stats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={stats}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b' }} unit="%" />
                    <YAxis dataKey="name" type="category" width={60} tick={{ fill: '#334155', fontFamily: 'Cairo, sans-serif' }} />
                    <Tooltip
                        cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            fontFamily: 'Cairo, sans-serif'
                        }}
                    />
                    <Bar dataKey="progress" name="نسبة الإنجاز" barSize={20}>
                        {stats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getProgressColor(entry.progress)} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                    <p>لا توجد بيانات تدريب لعرضها.</p>
                </div>
             )}
          </div>
        </div>
    );
};

export default TeamLearningOverviewWidget;