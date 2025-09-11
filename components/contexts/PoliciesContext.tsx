import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    PoliciesContextType,
    AttendancePolicy,
    LeavePolicy,
    OvertimePolicy,
    OnboardingTemplate,
    OffboardingTemplate,
    WorkLocation,
    SalaryComponent,
    CompensationPackage,
    ApprovalWorkflow,
} from '../../types';

import { MOCK_ATTENDANCE_POLICIES, MOCK_LEAVE_POLICIES, MOCK_OVERTIME_POLICIES, MOCK_ONBOARDING_TEMPLATES, MOCK_OFFBOARDING_TEMPLATES, MOCK_WORK_LOCATIONS, MOCK_SALARY_COMPONENTS, MOCK_COMPENSATION_PACKAGES, MOCK_APPROVAL_WORKFLOWS } from '../../constants';
import { useToast } from './ToastContext';
import { useTranslation } from './LanguageContext';


const PoliciesContext = createContext<PoliciesContextType | undefined>(undefined);

export const usePoliciesContext = () => {
    const context = useContext(PoliciesContext);
    if (!context) {
        throw new Error('usePoliciesContext must be used within a PoliciesProvider');
    }
    return context;
};

export const PoliciesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [attendancePolicies, setAttendancePolicies] = useState<AttendancePolicy[]>(MOCK_ATTENDANCE_POLICIES);
    const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>(MOCK_LEAVE_POLICIES);
    const [overtimePolicies, setOvertimePolicies] = useState<OvertimePolicy[]>(MOCK_OVERTIME_POLICIES);
    const [onboardingTemplates, setOnboardingTemplates] = useState<OnboardingTemplate[]>(MOCK_ONBOARDING_TEMPLATES);
    const [offboardingTemplates, setOffboardingTemplates] = useState<OffboardingTemplate[]>(MOCK_OFFBOARDING_TEMPLATES);
    const [workLocations, setWorkLocations] = useState<WorkLocation[]>(MOCK_WORK_LOCATIONS);
    const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>(MOCK_SALARY_COMPONENTS);
    const [compensationPackages, setCompensationPackages] = useState<CompensationPackage[]>(MOCK_COMPENSATION_PACKAGES);
    const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>(MOCK_APPROVAL_WORKFLOWS);
    const { addToast } = useToast();
    const { t } = useTranslation();

    const createSaveFunction = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, successMessageKey: string) => (item: T) => {
        setter(prev => {
            const isNew = !prev.some(p => p.id === item.id);
            if (isNew) return [...prev, item];
            return prev.map(p => p.id === item.id ? item : p);
        });
        addToast(t(successMessageKey), 'success');
    };
    
    const createDeleteFunction = (setter: React.Dispatch<React.SetStateAction<any[]>>, successMessageKey: string) => (id: string) => {
        setter(prev => prev.filter(item => item.id !== id));
        addToast(t(successMessageKey), 'success');
    };

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
        saveAttendancePolicy: createSaveFunction(setAttendancePolicies, 'toasts.policySaved'),
        saveLeavePolicy: createSaveFunction(setLeavePolicies, 'toasts.policySaved'),
        saveOvertimePolicy: createSaveFunction(setOvertimePolicies, 'toasts.policySaved'),
        saveOnboardingTemplate: createSaveFunction(setOnboardingTemplates, 'toasts.templateSaved'),
        deleteOnboardingTemplate: createDeleteFunction(setOnboardingTemplates, 'toasts.templateDeleted'),
        saveOffboardingTemplate: createSaveFunction(setOffboardingTemplates, 'toasts.templateSaved'),
        deleteOffboardingTemplate: createDeleteFunction(setOffboardingTemplates, 'toasts.templateDeleted'),
        addWorkLocation: (location) => {
            const newLocation = { id: `loc-${Date.now()}`, ...location };
            setWorkLocations(prev => [...prev, newLocation]);
            addToast(t('toasts.locationSaved'), 'success');
        },
        updateWorkLocation: (location) => {
            setWorkLocations(prev => prev.map(loc => loc.id === location.id ? location : loc));
            addToast(t('toasts.locationSaved'), 'success');
        },
        saveSalaryComponent: createSaveFunction(setSalaryComponents, 'toasts.salaryComponentSaved'),
        saveCompensationPackage: createSaveFunction(setCompensationPackages, 'toasts.compensationPackageSaved'),
        saveApprovalWorkflow: createSaveFunction(setApprovalWorkflows, 'toasts.workflowSaved'),
        deleteApprovalWorkflow: createDeleteFunction(setApprovalWorkflows, 'toasts.workflowDeleted'),
    };

    return <PoliciesContext.Provider value={value}>{children}</PoliciesContext.Provider>;
};