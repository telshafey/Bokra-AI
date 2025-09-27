import React, { useState } from 'react';
import { PlusCircleIcon, PencilIcon, TrashIcon, SitemapIcon } from './icons/Icons';
import { usePoliciesContext } from './contexts/PoliciesContext';
import { useTranslation } from './contexts/LanguageContext';
import PageHeader from './PageHeader';
import Card from './Card';
import { ApprovalWorkflow } from '../types';
import ApprovalWorkflowModal from './ApprovalWorkflowModal';

const ApprovalWorkflowsPage: React.FC = () => {
    const { t } = useTranslation();
    const { approvalWorkflows, deleteApprovalWorkflow } = usePoliciesContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<ApprovalWorkflow | null>(null);
    
    const handleOpenAddModal = () => {
        setEditingWorkflow(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (workflow: ApprovalWorkflow) => {
        setEditingWorkflow(workflow);
        setIsModalOpen(true);
    };

    const handleDelete = (workflowId: string) => {
        if (confirm(t('approvalWorkflows.confirmDelete'))) {
            deleteApprovalWorkflow(workflowId);
        }
    };

    const headerAction = (
        <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
        >
            <PlusCircleIcon className="w-6 h-6" />
            <span>{t('approvalWorkflows.addNew')}</span>
        </button>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('approvalWorkflows.pageHeaderTitle')}
                subtitle={t('approvalWorkflows.pageHeaderSubtitle')}
                actionButton={headerAction}
            />
            <Card paddingClass="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">{t('approvalWorkflows.workflowName')}</th>
                                <th className="px-6 py-3">{t('approvalWorkflows.requestType')}</th>
                                <th className="px-6 py-3">{t('approvalWorkflows.steps')}</th>
                                <th className="px-6 py-3">{t('general.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvalWorkflows.map(workflow => (
                                <tr key={workflow.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{workflow.name}</td>
                                    <td className="px-6 py-4">{t(`requestTypes.${workflow.requestType}`)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {workflow.steps.sort((a,b) => a.order - b.order).map((step, index) => (
                                                <React.Fragment key={step.id}>
                                                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-xs font-medium">{t(`approverRoles.${step.approverRole}`)}</span>
                                                    {index < workflow.steps.length - 1 && <span className="text-slate-400">&rarr;</span>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button onClick={() => handleOpenEditModal(workflow)} className="p-2 text-slate-500 hover:text-sky-600" title={t('general.edit')}><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(workflow.id)} className="p-2 text-slate-500 hover:text-red-600" title={t('general.delete')}><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {approvalWorkflows.length === 0 && (
                        <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                            <SitemapIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2"/>
                            <p className="font-semibold">{t('approvalWorkflows.noWorkflows')}</p>
                            <p className="text-sm">{t('approvalWorkflows.noWorkflowsHint')}</p>
                        </div>
                    )}
                </div>
            </Card>

             <ApprovalWorkflowModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                workflowToEdit={editingWorkflow}
            />
        </div>
    );
};

export default ApprovalWorkflowsPage;
