

import React, { useState } from 'react';
import { BellIcon, Bars3Icon, CogIcon } from './icons/Icons';
// FIX: Corrected import path to be a relative module import.
import { EmployeeProfile, Notification, Branch } from '../types';
import NotificationPanel from './NotificationPanel';
import { useTranslation } from './contexts/LanguageContext';


interface HeaderProps {
    pageTitle: string;
    currentUser: EmployeeProfile;
    allEmployees: EmployeeProfile[];
    currentUserId: string;
    setCurrentUserId: (id: string) => void;
    notifications: Notification[];
    unreadCount: number;
    onMarkAsRead: (notificationId: string) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
    branches: Branch[];
    setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    pageTitle, 
    currentUser, 
    allEmployees, 
    currentUserId, 
    setCurrentUserId,
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearAll,
    branches,
    setIsMobileSidebarOpen,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { t } = useTranslation();

  const getWelcomeMessage = () => {
    if (['Super Admin', 'Admin'].includes(currentUser.role)) {
      return t('header.welcomeAdmin');
    }
    if (['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'].includes(currentUser.role)) {
      return t('header.welcomeManager', { name: currentUser.name });
    }
    return t('header.welcome', { name: currentUser.name });
  };
  
  const getDisplayTitle = (employee: EmployeeProfile): string => {
    if (employee.role === 'Branch Admin') {
        const branch = branches.find(b => b.id === employee.branchId);
        if (branch) {
            const branchShortName = t(`branches_short.${branch.nameKey.split('.')[1]}`);
            return t('jobTitles.branchAdminShort', { branchName: branchShortName });
        }
    }
    return employee.isEmployee ? employee.title : employee.role;
  };


  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex-shrink-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden text-slate-500 dark:text-slate-400">
                <Bars3Icon className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{t(pageTitle.replace('sidebar.', 'pageTitles.'))}</h1>
                <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
                    {getWelcomeMessage()}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:block">
            <div className="relative group">
                <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:text-slate-400" aria-label={t('header.loginAs')}>
                    <CogIcon className="w-6 h-6"/>
                </button>
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-20 p-4">
                    <label htmlFor="user-switcher" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{t('header.loginAs')}</label>
                    <select
                        id="user-switcher"
                        value={currentUserId}
                        onChange={(e) => setCurrentUserId(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                        {allEmployees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} - {getDisplayTitle(emp)}</option>
                        ))}
                    </select>
                </div>
            </div>
          </div>


          <div className="relative">
            <button onClick={() => setIsPanelOpen(prev => !prev)} className="relative text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            {isPanelOpen && (
              <NotificationPanel
                  notifications={notifications}
                  allUsers={allEmployees}
                  onMarkAsRead={onMarkAsRead}
                  onMarkAllAsRead={onMarkAllAsRead}
                  onClearAll={onClearAll}
                  onClose={() => setIsPanelOpen(false)}
              />
            )}
          </div>
          
          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200 dark:border-slate-700">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
            />
            <div className="hidden md:block">
              <p className="font-semibold text-slate-700 dark:text-slate-200">{currentUser.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{getDisplayTitle(currentUser)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;