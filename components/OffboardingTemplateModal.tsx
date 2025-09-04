

import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';
import type { OffboardingTemplate, OffboardingTask, OffboardingTaskCategory, OffboardingResponsible } from '../types';
import { OFFBOARDING_TASK_CATEGORIES, OFFBOARDING_RESPONSIBLE_PARTIES } from '../constants';

interface OffboardingTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (template: OffboardingTemplate) => void;
    templateToEdit: OffboardingTemplate | null;
}

const OffboardingTemplateModal: React.FC<OffboardingTemplateModalProps> = ({ isOpen, onClose, onSave, templateToEdit }) => {
    const getInitialState = (): Omit<OffboardingTemplate, 'id'> => ({
        name: '',
        description: '',
        tasks: [{ title: '', category: 'تسليم العهدة', responsible: 'الموظف المغادر', dueOffsetDays: 0 }]
    });

    const [templateData, setTemplateData] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            setTemplateData(templateToEdit || getInitialState());
        }
    }, [isOpen, templateToEdit]);

    if (!isOpen) return null;
    
    const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTemplateData(prev => ({ ...prev, [name]: value }));
    };

    const handleTaskChange = (index: number, field: keyof Omit<OffboardingTask, 'id' | 'isCompleted' | 'dueDate'>, value: string | number) => {
        const newTasks = [...templateData.tasks];
        const taskToUpdate = { ...newTasks[index] };
        (taskToUpdate as any)[field] = value;
        newTasks[index] = taskToUpdate;
        setTemplateData(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleAddTask = () => {
        setTemplateData(prev => ({
            ...prev,
            tasks: [...prev.tasks, { title: '', category: 'تسليم العهدة', responsible: 'الموظف المغادر', dueOffsetDays: 0 }]
        }));
    };

    const handleRemoveTask = (index: number) => {
        setTemplateData(prev => ({
            ...prev,
            tasks: prev.tasks.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTemplate: OffboardingTemplate = {
            id: templateToEdit?.id || `template-off-${Date.now()}`,
            ...templateData,
        };
        onSave(finalTemplate);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{templateToEdit ? 'تعديل قالب إنهاء الخدمة' : 'إنشاء قالب إنهاء خدمة جديد'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={templateData.name}
                            onChange={handleMainChange}
                            placeholder="اسم القالب (مثال: خطة إنهاء خدمة للمبيعات)"
                            className="w-full p-2 border border-slate-300 rounded-lg"
                            required
                            spellCheck="true"
                        />
                        <textarea
                            name="description"
                            value={templateData.description}
                            onChange={handleMainChange}
                            placeholder="وصف موجز للقالب"
                            rows={2}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                            spellCheck="true"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto border-t border-b py-4 space-y-3">
                        <h3 className="font-bold text-slate-700">مهام القالب</h3>
                        {templateData.tasks.map((task, index) => (
                            <div key={index} className="p-3 bg-slate-50 rounded-lg border flex flex-col md:flex-row gap-2">
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={e => handleTaskChange(index, 'title', e.target.value)}
                                    placeholder={`عنوان المهمة ${index + 1}`}
                                    className="w-full p-1.5 border rounded"
                                    required
                                    spellCheck="true"
                                />
                                <select value={task.category} onChange={e => handleTaskChange(index, 'category', e.target.value)} className="w-full md:w-48 p-1.5 border rounded bg-white text-sm">
                                    {OFFBOARDING_TASK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <select value={task.responsible} onChange={e => handleTaskChange(index, 'responsible', e.target.value)} className="w-full md:w-48 p-1.5 border rounded bg-white text-sm">
                                    {OFFBOARDING_RESPONSIBLE_PARTIES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={task.dueOffsetDays}
                                        onChange={e => handleTaskChange(index, 'dueOffsetDays', Number(e.target.value))}
                                        className="w-20 p-1.5 border rounded text-center"
                                    />
                                    <span className="text-xs text-slate-600">أيام قبل المغادرة</span>
                                </div>
                                <button type="button" onClick={() => handleRemoveTask(index)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-full">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddTask} className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-800 mt-2">
                            <PlusCircleIcon className="w-5 h-5" />
                            <span>إضافة مهمة جديدة</span>
                        </button>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ القالب</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OffboardingTemplateModal;