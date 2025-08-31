import React, { useState, useEffect } from 'react';
import { NAV_GROUPS, BOTTOM_NAV_ITEMS } from '../constants';
import type { NavItem, EmployeeProfile, NavGroup, AppModule } from '../types';
import { PencilSquareIcon, ChevronDownIcon, BriefcaseIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

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

const NavLink: React.FC<{ item: NavItem, isActive: boolean, onClick: () => void, isCollapsed: boolean }> = ({ item, isActive, onClick, isCollapsed }) => (
  <li>
    <a
      href={item.path}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`group relative flex items-center p-3 my-1 rounded-lg transition-colors duration-200 cursor-pointer ${
        isActive
          ? 'bg-sky-100 text-sky-700 font-bold'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      {isActive && !isCollapsed && <div className="absolute right-0 top-2 bottom-2 w-1 bg-sky-500 rounded-r-lg"></div>}
      <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className={`mr-4 whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100'}`}>{item.name}</span>
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
          {item.name}
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
}> = ({ group, activePage, setActivePage, isOpen, onToggle, isCollapsed }) => (
    <div className="mb-1">
        <button 
            onClick={onToggle}
            className={`w-full flex justify-between items-center p-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-200 ${isCollapsed ? 'hidden' : ''}`}
        >
            <h2 className="text-xs font-bold uppercase tracking-wider">
                {group.groupName}
            </h2>
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen || isCollapsed ? 'max-h-[500px]' : 'max-h-0'}`}>
            <ul className="pt-1">
                {group.items.map((item) => (
                   <NavLink 
                        key={item.name} 
                        item={item} 
                        isActive={activePage === item.name}
                        onClick={() => setActivePage(item.name)}
                        isCollapsed={isCollapsed}
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

  useEffect(() => {
    setEditedName(companyName);
  }, [companyName]);
  
  const filterNavItem = (item: NavItem) => {
    if (item.module && !activeModules.has(item.module)) return false;
    if (item.name === 'خطتي للتعيين' && !hasOnboardingProcess) return false;
    if (item.name === 'خطتي لإنهاء الخدمة' && !hasOffboardingProcess) return false;
    if (item.requiresEmployee && !currentUser.isEmployee) return false;
    if (item.roles && !item.roles.includes(currentUser.role)) return false;
    return true;
  };
  
  useEffect(() => {
      if (!isSidebarCollapsed) {
        const activeGroup = NAV_GROUPS.find(g => g.items.some(i => i.name === activePage));
        if (activeGroup) {
          setOpenGroups(prev => new Set(prev).add(activeGroup.groupName));
        }
      }
  }, [activePage, isSidebarCollapsed]);

  const toggleGroup = (groupName: string) => {
      setOpenGroups(prev => {
          const newSet = new Set(prev);
          if (newSet.has(groupName)) {
              newSet.delete(groupName);
          } else {
              newSet.add(groupName);
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
    <aside className={`bg-white h-screen flex flex-col p-4 sticky top-0 transition-all duration-300 border-l border-slate-200 ${isSidebarCollapsed ? 'w-20' : 'w-72'} overflow-y-auto`}>
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
                    className="w-full bg-slate-100 text-xl font-bold border-b-2 border-sky-500 focus:outline-none text-slate-800 p-1 rounded-t"
                    autoFocus
                />
            ) : (
                <div className="flex items-center group">
                    <h1 className="text-xl font-bold text-slate-800 whitespace-nowrap">{companyName}</h1>
                    {currentUser.role === 'Super Admin' && (
                        <button onClick={() => setIsEditingName(true)} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <PencilSquareIcon className="w-5 h-5 text-slate-400 hover:text-slate-700" />
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
                    key={group.groupName}
                    group={{...group, items: visibleItems}}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    isOpen={openGroups.has(group.groupName)}
                    onToggle={() => toggleGroup(group.groupName)}
                    isCollapsed={isSidebarCollapsed}
                />
            );
        })}
      </nav>
      
      <div className="mt-auto flex-shrink-0">
        <div className="p-4 border-t border-slate-100">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="font-semibold text-sm text-slate-800">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.isEmployee ? currentUser.title : currentUser.role}</p>
                </div>
            </div>
        </div>
        <ul>
          {filteredBottomNavItems.map((item) => (
             <NavLink 
                key={item.name} 
                item={item} 
                isActive={activePage === item.name}
                onClick={() => setActivePage(item.name)}
                isCollapsed={isSidebarCollapsed}
            />
          ))}
        </ul>
         <div className="pt-2 mt-2 border-t border-slate-100">
            <button
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label={isSidebarCollapsed ? "توسيع الشريط الجانبي" : "طي الشريط الجانبي"}
            >
                {isSidebarCollapsed ? <ChevronRightIcon className="w-6 h-6"/> : <ChevronLeftIcon className="w-6 h-6"/>}
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;