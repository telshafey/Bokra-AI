import React, { useState } from 'react';
import { BellIcon, LanguageIcon, SunIcon, MoonIcon, LockClosedIcon, UserCircleIcon, KeyIcon } from './icons/Icons';
import ChangePasswordModal from './ChangePasswordModal';
import { EmployeeProfile } from '../types';

type IconProps = React.SVGProps<SVGSVGElement>;

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-slate-700 dark:text-slate-300 font-medium">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
                enabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
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

const SettingsCard: React.FC<{ title: string; icon: React.FC<IconProps>; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
            <Icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{title}</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {children}
        </div>
    </div>
);

interface SettingsPageProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    currentUser: EmployeeProfile;
    setActivePage: (page: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, setTheme, currentUser, setActivePage }) => {
    const [notifications, setNotifications] = useState({
        approvals: true,
        reminders: true,
        announcements: false,
    });
    const [language, setLanguage] = useState('ar');
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6">
             <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">إعدادات التطبيق</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">تحكم في تفضيلاتك وخصص تجربتك.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsCard title="إعدادات الحساب" icon={UserCircleIcon}>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-4">
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full"/>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser.title}</p>
                            </div>
                        </div>
                         <button onClick={() => setActivePage('ملفي الشخصي')} className="py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 text-sm whitespace-nowrap">
                            عرض الملف الشخصي
                        </button>
                    </div>
                </SettingsCard>

                <SettingsCard title="الأمان والخصوصية" icon={LockClosedIcon}>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                            <p className="text-slate-700 dark:text-slate-300 font-medium">تغيير كلمة المرور</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">يوصى باستخدام كلمة مرور قوية لم تقم باستخدامها في أي مكان آخر.</p>
                        </div>
                        <button 
                            onClick={() => setIsChangePasswordModalOpen(true)}
                            className="py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 text-sm whitespace-nowrap flex items-center gap-2">
                            <KeyIcon className="w-4 h-4"/>
                            <span>تغيير</span>
                        </button>
                    </div>
                </SettingsCard>

                <SettingsCard title="تفضيلات الإشعارات" icon={BellIcon}>
                    <ToggleSwitch 
                        label="الموافقات على الطلبات"
                        enabled={notifications.approvals}
                        setEnabled={(val) => handleNotificationChange('approvals', val)}
                    />
                    <ToggleSwitch 
                        label="تذكيرات المهام والأهداف"
                        enabled={notifications.reminders}
                        setEnabled={(val) => handleNotificationChange('reminders', val)}
                    />
                    <ToggleSwitch 
                        label="إعلانات الشركة العامة"
                        enabled={notifications.announcements}
                        setEnabled={(val) => handleNotificationChange('announcements', val)}
                    />
                </SettingsCard>

                <SettingsCard title="إعدادات اللغة والمظهر" icon={LanguageIcon}>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">لغة التطبيق</span>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        >
                            <option value="ar">العربية</option>
                            <option value="en" disabled>English (Coming Soon)</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">مظهر التطبيق</span>
                        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <button 
                                onClick={() => setTheme('light')}
                                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold transition-colors ${theme === 'light' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                <SunIcon className="w-5 h-5"/>
                                <span>فاتح</span>
                            </button>
                            <button 
                                onClick={() => setTheme('dark')}
                                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold transition-colors ${theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                <MoonIcon className="w-5 h-5"/>
                                <span>داكن</span>
                            </button>
                        </div>
                    </div>
                </SettingsCard>
            </div>
            
            <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} />
        </div>
    );
};

export default SettingsPage;