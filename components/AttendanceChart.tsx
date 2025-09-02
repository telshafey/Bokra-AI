

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from './contexts/LanguageContext';

interface AttendanceChartProps {
  data: { name: string; hours: number }[];
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
        <YAxis tick={{ fill: '#64748b' }} label={{ value: t('attendance.yAxisLabel'), angle: -90, position: 'insideLeft', fill: '#334155', dx: 10 }} />
        <Tooltip
          cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontFamily: 'Cairo, sans-serif'
          }}
        />
        <Legend wrapperStyle={{ fontFamily: 'Cairo, sans-serif'}} />
        <Bar dataKey="hours" fill="#0ea5e9" name={t('attendance.barLabel')} barSize={30} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
