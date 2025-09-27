import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';
import { OffboardingTemplate, OffboardingTask, OffboardingTaskCategory, OffboardingResponsible } from '../types';
import { useTranslation } from './contexts/LanguageContext';
import { OFFBOARDING_TASK_CATEGORIES, OFFBOARDING_RESPONSIBLE_PARTIES } from '../constants';

interface OffboardingTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (template: OffboardingTemplate) => void;
    templateToEdit: OffboardingTemplate | null;
}

const OffboardingTemplateModal: React.FC<OffboardingTemplateModalProps> = ({ isOpen, onClose, onSave, templateToEdit }) => {
    const { t } = useTranslation();
    const getInitialState = (): Omit<OffboardingTemplate, 'id'> => ({
        name: '',
        description: '',
        tasks: [],
    });

    const [template, setTemplate] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            setTemplate(templateToEdit || getInitialState());
        }
    }, [isOpen, templateToEdit]);

    const handleTaskChange = (index: number, field: keyof Omit<OffboardingTask, 'id' | 'isCompleted' | 'dueDate'>, value: string | number) => {
        const newTasks = [...template.tasks];
        (newTasks[index] as any)[field] = value;
        setTemplate(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleAddTask = () => {
        const newTask: Omit<OffboardingTask, 'id' | 'isCompleted' | 'dueDate'> = {
            title: '',
            category: 'assetHandover',
            responsible: 'departingEmployee',
            dueOffsetDays: 0,
        };
        setTemplate(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    };
    
    const handleRemoveTask = (index: number) => {
        setTemplate(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: templateToEdit?.id || `off-t-${Date.now()}`, ...template });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{templateToEdit ? 'تعديل قالب' : 'إنشاء قالب جديد'}</h2>
                    <button type="button" onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    <input type="text" value={template.name} onChange={e => setTemplate(p => ({...p, name: e.target.value}))} placeholder="اسم القالب" className="w-full p-2 border rounded-lg" required />
                    <textarea value={template.description} onChange={e => setTemplate(p => ({...p, description: e.target.value}))} placeholder="وصف القالب" rows={2} className="w-full p-2 border rounded-lg" />
                    <h3 className="font-semibold text-lg text-slate-700">المهام</h3>
                    <div className="space-y-2">
                        {template.tasks.map((task, index) => (
                            <div key={index} className="p-2 bg-slate-50 border rounded-md grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                                <input type="text" value={task.title} onChange={e => handleTaskChange(index, 'title', e.target.value)} placeholder="عنوان المهمة" className="w-full p-1.5 border rounded col-span-2" />
                                <select value={task.category} onChange={e => handleTaskChange(index, 'category', e.target.value)} className="w-full p-1.5 border rounded bg-white">
                                    {OFFBOARDING_TASK_CATEGORIES.map(c => <option key={c} value={c}>{t(`offboarding.categories.${c}`)}</option>)}
                                </select>
                                <div className="flex items-center gap-1">
                                    <input type="number" value={task.dueOffsetDays} onChange={e => handleTaskChange(index, 'dueOffsetDays', Number(e.target.value))} className="w-full p-1.5 border rounded" />
                                    <button type="button" onClick={() => handleRemoveTask(index)} className="p-1 text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={handleAddTask} className="flex items-center gap-2 text-sm font-semibold text-sky-600"><PlusCircleIcon className="w-5 h-5"/> إضافة مهمة</button>
                </div>
                <div className="flex justify-end gap-4 pt-4 mt-4 border-t">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                    <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ القالب</button>
                </div>
            </form>
        </div>
    );
};

export default OffboardingTemplateModal;
