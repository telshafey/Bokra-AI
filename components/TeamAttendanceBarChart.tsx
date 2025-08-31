
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TeamWeeklyAttendanceItem } from '../types';

interface TeamAttendanceBarChartProps {
  data: TeamWeeklyAttendanceItem[];
}

const TeamAttendanceBarChart: React.FC<TeamAttendanceBarChartProps> = ({ data }) => {
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
        <XAxis dataKey="day" tick={{ fill: '#64748b' }} />
        <YAxis tick={{ fill: '#64748b' }} allowDecimals={false} />
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
        <Bar dataKey="present" stackId="a" fill="#10b981" name="حاضر" barSize={30} radius={[4, 4, 0, 0]} />
        <Bar dataKey="leave" stackId="a" fill="#f59e0b" name="إجازة" barSize={30} />
        <Bar dataKey="absent" stackId="a" fill="#ef4444" name="غائب" barSize={30} radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TeamAttendanceBarChart;