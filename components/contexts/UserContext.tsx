
import React, { createContext, useContext, useState } from 'react';
import { EmployeeProfile, UserContextType, UserProviderProps, NewUserPayload, UserRole } from '../../types';
import { ALL_EMPLOYEES } from '../../constants';
import { useCompanyStructureContext } from './CompanyStructureContext';
import { useTranslation } from './LanguageContext';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUserContext must be used within a UserProvider');
    return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { jobTitles } = useCompanyStructureContext();
    const [employees, setEmployees] = useState<EmployeeProfile[]>(ALL_EMPLOYEES);
    const { t } = useTranslation();

    const updateUserRole = (userId: string, newRole: UserRole) => {
        setEmployees(prev => prev.map(emp => emp.id === userId ? { ...emp, role: newRole } : emp));
    };

    const deactivateUser = (userId: string) => {
        const deactivationDate = new Date().toISOString();
        setEmployees(prev => prev.map(emp => emp.id === userId ? { ...emp, employmentStatus: 'Inactive', deactivationDate } : emp));
    };
    
    const bulkDeactivateUsers = (userIds: string[]) => {
        const deactivationDate = new Date().toISOString();
        setEmployees(prev => prev.map(emp => userIds.includes(emp.id) ? { ...emp, employmentStatus: 'Inactive', deactivationDate } : emp));
    };
    
    const reactivateUser = (userId: string) => {
        setEmployees(prev => prev.map(emp => emp.id === userId ? { ...emp, employmentStatus: 'دوام كامل', deactivationDate: undefined } : emp));
    };
    
    const bulkAssignAttendancePolicy = (policyId: string, employeeIds: string[]) => {
        setEmployees(prev => prev.map(emp => employeeIds.includes(emp.id) ? { ...emp, attendancePolicyId: policyId } : emp));
    };
    
    const bulkAssignOvertimePolicy = (policyId: string, employeeIds: string[]) => {
        setEmployees(prev => prev.map(emp => employeeIds.includes(emp.id) ? { ...emp, overtimePolicyId: policyId } : emp));
    };
    
    const bulkAssignLeavePolicy = (policyId: string, employeeIds: string[]) => {
        setEmployees(prev => prev.map(emp => employeeIds.includes(emp.id) ? { ...emp, leavePolicyId: policyId } : emp));
    };
    
    const updateProfile = (updatedProfile: EmployeeProfile) => {
        setEmployees(prev => prev.map(emp => emp.id === updatedProfile.id ? updatedProfile : emp));
    };

    const addNewUser = (newUserPayload: NewUserPayload) => {
        const newEmployeeId = `BOK-${Math.floor(1000 + Math.random() * 9000)}`;
        const newId = `emp-${Math.floor(1000 + Math.random() * 9000)}`;
        // FIX: Changed property access from `name` to `nameKey` and used the translation function to get the display title.
        const jobTitle = jobTitles.find(jt => jt.id === newUserPayload.jobTitleId);

        const newUserProfile: EmployeeProfile = {
          id: newId,
          employeeId: newEmployeeId,
          name: newUserPayload.name,
          jobTitleId: newUserPayload.jobTitleId,
          title: jobTitle ? t(jobTitle.nameKey) : '',
          role: newUserPayload.role,
          isEmployee: true,
          avatarUrl: `https://i.pravatar.cc/100?u=${newId}`,
          // FIX: Changed property from `department` to `departmentKey` to match type definitions.
          departmentKey: newUserPayload.departmentKey,
          hireDate: newUserPayload.hireDate,
          employmentStatus: 'دوام كامل',
          managerId: newUserPayload.managerId,
          branchId: newUserPayload.branchId,
          checkInStatus: 'CheckedOut',
          leaveBalances: [],
          baseSalary: newUserPayload.baseSalary,
          attendancePolicyId: newUserPayload.attendancePolicyId,
          overtimePolicyId: newUserPayload.overtimePolicyId,
          leavePolicyId: newUserPayload.leavePolicyId,
          compensationPackageId: newUserPayload.compensationPackageId,
          contact: {
              phone: newUserPayload.phone,
              workEmail: newUserPayload.workEmail,
              personalEmail: newUserPayload.personalEmail,
          },
          personal: {
              dateOfBirth: newUserPayload.dateOfBirth,
              nationality: newUserPayload.nationality,
              nationalId: newUserPayload.nationalId,
              maritalStatus: newUserPayload.maritalStatus,
              gender: newUserPayload.gender,
              religion: newUserPayload.religion,
          },
          address: newUserPayload.address,
          performanceScore: 4.0, 
          satisfactionSurveyScore: 4.0,
          lastPromotionDate: null,
          salaryComparedToMarket: 'Average',
        };
        setEmployees(prev => [...prev, newUserProfile]);
    };
  
    const updateUser = (userId: string, updatedData: NewUserPayload) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === userId) {
                // FIX: Changed property access from `name` to `nameKey` and used the translation function to get the display title.
                const jobTitle = jobTitles.find(jt => jt.id === updatedData.jobTitleId);
                return {
                    ...emp,
                    name: updatedData.name,
                    jobTitleId: updatedData.jobTitleId,
                    title: jobTitle ? t(jobTitle.nameKey) : emp.title,
                    // FIX: Changed property from `department` to `departmentKey` to match type definitions.
                    departmentKey: updatedData.departmentKey,
                    hireDate: updatedData.hireDate,
                    branchId: updatedData.branchId,
                    role: updatedData.role,
                    managerId: updatedData.managerId,
                    baseSalary: updatedData.baseSalary,
                    attendancePolicyId: updatedData.attendancePolicyId,
                    overtimePolicyId: updatedData.overtimePolicyId,
                    leavePolicyId: updatedData.leavePolicyId,
                    compensationPackageId: updatedData.compensationPackageId,
                    contact: {
                        phone: updatedData.phone,
                        workEmail: updatedData.workEmail,
                        personalEmail: updatedData.personalEmail,
                    },
                    personal: {
                        ...emp.personal,
                        dateOfBirth: updatedData.dateOfBirth,
                        nationality: updatedData.nationality,
                        nationalId: updatedData.nationalId,
                        maritalStatus: updatedData.maritalStatus,
                        gender: updatedData.gender,
                        religion: updatedData.religion,
                    },
                    address: updatedData.address,
                };
            }
            return emp;
        }));
    };

    const updateBranchManager = (branchId: string, newManagerId: string) => {
        setEmployees(prev => {
            const oldManager = prev.find(e => e.branchId === branchId && e.role === 'Branch Admin');
            
            return prev.map(emp => {
                // Demote old manager if they are not the new manager
                if (oldManager && emp.id === oldManager.id && emp.id !== newManagerId) {
                     return { ...emp, role: 'Employee' }; 
                }
                // Assign new manager
                if (emp.id === newManagerId) {
                    return { ...emp, branchId: branchId, role: 'Branch Admin' }; 
                }
                return emp;
            });
        });
    };

    const updateEmployeeManager = (employeeId: string, newManagerId: string) => {
        setEmployees(prev => prev.map(emp => 
            emp.id === employeeId ? { ...emp, managerId: newManagerId } : emp
        ));
    };

    const value = {
        employees,
        updateUserRole,
        deactivateUser,
        bulkDeactivateUsers,
        reactivateUser,
        bulkAssignAttendancePolicy,
        bulkAssignOvertimePolicy,
        bulkAssignLeavePolicy,
        updateProfile,
        addNewUser,
        updateUser,
        updateBranchManager,
        updateEmployeeManager,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
