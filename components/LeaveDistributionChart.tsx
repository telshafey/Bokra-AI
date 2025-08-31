import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { LeaveDistributionDataItem } from '../types';

interface LeaveDistributionChartProps {
    data: LeaveDistributionDataItem[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-700">{`${payload[0].payload.typeName}: ${payload[0].value} يوم`}</p>
        </div>
      );
    }
    return null;
};

const LeaveDistributionChart: React.FC<LeaveDistributionChartProps> = ({ data }) => {
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
                    nameKey="typeName"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
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

export default LeaveDistributionChart;