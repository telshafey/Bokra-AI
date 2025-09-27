import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Branch, JobTitle, CompanyStructureContextType, CompanyStructureProviderProps } from '../../types';
import * as api from '../../services/mockApi';
import { useToast } from './ToastContext';
import { useTranslation } from './LanguageContext';

const CompanyStructureContext = createContext<CompanyStructureContextType | undefined>(undefined);

export const useCompanyStructureContext = () => {
    const context = useContext(CompanyStructureContext);
    if (!context) throw new Error('useCompanyStructureContext must be used within a CompanyStructureProvider');
    return context;
};

export const CompanyStructureProvider: React.FC<CompanyStructureProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { t } = useTranslation();

    // --- Queries ---
    const { data: branches = [] } = useQuery<Branch[], Error>({
        queryKey: ['branches'],
        queryFn: api.fetchBranches,
    });
    
    const { data: jobTitles = [] } = useQuery<JobTitle[], Error>({
        queryKey: ['jobTitles'],
        queryFn: api.fetchJobTitles,
    });

    // --- Mutations ---
    const addBranchMutation = useMutation<Branch, Error, string>({
        mutationFn: api.addBranch,
        onSuccess: (newBranch) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            addToast(t('toasts.branchSaved'), 'success');
            // We return the newBranch from mutateAsync so the caller can use it
        },
    });

    const updateBranchMutation = useMutation<Branch, Error, { id: string; nameKey: string }>({
        mutationFn: api.updateBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            addToast(t('toasts.branchSaved'), 'success');
        },
    });

    const archiveBranchMutation = useMutation<Branch, Error, string>({
        mutationFn: api.archiveBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            addToast(t('toasts.branchArchived'), 'success');
        },
    });
    
    const saveJobTitleMutation = useMutation<JobTitle, Error, JobTitle>({
        mutationFn: api.saveJobTitle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobTitles'] });
            addToast(t('toasts.jobTitleSaved'), 'success');
        },
    });

    const deleteJobTitleMutation = useMutation<{ id: string }, Error, string>({
        mutationFn: api.deleteJobTitle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobTitles'] });
            addToast(t('toasts.jobTitleDeleted'), 'success');
        },
    });

    const value: CompanyStructureContextType = {
        branches,
        jobTitles,
        addBranch: (name: string) => addBranchMutation.mutateAsync(name),
        updateBranch: (id: string, name: string) => updateBranchMutation.mutateAsync({ id, nameKey: name }),
        archiveBranch: (id: string) => archiveBranchMutation.mutateAsync(id),
        saveJobTitle: (jobTitle: JobTitle) => saveJobTitleMutation.mutateAsync(jobTitle),
        deleteJobTitle: (jobTitleId: string) => deleteJobTitleMutation.mutateAsync(jobTitleId),
    };

    return <CompanyStructureContext.Provider value={value}>{children}</CompanyStructureContext.Provider>;
};