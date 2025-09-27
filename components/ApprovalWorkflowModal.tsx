// FIX: Replaced placeholder content with a full implementation.
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
            <form 
                onSubmit={handleSubmit}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{workflowToEdit ? t('approvalWorkflows.modal.editTitle') : t('approvalWorkflows.modal.addTitle')}</h2>
                    <button type="button" onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={workflow.name} onChange={handleTextChange} placeholder={t('approvalWorkflows.modal.namePlaceholder')} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        <select value={workflow.requestType} onChange={handleSelectChange} className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600" required>
                             {requestTypes.map(type => <option key={type} value={type}>{t(`requestTypes.${type}`)}</option>)}
                        </select>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">{t('approvalWorkflows.modal.stepsTitle')}</h3>
                        <div className="space-y-3">
                            {workflow.steps.map((step, index) => (
                                <div key={step.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-200 dark:border-slate-700">
                                    <span className="font-bold text-slate-500 dark:text-slate-400">{t('approvalWorkflows.modal.step')} {index + 1}:</span>
                                    <select value={step.approverRole} onChange={e => handleStepChange(index, e.target.value as ApprovalStep['approverRole'])} className="flex-1 p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600">
                                        {approverRoles.map(role => <option key={role} value={role}>{t(`approverRoles.${role}`)}</option>)}
                                    </select>
                                    <button type="button" onClick={() => removeStep(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" disabled={workflow.steps.length <= 1}>
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            ))}
                             <button type="button" onClick={addStep} className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-800">
                                <PlusCircleIcon className="w-5 h-5" />
                                <span>{t('approvalWorkflows.modal.addStep')}</span>
                            </button>
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end gap-4 pt-4 mt-4 border-t dark:border-slate-700">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 rounded-lg">{t('general.cancel')}</button>
                    <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">{t('general.save')}</button>
                </div>
            </form>
        </div>
    );
};

export default ApprovalWorkflowModal;
