import React, { useState, useEffect } from 'react';
import { EmployeeProfile, Branch, AttendancePolicy, LeavePolicy, JobTitle, OvertimePolicy } from '../types';
import ProfileDetailCard from './ProfileDetailCard';
import { PencilSquareIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

interface ProfilePageProps {
    currentUser: EmployeeProfile;
    branches: Branch[];
    attendancePolicies: AttendancePolicy[];
    overtimePolicies: OvertimePolicy[];
    leavePolicies: LeavePolicy[];
    jobTitles: JobTitle[];
    onUpdateProfile: (updatedProfile: EmployeeProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, branches, attendancePolicies, overtimePolicies, leavePolicies, jobTitles, onUpdateProfile }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(currentUser);

    useEffect(() => {
        setEditedProfile(currentUser);
        setIsEditing(false); // Reset edit mode on user change
    }, [currentUser]);

    const handleProfileChange = (field: string, value: any) => {
       if (field.includes('.')) {
            const [section, key] = field.split('.');
            setEditedProfile(prev => {
                const sectionKey = section as keyof EmployeeProfile;
                 if (typeof prev[sectionKey] === 'object' && prev[sectionKey] !== null) {
                    return {
                        ...prev,
                        [sectionKey]: {
                            ...(prev[sectionKey] as object),
                            [key]: value,
                        },
                    };
                }
                return prev;
            });
        } else {
             setEditedProfile(prev => ({
                ...prev,
                [field as keyof EmployeeProfile]: value
            }));
        }
    };
    
    const handleSave = () => {
        onUpdateProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(currentUser);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-sky-500"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{currentUser.name}</h1>
                        <p className="text-lg text-slate-500">{currentUser.title}</p>
                        <p className="text-sm text-slate-400 mt-1">ID: {currentUser.employeeId}</p>
                    </div>
                </div>
                 {isEditing ? (
                    <div className="flex items-center gap-2">
                         <button onClick={handleCancel} className="py-2 px-4 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300">{t('profilePage.cancelButton')}</button>
                         <button onClick={handleSave} className="py-2 px-4 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 shadow-sm">{t('profilePage.saveButton')}</button>
                    </div>
                ) : (
                    ['Super Admin', 'Admin'].includes(currentUser.role) && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-lg transition-colors">
                            <PencilSquareIcon className="w-5 h-5" />
                            <span>{t('profilePage.editButton')}</span>
                        </button>
                    )
                )}
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileDetailCard 
                    profile={editedProfile}
                    isEditing={isEditing}
                    onProfileChange={handleProfileChange}
                    branches={branches}
                    attendancePolicies={attendancePolicies}
                    overtimePolicies={overtimePolicies}
                    leavePolicies={leavePolicies}
                    jobTitles={jobTitles}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
