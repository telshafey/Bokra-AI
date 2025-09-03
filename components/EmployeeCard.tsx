import React from 'react';
import { EmployeeProfile } from '../types';
import { PhoneIcon, EnvelopeIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

interface EmployeeCardProps {
    employee: EmployeeProfile;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <img src={employee.avatarUrl} alt={employee.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-200 dark:border-slate-700" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{employee.name}</h3>
            <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold">{employee.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t(`departments.${employee.departmentKey}`)}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2 text-sm">
                <a href={`mailto:${employee.contact.workEmail}`} className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>{employee.contact.workEmail}</span>
                </a>
                <a href={`tel:${employee.contact.phone}`} className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{employee.contact.phone}</span>
                </a>
            </div>
        </div>
    );
};

export default EmployeeCard;