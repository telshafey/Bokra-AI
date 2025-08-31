
import React, { useState } from 'react';
import { BellIcon } from './icons/Icons';
import { EmployeeProfile, Notification } from '../types';
import NotificationPanel from './NotificationPanel';

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
    onClearAll 
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const getWelcomeMessage = () => {
    if (['Super Admin', 'Admin'].includes(currentUser.role)) {
      return 'مرحباً، إليك نظرة شاملة على المنظومة.';
    }
    if (['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'].includes(currentUser.role)) {
      return `مرحباً ${currentUser.name}، إليك نظرة عامة على فريقك.`;
    }
    return `مرحباً بعودتك، ${currentUser.name}!`;
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
              <label htmlFor="user-switcher" className="text-sm font-semibold text-slate-600 dark:text-slate-300">تسجيل الدخول كـ:</label>
              <select
                  id="user-switcher"
                  value={currentUserId}
                  onChange={(e) => setCurrentUserId(e.target.value)}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              >
                  {allEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.isEmployee ? emp.title : emp.role})</option>
                  ))}
              </select>
          </div>

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
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.isEmployee ? currentUser.title : currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
