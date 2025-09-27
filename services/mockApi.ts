import { MOCK_ASSETS, MOCK_ATTENDANCE_POLICIES, MOCK_LEAVE_POLICIES, MOCK_OVERTIME_POLICIES, MOCK_ONBOARDING_TEMPLATES, MOCK_OFFBOARDING_TEMPLATES, MOCK_WORK_LOCATIONS, MOCK_SALARY_COMPONENTS, MOCK_COMPENSATION_PACKAGES, MOCK_APPROVAL_WORKFLOWS, ALL_EMPLOYEES, COMPANY_BRANCHES, MOCK_JOB_TITLES } from "../constants";
import type { Asset, AttendancePolicy, LeavePolicy, OvertimePolicy, OnboardingTemplate, OffboardingTemplate, WorkLocation, SalaryComponent, CompensationPackage, ApprovalWorkflow, EmployeeProfile, Branch, JobTitle, UserRole, NewUserPayload } from "../types";

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Assets ---
export const fetchAssets = async (): Promise<Asset[]> => {
    await delay(200);
    return MOCK_ASSETS;
};

export const updateAsset = async (asset: Asset): Promise<Asset> => {
    await delay(300);
    const index = MOCK_ASSETS.findIndex(a => a.id === asset.id);
    if (index > -1) {
        MOCK_ASSETS[index] = asset;
    } else {
        MOCK_ASSETS.push(asset);
    }
    return asset;
};

export const updateAssetAssignment = async ({ assetId, employeeId }: { assetId: string, employeeId: string | null }): Promise<Asset> => {
    await delay(300);
    const asset = MOCK_ASSETS.find(a => a.id === assetId);
    if (asset) {
        asset.assignedToId = employeeId;
        asset.status = employeeId ? 'Assigned' : 'Available';
        return asset;
    }
    throw new Error("Asset not found");
};

// --- Policies & Templates ---
export const fetchAttendancePolicies = async (): Promise<AttendancePolicy[]> => {
    await delay(200);
    return MOCK_ATTENDANCE_POLICIES;
};
export const saveAttendancePolicy = async (policy: AttendancePolicy): Promise<AttendancePolicy> => {
     await delay(300);
    const index = MOCK_ATTENDANCE_POLICIES.findIndex(p => p.id === policy.id);
    if (index > -1) MOCK_ATTENDANCE_POLICIES[index] = policy;
    else MOCK_ATTENDANCE_POLICIES.push(policy);
    return policy;
}

export const fetchLeavePolicies = async (): Promise<LeavePolicy[]> => {
    await delay(200);
    return MOCK_LEAVE_POLICIES;
};
export const saveLeavePolicy = async (policy: LeavePolicy): Promise<LeavePolicy> => {
    await delay(300);
    const index = MOCK_LEAVE_POLICIES.findIndex(p => p.id === policy.id);
    if (index > -1) MOCK_LEAVE_POLICIES[index] = policy;
    else MOCK_LEAVE_POLICIES.push(policy);
    return policy;
}

export const fetchOvertimePolicies = async (): Promise<OvertimePolicy[]> => {
    await delay(200);
    return MOCK_OVERTIME_POLICIES;
};
export const saveOvertimePolicy = async (policy: OvertimePolicy): Promise<OvertimePolicy> => {
    await delay(300);
    const index = MOCK_OVERTIME_POLICIES.findIndex(p => p.id === policy.id);
    if (index > -1) MOCK_OVERTIME_POLICIES[index] = policy;
    else MOCK_OVERTIME_POLICIES.push(policy);
    return policy;
}


export const fetchOnboardingTemplates = async (): Promise<OnboardingTemplate[]> => {
    await delay(200);
    return MOCK_ONBOARDING_TEMPLATES;
};
export const saveOnboardingTemplate = async (template: OnboardingTemplate): Promise<OnboardingTemplate> => {
    await delay(300);
    const index = MOCK_ONBOARDING_TEMPLATES.findIndex(t => t.id === template.id);
    if (index > -1) MOCK_ONBOARDING_TEMPLATES[index] = template;
    else MOCK_ONBOARDING_TEMPLATES.push(template);
    return template;
}
export const deleteOnboardingTemplate = async (templateId: string): Promise<{ id: string }> => {
    await delay(300);
    // In a real app, check if it's in use
    const index = MOCK_ONBOARDING_TEMPLATES.findIndex(t => t.id === templateId);
    if (index > -1) MOCK_ONBOARDING_TEMPLATES.splice(index, 1);
    return { id: templateId };
};


