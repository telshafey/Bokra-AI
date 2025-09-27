import React, { useState } from 'react';
import type { OvertimePolicy, EmployeeProfile } from '../types';
import { PlusCircleIcon, PencilIcon, UsersIcon } from './icons/Icons';
import PageHeader from './PageHeader';
import Card from './Card';
import OvertimePolicyModal from './OvertimePolicyModal';
import AssignOvertimePolicyModal from './AssignOvertimePolicyModal';
import { useTranslation } from './contexts/LanguageContext';

interface OvertimePolicyPageProps {
  policies: OvertimePolicy[];
  onSavePolicy: (policy: OvertimePolicy) => void;
  allEmployees: EmployeeProfile[];
  onAssignPolicy: (policyId: string, employeeIds: string[]) => void;
}

const OvertimePolicyPage: React.FC<OvertimePolicyPageProps> = ({ policies, onSavePolicy, allEmployees, onAssignPolicy }) => {
    const { t } = useTranslation();
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<OvertimePolicy | null>(null);

    const handleOpenEditModal = (policy: OvertimePolicy) => {
        setSelectedPolicy(policy);
        setIsPolicyModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setSelectedPolicy(null);
        setIsPolicyModalOpen(true);
    };
    
    const handleOpenAssignModal = (policy: OvertimePolicy) => {
        setSelectedPolicy(policy);
        setIsAssignModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('pageTitles.overtimePolicies')}
                subtitle="إدارة سياسات احتساب الوقت الإضافي."
                actionButton={
                    <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg">
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>إنشاء سياسة جديدة</span>
                    </button>
                }
            />
             <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">اسم السياسة</th>
                                <th className="px-6 py-3">معامل اليوم العادي</th>
                                <th className="px-6 py-3">معامل العطلة</th>
                                <th className="px-6 py-3">الحالة</th>
                                <th className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map(policy => (
                                <tr key={policy.id} className="border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-semibold">{policy.name}</td>
                                    <td className="px-6 py-4">{policy.overtimeRateNormal}x</td>
                                    <td className="px-6 py-4">{policy.overtimeRateHoliday}x</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${policy.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{policy.status}</span></td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button onClick={() => handleOpenAssignModal(policy)} className="p-2 text-slate-500 hover:text-emerald-600" title="تعيين موظفين"><UsersIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleOpenEditModal(policy)} className="p-2 text-slate-500 hover:text-sky-600" title="تعديل"><PencilIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <OvertimePolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                onSave={onSavePolicy}
                policyToEdit={selectedPolicy}
            />

            {selectedPolicy && (
                <AssignOvertimePolicyModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    policy={selectedPolicy}
                    employees={allEmployees}
                    onAssign={onAssignPolicy}
                />
            )}
        </div>
    );
};

export default OvertimePolicyPage;
