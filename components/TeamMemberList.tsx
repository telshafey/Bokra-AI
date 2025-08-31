
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
    <div className="bg-white h-full rounded-xl shadow-md flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-slate-700 mb-2">أعضاء الفريق</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن عضو بالفريق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-10 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelectMember(member.id)}
            className={`w-full text-right flex items-center gap-4 p-4 transition-colors duration-200 ${
              selectedMemberId === member.id
                ? 'bg-sky-100 border-r-4 border-sky-500'
                : 'hover:bg-slate-50'
            }`}
          >
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className={`font-semibold ${selectedMemberId === member.id ? 'text-sky-700' : 'text-slate-800'}`}>
                {member.name}
              </p>
              <p className="text-sm text-slate-500">{member.title}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamMemberList;
