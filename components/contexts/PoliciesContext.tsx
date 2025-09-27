// FIX: Replaced placeholder content with a full implementation.
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    PoliciesContextType, 
    PoliciesProviderProps, 
    AttendancePolicy, 
    LeavePolicy, 
    OvertimePolicy, 
    OnboardingTemplate, 
    OffboardingTemplate,
    WorkLocation,
    SalaryComponent,
    CompensationPackage,
    ApprovalWorkflow
} from '../../types';
import * as api from '../../services/mockApi';
import { useToast } from './ToastContext';
import { useTranslation } from './LanguageContext';

const PoliciesContext = createContext<PoliciesContextType | undefined>(undefined);

export const usePoliciesContext = () => {
    const context = useContext(PoliciesContext);
    if (!context) throw new Error('usePoliciesContext must be used within a PoliciesProvider');
    return context;
};

export const PoliciesProvider: React.FC<PoliciesProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const { data: attendancePolicies = [] } = useQuery<AttendancePolicy[]>({ queryKey: ['attendancePolicies'], queryFn: api.fetchAttendancePolicies });
    const { data: leavePolicies = [] } = useQuery<LeavePolicy[]>({ queryKey: ['leavePolicies'], queryFn: api.fetchLeavePolicies });
    const { data: overtimePolicies = [] } = useQuery<OvertimePolicy[]>({ queryKey: ['overtimePolicies'], queryFn: api.fetchOvertimePolicies });
    const { data: onboardingTemplates = [] } = useQuery<OnboardingTemplate[]>({ queryKey: ['onboardingTemplates'], queryFn: api.fetchOnboardingTemplates });
    const { data: offboardingTemplates = [] } = useQuery<OffboardingTemplate[]>({ queryKey: ['offboardingTemplates'], queryFn: api.fetchOffboardingTemplates });
    const { data: workLocations = [] } = useQuery<WorkLocation[]>({ queryKey: ['workLocations'], queryFn: api.fetchWorkLocations });
    const { data: salaryComponents = [] } = useQuery<SalaryComponent[]>({ queryKey: ['salaryComponents'], queryFn: api.fetchSalaryComponents });
    const { data: compensationPackages = [] } = useQuery<CompensationPackage[]>({ queryKey: ['compensationPackages'], queryFn: api.fetchCompensationPackages });
    const { data: approvalWorkflows = [] } = useQuery<ApprovalWorkflow[]>({ queryKey: ['approvalWorkflows'], queryFn: api.fetchApprovalWorkflows });

    const createMutation = (mutationFn: (...args: any[]) => Promise<any>, queryKey: string[], successMessageKey: string) => {
        return useMutation({
            mutationFn,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey });
                addToast(t(successMessageKey), 'success');
            },
        });
    };

    const saveAttendancePolicyMutation = createMutation(api.saveAttendancePolicy, ['attendancePolicies'], 'toasts.policySaved');
    const saveLeavePolicyMutation = createMutation(api.saveLeavePolicy, ['leavePolicies'], 'toasts.policySaved');
    const saveOvertimePolicyMutation = createMutation(api.saveOvertimePolicy, ['overtimePolicies'], 'toasts.policySaved');
    const saveOnboardingTemplateMutation = createMutation(api.saveOnboardingTemplate, ['onboardingTemplates'], 'toasts.templateSaved');
    const deleteOnboardingTemplateMutation = createMutation(api.deleteOnboardingTemplate, ['onboardingTemplates'], 'toasts.templateDeleted');
    const saveOffboardingTemplateMutation = createMutation(api.saveOffboardingTemplate, ['offboardingTemplates'], 'toasts.templateSaved');
    const deleteOffboardingTemplateMutation = createMutation(api.deleteOffboardingTemplate, ['offboardingTemplates'], 'toasts.templateDeleted');
    const addWorkLocationMutation = createMutation(api.addWorkLocation, ['workLocations'], 'toasts.locationSaved');
    const updateWorkLocationMutation = createMutation(api.updateWorkLocation, ['workLocations'], 'toasts.locationSaved');
    const saveSalaryComponentMutation = createMutation(api.saveSalaryComponent, ['salaryComponents'], 'toasts.salaryComponentSaved');
    const saveCompensationPackageMutation = createMutation(api.saveCompensationPackage, ['compensationPackages'], 'toasts.compensationPackageSaved');
    const saveApprovalWorkflowMutation = createMutation(api.saveApprovalWorkflow, ['approvalWorkflows'], 'toasts.workflowSaved');
    const deleteApprovalWorkflowMutation = createMutation(api.deleteApprovalWorkflow, ['approvalWorkflows'], 'toasts.workflowDeleted');

    const value: PoliciesContextType = {
        attendancePolicies,
        leavePolicies,
        overtimePolicies,
        onboardingTemplates,
        offboardingTemplates,
        workLocations,
        salaryComponents,
        compensationPackages,
        approvalWorkflows,
        saveAttendancePolicy: (policy) => saveAttendancePolicyMutation.mutateAsync(policy),
        saveLeavePolicy: (policy) => saveLeavePolicyMutation.mutateAsync(policy),
        saveOvertimePolicy: (policy) => saveOvertimePolicyMutation.mutateAsync(policy),
        saveOnboardingTemplate: (template) => saveOnboardingTemplateMutation.mutateAsync(template),
        deleteOnboardingTemplate: (templateId) => deleteOnboardingTemplateMutation.mutateAsync(templateId),
        saveOffboardingTemplate: (template) => saveOffboardingTemplateMutation.mutateAsync(template),
        deleteOffboardingTemplate: (templateId) => deleteOffboardingTemplateMutation.mutateAsync(templateId),
        addWorkLocation: (location) => addWorkLocationMutation.mutateAsync(location),
        updateWorkLocation: (location) => updateWorkLocationMutation.mutateAsync(location),
        saveSalaryComponent: (component) => saveSalaryComponentMutation.mutateAsync(component),
        saveCompensationPackage: (pkg) => saveCompensationPackageMutation.mutateAsync(pkg),
        saveApprovalWorkflow: (workflow) => saveApprovalWorkflowMutation.mutateAsync(workflow),
        deleteApprovalWorkflow: (workflowId) => deleteApprovalWorkflowMutation.mutateAsync(workflowId),
    };

    return <PoliciesContext.Provider value={value}>{children}</PoliciesContext.Provider>;
};
