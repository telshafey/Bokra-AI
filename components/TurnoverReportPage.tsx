import React from 'react';
import { EmployeeProfile } from '../types';
import TurnoverReportRow from './TurnoverReportRow';
import PageHeader from './PageHeader';
import Card from './Card';

interface TurnoverReportPageProps {
    teamMembers: EmployeeProfile[];
}

const TurnoverReportPage: React.FC<TurnoverReportPageProps> = ({ teamMembers }) => {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="تحليل مخاطر التسرب الوظيفي (AI)"
                subtitle="استخدم الذكاء الاصطناعي لتحليل بيانات الموظفين وتوقع الموظفين المعرضين لخطر المغادرة."
            />
            
            <Card paddingClass="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">الموظف</th>
                                <th className="px-6 py-3">التحليل</th>
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