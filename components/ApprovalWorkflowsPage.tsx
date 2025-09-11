import React, { useState } from 'react';
import PageHeader from './PageHeader';
import Card from './Card';
import { usePoliciesContext } from './contexts/PoliciesContext';
import { useTranslation } from './contexts/LanguageContext';
import { PlusCircleIcon, PencilIcon, TrashIcon, ChevronRightIcon } from './icons/Icons';
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
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {approvalWorkflows.length > 0 ? (
                        approvalWorkflows.map(workflow => (
                            <div key={workflow.id} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{workflow.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('approvalWorkflows.requestType')}: {t(`requestTypes.${workflow.requestType}`)}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        {workflow.steps.sort((a,b) => a.order - b.order).map((step, index) => (
                                            <React.Fragment key={step.id}>
                                                <span className="bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-md">{t(`approverRoles.${step.approverRole}`)}</span>
                                                {index < workflow.steps.length - 1 && <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleOpenEditModal(workflow)} className="p-2 text-slate-500 hover:text-sky-600" title={t('approvalWorkflows.edit')}><PencilIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(workflow.id)} className="p-2 text-slate-500 hover:text-red-600" title={t('approvalWorkflows.delete')}><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-12">
                            <p className="font-semibold text-slate-600 dark:text-slate-300">{t('approvalWorkflows.noWorkflows')}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('approvalWorkflows.noWorkflowsHint')}</p>
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