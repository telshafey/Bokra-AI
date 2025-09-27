import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployeeProfile, UserContextType, UserProviderProps, NewUserPayload, UserRole } from '../../types';
import * as api from '../../services/mockApi';
import { useToast } from './ToastContext';
import { useTranslation } from './LanguageContext';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUserContext must be used within a UserProvider');
    return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const { data: employees = [], isError, error, isLoading } = useQuery<EmployeeProfile[], Error>({
        queryKey: ['users'],
        queryFn: api.fetchUsers,
    });
    
    const createMutation = (mutationFn: (...args: any[]) => Promise<any>, successMessageKey: string) => {
        return useMutation({
            mutationFn,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['users'] });
                queryClient.invalidateQueries({ queryKey: ['branches'] }); // Also invalidate branches in case a manager changes
                addToast(t(successMessageKey), 'success');
            },
            onError: (err: Error) => {
                addToast(err.message, 'error');
            },
        });
    };

    const updateUserRoleMutation = createMutation(api.updateUserRole, 'toasts.userRoleUpdated');
    const deactivateUserMutation = createMutation(api.deactivateUser, 'toasts.userDeactivated');
    const reactivateUserMutation = createMutation(api.reactivateUser, 'toasts.userReactivated');
    const bulkDeactivateUsersMutation = createMutation(api.bulkDeactivateUsers, 'toasts.userDeactivated');
    const bulkAssignAttendancePolicyMutation = createMutation(api.bulkAssignAttendancePolicy, 'toasts.policySaved');
    const bulkAssignOvertimePolicyMutation = createMutation(api.bulkAssignOvertimePolicy, 'toasts.policySaved');
    const bulkAssignLeavePolicyMutation = createMutation(api.bulkAssignLeavePolicy, 'toasts.policySaved');
    const updateProfileMutation = createMutation(api.updateProfile, 'toasts.profileUpdated');
    const addNewUserMutation = createMutation(api.addNewUser, 'toasts.userAdded');
    const updateUserMutation = createMutation(api.updateUser, 'toasts.userUpdated');
    const updateBranchManagerMutation = createMutation(api.updateBranchManager, 'toasts.branchManagerUpdated');
    const updateEmployeeManagerMutation = useMutation({ 
        mutationFn: api.updateEmployeeManager, 
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['users'] });
        } 
    });

    const value: UserContextType = {
        employees,
        isLoading,
        updateUserRole: async (userId, newRole) => {
            await updateUserRoleMutation.mutateAsync({ userId, newRole });
        },
        deactivateUser: async (userId) => {
            await deactivateUserMutation.mutateAsync(userId);
        },
        reactivateUser: async (userId) => {
            await reactivateUserMutation.mutateAsync(userId);
        },
        bulkDeactivateUsers: async (userIds) => {
            await bulkDeactivateUsersMutation.mutateAsync(userIds);
        },
        bulkAssignAttendancePolicy: async (policyId, employeeIds) => {
            await bulkAssignAttendancePolicyMutation.mutateAsync({ policyId, employeeIds });
        },
        bulkAssignOvertimePolicy: async (policyId, employeeIds) => {
            await bulkAssignOvertimePolicyMutation.mutateAsync({ policyId, employeeIds });
        },
        bulkAssignLeavePolicy: async (policyId, employeeIds) => {
            await bulkAssignLeavePolicyMutation.mutateAsync({ policyId, employeeIds });
        },
        updateProfile: async (updatedProfile) => {
            await updateProfileMutation.mutateAsync(updatedProfile);
        },
        addNewUser: async (newUser) => {
            await addNewUserMutation.mutateAsync(newUser);
        },
        updateUser: async (userId, updatedData) => {
            await updateUserMutation.mutateAsync({ userId, updatedData });
        },
        updateBranchManager: async (branchId, newManagerId) => {
            await updateBranchManagerMutation.mutateAsync({ branchId, newManagerId });
        },
        updateEmployeeManager: async (employeeId, newManagerId) => {
            await updateEmployeeManagerMutation.mutateAsync({ employeeId, newManagerId });
        },
    };
    
    if (isError) return <div>Error loading users: {error.message}</div>;

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};