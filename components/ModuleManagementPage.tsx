import React from 'react';
import type { AppModule } from '../types';
import { ShieldCheckIcon } from './icons/Icons';
import { MAIN_MODULES_CONFIG, OPTIONAL_MODULES_CONFIG } from '../constants';
import { useTranslation } from './contexts/LanguageContext';
import Card from './Card';
import PageHeader from './PageHeader';

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


interface ModuleManagementPageProps {
    activeModules: Set<AppModule>;
    onToggleModule: (moduleKey: AppModule) => void;
}

const ModuleManagementPage: React.FC<ModuleManagementPageProps> = ({ activeModules, onToggleModule }) => {
    const { t } = useTranslation();

    const handleCombinedToggle = () => {
        // Toggle both onboarding and offboarding modules together
        const areOnboardingModulesEnabled = activeModules.has('onboarding') && activeModules.has('offboarding');
        if (areOnboardingModulesEnabled) {
            onToggleModule('onboarding');
            onToggleModule('offboarding');
        } else {
            // If one or none are active, activate both
            if (!activeModules.has('onboarding')) onToggleModule('onboarding');
            if (!activeModules.has('offboarding')) onToggleModule('offboarding');
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title={t('pageTitles.moduleManagement')}
                subtitle={t('modules.optional.subtitle')}
            />

            <Card title={t('modules.main.title')}>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('modules.main.subtitle')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MAIN_MODULES_CONFIG.map(module => (
                        <div key={module.key} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-start gap-4">
                            <ShieldCheckIcon className="w-8 h-8 text-emerald-500 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100">{t(module.nameKey)}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{t(module.descriptionKey)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title={t('modules.optional.title')}>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {OPTIONAL_MODULES_CONFIG.map(module => {
                        let isEnabled: boolean;
                        let toggleHandler: () => void;

                        if (module.key === 'onboarding/offboarding') {
                            isEnabled = activeModules.has('onboarding') && activeModules.has('offboarding');
                            toggleHandler = handleCombinedToggle;
                        } else {
                            isEnabled = activeModules.has(module.key as AppModule);
                            toggleHandler = () => onToggleModule(module.key as AppModule);
                        }

                        return (
                            <div key={module.key} className="flex items-center justify-between py-4">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{t(module.nameKey)}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t(module.descriptionKey)}</p>
                                </div>
                                <ModuleToggle 
                                    enabled={isEnabled} 
                                    setEnabled={toggleHandler} 
                                />
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default ModuleManagementPage;