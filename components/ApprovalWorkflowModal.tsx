import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';
import type { ApprovalWorkflow, ApprovalStep, RequestType, ApproverRole } from '../types';
import { usePoliciesContext } from './contexts/PoliciesContext';
import { useTranslation } from './contexts/LanguageContext';

interface ApprovalWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    workflowToEdit: ApprovalWorkflow | null;
}

const ApprovalWorkflowModal: React.FC<ApprovalWorkflowModalProps> = ({ isOpen, onClose, workflowToEdit }) => {
    const { t } = useTranslation();
    const { saveApprovalWorkflow } = usePoliciesContext();
    
    const getInitialState = (): Omit<ApprovalWorkflow, 'id'> => ({
        name: '',
        requestType: 'Leave',
        steps: [{ id: `step-${Date.now()}`, approverRole: 'Direct Manager', order: 1 }]
    });

    const [workflow, setWorkflow] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            if (workflowToEdit) {
                setWorkflow(workflowToEdit);
            } else {
                setWorkflow(getInitialState());
            }
        }
    }, [isOpen, workflowToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setWorkflow(prev => ({ ...prev, [name]: value }));
    };

    const handleStepChange = (index: number, newRole: ApproverRole) => {
        const newSteps = [...workflow.steps];
        newSteps[index].approverRole = newRole;
        setWorkflow(prev => ({ ...prev, steps: newSteps }));
    };

    const handleAddStep = () => {
        const newStep: ApprovalStep = {
            id: `step-${Date.now()}`,
            approverRole: 'HR Manager',
            order: workflow.steps.length + 1
        };
        setWorkflow(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    };
    
    const handleRemoveStep = (index: number) => {
        const newSteps = workflow.steps
            .filter((_, i) => i !== index)
            .map((step, i) => ({ ...step, order: i + 1 }));
        setWorkflow(prev => ({ ...prev, steps: newSteps }));
    };

    const handleMoveStep = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === workflow.steps.length - 1)) {
            return;
        }

        const newSteps = [...workflow.steps];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];

        const reorderedSteps = newSteps.map((step, i) => ({ ...step, order: i + 1 }));
        setWorkflow(prev => ({ ...prev, steps: reorderedSteps }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalWorkflow: ApprovalWorkflow = {
            id: workflowToEdit?.id || `wf-${Date.now()}`,
            ...workflow,
        };
        saveApprovalWorkflow(finalWorkflow);
        onClose();
    };

    const requestTypes: RequestType[] = ['Leave', 'AttendanceAdjustment', 'LeavePermit', 'PettyCash'];
    const approverRoles: ApproverRole[] = ['Direct Manager', 'Branch Admin', 'HR Manager', 'General Manager'];
    const modalTitle = workflowToEdit ? t('approvalWorkflows.modal.editTitle') : t('approvalWorkflows.modal.addTitle');

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div 
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{modalTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="name"
                                type="text"
                                value={workflow.name}
                                onChange={handleChange}
                                placeholder={t('approvalWorkflows.modal.namePlaceholder')}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700"
                                required
                            />
                            <select
                                name="requestType"
                                value={workflow.requestType}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                            >
                                {requestTypes.map(type => (
                                    <option key={type} value={type}>{t(`requestTypes.${type}`)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">{t('approvalWorkflows.modal.stepsTitle')}</h3>
                            <div className="space-y-2">
                                {workflow.steps.sort((a,b) => a.order - b.order).map((step, index) => (
                                    <div key={step.id} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                        <span className="font-bold text-slate-600 dark:text-slate-300">{t('approvalWorkflows.modal.step')} {index + 1}:</span>
                                        <select
                                            value={step.approverRole}
                                            onChange={e => handleStepChange(index, e.target.value as ApproverRole)}
                                            className="flex-1 p-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm"
                                        >
                                            {approverRoles.map(role => (
                                                <option key={role} value={role}>{t(`approverRoles.${role}`)}</option>
                                            ))}
                                        </select>
                                        <div className="flex flex-col">
                                            <button type="button" onClick={() => handleMoveStep(index, 'up')} className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full disabled:opacity-50" disabled={index === 0}><ChevronUpIcon className="w-4 h-4"/></button>
                                            <button type="button" onClick={() => handleMoveStep(index, 'down')} className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full disabled:opacity-50" disabled={index === workflow.steps.length - 1}><ChevronDownIcon className="w-4 h-4"/></button>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveStep(index)} className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddStep} className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 mt-2">
                                    <PlusCircleIcon className="w-5 h-5" />
                                    <span>{t('approvalWorkflows.modal.addStep')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-700">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 rounded-lg">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">{t('general.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApprovalWorkflowModal;