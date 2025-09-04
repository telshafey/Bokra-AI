
import React, { useState } from 'react';
import type { EmployeeProfile } from '../types';
import { MagnifyingGlassIcon } from './icons/Icons';

interface TeamMemberListProps {
  members: EmployeeProfile[];
  selectedMemberId: string | null;
  onSelectMember: (id: string) => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({ members, selectedMemberId, onSelectMember }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 h-full rounded-xl shadow-md flex flex-col">
      <div className="p-4 border-b dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">أعضاء الفريق</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن عضو بالفريق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-10 border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            spellCheck="true"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelectMember(member.id)}
            className={`w-full text-right flex items-center gap-4 p-4 transition-colors duration-200 border-r-4 ${
              selectedMemberId === member.id
                ? 'bg-sky-100 border-sky-500 dark:bg-slate-700'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-transparent'
            }`}
          >
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className={`font-semibold ${selectedMemberId === member.id ? 'text-sky-700 dark:text-sky-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {member.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{member.title}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamMemberList;