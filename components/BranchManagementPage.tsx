import React, { useState, useMemo } from 'react';
import type { Branch, EmployeeProfile } from '../types';
import { BuildingOfficeIcon, PencilIcon, ArchiveBoxIcon, PlusCircleIcon } from './icons/Icons';
import BranchModal from './BranchModal';

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

    const handleSaveBranch = (name: string, managerId: string) => {
        if (editingBranch) {
            onUpdateBranch(editingBranch.id, name, managerId);
        } else {
            onAddBranch(name, managerId);
        }
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">إدارة فروع الشركة</h1>
                    <p className="text-sm text-slate-500">إضافة وتعديل وأرشفة فروع الشركة.</p>
                </div>
                 <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>إضافة فرع جديد</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم الفرع</th>
                                <th scope="col" className="px-6 py-3">مدير الفرع</th>
                                <th scope="col" className="px-6 py-3">عدد الموظفين</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branches.map((branch) => {
                                const branchManager = employees.find(e => e.branchId === branch.id && e.role === 'Branch Admin');
                                return (
                                <tr key={branch.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{branch.name}</td>
                                    <td className="px-6 py-4">{branchManager?.name || 'لا يوجد'}</td>
                                    <td className="px-6 py-4">{employeeCounts[branch.id] || 0}</td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${branch.status === 'Archived' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'}`}>
                                            {branch.status === 'Archived' ? 'مؤرشف' : 'نشط'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button 
                                            onClick={() => handleOpenEditModal(branch)}
                                            className="p-2 rounded-full text-slate-400 hover:bg-sky-100 hover:text-sky-600"
                                            title="تعديل"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(confirm(`هل أنت متأكد من رغبتك في أرشفة فرع "${branch.name}"؟`)) {
                                                    onArchiveBranch(branch.id);
                                                }
                                            }}
                                            disabled={branch.status === 'Archived'}
                                            className="p-2 rounded-full text-slate-400 hover:bg-amber-100 hover:text-amber-600 disabled:text-slate-300 disabled:hover:bg-transparent"
                                            title="أرشفة"
                                        >
                                            <ArchiveBoxIcon className="w-5 h-5" />
                                        </button>
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