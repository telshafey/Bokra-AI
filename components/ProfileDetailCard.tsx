
import React from 'react';
import {
    PhoneIcon, EnvelopeIcon, CakeIcon, FlagIcon, IdentificationIcon, HeartIcon,
    UserCircleIcon, UsersIcon, CalendarIcon, DocumentDuplicateIcon, BriefcaseIcon, ShieldExclamationIcon, ExclamationTriangleIcon, ClockIcon
} from './icons/Icons';
import { EmployeeProfile, Branch, AttendancePolicy, EmployeeInfraction, LeavePolicy, JobTitle, OvertimePolicy } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface InfoItemProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    value?: string;
    isEditing?: boolean;
    fieldName?: string;
    fieldType?: 'text' | 'date' | 'select';
    options?: { value: string; label: string }[];
    onChange?: (field: string, value: string) => void;
    spellCheck?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, isEditing = false, fieldName = '', fieldType='text', options=[], onChange = () => {}, spellCheck }) => {
    const renderValue = () => {
        if (!isEditing) {
            return <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">{value || '-'}</p>;
        }

        switch(fieldType) {
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => onChange(fieldName, e.target.value)}
                        className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold"
                    >
                        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                );
            case 'date':
                 return <input type="date" value={value} onChange={(e) => onChange(fieldName, e.target.value)} className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold" />;
            default: // text
                 return <input type="text" value={value} onChange={(e) => onChange(fieldName, e.target.value)} className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold" spellCheck={spellCheck} />;
        }
    };
    
    return (
        <div className="flex items-start gap-4 py-3">
            <Icon className="w-6 h-6 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                {renderValue()}
            </div>
        </div>
    );
};

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 border-b dark:border-slate-700 pb-3">{title}</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {children}
        </div>
    </div>
);

interface ProfileDetailCardProps {
    profile: EmployeeProfile;
    isEditing?: boolean;
    onProfileChange?: (field: string, value: any) => void;
    branches?: Branch[];
    infractions?: EmployeeInfraction[];
    attendancePolicies?: AttendancePolicy[];
    overtimePolicies?: OvertimePolicy[];
    leavePolicies?: LeavePolicy[];
    jobTitles?: JobTitle[];
}

