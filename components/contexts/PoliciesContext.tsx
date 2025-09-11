
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

// Mock data might be needed if not provided elsewhere
const MOCK_ATTENDANCE_POLICIES: AttendancePolicy[] = [];
const MOCK_LEAVE_POLICIES: LeavePolicy[] = [];
const MOCK_OVERTIME_POLICIES: OvertimePolicy[] = [];
const MOCK_ONBOARDING_TEMPLATES: OnboardingTemplate[] = [];
const MOCK_OFFBOARDING_TEMPLATES: OffboardingTemplate[] = [];
const MOCK_WORK_LOCATIONS: WorkLocation[] = [];
const MOCK_SALARY_COMPONENTS: SalaryComponent[] = [];
const MOCK_COMPENSATION_PACKAGES: CompensationPackage[] = [];
const MOCK_APPROVAL_WORKFLOWS: ApprovalWorkflow[] = [];

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

    const createSaveFunction = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) => (item: T) => {
        setter(prev => {
            const isNew = !prev.some(p => p.id === item.id);
            if (isNew) return [...prev, item];
            return prev.map(p => p.id === item.id ? item : p);
        });
    };
    
    const createDeleteFunction = (setter: React.Dispatch<React.SetStateAction<any[]>>) => (id: string) => {
        setter(prev => prev.filter(item => item.id !== id));
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
        saveAttendancePolicy: createSaveFunction(setAttendancePolicies),
        saveLeavePolicy: createSaveFunction(setLeavePolicies),
        saveOvertimePolicy: createSaveFunction(setOvertimePolicies),
        saveOnboardingTemplate: createSaveFunction(setOnboardingTemplates),
        deleteOnboardingTemplate: createDeleteFunction(setOnboardingTemplates),
        saveOffboardingTemplate: createSaveFunction(setOffboardingTemplates),
        deleteOffboardingTemplate: createDeleteFunction(setOffboardingTemplates),
        addWorkLocation: (location) => {
            const newLocation = { id: `loc-${Date.now()}`, ...location };
            setWorkLocations(prev => [...prev, newLocation]);
        },
        updateWorkLocation: (location) => {
            setWorkLocations(prev => prev.map(loc => loc.id === location.id ? location : loc));
        },
        saveSalaryComponent: createSaveFunction(setSalaryComponents),
        saveCompensationPackage: createSaveFunction(setCompensationPackages),
        saveApprovalWorkflow: createSaveFunction(setApprovalWorkflows),
        deleteApprovalWorkflow: createDeleteFunction(setApprovalWorkflows),
    };

    return <PoliciesContext.Provider value={value}>{children}</PoliciesContext.Provider>;
};
