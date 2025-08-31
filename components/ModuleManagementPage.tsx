import React from 'react';
import type { AppModule } from '../types';
import { CogIcon } from './icons/Icons';

interface ModuleManagementPageProps {
    activeModules: Set<AppModule>;
    onToggleModule: (moduleKey: AppModule) => void;
}

const ALL_MODULES_CONFIG: { key: AppModule; name: string; description: string }[] = [
    { key: 'performance', name: 'إدارة الأداء', description: 'يشمل تقييمات الأداء، الأهداف، المتابعة الشهرية، وتحليل المخاطر.' },
    { key: 'learning', name: 'التطوير والتدريب', description: 'إدارة الدورات التدريبية الداخلية والخارجية وخطط التطوير للموظفين.' },
    { key: 'recruitment', name: 'التوظيف وإدارة المتقدمين', description: 'إدارة الوظائف الشاغرة ومتابعة المتقدمين عبر مراحل التوظيف.' },
    { key: 'onboarding', name: 'إجراءات التعيين', description: 'إنشاء ومتابعة خطط ومهام الموظفين الجدد.' },
    { key: 'offboarding', name: 'إجراءات إنهاء الخدمة', description: 'إدارة ومتابعة مهام الموظفين المغادرين.' },
    { key: 'support', name: 'تذاكر الدعم الفني', description: 'نظام متكامل لتلقي ومعالجة استفسارات وشكاوى الموظفين.' },
    { key: 'compensation', name: 'التعويضات والمزايا', description: 'إدارة مكونات الرواتب وإنشاء حزم مالية مختلفة.' },
    { key: 'job_titles', name: 'الهيكل الوظيفي', description: 'بناء وإدارة شجرة المسميات الوظيفية للشركة.' },
    { key: 'documents', name: 'المستندات والأوراق', description: 'إدارة المستندات الرسمية للموظفين مثل العقود ومسوغات التعيين.' },
];

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
                                <h3 className="font-bold text-slate-800 text-lg">{module.name}</h3>
                                <p className="text-sm text-slate-500">{module.description}</p>
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
