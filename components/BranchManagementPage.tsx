

import React, { useState, useMemo } from 'react';
import type { Branch, EmployeeProfile } from '../types';
import { PencilIcon, ArchiveBoxIcon, PlusCircleIcon } from './icons/Icons';
import BranchModal from './BranchModal';
import { useTranslation } from './contexts/LanguageContext';

interface BranchManagementPageProps {
  branches: Branch[];
  employees: EmployeeProfile[];
  onAddBranch: (name: string, managerId: string) => void;
  onUpdateBranch: (id: string, name: string, managerId: string) => void;
  onArchiveBranch: (id: string) => void;
}

const BranchManagementPage: React.FC<BranchManagementPageProps> = ({ branches, employees, onAddBranch, onUpdateBranch, onArchiveBranch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const { t } = useTranslation();

    const employeeCounts = useMemo(() => {
        return branches.reduce((acc, branch) => {
            acc[branch.id] = employees.filter(e => e.branchId === branch.id && e.isEmployee).length;
            return acc;
        }, {} as Record<string, number>);
    }, [branches, employees]);
    
    const handleOpenAddModal = () => {
        setEditingBranch(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (branch: Branch) => {
        setEditingBranch(branch);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBranch(null);
    };

    const handleSaveBranch = (nameKey: string, managerId: string) => {
        if (editingBranch) {
            onUpdateBranch(editingBranch.id, nameKey, managerId);
        } else {
            onAddBranch(nameKey, managerId);
        }
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">إدارة الفروع</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                >
                    <PlusCircleIcon className="w-6 h-6" />
                    <span>إضافة فرع جديد</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم الفرع</th>
                                <th scope="col" className="px-6 py-3">مسؤول الفرع (Admin)</th>
                                <th scope="col" className="px-6 py-3">عدد الموظفين</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branches.map(branch => {
                                // A Branch Admin for a branch is the manager
                                const manager = employees.find(e => e.branchId === branch.id && e.role === 'Branch Admin');
                                return (
                                    <tr key={branch.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-semibold text-slate-800">{t(branch.nameKey)}</td>
                                        <td className="px-6 py-4">{manager?.name || 'غير معين'}</td>
                                        <td className="px-6 py-4">{employeeCounts[branch.id] || 0}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${branch.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                                                {branch.status === 'Active' ? 'نشط' : 'مؤرشف'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <button onClick={() => handleOpenEditModal(branch)} className="p-2 text-slate-500 hover:text-sky-600" title="تعديل">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            {branch.status === 'Active' && (
                                                <button onClick={() => onArchiveBranch(branch.id)} className="p-2 text-slate-500 hover:text-red-600" title="أرشفة">
                                                    <ArchiveBoxIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <BranchModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveBranch}
                branchToEdit={editingBranch}
                employees={employees}
            />
        </div>
    );
};

export default BranchManagementPage;