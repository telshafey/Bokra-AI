
import React, { useMemo } from 'react';
import { OnboardingProcess, OnboardingTask, OnboardingTaskCategory } from '../types';

interface MyOnboardingPageProps {
    process: OnboardingProcess;
    onUpdateTask: (processId: string, taskId: string, isCompleted: boolean) => void;
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${value}%` }}></div>
    </div>
);

const MyOnboardingPage: React.FC<MyOnboardingPageProps> = ({ process, onUpdateTask }) => {
    
    const { progress, tasksByCategory } = useMemo(() => {
        const totalTasks = process.tasks.length;
        const completedTasks = process.tasks.filter(t => t.isCompleted).length;
        const progressValue = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        const categorizedTasks = process.tasks.reduce((acc, task) => {
            if (!acc.has(task.category)) {
                acc.set(task.category, []);
            }
            acc.get(task.category)!.push(task);
            return acc;
        }, new Map<OnboardingTaskCategory, OnboardingTask[]>());

        return { progress: progressValue, tasksByCategory: categorizedTasks };
    }, [process]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h1 className="text-3xl font-bold text-slate-800">مرحباً بك في فريقنا!</h1>
                <p className="text-slate-500 mt-2">نحن سعداء بانضمامك. إليك خطة مهامك الأولى لمساعدتك على البدء.</p>
                <div className="mt-4 max-w-lg mx-auto">
                    <div className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
                        <span>التقدم في إنجاز المهام</span>
                        <span>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="space-y-6">
                    {Array.from(tasksByCategory.entries()).map(([category, tasks]) => (
                        <div key={category}>
                            <h3 className="font-bold text-slate-700 mb-3 border-b pb-2 text-lg">{category}</h3>
                            <div className="space-y-3">
                                {tasks.map(task => {
                                    const isEmployeeResponsible = task.responsible === 'الموظف الجديد';
                                    return (
                                        <div key={task.id} className={`p-3 rounded-lg flex items-center justify-between ${task.isCompleted ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={task.isCompleted}
                                                    onChange={(e) => isEmployeeResponsible && onUpdateTask(process.id, task.id, e.target.checked)}
                                                    disabled={!isEmployeeResponsible}
                                                    className="form-checkbox h-5 w-5 text-emerald-600 rounded disabled:bg-slate-300 disabled:cursor-not-allowed"
                                                />
                                                <div>
                                                    <p className={`font-medium ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>{task.title}</p>
                                                    <p className="text-xs text-slate-500">
                                                        المسؤول: {task.responsible} | الاستحقاق: {task.dueDate}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyOnboardingPage;
