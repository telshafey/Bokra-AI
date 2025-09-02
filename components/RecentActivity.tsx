import React from 'react';
import type { RecentActivityItem } from '../types';
import { useTranslation } from './contexts/LanguageContext';


interface RecentActivityProps {
  activities: RecentActivityItem[];
  setActivePage: (page: string) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, setActivePage }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t('dashboard.recentActivity')}</h2>
      {activities.length > 0 ? (
        <ul className="space-y-2">
          {activities.map((activity) => (
            <li key={activity.id}>
              <button
                onClick={() => setActivePage(activity.pageKey)}
                className="w-full flex items-start gap-4 text-right p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full mt-1">
                    <activity.icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium" dangerouslySetInnerHTML={{ __html: activity.text }}></p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{activity.timestamp}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
         <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>{t('dashboard.noRecentActivity')}</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;