import React, { useState, useMemo } from 'react';
import type { EmployeeProfile, ExternalTask } from '../types';
import { PlusCircleIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';
import ExternalTaskModal from './ExternalTaskModal';

interface ExternalTasksPageProps {
    teamMembers: EmployeeProfile[];
    externalTasks: ExternalTask[];
    onSaveTask: (taskData: Omit<ExternalTask, 'id' | 'managerId' | 'status'>, taskId?: string) => void;
    onRequestAction: (taskId: string, action: 'Approve' | 'Reject') => void;
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
    Approved: 'موافق عليها',
    Rejected: 'مرفوضة',
    InProgress: 'قيد التنفيذ',
    Completed: 'مكتملة',
    Cancelled: 'ملغاة',
};


const ExternalTasksPage: React.FC<ExternalTasksPageProps> = ({ teamMembers, externalTasks, onSaveTask, onRequestAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<ExternalTask | null>(null);
    const [filter, setFilter] = useState({ employeeId: 'all', status: 'all' });
    
    const employeeMap = useMemo(() => new Map(teamMembers.map(e => [e.id, e])), [teamMembers]);

    const filteredTasks = useMemo(() => {
        return externalTasks.filter(task => {
            const employeeMatch = filter.employeeId === 'all' || task.employeeId === filter.employeeId;
            const statusMatch = filter.status === 'all' || task.status === filter.status;
            return employeeMatch && statusMatch;
        });
    }, [externalTasks, filter]);

    const handleOpenAddModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (task: ExternalTask) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">إدارة المهام الخارجية</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                >
                    <PlusCircleIcon className="w-6 h-6" />
                    <span>إسناد مهمة جديدة</span>
                </button>
            </div>

             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                 <div className="flex items-center gap-4 mb-4 pb-4 border-b dark:border-slate-700">
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mr-2">الموظف:</label>
                        <select value={filter.employeeId} onChange={e => setFilter(f => ({...f, employeeId: e.target.value}))} className="p-2 border dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 dark:text-white">
                            <option value="all">الكل</option>
                            {teamMembers.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mr-2">الحالة:</label>
                        <select value={filter.status} onChange={e => setFilter(f => ({...f, status: e.target.value}))} className="p-2 border dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 dark:text-white">
                            <option value="all">الكل</option>
                            {Object.keys(STATUS_TRANSLATION).map(s => <option key={s} value={s}>{STATUS_TRANSLATION[s as ExternalTask['status']]}</option>)}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                         <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
                             <tr>
                                <th className="px-6 py-3">الموظف</th>
                                <th className="px-6 py-3">المهمة</th>
                                <th className="px-6 py-3">التاريخ</th>
                                <th className="px-6 py-3">الحالة</th>
                                <th className="px-6 py-3">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map(task => {
                                const employee = employeeMap.get(task.employeeId);
                                return (
                                <tr key={task.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium">
                                        {employee?.name || 'غير معروف'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</p>
                                        {task.requestedById && <span className="text-xs text-slate-500 dark:text-slate-400">(طلب من الموظف)</span>}
                                    </td>
                                    <td className="px-6 py-4">{new Date(task.date).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE_CLASSES[task.status]}`}>
                                            {STATUS_TRANSLATION[task.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.status === 'PendingApproval' ? (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => onRequestAction(task.id, 'Reject')} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" title="رفض"><XCircleIcon className="w-5 h-5"/></button>
                                                <button onClick={() => onRequestAction(task.id, 'Approve')} className="p-2 text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-full" title="موافقة"><CheckCircleIcon className="w-5 h-5"/></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleOpenEditModal(task)} className="font-medium text-sky-600 dark:text-sky-400 hover:underline">
                                                تفاصيل
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <ExternalTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveTask}
                taskToEdit={editingTask}
                teamMembers={teamMembers}
            />
        </div>
    );
};

export default ExternalTasksPage;