import React, { useState } from 'react';
import { OnboardingTemplate } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from './icons/Icons';
import PageHeader from './PageHeader';
import Card from './Card';
import OnboardingTemplateModal from './OnboardingTemplateModal';
import { useTranslation } from './contexts/LanguageContext';

interface OnboardingTemplatesPageProps {
    templates: OnboardingTemplate[];
    onSave: (template: OnboardingTemplate) => void;
    onDelete: (templateId: string) => void;
}

const OnboardingTemplatesPage: React.FC<OnboardingTemplatesPageProps> = ({ templates, onSave, onDelete }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<OnboardingTemplate | null>(null);

    const handleOpenAddModal = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (template: OnboardingTemplate) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };
    
    return (
        <div className="space-y-6">
            <PageHeader
                title={t('pageTitles.onboardingTemplates')}
                subtitle="إنشاء وإدارة قوالب المهام للموظفين الجدد."
                actionButton={
                    <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg">
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>إنشاء قالب جديد</span>
                    </button>
                }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(template => (
                    <Card key={template.id} title={template.name} paddingClass="p-4">
                        <p className="text-sm text-slate-500 mb-4 h-10">{template.description}</p>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-sm font-semibold">{template.tasks.length} مهام</span>
                            <div className="flex items-center">
                                <button onClick={() => handleOpenEditModal(template)} className="p-2 text-slate-500 hover:text-sky-600"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => onDelete(template.id)} className="p-2 text-slate-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <OnboardingTemplateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSave}
                templateToEdit={editingTemplate}
            />
        </div>
    );
};

export default OnboardingTemplatesPage;
