import React, { useState, useMemo } from 'react';
import { OnboardingTemplate, OnboardingProcess } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, UserGroupIcon, ClipboardDocumentCheckIcon } from './icons/Icons';
import OnboardingTemplateModal from './OnboardingTemplateModal';
import PageHeader from './PageHeader';

interface OnboardingTemplatesPageProps {
    onboardingTemplates: OnboardingTemplate[];
    onboardingProcesses: OnboardingProcess[];
    onSaveTemplate: (template: OnboardingTemplate) => void;
    onDeleteTemplate: (templateId: string) => void;
}

const OnboardingTemplatesPage: React.FC<OnboardingTemplatesPageProps> = ({
    onboardingTemplates,
    onboardingProcesses,
    onSaveTemplate,
    onDeleteTemplate,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<OnboardingTemplate | null>(null);

    const usageCountMap = useMemo(() => {
        return onboardingProcesses.reduce((acc, process) => {
            acc.set(process.templateId, (acc.get(process.templateId) || 0) + 1);
            return acc;
        }, new Map<string, number>());
    }, [onboardingProcesses]);

    const handleOpenAddModal = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (template: OnboardingTemplate) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const pageAction = (
        <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
        >
            <PlusCircleIcon className="w-6 h-6" />
            <span>إنشاء قالب جديد</span>
        </button>
    );
    
    return (
        <div className="space-y-6">
            <PageHeader 
                title="إدارة قوالب التعيين"
                subtitle="إنشاء وتخصيص خطط التعيين للمناصب المختلفة."
                actionButton={pageAction}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {onboardingTemplates.map(template => {
                    const usageCount = usageCountMap.get(template.id) || 0;
                    const canDelete = usageCount === 0;
                    return (
                        <div key={template.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{template.name}</h3>
                                <p className="text-sm text-slate-500 my-2 min-h-[40px]">{template.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-600 mt-4 pt-4 border-t">
                                    <div className="flex items-center gap-1.5">
                                        <ClipboardDocumentCheckIcon className="w-4 h-4 text-sky-600"/>
                                        <span>{template.tasks.length} مهام</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <UserGroupIcon className="w-4 h-4 text-emerald-600"/>
                                        <span>مستخدم بواسطة {usageCount} موظفين</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4">
                                <button onClick={() => handleOpenEditModal(template)} className="flex items-center gap-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-lg">
                                    <PencilIcon className="w-4 h-4"/>
                                    <span>تعديل</span>
                                </button>
                                <button 
                                    onClick={() => onDeleteTemplate(template.id)}
                                    disabled={!canDelete}
                                    className="flex items-center gap-2 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    title={!canDelete ? "لا يمكن حذف القالب لأنه قيد الاستخدام" : "حذف القالب"}
                                >
                                    <TrashIcon className="w-4 h-4"/>
                                    <span>حذف</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <OnboardingTemplateModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveTemplate}
                templateToEdit={editingTemplate}
            />
        </div>
    );
};

export default OnboardingTemplatesPage;