import React from 'react';
import { BriefcaseIcon, BanknotesIcon, UserCircleIcon, DocumentTextIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

interface QuickActionsProps {
    setActivePage: (page: string) => void;
}

const ActionButton: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string; onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-400 transition-all duration-200 shadow-sm hover:shadow-md">
        <Icon className="w-8 h-8"/>
        <span className="text-sm font-semibold">{label}</span>
    </button>
);


const QuickActions: React.FC<QuickActionsProps> = ({ setActivePage }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700">{t('quickActions.title')}</h2>
      <div className="grid grid-cols-2 gap-4">
        <ActionButton icon={BriefcaseIcon} label={t('quickActions.requestLeave')} onClick={() => setActivePage('sidebar.leave')}/>
        <ActionButton icon={BanknotesIcon} label={t('quickActions.viewPayslip')} onClick={() => setActivePage('sidebar.payslip')}/>
        <ActionButton icon={UserCircleIcon} label={t('quickActions.updateProfile')} onClick={() => setActivePage('sidebar.profile')}/>
      </div>
    </div>
  );
};

export default QuickActions;
