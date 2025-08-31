
import React from 'react';
import { UserGroupIcon, BriefcaseIcon, DocumentTextIcon } from './icons/Icons';

interface TeamStatsProps {
    teamSize: number;
    onLeave: number;
    attentionItemsCount: number;
}

const TeamStats: React.FC<TeamStatsProps> = ({ teamSize, onLeave, attentionItemsCount }) => {

    const stats = [
        {
            title: 'أعضاء الفريق',
            value: `${teamSize}`,
            icon: UserGroupIcon,
            color: 'bg-sky-500',
        },
        {
            title: 'في إجازة اليوم',
            value: `${onLeave}`,
            icon: BriefcaseIcon,
            color: 'bg-emerald-500',
        },
        {
            title: 'إجراءات مطلوبة',
            value: `${attentionItemsCount}`,
            icon: DocumentTextIcon,
            color: 'bg-amber-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
                <div key={stat.title} className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className={`p-4 rounded-full ${stat.color}`}>
                        <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeamStats;
