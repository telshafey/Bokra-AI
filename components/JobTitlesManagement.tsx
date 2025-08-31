import React, { useState, useMemo } from 'react';
import type { JobTitle, EmployeeProfile } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from './icons/Icons';
import JobTitleModal from './JobTitleModal';

interface JobTitleNodeProps {
    jobTitle: JobTitle;
    level: number;
    children: React.ReactNode;
    employeeCount: number;
    onAdd: (parentId: string) => void;
    onEdit: (jobTitle: JobTitle) => void;
    onDelete: (jobTitle: JobTitle) => void;
    canDelete: boolean;
}

const JobTitleNode: React.FC<JobTitleNodeProps> = ({ jobTitle, level, children, employeeCount, onAdd, onEdit, onDelete, canDelete }) => {
    return (
        <div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100">
                <div className="flex items-center">
                    <span style={{ marginRight: `${level * 2}rem` }}></span>
                    <div>
                        <p className="font-bold text-slate-800">{jobTitle.name}</p>
                        <p className="text-xs text-slate-500">{employeeCount} موظفين</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onAdd(jobTitle.id)} className="p-2 text-slate-500 hover:text-sky-600" title="إضافة منصب فرعي"><PlusCircleIcon className="w-5 h-5"/></button>
                    <button onClick={() => onEdit(jobTitle)} className="p-2 text-slate-500 hover:text-emerald-600" title="تعديل"><PencilIcon className="w-5 h-5"/></button>
                    <button 
                        onClick={() => onDelete(jobTitle)} 
                        disabled={!canDelete}
                        className="p-2 text-slate-500 hover:text-red-600 disabled:text-slate-300 disabled:cursor-not-allowed" 
                        title={canDelete ? "حذف" : "لا يمكن الحذف لوجود مناصب فرعية أو موظفين"}
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
            <div className="pl-8 mt-2 space-y-2">{children}</div>
        </div>
    );
};

interface JobTitlesManagementProps {
    jobTitles: JobTitle[];
    employees: EmployeeProfile[];
    onSave: (jobTitle: JobTitle) => void;
    onDelete: (jobTitleId: string) => void;
}

const JobTitlesManagement: React.FC<JobTitlesManagementProps> = ({ jobTitles, employees, onSave, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTitle, setEditingTitle] = useState<JobTitle | null>(null);
    const [parentTitleId, setParentTitleId] = useState<string | null>(null);

    const jobTitleMap = useMemo(() => new Map(jobTitles.map(jt => [jt.id, jt])), [jobTitles]);
    const childrenMap = useMemo(() => {
        const map = new Map<string | null, JobTitle[]>();
        jobTitles.forEach(jt => {
            if (!map.has(jt.parentId)) {
                map.set(jt.parentId, []);
            }
            map.get(jt.parentId)!.push(jt);
        });
        return map;
    }, [jobTitles]);

    const employeeCountMap = useMemo(() => {
        const map = new Map<string, number>();
        employees.forEach(emp => {
            if (emp.jobTitleId) {
                map.set(emp.jobTitleId, (map.get(emp.jobTitleId) || 0) + 1);
            }
        });
        return map;
    }, [employees]);

    const handleOpenAddModal = (parentId: string | null) => {
        setEditingTitle(null);
        setParentTitleId(parentId);
        setIsModalOpen(true);
    };
    
    const handleOpenEditModal = (jobTitle: JobTitle) => {
        setEditingTitle(jobTitle);
        setParentTitleId(jobTitle.parentId);
        setIsModalOpen(true);
    };

    const handleDelete = (jobTitle: JobTitle) => {
        if (confirm(`هل أنت متأكد من حذف منصب "${jobTitle.name}"؟`)) {
            onDelete(jobTitle.id);
        }
    };

    const renderTree = (parentId: string | null, level: number): React.ReactNode => {
        const children = childrenMap.get(parentId) || [];
        return children.map(jobTitle => {
            const employeeCount = employeeCountMap.get(jobTitle.id) || 0;
            const hasChildren = (childrenMap.get(jobTitle.id) || []).length > 0;
            const canDelete = employeeCount === 0 && !hasChildren;
            return (
                <JobTitleNode
                    key={jobTitle.id}
                    jobTitle={jobTitle}
                    level={level}
                    employeeCount={employeeCount}
                    onAdd={handleOpenAddModal}
                    onEdit={handleOpenEditModal}
                    onDelete={() => handleDelete(jobTitle)}
                    canDelete={canDelete}
                >
                    {renderTree(jobTitle.id, level + 1)}
                </JobTitleNode>
            );
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-700">شجرة المسميات الوظيفية</h2>
                <button onClick={() => handleOpenAddModal(null)} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>إضافة منصب رئيسي</span>
                </button>
            </div>
            <div className="space-y-2">
                {renderTree(null, 0)}
            </div>
            
            <JobTitleModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSave}
                jobTitleToEdit={editingTitle}
                parentId={parentTitleId}
            />
        </div>
    );
};

export default JobTitlesManagement;