export const fetchOffboardingTemplates = async (): Promise<OffboardingTemplate[]> => {
    await delay(200);
    return MOCK_OFFBOARDING_TEMPLATES;
};
export const saveOffboardingTemplate = async (template: OffboardingTemplate): Promise<OffboardingTemplate> => {
    await delay(300);
    const index = MOCK_OFFBOARDING_TEMPLATES.findIndex(t => t.id === template.id);
    if (index > -1) MOCK_OFFBOARDING_TEMPLATES[index] = template;
    else MOCK_OFFBOARDING_TEMPLATES.push(template);
    return template;
}
export const deleteOffboardingTemplate = async (templateId: string): Promise<{ id: string }> => {
    await delay(300);
    const index = MOCK_OFFBOARDING_TEMPLATES.findIndex(t => t.id === templateId);
    if (index > -1) MOCK_OFFBOARDING_TEMPLATES.splice(index, 1);
    return { id: templateId };
};

export const fetchWorkLocations = async (): Promise<WorkLocation[]> => {
    await delay(200);
    return MOCK_WORK_LOCATIONS;
};
export const addWorkLocation = async (location: Omit<WorkLocation, 'id'>): Promise<WorkLocation> => {
    await delay(300);
    const newLocation = { id: `loc-${Date.now()}`, ...location };
    MOCK_WORK_LOCATIONS.push(newLocation);
    return newLocation;
};
export const updateWorkLocation = async (location: WorkLocation): Promise<WorkLocation> => {
     await delay(300);
    const index = MOCK_WORK_LOCATIONS.findIndex(l => l.id === location.id);
    if(index > -1) MOCK_WORK_LOCATIONS[index] = location;
    return location;
};

export const fetchSalaryComponents = async (): Promise<SalaryComponent[]> => {
    await delay(200);
    return MOCK_SALARY_COMPONENTS;
};
export const saveSalaryComponent = async (component: SalaryComponent): Promise<SalaryComponent> => {
    await delay(300);
    MOCK_SALARY_COMPONENTS.push(component);
    return component;
};


export const fetchCompensationPackages = async (): Promise<CompensationPackage[]> => {
    await delay(200);
    return MOCK_COMPENSATION_PACKAGES;
};
export const saveCompensationPackage = async (pkg: CompensationPackage): Promise<CompensationPackage> => {
    await delay(300);
    MOCK_COMPENSATION_PACKAGES.push(pkg);
    return pkg;
};


export const fetchApprovalWorkflows = async (): Promise<ApprovalWorkflow[]> => {
    await delay(200);
    return MOCK_APPROVAL_WORKFLOWS;
};
export const saveApprovalWorkflow = async (workflow: ApprovalWorkflow): Promise<ApprovalWorkflow> => {
    await delay(300);
    const index = MOCK_APPROVAL_WORKFLOWS.findIndex(w => w.id === workflow.id);
    if (index > -1) MOCK_APPROVAL_WORKFLOWS[index] = workflow;
    else MOCK_APPROVAL_WORKFLOWS.push(workflow);
    return workflow;
};
export const deleteApprovalWorkflow = async (workflowId: string): Promise<{ id: string }> => {
    await delay(300);
    const index = MOCK_APPROVAL_WORKFLOWS.findIndex(w => w.id === workflowId);
    if(index > -1) MOCK_APPROVAL_WORKFLOWS.splice(index, 1);
    return { id: workflowId };
};

// --- Users ---
export const fetchUsers = async (): Promise<EmployeeProfile[]> => {
    await delay(500);
    return ALL_EMPLOYEES;
};

