
import React from 'react';
import type { Stat } from '../types';
import { ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';

const StatCard: React.FC<Stat> = ({ title, value, icon: Icon, color, chartData, chartColor }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="flex items-center gap-6">
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
      </div>
      {chartData && chartData.length > 0 && chartColor && (
          <div className="h-16 -mb-2 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                      <Tooltip
                          cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                          contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '0.5rem',
                              fontSize: '12px',
                              padding: '4px 8px',
                          }}
                          labelStyle={{ display: 'none' }}
                          formatter={(value: number, name: string) => [`${value}h`, null]}
                      />
                      <Bar dataKey="value" fill={chartColor} barSize={10} radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
          </div>
      )}
    </div>
  );
};

export default StatCard;