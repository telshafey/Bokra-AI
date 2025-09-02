
import React, { useState, useEffect } from 'react';
import { NAV_GROUPS, BOTTOM_NAV_ITEMS } from '../constants';
import type { NavItem, EmployeeProfile, NavGroup, AppModule } from '../types';
import { PencilSquareIcon, ChevronDownIcon, BriefcaseIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';


interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    companyName: string;
    onCompanyNameChange: (newName: string) => void;
    currentUser: EmployeeProfile;
    hasOnboardingProcess: boolean;
    hasOffboardingProcess: boolean;
    activeModules: Set<AppModule>;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
}

const NavLink: React.FC<{ item: NavItem, isActive: boolean, onClick: () => void, isCollapsed: boolean, t: (key: string) => string }> = ({ item, isActive, onClick, isCollapsed, t }) => (
  <li>
    <a
      href={item.path}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`group relative flex items-center p-3 my-1 rounded-lg transition-colors duration-200 cursor-pointer ${
        isActive
          ? 'bg-sky-100 text-sky-700 font-bold dark:bg-slate-700 dark:text-sky-400'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      {isActive && !isCollapsed && <div className="absolute right-0 top-2 bottom-2 w-1 bg-sky-500 rounded-r-lg"></div>}
      <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`} />
      <span className={`mr-4 whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100'}`}>{t(item.nameKey)}</span>
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none dark:bg-slate-900 dark:text-slate-200">
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


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, companyName, onCompanyNameChange, currentUser, hasOnboardingProcess, hasOffboardingProcess, activeModules, isSidebarCollapsed, toggleSidebar }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(companyName);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  useEffect(() => {
    setEditedName(companyName);
  }, [companyName]);
  
  const filterNavItem = (item: NavItem) => {
    if (item.module && !activeModules.has(item.module)) return false;
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

  const handleNameSave = () => {
    onCompanyNameChange(editedName);
    setIsEditingName(false);
  };
  
  const filteredBottomNavItems = BOTTOM_NAV_ITEMS.filter(filterNavItem);
  
  return (
    <aside className={`bg-white dark:bg-slate-800 h-screen flex flex-col p-4 sticky top-0 transition-all duration-300 border-l border-slate-200 dark:border-slate-700 ${isSidebarCollapsed ? 'w-20' : 'w-72'} overflow-y-auto`}>
      <div className="flex items-center gap-3 mb-8 px-2 flex-shrink-0">
        <div className="bg-sky-100 p-3 rounded-lg">
          <BriefcaseIcon className="w-7 h-7 text-sky-600"/>
        </div>
        <div className={`flex-1 transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            {isEditingName ? (
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    className="w-full bg-slate-100 dark:bg-slate-700 text-xl font-bold border-b-2 border-sky-500 focus:outline-none text-slate-800 dark:text-slate-100 p-1 rounded-t"
                    autoFocus
                />
            ) : (
                <div className="flex items-center group">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{companyName}</h1>
                    {currentUser.role === 'Super Admin' && (
                        <button onClick={() => setIsEditingName(true)} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <PencilSquareIcon className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300" />
                        </button>
                    )}
                </div>
            )}
        </div>
      </div>
      
      <nav className="flex-1">
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
        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.isEmployee ? currentUser.title : currentUser.role}</p>
                </div>
            </div>
        </div>
        <ul>
          {filteredBottomNavItems.map((item) => (
             <NavLink 
                key={item.nameKey} 
                item={item} 
                isActive={activePage === item.nameKey}
                onClick={() => setActivePage(item.nameKey)}
                isCollapsed={isSidebarCollapsed}
                t={t}
            />
          ))}
        </ul>
         <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
            <button
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label={t(isSidebarCollapsed ? "sidebar.toggleExpand" : "sidebar.toggleCollapse")}
            >
                {isSidebarCollapsed ? <ChevronRightIcon className="w-6 h-6"/> : <ChevronLeftIcon className="w-6 h-6"/>}
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