export const updateUserRole = async ({ userId, newRole }: { userId: string, newRole: UserRole }): Promise<EmployeeProfile> => {
    await delay(300);
    const user = ALL_EMPLOYEES.find(e => e.id === userId);
    if (user) {
        user.role = newRole;
        return user;
    }
    throw new Error("User not found");
};

export const deactivateUser = async (userId: string): Promise<EmployeeProfile> => {
    await delay(300);
    const user = ALL_EMPLOYEES.find(e => e.id === userId);
    if (user) {
        user.employmentStatus = 'Inactive';
        return user;
    }
    throw new Error("User not found");
};

export const reactivateUser = async (userId: string): Promise<EmployeeProfile> => {
    await delay(300);
    const user = ALL_EMPLOYEES.find(e => e.id === userId);
    if (user) {
        user.employmentStatus = 'دوام كامل';
        return user;
    }
    throw new Error("User not found");
};

export const bulkDeactivateUsers = async (userIds: string[]): Promise<void> => {
    await delay(500);
    userIds.forEach(id => {
        const user = ALL_EMPLOYEES.find(e => e.id === id);
        if (user) user.employmentStatus = 'Inactive';
    });
};
export const bulkAssignAttendancePolicy = async ({ policyId, employeeIds }: { policyId: string, employeeIds: string[] }): Promise<void> => {
    await delay(500);
    employeeIds.forEach(id => {
        const user = ALL_EMPLOYEES.find(e => e.id === id);
        if (user) user.attendancePolicyId = policyId;
    });
};
export const bulkAssignOvertimePolicy = async ({ policyId, employeeIds }: { policyId: string, employeeIds: string[] }): Promise<void> => {
    await delay(500);
    employeeIds.forEach(id => {
        const user = ALL_EMPLOYEES.find(e => e.id === id);
        if (user) user.overtimePolicyId = policyId;
    });
};
export const bulkAssignLeavePolicy = async ({ policyId, employeeIds }: { policyId: string, employeeIds: string[] }): Promise<void> => {
    await delay(500);
    employeeIds.forEach(id => {
        const user = ALL_EMPLOYEES.find(e => e.id === id);
        if (user) user.leavePolicyId = policyId;
    });
};

export const updateProfile = async (profile: EmployeeProfile): Promise<EmployeeProfile> => {
    await delay(300);
    const index = ALL_EMPLOYEES.findIndex(e => e.id === profile.id);
    if (index > -1) {
        ALL_EMPLOYEES[index] = { ...ALL_EMPLOYEES[index], ...profile };
        return ALL_EMPLOYEES[index];
    }
    throw new Error("User not found");
};

export const addNewUser = async (newUser: NewUserPayload): Promise<EmployeeProfile> => {
    await delay(500);
    const newEmployee: EmployeeProfile = {
        id: `emp-${Date.now()}`,
        employeeId: `BOK-${String(ALL_EMPLOYEES.length + 1).padStart(4, '0')}`,
        isEmployee: true,
        avatarUrl: `https://i.pravatar.cc/100?u=emp-${Date.now()}`,
        checkInStatus: 'CheckedOut',
        leaveBalances: [],
        employmentStatus: 'دوام كامل',
        performanceScore: 0,
        satisfactionSurveyScore: 0,
        lastPromotionDate: null,
        salaryComparedToMarket: 'Average',
        ...newUser,
        contact: {
            workEmail: newUser.workEmail,
            phone: newUser.phone,
            personalEmail: newUser.personalEmail,
        },
        personal: {
            dateOfBirth: newUser.dateOfBirth,
            nationality: newUser.nationality,
            nationalId: newUser.nationalId,
            maritalStatus: newUser.maritalStatus,
            gender: newUser.gender,
            religion: newUser.religion,
        },
        // These need to be derived
        title: MOCK_JOB_TITLES.find(jt => jt.id === newUser.jobTitleId)?.nameKey || 'Unknown',
        branchName: COMPANY_BRANCHES.find(b => b.id === newUser.branchId)?.nameKey || 'Unknown',
        manager: ALL_EMPLOYEES.find(e => e.id === newUser.managerId)?.name || undefined,
    };
    ALL_EMPLOYEES.push(newEmployee);
    return newEmployee;
};

