import React, { useState } from 'react';
import { BellIcon, SunIcon, MoonIcon, LanguageIcon } from './icons/Icons';
import { EmployeeProfile, Notification, Branch } from '../types';
import NotificationPanel from './NotificationPanel';
import { useTranslation, Language } from './contexts/LanguageContext';


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
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    branches: Branch[];
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
    theme,
    setTheme,
    language,
    setLanguage,
    branches
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

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleLanguageToggle = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
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
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{pageTitle}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
              {getWelcomeMessage()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
              <label htmlFor="user-switcher" className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('header.loginAs')}</label>
              <select
                  id="user-switcher"
                  value={currentUserId}
                  onChange={(e) => setCurrentUserId(e.target.value)}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              >
                  {allEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} - {getDisplayTitle(emp)}</option>
                  ))}
              </select>
          </div>

          <button
            onClick={handleLanguageToggle}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={t('header.toggleLanguage')}
          >
            <LanguageIcon className="h-6 w-6" />
          </button>


          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={t('header.toggleTheme')}
          >
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>

          <div className="relative">
            <button onClick={() => setIsPanelOpen(prev => !prev)} className="relative text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors">
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
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
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-sky-500"
            />
            <div>
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