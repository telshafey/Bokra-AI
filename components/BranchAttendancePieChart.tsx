
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BranchAttendancePieChartProps {
    present: number;
    onLeave: number;
    absent: number;
}

const COLORS = {
    present: '#10b981', // emerald
    onLeave: '#f59e0b', // amber
    absent: '#ef4444',  // red
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-700">{`${payload[0].name}: ${payload[0].value} موظف`}</p>
        </div>
      );
    }
    return null;
};

const BranchAttendancePieChart: React.FC<BranchAttendancePieChartProps> = ({ present, onLeave, absent }) => {
    const data = [
        { name: 'حاضر', value: present, fill: COLORS.present },
        { name: 'إجازة', value: onLeave, fill: COLORS.onLeave },
        { name: 'غائب', value: absent, fill: COLORS.absent },
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Legend 
                    iconSize={10} 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right" 
                    wrapperStyle={{ fontFamily: 'Cairo, sans-serif' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default BranchAttendancePieChart;
