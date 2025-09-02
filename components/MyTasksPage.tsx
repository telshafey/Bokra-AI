import React, { useState } from 'react';
import type { ExternalTask } from '../types';
import { ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon, PlusCircleIcon } from './icons/Icons';
import RequestExternalTaskModal from './RequestExternalTaskModal';

interface MyTasksPageProps {
    externalTasks: ExternalTask[];
    onNewRequest: (taskData: { title: string; description: string; date: string; startTime: string; endTime: string; }) => void;
}

const STATUS_BADGE_CLASSES: Record<ExternalTask['status'], string> = {
    PendingApproval: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    Approved: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
    InProgress: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300',
    Completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
};

const STATUS_TRANSLATION: Record<ExternalTask['status'], string> = {
    PendingApproval: 'بانتظار الموافقة',
    Approved: 'قادمة',
    Rejected: 'مرفوضة',
    InProgress: 'قيد التنفيذ',
    Completed: 'مكتملة',
    Cancelled: 'ملغاة',
};

const TaskCard: React.FC<{ task: ExternalTask }> = ({ task }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border-l-4 border-sky-500">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{task.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(task.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${STATUS_BADGE_CLASSES[task.status]}`}>
                    {STATUS_TRANSLATION[task.status]}
                </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 my-3 pt-3 border-t dark:border-slate-700">{task.description}</p>
            {task.checkInTimestamp && (
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-emerald-500" /> تسجيل الحضور: {new Date(task.checkInTimestamp).toLocaleTimeString('ar-EG-u-nu-latn')}</p>
                    {task.checkOutTimestamp && (
                         <p className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-red-500" /> تسجيل الانصراف: {new Date(task.checkOutTimestamp).toLocaleTimeString('ar-EG-u-nu-latn')}</p>
                    )}
                </div>
            )}
        </div>
    );
};

const MyTasksPage: React.FC<MyTasksPageProps> = ({ externalTasks, onNewRequest }) => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const pendingTasks = externalTasks.filter(t => t.status === 'PendingApproval' || t.status === 'Approved' || t.status === 'InProgress');
    const completedTasks = externalTasks.filter(t => t.status === 'Completed' || t.status === 'Cancelled' || t.status === 'Rejected');
    
    const handleNewRequestSubmit = (taskData: { title: string; description: string; date: string; startTime: string; endTime: string; }) => {
        onNewRequest(taskData);
        setIsRequestModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">مهامي الخارجية</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">عرض وطلب المهام الخارجية المسندة إليك.</p>
                </div>
                <button 
                    onClick={() => setIsRequestModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>طلب مهمة خارجية جديدة</span>
                </button>
            </div>


            <section>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2"><ClockIcon className="w-6 h-6"/> المهام القادمة والحالية</h2>
                {pendingTasks.length > 0 ? (
                    <div className="space-y-4">
                        {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                        <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-slate-400 mb-2"/>
                        <p className="font-semibold text-slate-600 dark:text-slate-300">لا توجد مهام قادمة أو حالية.</p>
                    </div>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2"><CheckCircleIcon className="w-6 h-6"/> سجل المهام المكتملة</h2>
                 {completedTasks.length > 0 ? (
                    <div className="space-y-4">
                        {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                         <p className="font-semibold text-slate-600 dark:text-slate-300">لا يوجد سجل للمهام المكتملة بعد.</p>
                    </div>
                )}
            </section>

            <RequestExternalTaskModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                onSubmit={handleNewRequestSubmit}
            />
        </div>
    );
};

export default MyTasksPage;