const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({ 
    profile, 
    isEditing = false, 
    onProfileChange = () => {}, 
    branches = [], 
    infractions = [], 
    attendancePolicies = [],
    overtimePolicies = [],
    leavePolicies = [],
    jobTitles = [],
}) => {
    const { t, language } = useTranslation();
    const locale = language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

    const branchOptions = branches.map(b => ({ value: b.id, label: t(b.nameKey) }));
    const jobTitleOptions = [{ value: '', label: t('profilePage.noPolicy') }, ...jobTitles.map(jt => ({ value: jt.id, label: t(jt.nameKey) }))];
    
    const activeAttendancePolicies = attendancePolicies.filter(p => p.status === 'Active');
    const activeOvertimePolicies = overtimePolicies.filter(p => p.status === 'Active');
    const activeLeavePolicies = leavePolicies.filter(p => p.status === 'Active');

    const attendancePolicyOptions = [{ value: '', label: t('profilePage.noPolicy') }, ...activeAttendancePolicies.map(p => ({ value: p.id, label: p.name }))];
    const overtimePolicyOptions = [{ value: '', label: t('profilePage.noPolicy') }, ...activeOvertimePolicies.map(p => ({ value: p.id, label: p.name }))];
    const leavePolicyOptions = [{ value: '', label: t('profilePage.noPolicy') }, ...activeLeavePolicies.map(p => ({ value: p.id, label: p.name }))];
    
    const hasInfractions = infractions && infractions.length > 0;
    
    return (
        <>
            <div className="space-y-6">
                <InfoCard title={t('profilePage.contactInfo')}>
                    <InfoItem icon={PhoneIcon} label={t('profilePage.phone')} value={profile.contact.phone} isEditing={isEditing} fieldName="contact.phone" onChange={onProfileChange} spellCheck={false} />
                    <InfoItem icon={EnvelopeIcon} label={t('profilePage.workEmail')} value={profile.contact.workEmail} isEditing={isEditing} fieldName="contact.workEmail" onChange={onProfileChange} spellCheck={false} />
                    <InfoItem icon={EnvelopeIcon} label={t('profilePage.personalEmail')} value={profile.contact.personalEmail} isEditing={isEditing} fieldName="contact.personalEmail" onChange={onProfileChange} spellCheck={false} />
                </InfoCard>
                
                <InfoCard title={t('profilePage.personalInfo')}>
                    <InfoItem icon={CakeIcon} label={t('profilePage.dob')} value={profile.personal.dateOfBirth} isEditing={isEditing} fieldName="personal.dateOfBirth" fieldType="date" onChange={onProfileChange} />
                    <InfoItem icon={FlagIcon} label={t('profilePage.nationality')} value={profile.personal.nationality} isEditing={isEditing} fieldName="personal.nationality" onChange={onProfileChange} spellCheck={true} />
                    <InfoItem icon={IdentificationIcon} label={t('profilePage.nationalId')} value={profile.personal.nationalId} spellCheck={false} />
                    <InfoItem icon={HeartIcon} label={t('profilePage.maritalStatus')} value={profile.personal.maritalStatus} isEditing={isEditing} fieldName="personal.maritalStatus" fieldType="select" options={[{value: 'أعزب', label: t('profilePage.maritalStatuses.single')}, {value: 'متزوج', label: t('profilePage.maritalStatuses.married')}]} onChange={onProfileChange} />
                    <InfoItem icon={UserCircleIcon} label={t('profilePage.gender')} value={profile.personal.gender} isEditing={isEditing} fieldName="personal.gender" fieldType="select" options={[{value: 'Male', label: t('profilePage.genders.male')}, {value: 'Female', label: t('profilePage.genders.female')}]} onChange={onProfileChange} />
                    <InfoItem icon={BriefcaseIcon} label={t('profilePage.religion')} value={profile.personal.religion} isEditing={isEditing} fieldName="personal.religion" fieldType="select" options={[{value: 'Muslim', label: t('profilePage.religions.muslim')}, {value: 'Christian', label: t('profilePage.religions.christian')}]} onChange={onProfileChange} />
                </InfoCard>
            </div>
            
            <div className="space-y-6">
                <InfoCard title={t('profilePage.jobInfo')}>
                    <InfoItem icon={BriefcaseIcon} label={t('profilePage.jobTitle')} value={isEditing ? profile.jobTitleId : profile.title} isEditing={isEditing} fieldName="jobTitleId" fieldType="select" options={jobTitleOptions} onChange={onProfileChange} />
                    <InfoItem icon={UsersIcon} label={t('profilePage.department')} value={t('departments.' + profile.departmentKey)} />
                    <InfoItem icon={UserCircleIcon} label={t('profilePage.manager')} value={profile.manager} />
                    <InfoItem icon={BriefcaseIcon} label={t('profilePage.branch')} value={isEditing ? profile.branchId : profile.branchName} isEditing={isEditing} fieldName="branchId" fieldType="select" options={branchOptions} onChange={onProfileChange} />
                    <InfoItem icon={CalendarIcon} label={t('profilePage.hireDate')} value={new Date(profile.hireDate).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })} />
                    <InfoItem icon={DocumentDuplicateIcon} label={t('profilePage.employmentStatus')} value={profile.employmentStatus} />
                     <div className="flex items-start gap-4 py-3">
                        <ShieldExclamationIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('profilePage.attendancePolicy')}</p>
                            {isEditing ? (
                                    <select
                                    value={profile.attendancePolicyId || ''}
                                    onChange={(e) => onProfileChange('attendancePolicyId', e.target.value)}
                                    className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold"
                                >
                                    {attendancePolicyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">{profile.attendancePolicyName || '-'}</p>
                                    {hasInfractions && (
                                        <div className="relative group">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                                            <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                {t('profilePage.hasInfractions')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start gap-4 py-3">
                        <ClockIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('profilePage.overtimePolicy')}</p>
                            {isEditing ? (
                                    <select
                                    value={profile.overtimePolicyId || ''}
                                    onChange={(e) => onProfileChange('overtimePolicyId', e.target.value)}
                                    className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold"
                                >
                                    {overtimePolicyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            ) : (
                                <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">{profile.overtimePolicyName || '-'}</p>
                            )}
                        </div>
                    </div>
                     <div className="flex items-start gap-4 py-3">
                        <BriefcaseIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('profilePage.leavePolicy')}</p>
                            {isEditing ? (
                                    <select
                                    value={profile.leavePolicyId || ''}
                                    onChange={(e) => onProfileChange('leavePolicyId', e.target.value)}
                                    className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold"
                                >
                                    {leavePolicyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            ) : (
                                <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">{profile.leavePolicyName || '-'}</p>
                            )}
                        </div>
                    </div>
                </InfoCard>
            </div>
        </>
    );
};

export default ProfileDetailCard;