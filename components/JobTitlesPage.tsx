import React from 'react';
import type { JobTitle, EmployeeProfile } from '../types';
import JobTitlesManagement from './JobTitlesManagement';
import PageHeader from './PageHeader';
import Card from './Card';

interface JobTitlesPageProps {
    jobTitles: JobTitle[];
    employees: EmployeeProfile[];
    onSaveJobTitle: (jobTitle: JobTitle) => void;
    onDeleteJobTitle: (jobTitleId: string) => void;
}

const JobTitlesPage: React.FC<JobTitlesPageProps> = ({ jobTitles, employees, onSaveJobTitle, onDeleteJobTitle }) => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="إدارة الهيكل الوظيفي"
                subtitle="إدارة شجرة المسميات الوظيفية للشركة."
            />
            <Card paddingClass="p-6">
                <JobTitlesManagement 
                    jobTitles={jobTitles}
                    employees={employees}
                    onSave={onSaveJobTitle}
                    onDelete={onDeleteJobTitle}
                />
            </Card>
        </div>
    );
};

export default JobTitlesPage;