export const updateUser = async ({ userId, updatedData }: { userId: string, updatedData: NewUserPayload }): Promise<EmployeeProfile> => {
    await delay(500);
    const index = ALL_EMPLOYEES.findIndex(e => e.id === userId);
    if (index > -1) {
        const existingUser = ALL_EMPLOYEES[index];
        const updatedUser: EmployeeProfile = {
            ...existingUser,
            ...updatedData,
            contact: {
                workEmail: updatedData.workEmail,
                phone: updatedData.phone,
                personalEmail: updatedData.personalEmail,
            },
            personal: {
                dateOfBirth: updatedData.dateOfBirth,
                nationality: updatedData.nationality,
                nationalId: updatedData.nationalId,
                maritalStatus: updatedData.maritalStatus,
                gender: updatedData.gender,
                religion: updatedData.religion,
            },
            title: MOCK_JOB_TITLES.find(jt => jt.id === updatedData.jobTitleId)?.nameKey || existingUser.title,
            branchName: COMPANY_BRANCHES.find(b => b.id === updatedData.branchId)?.nameKey || existingUser.branchName,
            manager: ALL_EMPLOYEES.find(e => e.id === updatedData.managerId)?.name || undefined,
        };
        ALL_EMPLOYEES[index] = updatedUser;
        return updatedUser;
    }
    throw new Error("User not found");
};

export const updateBranchManager = async ({ branchId, newManagerId }: { branchId: string, newManagerId: string }): Promise<void> => {
    // This is complex logic that might involve changing roles, handled client-side for now
};

export const updateEmployeeManager = async ({ employeeId, newManagerId }: { employeeId: string, newManagerId: string }): Promise<EmployeeProfile> => {
    await delay(300);
    const employee = ALL_EMPLOYEES.find(e => e.id === employeeId);
    if (employee) {
        employee.managerId = newManagerId;
        employee.manager = ALL_EMPLOYEES.find(e => e.id === newManagerId)?.name;
        return employee;
    }
    throw new Error("Employee not found");
};


// --- Company Structure ---
export const fetchBranches = async (): Promise<Branch[]> => {
    await delay(200);
    return COMPANY_BRANCHES;
};

export const addBranch = async (name: string): Promise<Branch> => {
    await delay(300);
    const newBranch = { id: `branch-${Date.now()}`, nameKey: name, status: 'Active' as const };
    COMPANY_BRANCHES.push(newBranch);
    return newBranch;
};

export const updateBranch = async ({ id, nameKey }: { id: string; nameKey: string }): Promise<Branch> => {
    await delay(300);
    const branch = COMPANY_BRANCHES.find(b => b.id === id);
    if (branch) {
        branch.nameKey = nameKey;
        return branch;
    }
    throw new Error("Branch not found");
};

export const archiveBranch = async (id: string): Promise<Branch> => {
    await delay(300);
    const branch = COMPANY_BRANCHES.find(b => b.id === id);
    if (branch) {
        branch.status = 'Archived';
        return branch;
    }
    throw new Error("Branch not found");
};

export const fetchJobTitles = async (): Promise<JobTitle[]> => {
    await delay(200);
    return MOCK_JOB_TITLES;
};

export const saveJobTitle = async (jobTitle: JobTitle): Promise<JobTitle> => {
    await delay(300);
    const index = MOCK_JOB_TITLES.findIndex(jt => jt.id === jobTitle.id);
    if (index > -1) {
        MOCK_JOB_TITLES[index] = jobTitle;
    } else {
        MOCK_JOB_TITLES.push(jobTitle);
    }
    return jobTitle;
};

export const deleteJobTitle = async (jobTitleId: string): Promise<{ id: string }> => {
    await delay(300);
    const index = MOCK_JOB_TITLES.findIndex(jt => jt.id === jobTitleId);
    if (index > -1) {
        MOCK_JOB_TITLES.splice(index, 1);
        return { id: jobTitleId };
    }
    throw new Error("Job title not found");
};
