import React from 'react';
import type { AppModule } from '../types';
import { CogIcon } from './icons/Icons';
import { ALL_MODULES_CONFIG } from '../constants';
import { useTranslation } from './contexts/LanguageContext';

interface ModuleManagementPageProps {
    activeModules: Set<AppModule>;
    onToggleModule: (moduleKey: AppModule) => void;
}

const ModuleToggle: React.FC<{ enabled: boolean; setEnabled: () => void }> = ({ enabled, setEnabled }) => (
    <button
        onClick={setEnabled}
        className={`relative inline-flex items-center h-7 rounded-full w-12 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
            enabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
    >
        <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ${
                enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);


const ModuleManagementPage: React.FC<ModuleManagementPageProps> = ({ activeModules, onToggleModule }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800">إدارة الوحدات الاختيارية</h1>
                <p className="text-slate-500 mt-1">تفعيل أو تعطيل الوحدات لتخصيص النظام حسب احتياجات شركتك.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
                 <div className="divide-y divide-slate-100">
                    {ALL_MODULES_CONFIG.map(module => (
                        <div key={module.key} className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{t(module.nameKey)}</h3>
                                <p className="text-sm text-slate-500">{t(module.descriptionKey)}</p>
                            </div>
                            <ModuleToggle 
                                enabled={activeModules.has(module.key)} 
                                setEnabled={() => onToggleModule(module.key)} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModuleManagementPage;