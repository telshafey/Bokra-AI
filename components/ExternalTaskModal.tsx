
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { ExternalTask, EmployeeProfile } from '../types';

interface ExternalTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: Omit<ExternalTask, 'id' | 'managerId' | 'status'>, taskId?: string) => void;
    taskToEdit: ExternalTask | null;
    teamMembers: EmployeeProfile[];
}

const ExternalTaskModal: React.FC<ExternalTaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, teamMembers }) => {
    
    const getInitialState = (): Omit<ExternalTask, 'id' | 'managerId' | 'status'> => ({
        employeeId: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
    });

    const [taskData, setTaskData] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setTaskData({
                    employeeId: taskToEdit.employeeId,
                    title: taskToEdit.title,
                    description: taskToEdit.description,
                    date: taskToEdit.date,
                    startTime: taskToEdit.startTime,
                    endTime: taskToEdit.endTime,
                });
            } else {
                setTaskData(getInitialState());
            }
        }
    }, [isOpen, taskToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskData.employeeId || !taskData.title.trim() || !taskData.startTime || !taskData.endTime) {
            alert('الرجاء اختيار موظف وإدخال عنوان وتوقيتات المهمة.');
            return;
        }
        onSave(taskData, taskToEdit?.id);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{taskToEdit ? 'تعديل المهمة' : 'إسناد مهمة خارجية جديدة'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الموظف</label>
                            <select name="employeeId" value={taskData.employeeId} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50" required>
                                <option value="">-- اختر موظف --</option>
                                {teamMembers.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ المهمة</label>
                            <input type="date" name="date" value={taskData.date} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">وقت البدء</label>
                            <input type="time" name="startTime" value={taskData.startTime} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">وقت الانتهاء</label>
                            <input type="time" name="endTime" value={taskData.endTime} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">عنوان المهمة</label>
                        <input type="text" name="title" value={taskData.title} onChange={handleChange} className="w-full p-2 border rounded-lg" required spellCheck="true" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">الوصف</label>
                        <textarea name="description" value={taskData.description} onChange={handleChange} rows={4} className="w-full p-2 border rounded-lg" spellCheck="true" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ المهمة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExternalTaskModal;