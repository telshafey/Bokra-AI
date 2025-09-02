import React from 'react';
import type { TeamMember } from '../types';

type AttendanceStatus = TeamMember['attendanceStatus'];

const STATUS_BADGE: Record<AttendanceStatus, string> = {
    Present: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    Absent: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
    Leave: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
};

const STATUS_TRANSLATION: Record<AttendanceStatus, string> = {
    Present: 'حاضر',
    Absent: 'غائب',
    Leave: 'إجازة',
}

const TeamAttendance: React.FC<{ members: TeamMember[] }> = ({ members }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">حالة حضور الفريق اليوم</h2>
      <ul className="space-y-3">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{member.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{member.title}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[member.attendanceStatus]}`}>
                {STATUS_TRANSLATION[member.attendanceStatus]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamAttendance;