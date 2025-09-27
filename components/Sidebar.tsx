import React, { useState, useEffect } from 'react';
import { NAV_GROUPS, BOTTOM_NAV_ITEMS } from '../constants';
import type { NavItem, EmployeeProfile, NavGroup, AppModule, Language } from '../types';
import { ChevronDownIcon, BuildingOfficeIcon, ChevronLeftIcon, ChevronRightIcon, SunIcon, MoonIcon, LanguageIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';


interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    companyName: string;
    currentUser: EmployeeProfile;
    hasOnboardingProcess: boolean;
    hasOffboardingProcess: boolean;
    activeModules: Set<AppModule>;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    isMobileSidebarOpen: boolean;
    setIsMobileSidebarOpen: (isOpen: boolean) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const NavLink: React.FC<{ item: NavItem, isActive: boolean, onClick: () => void, isCollapsed: boolean, t: (key: string) => string }> = ({ item, isActive, onClick, isCollapsed, t }) => (
  <li>
    <a
      href={item.path}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`group relative flex items-center gap-4 p-3 my-1 rounded-lg transition-colors duration-200 cursor-pointer ${
        isActive
          ? 'bg-primary-600 text-white font-semibold shadow-md dark:bg-primary-500'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      <item.icon className={`w-6 h-6 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`} />
      <span className={`whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100'}`}>{t(item.nameKey)}</span>
      {isCollapsed && (
        <div className="absolute start-full ms-4 px-2 py-1 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none dark:bg-slate-900 dark:text-slate-200">
          {t(item.nameKey)}
        </div>
      )}
    </a>
  </li>
);

const NavGroup: React.FC<{ 
    group: NavGroup, 
    activePage: string, 
    setActivePage: (page: string) => void,
    isOpen: boolean,
    onToggle: () => void,
    isCollapsed: boolean,
    t: (key: string) => string
}> = ({ group, activePage, setActivePage, isOpen, onToggle, isCollapsed, t }) => (
    <div className="mb-1">
        <button 
            onClick={onToggle}
            className={`w-full flex justify-between items-center p-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 ${isCollapsed ? 'hidden' : ''}`}
        >
            <h2 className="text-xs font-bold uppercase tracking-wider">
                {t(group.groupNameKey)}
            </h2>
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen || isCollapsed ? 'max-h-[500px]' : 'max-h-0'}`}>
            <ul className="pt-1">
                {group.items.map((item) => (
                   <NavLink 
                        key={item.nameKey} 
                        item={item} 
                        isActive={activePage === item.nameKey}
                        onClick={() => setActivePage(item.nameKey)}
                        isCollapsed={isCollapsed}
                        t={t}
                    />
                ))}
            </ul>
        </div>
    </div>
);


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, companyName, currentUser, hasOnboardingProcess, hasOffboardingProcess, activeModules, isSidebarCollapsed, toggleSidebar, isMobileSidebarOpen, setIsMobileSidebarOpen, theme, setTheme, language, setLanguage }) => {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const { t } = useTranslation();
  const isRTL = language === 'ar';

  const filterNavItem = (item: NavItem) => {
    if (item.module && !activeModules.has(item.module as AppModule)) return false;
    if (item.nameKey === 'sidebar.myOnboarding' && !hasOnboardingProcess) return false;
    if (item.nameKey === 'sidebar.myOffboarding' && !hasOffboardingProcess) return false;
    if (item.requiresEmployee && !currentUser.isEmployee) return false;
    if (item.roles && !item.roles.includes(currentUser.role)) return false;
    return true;
  };
  
  useEffect(() => {
      if (!isSidebarCollapsed) {
        const activeGroup = NAV_GROUPS.find(g => g.items.some(i => i.nameKey === activePage));
        if (activeGroup) {
          setOpenGroups(prev => new Set(prev).add(activeGroup.groupNameKey));
        }
      }
  }, [activePage, isSidebarCollapsed]);

  const toggleGroup = (groupNameKey: string) => {
      setOpenGroups(prev => {
          const newSet = new Set(prev);
          if (newSet.has(groupNameKey)) {
              newSet.delete(groupNameKey);
          } else {
              newSet.add(groupNameKey);
          }
          return newSet;
      });
  };
  
  const sidebarClasses = `
    fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-40 h-screen flex flex-col p-4 bg-white dark:bg-slate-800
    ${isRTL ? 'border-l border-slate-200 dark:border-slate-700' : 'border-r border-slate-200 dark:border-slate-700'} 
    transition-transform duration-300 ease-in-out 
    md:relative md:translate-x-0 md:h-auto
    ${isMobileSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
    ${isSidebarCollapsed ? 'md:w-20' : 'md:w-72'}
    w-64
  `;

    const handleLanguageToggle = () => setLanguage(language === 'ar' ? 'en' : 'ar');
    const handleThemeToggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const expandIcon = isRTL ? <ChevronLeftIcon className="w-6 h-6"/> : <ChevronRightIcon className="w-6 h-6"/>;
    const collapseIcon = isRTL ? <ChevronRightIcon className="w-6 h-6"/> : <ChevronLeftIcon className="w-6 h-6"/>;

  
  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center gap-3 mb-8 px-2 flex-shrink-0">
        <BuildingOfficeIcon className="w-8 h-8 text-primary-600 flex-shrink-0"/>
        <div className={`flex-1 transition-opacity duration-200 ${isSidebarCollapsed ? 'md:opacity-0' : 'opacity-100'}`}>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{companyName}</h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto -mr-2 pr-2">
        {NAV_GROUPS.map(group => {
            const visibleItems = group.items.filter(filterNavItem);
            if (visibleItems.length === 0) {
                return null;
            }
            return (
                <NavGroup 
                    key={group.groupNameKey}
                    group={{...group, items: visibleItems}}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    isOpen={openGroups.has(group.groupNameKey)}
                    onToggle={() => toggleGroup(group.groupNameKey)}
                    isCollapsed={isSidebarCollapsed}
                    t={t}
                />
            );
        })}
      </nav>
      
      <div className="mt-auto flex-shrink-0">
         {/* Combined Footer for Desktop */}
         <div className={`pt-2 mt-2 border-t border-slate-100 dark:border-slate-700 hidden md:flex items-center justify-between px-2`}>
            <div className={`flex items-center gap-1 transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button onClick={handleLanguageToggle} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={t('header.toggleLanguage')}>
                    <LanguageIcon className="h-5 w-5" />
                </button>
                <button onClick={handleThemeToggle} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={t('header.toggleTheme')}>
                    {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                </button>
            </div>
            
            <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label={t(isSidebarCollapsed ? "sidebar.toggleExpand" : "sidebar.toggleCollapse")}
            >
                {isSidebarCollapsed ? expandIcon : collapseIcon}
            </button>
        </div>

        {/* Footer for Mobile (always expanded, no collapse button) */}
        <div className={`md:hidden pt-2 mt-2 border-t border-slate-100 dark:border-slate-700`}>
            <div className="flex justify-around items-center">
                <button onClick={handleLanguageToggle} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={t('header.toggleLanguage')}>
                    <LanguageIcon className="h-6 w-6" />
                </button>
                <button onClick={handleThemeToggle} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={t('header.toggleTheme')}>
                    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                </button>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
