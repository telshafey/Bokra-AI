import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';
import { ApprovalWorkflow, ApprovalStep, HRRequest } from '../types';
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
        steps: [{ id: `step-${Date.now()}`, approverRole: 'Direct Manager', order: 1 }],
    });

    const [workflow, setWorkflow] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            setWorkflow(workflowToEdit || getInitialState());
        }
    }, [isOpen, workflowToEdit]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkflow(prev => ({ ...prev, name: e.target.value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWorkflow(prev => ({ ...prev, requestType: e.target.value as HRRequest['type'] }));
    };

    const handleStepChange = (index: number, newRole: ApprovalStep['approverRole']) => {
        const newSteps = [...workflow.steps];
        newSteps[index].approverRole = newRole;
        setWorkflow(prev => ({...prev, steps: newSteps}));
    };

    const addStep = () => {
        const newStep: ApprovalStep = {
            id: `step-${Date.now()}`,
            approverRole: 'HR Manager',
            order: workflow.steps.length + 1,
        };
        setWorkflow(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    };

    const removeStep = (index: number) => {
        const newSteps = workflow.steps
            .filter((_, i) => i !== index)
            .map((step, i) => ({ ...step, order: i + 1 }));
        setWorkflow(prev => ({ ...prev, steps: newSteps }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveApprovalWorkflow({
            id: workflowToEdit?.id || `wf-${Date.now()}`,
            ...workflow
        });
        onClose();
    };

    const requestTypes: HRRequest['type'][] = ['Leave', 'AttendanceAdjustment', 'LeavePermit', 'PettyCash'];
    const approverRoles: ApprovalStep['approverRole'][] = ['Direct Manager', 'Branch Admin', 'HR Manager', 'General Manager'];

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div 
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{workflowToEdit ? t('approvalWorkflows.modal.editTitle') : t('approvalWorkflows.modal.addTitle')}</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('approvalWorkflows.workflowName')}</label>
                        <input type="text" value={workflow.name} onChange={handleTextChange} placeholder={t('approvalWorkflows.modal.namePlaceholder')} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('approvalWorkflows.requestTypeLabel')}</label>
                        <select value={workflow.requestType} onChange={handleSelectChange} className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600">
                            {requestTypes.map(type => (
                                <option key={type} value={type}>{t(`requestTypes.${type}`)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">{t('approvalWorkflows.modal.stepsTitle')}</h3>
                        <div className="space-y-3">
                            {workflow.steps.map((step, index) => (
                                <div key={step.id} className="flex items-center gap-4 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <span className="font-bold text-slate-600 dark:text-slate-300">{t('approvalWorkflows.modal.step')} {index + 1}:</span>
                                    <select value={step.approverRole} onChange={e => handleStepChange(index, e.target.value as ApprovalStep['approverRole'])} className="flex-1 p-2 border rounded-md bg-white dark:bg-slate-700 dark:border-slate-600">
                                        {approverRoles.map(role => (
                                            <option key={role} value={role}>{t(`approverRoles.${role}`)}</option>
                                        ))}
                                    </select>
                                    <button type="button" onClick={() => removeStep(index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full dark:hover:bg-red-900/50">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addStep} className="mt-2 flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300">
                            <PlusCircleIcon className="w-5 h-5"/> {t('approvalWorkflows.modal.addStep')}
                        </button>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 mt-6 border-t dark:border-slate-700">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-500">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">{t('general.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// FIX: Add default export
export default ApprovalWorkflowModal;
