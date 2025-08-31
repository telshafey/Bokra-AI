import React from 'react';
import type { RecentActivityItem } from '../types';

interface RecentActivityProps {
  activities: RecentActivityItem[];
  setActivePage: (page: string) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, setActivePage }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700">آخر النشاطات</h2>
      {activities.length > 0 ? (
        <ul className="space-y-2">
          {activities.map((activity) => (
            <li key={activity.id}>
              <button
                onClick={() => setActivePage(activity.page)}
                className="w-full flex items-start gap-4 text-right p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="bg-slate-100 p-2 rounded-full mt-1">
                    <activity.icon className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 font-medium" dangerouslySetInnerHTML={{ __html: activity.text }}></p>
                  <p className="text-xs text-slate-400">{activity.timestamp}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
         <div className="text-center py-8 text-slate-500">
            <p>لا توجد نشاطات حديثة.</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;