
import React, { useState, useMemo } from 'react';
import { useUserContext } from './contexts/UserContext';
import { useCompanyStructureContext } from './contexts/CompanyStructureContext';
import { useTranslation } from './contexts/LanguageContext';
import PageHeader from './PageHeader';
import EmployeeCard from './EmployeeCard';
import { MagnifyingGlassIcon } from './icons/Icons';

const EmployeeDirectoryPage: React.FC = () => {
    const { t } = useTranslation();
    const { employees } = useUserContext();
    const { branches } = useCompanyStructureContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [branchFilter, setBranchFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const activeEmployees = useMemo(() => employees.filter(e => e.isEmployee), [employees]);

    const departments = useMemo(() => {
        const uniqueDepartments = [...new Set(activeEmployees.map(e => e.departmentKey))];
        return uniqueDepartments;
    }, [activeEmployees]);

    const filteredEmployees = useMemo(() => {
        return activeEmployees.filter(employee => {
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = employee.name.toLowerCase().includes(searchLower);
            const titleMatch = employee.title.toLowerCase().includes(searchLower);
            const branchMatch = branchFilter === 'all' || employee.branchId === branchFilter;
            const departmentMatch = departmentFilter === 'all' || employee.departmentKey === departmentFilter;

            return (nameMatch || titleMatch) && branchMatch && departmentMatch;
        });
    }, [activeEmployees, searchTerm, branchFilter, departmentFilter]);

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('employeeDirectory.pageHeaderTitle')}
                subtitle={t('employeeDirectory.pageHeaderSubtitle')}
            />

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('employeeDirectory.searchPlaceholder')}
                        className="w-full p-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        spellCheck="true"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white"
                    >
                        <option value="all">{t('employeeDirectory.allBranches')}</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{t(b.nameKey)}</option>)}
                    </select>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white"
                    >
                        <option value="all">{t('employeeDirectory.allDepartments')}</option>
                        {departments.map(d => <option key={d} value={d}>{t(`departments.${d}`)}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredEmployees.map(employee => (
                    <EmployeeCard key={employee.id} employee={employee} />
                ))}
            </div>

            {filteredEmployees.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <p className="text-slate-500 dark:text-slate-400">{t('employeeDirectory.noEmployeesFound')}</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeDirectoryPage;