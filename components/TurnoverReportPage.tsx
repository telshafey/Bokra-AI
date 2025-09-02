
import React from 'react';
import { EmployeeProfile } from '../types';
import TurnoverReportRow from './TurnoverReportRow';
import PageHeader from './PageHeader';
import Card from './Card';
import { useTranslation } from './contexts/LanguageContext';

interface TurnoverReportPageProps {
    teamMembers: EmployeeProfile[];
}

const TurnoverReportPage: React.FC<TurnoverReportPageProps> = ({ teamMembers }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <PageHeader 
                title={t('turnover.pageHeaderTitle')}
                subtitle={t('turnover.pageHeaderSubtitle')}
            />
            
            <Card paddingClass="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">{t('general.employee')}</th>
                                <th className="px-6 py-3">{t('turnover.analysis')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map(member => (
                                <TurnoverReportRow key={member.id} employee={member} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default TurnoverReportPage;
