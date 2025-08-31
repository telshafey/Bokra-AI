import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Cell } from 'recharts';
import type { Goal, GoalStatus } from '../types';

const STATUS_STYLES: Record<GoalStatus, { fill: string; name: string; }> = {
    'Completed': { fill: '#10b981', name: 'مكتمل' },
    'On Track': { fill: '#0ea5e9', name: 'على المسار' },
    'At Risk': { fill: '#f59e0b', name: 'في خطر' },
    'Off Track': { fill: '#ef4444', name: 'خارج المسار' },
    'Draft': { fill: '#64748b', name: 'مسودة' },
};


const ProductivityAnalysis: React.FC<{ goals: Goal[] }> = ({ goals }) => {

    const analysis = useMemo(() => {
        if (goals.length === 0) {
            return {
                totalGoals: 0,
                completionRate: 0,
                statusCounts: [],
            };
        }
        
        const completedGoals = goals.filter(g => g.status === 'Completed').length;
        const completionRate = Math.round((completedGoals / goals.length) * 100);

        const statusCounts = Object.keys(STATUS_STYLES).map(status => ({
            name: STATUS_STYLES[status as GoalStatus].name,
            count: goals.filter(g => g.status === status).length,
            fill: STATUS_STYLES[status as GoalStatus].fill,
        })).filter(item => item.count > 0);

        return {
            totalGoals: goals.length,
            completionRate,
            statusCounts,
        };
    }, [goals]);
    
    const radialData = [{
        name: 'Completion',
        value: analysis.completionRate,
        fill: '#10b981'
    }];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg h-full">
            <h2 className="text-xl font-bold mb-4 text-slate-700">تحليل الإنتاجية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-40px)]">
                <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-base font-semibold text-slate-600 mb-2">معدل إنجاز الأهداف</h3>
                     <ResponsiveContainer width="100%" height={150}>
                        <RadialBarChart 
                            innerRadius="70%" 
                            outerRadius="100%" 
                            data={radialData} 
                            startAngle={90} 
                            endAngle={-270}
                        >
                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                angleAxisId={0}
                                tick={false}
                            />
                            <RadialBar
                                background
                                dataKey="value"
                                cornerRadius={10}
                            />
                             <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-emerald-600">
                                {`${analysis.completionRate}%`}
                            </text>
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <p className="text-sm text-slate-500 mt-2">{`من إجمالي ${analysis.totalGoals} هدف`}</p>
                </div>
                <div>
                     <h3 className="text-base font-semibold text-slate-600 mb-2 text-center">توزيع حالات الأهداف</h3>
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={analysis.statusCounts} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" allowDecimals={false} tick={{ fill: '#64748b' }} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#334155', fontFamily: 'Cairo, sans-serif' }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Bar dataKey="count" name="عدد الأهداف" barSize={20}>
                                 {analysis.statusCounts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProductivityAnalysis;