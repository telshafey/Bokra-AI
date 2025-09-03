import React, { useState } from 'react';
import type { ExternalTask } from '../types';
import { ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon, PlusCircleIcon } from './icons/Icons';
import RequestExternalTaskModal from './RequestExternalTaskModal';
import { useTranslation } from './contexts/LanguageContext';

const STATUS_BADGE_CLASSES: Record<ExternalTask['status'], string> = {
    PendingApproval: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    Approved: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
    InProgress: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300',
    Completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
};

const TaskCard: React.FC<{ task: ExternalTask; t: (key: string) => string; lang: 'ar' | 'en' }> = ({ task, t, lang }) => {
    const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
    const timeLocale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border-l-4 border-sky-500">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{task.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(task.date).toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${STATUS_BADGE_CLASSES[task.status]}`}>
                    {t(`myTasks.statuses.${task.status}`)}
                </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 my-3 pt-3 border-t dark:border-slate-700">{task.description}</p>
            {task.checkInTimestamp && (
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-emerald-500" /> {t('attendance.checkIn')}: {new Date(task.checkInTimestamp).toLocaleTimeString(timeLocale)}</p>
                    {task.checkOutTimestamp && (
                         <p className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-red-500" /> {t('attendance.checkOut')}: {new Date(task.checkOutTimestamp).toLocaleTimeString(timeLocale)}</p>
                    )}
                </div>
            )}
        </div>
    );
};

interface MyTasksPageProps {
    externalTasks: ExternalTask[];
    onNewRequest: (taskData: { title: string; description: string; date: string; startTime: string; endTime: string; }) => void;
}

const MyTasksPage: React.FC<MyTasksPageProps> = ({ externalTasks, onNewRequest }) => {
    const { t, language } = useTranslation();
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
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('myTasks.pageHeaderTitle')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('myTasks.pageHeaderSubtitle')}</p>
                </div>
                <button 
                    onClick={() => setIsRequestModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>{t('myTasks.newRequestButton')}</span>
                </button>
            </div>


            <section>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2"><ClockIcon className="w-6 h-6"/> {t('myTasks.upcomingHeader')}</h2>
                {pendingTasks.length > 0 ? (
                    <div className="space-y-4">
                        {pendingTasks.map(task => <TaskCard key={task.id} task={task} t={t} lang={language} />)}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                        <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-slate-400 mb-2"/>
                        <p className="font-semibold text-slate-600 dark:text-slate-300">{t('myTasks.noUpcoming')}</p>
                    </div>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2"><CheckCircleIcon className="w-6 h-6"/> {t('myTasks.completedHeader')}</h2>
                 {completedTasks.length > 0 ? (
                    <div className="space-y-4">
                        {completedTasks.map(task => <TaskCard key={task.id} task={task} t={t} lang={language} />)}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                         <p className="font-semibold text-slate-600 dark:text-slate-300">{t('myTasks.noCompleted')}</p>
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
