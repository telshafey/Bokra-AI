import React from 'react';
import {
    PhoneIcon, EnvelopeIcon, CakeIcon, FlagIcon, IdentificationIcon, HeartIcon,
    UserCircleIcon, UsersIcon, CalendarIcon, DocumentDuplicateIcon, BriefcaseIcon, ShieldExclamationIcon, ExclamationTriangleIcon, ClockIcon
} from './icons/Icons';
import { EmployeeProfile, Branch, AttendancePolicy, EmployeeInfraction, LeavePolicy, JobTitle, OvertimePolicy } from '../types';

interface InfoItemProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    value?: string;
    isEditing?: boolean;
    fieldName?: string;
    fieldType?: 'text' | 'date' | 'select';
    options?: { value: string; label: string }[];
    onChange?: (field: string, value: string) => void;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, isEditing = false, fieldName = '', fieldType='text', options=[], onChange = () => {} }) => {
    const renderValue = () => {
        if (!isEditing) {
            return <p className="font-semibold text-slate-800 break-words">{value || '-'}</p>;
        }

        switch(fieldType) {
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => onChange(fieldName, e.target.value)}
                        className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold"
                    >
                        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                );
            case 'date':
                 return <input type="date" value={value} onChange={(e) => onChange(fieldName, e.target.value)} className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold" />;
            default: // text
                 return <input type="text" value={value} onChange={(e) => onChange(fieldName, e.target.value)} className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold" />;
        }
    };
    
    return (
        <div className="flex items-start gap-4 py-3">
            <Icon className="w-6 h-6 text-slate-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm text-slate-500">{label}</p>
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
    <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
        <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-3">{title}</h3>
        <div className="divide-y divide-slate-100">
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
    const branchOptions = branches.map(b => ({ value: b.id, label: b.name }));
    const jobTitleOptions = [{ value: '', label: 'بدون منصب' }, ...jobTitles.map(jt => ({ value: jt.id, label: jt.name }))];
    
    const activeAttendancePolicies = attendancePolicies.filter(p => p.status === 'Active');
    const activeOvertimePolicies = overtimePolicies.filter(p => p.status === 'Active');
    const activeLeavePolicies = leavePolicies.filter(p => p.status === 'Active');

    const attendancePolicyOptions = [{ value: '', label: 'بدون سياسة' }, ...activeAttendancePolicies.map(p => ({ value: p.id, label: p.name }))];
    const overtimePolicyOptions = [{ value: '', label: 'بدون سياسة' }, ...activeOvertimePolicies.map(p => ({ value: p.id, label: p.name }))];
    const leavePolicyOptions = [{ value: '', label: 'بدون سياسة' }, ...activeLeavePolicies.map(p => ({ value: p.id, label: p.name }))];
    
    const hasInfractions = infractions && infractions.length > 0;
    
    return (
        <>
            <div className="space-y-6">
                <InfoCard title="معلومات الاتصال">
                    <InfoItem icon={PhoneIcon} label="رقم الهاتف" value={profile.contact.phone} isEditing={isEditing} fieldName="contact.phone" onChange={onProfileChange} />
                    <InfoItem icon={EnvelopeIcon} label="البريد الإلكتروني (العمل)" value={profile.contact.workEmail} isEditing={isEditing} fieldName="contact.workEmail" onChange={onProfileChange} />
                    <InfoItem icon={EnvelopeIcon} label="البريد الإلكتروني (شخصي)" value={profile.contact.personalEmail} isEditing={isEditing} fieldName="contact.personalEmail" onChange={onProfileChange} />
                </InfoCard>
                
                <InfoCard title="المعلومات الشخصية">
                    <InfoItem icon={CakeIcon} label="تاريخ الميلاد" value={profile.personal.dateOfBirth} isEditing={isEditing} fieldName="personal.dateOfBirth" fieldType="date" onChange={onProfileChange} />
                    <InfoItem icon={FlagIcon} label="الجنسية" value={profile.personal.nationality} isEditing={isEditing} fieldName="personal.nationality" onChange={onProfileChange} />
                    <InfoItem icon={IdentificationIcon} label="الرقم القومي" value={profile.personal.nationalId} />
                    <InfoItem icon={HeartIcon} label="الحالة الاجتماعية" value={profile.personal.maritalStatus} isEditing={isEditing} fieldName="personal.maritalStatus" fieldType="select" options={[{value: 'أعزب', label: 'أعزب'}, {value: 'متزوج', label: 'متزوج'}]} onChange={onProfileChange} />
                    <InfoItem icon={UserCircleIcon} label="الجنس" value={profile.personal.gender} isEditing={isEditing} fieldName="personal.gender" fieldType="select" options={[{value: 'Male', label: 'ذكر'}, {value: 'Female', label: 'أنثى'}]} onChange={onProfileChange} />
                    <InfoItem icon={BriefcaseIcon} label="الديانة" value={profile.personal.religion} isEditing={isEditing} fieldName="personal.religion" fieldType="select" options={[{value: 'Muslim', label: 'مسلم'}, {value: 'Christian', label: 'مسيحي'}]} onChange={onProfileChange} />
                </InfoCard>
            </div>
            
            <div className="space-y-6">
                <InfoCard title="المعلومات الوظيفية">
                    <InfoItem icon={BriefcaseIcon} label="المسمى الوظيفي" value={isEditing ? profile.jobTitleId : profile.title} isEditing={isEditing} fieldName="jobTitleId" fieldType="select" options={jobTitleOptions} onChange={onProfileChange} />
                    <InfoItem icon={UsersIcon} label="القسم" value={profile.department} />
                    <InfoItem icon={UserCircleIcon} label="المدير المباشر" value={profile.manager} />
                    <InfoItem icon={BriefcaseIcon} label="الفرع" value={isEditing ? profile.branchId : profile.branchName} isEditing={isEditing} fieldName="branchId" fieldType="select" options={branchOptions} onChange={onProfileChange} />
                    <InfoItem icon={CalendarIcon} label="تاريخ التعيين" value={new Date(profile.hireDate).toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })} />
                    <InfoItem icon={DocumentDuplicateIcon} label="الحالة الوظيفية" value={profile.employmentStatus} />
                     <div className="flex items-start gap-4 py-3">
                        <ShieldExclamationIcon className="w-6 h-6 text-slate-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-500">سياسة الحضور والمخالفات</p>
                            {isEditing ? (
                                    <select
                                    value={profile.attendancePolicyId || ''}
                                    onChange={(e) => onProfileChange('attendancePolicyId', e.target.value)}
                                    className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold"
                                >
                                    {attendancePolicyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-slate-800 break-words">{profile.attendancePolicyName || '-'}</p>
                                    {hasInfractions && (
                                        <div className="relative group">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                                            <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                لدى الموظف مخالفات مسجلة
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start gap-4 py-3">
                        <ClockIcon className="w-6 h-6 text-slate-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-500">سياسة الوقت الإضافي</p>
                            {isEditing ? (
                                    <select
                                    value={profile.overtimePolicyId || ''}
                                    onChange={(e) => onProfileChange('overtimePolicyId', e.target.value)}
                                    className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold"
                                >
                                    {overtimePolicyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            ) : (
                                <p className="font-semibold text-slate-800 break-words">{profile.overtimePolicyName || '-'}</p>
                            )}
                        </div>
                    </div>
                     <div className="flex items-start gap-4 py-3">
                        <BriefcaseIcon className="w-6 h-6 text-slate-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-500">سياسة الإجازات</p>
                            {isEditing ? (
                                    <select
                                    value={profile.leavePolicyId || ''}
                                    onChange={(e) => onProfileChange('leavePolicyId', e.target.value)}
                                    className="w-full p-1 border border-slate-300 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold"
                                >
                                    {leavePolicyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            ) : (
                                <p className="font-semibold text-slate-800 break-words">{profile.leavePolicyName || '-'}</p>
                            )}
                        </div>
                    </div>
                </InfoCard>
            </div>
        </>
    );
};

export default ProfileDetailCard;