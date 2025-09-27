import React, { useState } from 'react';
import { BellIcon, LanguageIcon, SunIcon, MoonIcon, LockClosedIcon, UserCircleIcon, KeyIcon, CogIcon, BuildingOfficeIcon, ArrowUpTrayIcon, QuestionMarkCircleIcon, LifebuoyIcon, ArrowLeftOnRectangleIcon } from './icons/Icons';
import ChangePasswordModal from './ChangePasswordModal';
import { EmployeeProfile } from '../types';
import { useTranslation } from './contexts/LanguageContext';
import Card from './Card';

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-slate-700 dark:text-slate-300 font-medium">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                enabled ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

interface SettingsPageProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    currentUser: EmployeeProfile;
    setActivePage: (page: string) => void;
    companyName: string;
    onCompanyNameChange: (name: string) => void;
}

type SettingsTab = 'mySettings' | 'display' | 'system';

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
            isActive
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
    >
        {label}
    </button>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, setTheme, currentUser, setActivePage, companyName, onCompanyNameChange }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<SettingsTab>('mySettings');
    const [notifications, setNotifications] = useState({
        approvals: true,
        reminders: true,
        announcements: false,
    });
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [editedCompanyName, setEditedCompanyName] = useState(companyName);

    const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
    };

    const handleCompanyNameSave = () => {
        if (editedCompanyName.trim() && editedCompanyName.trim() !== companyName) {
            onCompanyNameChange(editedCompanyName.trim());
        }
    };
    
     const LinkItem: React.FC<{
        label: string;
        subtitle: string;
        icon: React.FC<React.SVGProps<SVGSVGElement>>;
        iconColor: string;
        onClick: () => void;
    }> = ({ label, subtitle, icon: Icon, iconColor, onClick }) => (
        <button
            onClick={onClick}
            className="w-full text-center flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
            <Icon className={`w-8 h-8 ${iconColor}`} />
            <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
        </button>
    );

    const renderMySettings = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title={t('settingsPage.account.title')}>
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full"/>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser.title}</p>
                        </div>
                    </div>
                     <button onClick={() => setActivePage('sidebar.profile')} className="py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 text-sm whitespace-nowrap">
                        {t('settingsPage.account.viewProfile')}
                    </button>
                </div>
            </Card>

            <Card title={t('settingsPage.security.title')}>
                <div className="flex items-center justify-between py-3">
                    <div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{t('settingsPage.security.changePassword')}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('settingsPage.security.passwordHint')}</p>
                    </div>
                    <button 
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 text-sm whitespace-nowrap flex items-center gap-2">
                        <KeyIcon className="w-4 h-4"/>
                        <span>{t('general.change')}</span>
                    </button>
                </div>
            </Card>

             <Card title={t('settingsPage.links.title')} className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700 -m-6">
                    <LinkItem
                        icon={QuestionMarkCircleIcon}
                        label={t('sidebar.support')}
                        subtitle={t('settingsPage.links.supportSubtitle')}
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        onClick={() => setActivePage('sidebar.support')}
                    />
                    <LinkItem
                        icon={LifebuoyIcon}
                        label={t('sidebar.helpCenter')}
                        subtitle={t('settingsPage.links.helpCenterSubtitle')}
                        iconColor="text-sky-600 dark:text-sky-400"
                        onClick={() => setActivePage('sidebar.helpCenter')}
                    />
                    <LinkItem
                        icon={ArrowLeftOnRectangleIcon}
                        label={t('sidebar.logout')}
                        subtitle={t('settingsPage.links.logoutSubtitle')}
                        iconColor="text-red-600 dark:text-red-400"
                        onClick={() => alert('Logout action triggered!')}
                    />
                </div>
            </Card>

            <Card title={t('settingsPage.notifications.title')} className="md:col-span-2">
                <ToggleSwitch 
                    label={t('settingsPage.notifications.approvals')}
                    enabled={notifications.approvals}
                    setEnabled={(val) => handleNotificationChange('approvals', val)}
                />
                <ToggleSwitch 
                    label={t('settingsPage.notifications.reminders')}
                    enabled={notifications.reminders}
                    setEnabled={(val) => handleNotificationChange('reminders', val)}
                />
                <ToggleSwitch 
                    label={t('settingsPage.notifications.announcements')}
                    enabled={notifications.announcements}
                    setEnabled={(val) => handleNotificationChange('announcements', val)}
                />
            </Card>
        </div>
    );
    
    const renderDisplaySettings = () => (
        <Card title={t('settingsPage.display.title')}>
            <div className="py-3">
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">{t('settingsPage.display.theme')}</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setTheme('light')} className={`p-4 border-2 rounded-lg ${theme === 'light' ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        <div className="w-full h-16 bg-slate-100 rounded-md mb-2 flex items-center justify-center"><SunIcon className="w-8 h-8 text-amber-500" /></div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{t('settingsPage.display.light')}</span>
                    </button>
                     <button onClick={() => setTheme('dark')} className={`p-4 border-2 rounded-lg ${theme === 'dark' ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        <div className="w-full h-16 bg-slate-800 rounded-md mb-2 flex items-center justify-center"><MoonIcon className="w-8 h-8 text-primary-400" /></div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{t('settingsPage.display.dark')}</span>
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300 font-medium">{t('settingsPage.display.language')}</span>
                <select
                    value={t('language')}
                    className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white"
                    disabled
                >
                    <option value="ar">{t('settingsPage.display.arabic')}</option>
                    <option value="en">{t('settingsPage.display.english')}</option>
                </select>
            </div>
        </Card>
    );

    const renderSystemSettings = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title={t('settingsPage.company.title')}>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('settingsPage.company.subtitle')}</p>
                 <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('settingsPage.company.nameLabel')}</label>
                        <input
                            type="text"
                            value={editedCompanyName}
                            onChange={(e) => setEditedCompanyName(e.target.value)}
                            onBlur={handleCompanyNameSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleCompanyNameSave()}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white"
                            spellCheck="true"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('settingsPage.company.logoLabel')}</label>
                         <button className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-primary-500 hover:text-primary-600">
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            <span>{t('settingsPage.company.uploadLogo')}</span>
                        </button>
                     </div>
                 </div>
            </Card>
             <Card title={t('settingsPage.modules.title')}>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('settingsPage.modules.subtitle')}</p>
                 <button 
                    onClick={() => setActivePage('sidebar.moduleManagement')}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md">
                    <CogIcon className="w-5 h-5"/>
                    <span>{t('settingsPage.modules.button')}</span>
                </button>
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('settingsPage.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('settingsPage.subtitle')}</p>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700">
                <TabButton label={t('settingsPage.tabs.mySettings')} isActive={activeTab === 'mySettings'} onClick={() => setActiveTab('mySettings')} />
                <TabButton label={t('settingsPage.tabs.display')} isActive={activeTab === 'display'} onClick={() => setActiveTab('display')} />
                {(currentUser.role === 'Super Admin') && (
                    <TabButton label={t('settingsPage.tabs.system')} isActive={activeTab === 'system'} onClick={() => setActiveTab('system')} />
                )}
            </div>

            <div className="mt-6">
                {activeTab === 'mySettings' && renderMySettings()}
                {activeTab === 'display' && renderDisplaySettings()}
                {activeTab === 'system' && renderSystemSettings()}
            </div>
            
            <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} />
        </div>
    );
};

export default SettingsPage;