
import React from 'react';
import type { Stat } from '../types';

const StatCard: React.FC<Stat> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
