import React from 'react';
import { BriefcaseIcon, BanknotesIcon, UserCircleIcon, DocumentTextIcon } from './icons/Icons';

interface QuickActionsProps {
    setActivePage: (page: string) => void;
}

const ActionButton: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string; onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 rounded-lg text-slate-600 hover:bg-sky-100 hover:text-sky-700 transition-all duration-200 shadow-sm hover:shadow-md">
        <Icon className="w-8 h-8"/>
        <span className="text-sm font-semibold">{label}</span>
    </button>
);


const QuickActions: React.FC<QuickActionsProps> = ({ setActivePage }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700">إجراءات سريعة</h2>
      <div className="grid grid-cols-2 gap-4">
        <ActionButton icon={BriefcaseIcon} label="طلب إجازة" onClick={() => setActivePage('الإجازات')}/>
        <ActionButton icon={BanknotesIcon} label="عرض الراتب" onClick={() => setActivePage('كشف الراتب')}/>
        <ActionButton icon={UserCircleIcon} label="تحديث ملفي" onClick={() => setActivePage('ملفي الشخصي')}/>
      </div>
    </div>
  );
};

export default QuickActions;