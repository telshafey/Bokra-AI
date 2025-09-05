

import React, { createContext, useContext, useState } from 'react';
import { Branch, JobTitle, CompanyStructureContextType, CompanyStructureProviderProps } from '../../types';
import { COMPANY_BRANCHES, MOCK_JOB_TITLES } from '../../constants';

const CompanyStructureContext = createContext<CompanyStructureContextType | undefined>(undefined);

export const useCompanyStructureContext = () => {
    const context = useContext(CompanyStructureContext);
    if (!context) throw new Error('useCompanyStructureContext must be used within a CompanyStructureProvider');
    return context;
};

export const CompanyStructureProvider: React.FC<CompanyStructureProviderProps> = ({ children }) => {
    const [branches, setBranches] = useState<Branch[]>(COMPANY_BRANCHES);
    const [jobTitles, setJobTitles] = useState<JobTitle[]>(MOCK_JOB_TITLES);

    const addBranch = (nameKey: string): Branch => {
        const newBranch: Branch = {
            id: `branch-${nameKey.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
            // FIX: Changed property from `name` to `nameKey` to align with the `Branch` type definition.
            nameKey: nameKey,
            status: 'Active'
        };
        setBranches(prev => [...prev, newBranch]);
        return newBranch;
    };

    const updateBranch = (id: string, nameKey: string) => {
        // FIX: Changed property from `name` to `nameKey` to align with the `Branch` type definition.
        setBranches(prev => prev.map(b => b.id === id ? { ...b, nameKey: nameKey } : b));
    };

    const archiveBranch = (id: string) => {
        setBranches(prev => prev.map(b => b.id === id ? { ...b, status: 'Archived' } : b));
    };

    const saveJobTitle = (jobTitle: JobTitle) => {
        setJobTitles(prev => {
            const isNew = !prev.some(jt => jt.id === jobTitle.id);
            if (isNew) return [...prev, jobTitle];
            return prev.map(jt => jt.id === jobTitle.id ? jobTitle : jt);
        });
    };
    
    const deleteJobTitle = (jobTitleId: string) => {
        setJobTitles(prev => prev.filter(jt => jt.id !== jobTitleId));
    };

    const value = { branches, jobTitles, addBranch, updateBranch, archiveBranch, saveJobTitle, deleteJobTitle };

    return <CompanyStructureContext.Provider value={value}>{children}</CompanyStructureContext.Provider>;
};