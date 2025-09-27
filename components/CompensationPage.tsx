import React from 'react';
import type { SalaryComponent, CompensationPackage } from '../types';
import CompensationManagement from './CompensationManagement';
import PageHeader from './PageHeader';
import Card from './Card';
import { useTranslation } from './contexts/LanguageContext';

interface CompensationPageProps {
    salaryComponents: SalaryComponent[];
    compensationPackages: CompensationPackage[];
    onSaveSalaryComponent: (component: SalaryComponent) => void;
    onSaveCompensationPackage: (pkg: CompensationPackage) => void;
}

const CompensationPage: React.FC<CompensationPageProps> = (props) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <PageHeader
                title={t('pageTitles.compensation')}
                subtitle="إدارة مكونات الرواتب وحزم التعويضات والمزايا."
            />
            <Card>
                <CompensationManagement {...props} />
            </Card>
        </div>
    );
};

export default CompensationPage;
