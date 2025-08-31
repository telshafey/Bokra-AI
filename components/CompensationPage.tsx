import React from 'react';
import type { SalaryComponent, CompensationPackage } from '../types';
import CompensationManagement from './CompensationManagement';
import PageHeader from './PageHeader';
import Card from './Card';

interface CompensationPageProps {
    salaryComponents: SalaryComponent[];
    compensationPackages: CompensationPackage[];
    onSaveSalaryComponent: (component: SalaryComponent) => void;
    onSaveCompensationPackage: (pkg: CompensationPackage) => void;
}

const CompensationPage: React.FC<CompensationPageProps> = ({
    salaryComponents,
    compensationPackages,
    onSaveSalaryComponent,
    onSaveCompensationPackage
}) => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="إدارة التعويضات والمزايا"
                subtitle="إدارة مكونات وحزم الرواتب لضمان هيكل مالي عادل وشفاف."
            />
            <Card paddingClass="p-6">
                <CompensationManagement
                    salaryComponents={salaryComponents}
                    compensationPackages={compensationPackages}
                    onSaveSalaryComponent={onSaveSalaryComponent}
                    onSaveCompensationPackage={onSaveCompensationPackage}
                />
            </Card>
        </div>
    );
};

export default CompensationPage;