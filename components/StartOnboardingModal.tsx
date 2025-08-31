
import React, { useState, useMemo } from 'react';
import { XMarkIcon } from './icons/Icons';
import { EmployeeProfile, OnboardingTemplate } from '../types';

interface StartOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (employeeId: string, templateId: string, startDate: string) => void;
    employees: EmployeeProfile[];
    templates: OnboardingTemplate[];
    activeProcessEmployeeIds: string[];
}

const StartOnboardingModal: React.FC<StartOnboardingModalProps> = ({ isOpen, onClose, onStart, employees, templates, activeProcessEmployeeIds }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [templateId, setTemplateId] = useState(templates[0]?.id || '');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const availableEmployees = useMemo(() => {
        return employees.filter(e => e.isEmployee && !activeProcessEmployeeIds.includes(e.id));
    }, [employees, activeProcessEmployeeIds]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId || !templateId || !startDate) {
            alert('يرجى تعبئة جميع الحقول.');
            return;
        }
        onStart(employeeId, templateId, startDate);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">بدء عملية تعيين لموظف جديد</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700 mb-1">اختر الموظف</label>
                        <select
                            id="employeeId"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                            required
                        >
                            <option value="" disabled>-- قائمة الموظفين المتاحين --</option>
                            {availableEmployees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name} ({emp.title})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="templateId" className="block text-sm font-medium text-slate-700 mb-1">اختر قالب التعيين</label>
                        <select
                            id="templateId"
                            value={templateId}
                            onChange={(e) => setTemplateId(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                            required
                        >
                            {templates.map(temp => (
                                <option key={temp.id} value={temp.id}>{temp.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">تاريخ بدء العمل</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">
                            بدء عملية التعيين
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StartOnboardingModal;
