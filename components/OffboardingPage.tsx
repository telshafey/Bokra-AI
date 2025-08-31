
import React, { useState, useMemo } from 'react';
import { OffboardingProcess, OffboardingTemplate, EmployeeProfile, OffboardingTask, OffboardingTaskCategory } from '../types';
import { UserMinusIcon } from './icons/Icons';
import StartOffboardingModal from './StartOffboardingModal';

interface OffboardingPageProps {
    offboardingProcesses: OffboardingProcess[];
    offboardingTemplates: OffboardingTemplate[];
    employees: EmployeeProfile[];
    onStartOffboarding: (employeeId: string, templateId: string, lastDay: string) => void;
    onUpdateTask: (processId: string, taskId: string, isCompleted: boolean) => void;
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-slate-200 rounded-full h-2">
        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${value}%` }}></div>
    </div>
);

const OffboardingPage: React.FC<OffboardingPageProps> = ({ offboardingProcesses, offboardingTemplates, employees, onStartOffboarding, onUpdateTask }) => {
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(offboardingProcesses[0]?.id || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const enrichedProcesses = useMemo(() => {
        return offboardingProcesses.map(process => {
            const employee = employeeMap.get(process.employeeId);
            if (!employee) return null;

            const totalTasks = process.tasks.length;
            const completedTasks = process.tasks.filter(t => t.isCompleted).length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            return {
                ...process,
                employee,
                progress,
            };
        }).filter(Boolean);
    }, [offboardingProcesses, employeeMap]);

    const selectedProcess = useMemo(() => {
        return enrichedProcesses.find(p => p?.id === selectedProcessId) || null;
    }, [selectedProcessId, enrichedProcesses]);

    const tasksByCategory = useMemo(() => {
        if (!selectedProcess) return new Map();
        return selectedProcess.tasks.reduce((acc, task) => {
            if (!acc.has(task.category)) {
                acc.set(task.category, []);
            }
            acc.get(task.category)!.push(task);
            return acc;
        }, new Map<OffboardingTaskCategory, OffboardingTask[]>());
    }, [selectedProcess]);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">إدارة إنهاء الخدمة</h1>
                    <p className="text-slate-500">متابعة خطط مغادرة الموظفين.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                >
                    <UserMinusIcon className="w-6 h-6" />
                    <span>بدء إنهاء خدمة لموظف</span>
                </button>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Master: Offboarding List */}
                <div className="w-1/3 xl:w-1/4">
                    <div className="bg-white h-full rounded-xl shadow-md flex flex-col">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-bold text-slate-700">الموظفون المغادرون ({enrichedProcesses.length})</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {enrichedProcesses.map(process => (
                                <button
                                    key={process.id}
                                    onClick={() => setSelectedProcessId(process.id)}
                                    className={`w-full text-right p-4 transition-colors duration-200 border-r-4 ${
                                        selectedProcessId === process.id ? 'bg-red-50 border-red-500' : 'hover:bg-slate-50 border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={process.employee.avatarUrl} alt={process.employee.name} className="w-12 h-12 rounded-full" />
                                        <div className="flex-1">
                                            <p className={`font-semibold ${selectedProcessId === process.id ? 'text-red-700' : 'text-slate-800'}`}>{process.employee.name}</p>
                                            <p className="text-sm text-slate-500">{process.employee.title}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                            <span>التقدم</span>
                                            <span>{process.progress}%</span>
                                        </div>
                                        <ProgressBar value={process.progress} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detail: Offboarding Plan */}
                <div className="flex-1">
                    <div className="bg-white h-full rounded-xl shadow-md flex flex-col">
                        {selectedProcess ? (
                            <>
                                <div className="p-4 border-b">
                                    <h2 className="text-xl font-bold text-slate-800">خطة إنهاء خدمة: {selectedProcess.employee.name}</h2>
                                    <p className="text-sm text-slate-500">آخر يوم عمل: {new Date(selectedProcess.lastDay).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {Array.from(tasksByCategory.entries()).map(([category, tasks]) => (
                                        <div key={category}>
                                            <h3 className="font-bold text-slate-700 mb-3 border-b pb-2">{category}</h3>
                                            <div className="space-y-3">
                                                {tasks.map(task => (
                                                    <div key={task.id} className={`p-3 rounded-lg flex items-center justify-between ${task.isCompleted ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={task.isCompleted}
                                                                onChange={(e) => onUpdateTask(selectedProcess.id, task.id, e.target.checked)}
                                                                className="form-checkbox h-5 w-5 text-emerald-600 rounded"
                                                            />
                                                            <div>
                                                                <p className={`font-medium ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>{task.title}</p>
                                                                <p className="text-xs text-slate-500">
                                                                    المسؤول: {task.responsible} | الاستحقاق: {task.dueDate}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <p>الرجاء اختيار موظف لعرض خطة إنهاء الخدمة الخاصة به.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <StartOffboardingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStart={onStartOffboarding}
                employees={employees}
                templates={offboardingTemplates}
                activeProcessEmployeeIds={offboardingProcesses.map(p => p.employeeId)}
            />
        </div>
    );
};

export default OffboardingPage;
