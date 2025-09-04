
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { Branch, EmployeeProfile, NewUserPayload, UserRole, AttendancePolicy, LeavePolicy, JobTitle, CompensationPackage, OvertimePolicy } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: NewUserPayload) => void;
    userToEdit: EmployeeProfile | null;
    branches: Branch[];
    managers: EmployeeProfile[];
    attendancePolicies: AttendancePolicy[];
    overtimePolicies: OvertimePolicy[];
    leavePolicies: LeavePolicy[];
    jobTitles: JobTitle[];
    compensationPackages: CompensationPackage[];
}

const FormField: React.FC<{
    label: string;
    name: keyof NewUserPayload | string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    type?: string;
    required?: boolean;
    children?: React.ReactNode;
    spellCheck?: boolean;
}> = ({ label, name, value, onChange, type = 'text', required = true, children, spellCheck }) => (
    <div>
        <label htmlFor={name as string} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children ? (
            React.cloneElement(children as React.ReactElement<any>, { name, id: name, value, onChange, required, spellCheck, className: "w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500" })
        ) : (
            <input type={type} name={name as string} id={name as string} value={value} onChange={onChange} required={required} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" spellCheck={spellCheck} />
        )}
    </div>
);


const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, userToEdit, branches, managers, attendancePolicies, overtimePolicies, leavePolicies, jobTitles, compensationPackages }) => {
    const { t } = useTranslation();
    const departmentKeys = ['management', 'hr', 'it', 'sales', 'system'];

    const getInitialState = (): NewUserPayload => ({
        name: '',
        jobTitleId: '',
        departmentKey: 'it',
        hireDate: new Date().toISOString().split('T')[0],
        branchId: branches[0]?.id || '',
        role: 'Employee',
        managerId: '',
        attendancePolicyId: '',
        overtimePolicyId: '',
        leavePolicyId: '',
        compensationPackageId: '',
        baseSalary: 0,
        workEmail: '',
        phone: '',
        personalEmail: '',
        dateOfBirth: '',
        nationality: 'مصري',
        nationalId: '',
        maritalStatus: 'أعزب',
        gender: 'Male',
        religion: 'Muslim',
        address: '',
    });

    const [formData, setFormData] = useState<NewUserPayload>(getInitialState());

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                jobTitleId: userToEdit.jobTitleId || '',
                departmentKey: userToEdit.departmentKey,
                hireDate: userToEdit.hireDate,
                branchId: userToEdit.branchId,
                role: userToEdit.role,
                managerId: userToEdit.managerId || '',
                attendancePolicyId: userToEdit.attendancePolicyId || '',
                overtimePolicyId: userToEdit.overtimePolicyId || '',
                leavePolicyId: userToEdit.leavePolicyId || '',
                compensationPackageId: userToEdit.compensationPackageId || '',
                baseSalary: userToEdit.baseSalary,
                workEmail: userToEdit.contact.workEmail,
                phone: userToEdit.contact.phone,
                personalEmail: userToEdit.contact.personalEmail,
                dateOfBirth: userToEdit.personal.dateOfBirth,
                nationality: userToEdit.personal.nationality,
                nationalId: userToEdit.personal.nationalId,
                maritalStatus: userToEdit.personal.maritalStatus as 'أعزب' | 'متزوج', // Type assertion
                gender: userToEdit.personal.gender,
                religion: userToEdit.personal.religion as 'Muslim' | 'Christian', // Type assertion
                address: userToEdit.address,
            });
        } else {
            setFormData(getInitialState());
        }
    }, [userToEdit, isOpen, branches]);


    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumber = ['baseSalary'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const roles: UserRole[] = ['Super Admin', 'Admin', 'Branch Admin', 'General Manager', 'HR Manager', 'HR Specialist', 'Finance Manager', 'Team Lead', 'Employee'];
    const modalTitle = userToEdit ? 'تعديل بيانات الموظف' : 'إنشاء ملف موظف جديد';
    const saveButtonText = userToEdit ? 'حفظ التعديلات' : 'حفظ وإنشاء الملف';


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{modalTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b dark:border-slate-600 pb-2 text-slate-700 dark:text-slate-200">المعلومات الأساسية</h3>
                            <FormField label="الاسم الكامل" name="name" value={formData.name} onChange={handleChange} spellCheck={true} />
                            <FormField label="البريد الإلكتروني للعمل" name="workEmail" value={formData.workEmail} onChange={handleChange} type="email" spellCheck={false} />
                            <FormField label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleChange} spellCheck={false} />

                            <h3 className="font-semibold text-lg border-b dark:border-slate-600 pb-2 mt-4 text-slate-700 dark:text-slate-200">المعلومات الوظيفية</h3>
                            <FormField label="المسمى الوظيفي" name="jobTitleId" value={formData.jobTitleId} onChange={handleChange}>
                                <select>
                                    <option value="">-- اختر --</option>
                                    {jobTitles.map(jt => <option key={jt.id} value={jt.id}>{t(jt.nameKey)}</option>)}
                                </select>
                            </FormField>
                            <FormField label="القسم" name="departmentKey" value={formData.departmentKey} onChange={handleChange}>
                                <select>
                                    {departmentKeys.map(d => <option key={d} value={d}>{t(`departments.${d}`)}</option>)}
                                </select>
                            </FormField>
                            <FormField label="الفرع" name="branchId" value={formData.branchId} onChange={handleChange}>
                                <select>
                                    {branches.map(b => <option key={b.id} value={b.id}>{t(b.nameKey)}</option>)}
                                </select>
                            </FormField>
                            <FormField label="المدير المباشر" name="managerId" value={formData.managerId} onChange={handleChange} required={false}>
                                <select>
                                    <option value="">-- لا يوجد --</option>
                                    {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="تاريخ التعيين" name="hireDate" value={formData.hireDate} onChange={handleChange} type="date"/>
                            <FormField label="صلاحية النظام (Role)" name="role" value={formData.role} onChange={handleChange}>
                                <select>
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </FormField>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b dark:border-slate-600 pb-2 text-slate-700 dark:text-slate-200">التعويضات والسياسات</h3>
                            <FormField label="الراتب الأساسي" name="baseSalary" value={String(formData.baseSalary || '')} onChange={handleChange} type="number" required={false}/>
                            <FormField label="حزمة التعويضات" name="compensationPackageId" value={formData.compensationPackageId} onChange={handleChange} required={false}>
                                <select>
                                    <option value="">-- لا يوجد --</option>
                                    {compensationPackages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="سياسة الحضور" name="attendancePolicyId" value={formData.attendancePolicyId} onChange={handleChange} required={false}>
                                <select>
                                    <option value="">-- لا يوجد --</option>
                                    {attendancePolicies.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="سياسة الوقت الإضافي" name="overtimePolicyId" value={formData.overtimePolicyId} onChange={handleChange} required={false}>
                                <select>
                                    <option value="">-- لا يوجد --</option>
                                    {overtimePolicies.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="سياسة الإجازات" name="leavePolicyId" value={formData.leavePolicyId} onChange={handleChange} required={false}>
                                <select>
                                    <option value="">-- لا يوجد --</option>
                                    {leavePolicies.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </FormField>
                            <h3 className="font-semibold text-lg border-b dark:border-slate-600 pb-2 mt-4 text-slate-700 dark:text-slate-200">المعلومات الشخصية</h3>
                            <FormField label="البريد الإلكتروني الشخصي" name="personalEmail" value={formData.personalEmail} onChange={handleChange} type="email" required={false} spellCheck={false}/>
                            <FormField label="تاريخ الميلاد" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" required={false}/>
                            <FormField label="الجنسية" name="nationality" value={formData.nationality} onChange={handleChange} required={false} spellCheck={true}/>
                            <FormField label="الرقم القومي" name="nationalId" value={formData.nationalId} onChange={handleChange} required={false} spellCheck={false}/>
                            <FormField label="الحالة الاجتماعية" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required={false}>
                                <select>
                                    <option value="أعزب">أعزب</option>
                                    <option value="متزوج">متزوج</option>
                                </select>
                            </FormField>
                            <FormField label="الجنس" name="gender" value={formData.gender} onChange={handleChange} required={false}>
                                <select>
                                    <option value="Male">ذكر</option>
                                    <option value="Female">أنثى</option>
                                </select>
                            </FormField>
                            <FormField label="الديانة" name="religion" value={formData.religion} onChange={handleChange} required={false}>
                                <select>
                                    <option value="Muslim">مسلم</option>
                                    <option value="Christian">مسيحي</option>
                                </select>
                            </FormField>
                            <FormField label="العنوان" name="address" value={formData.address} onChange={handleChange} required={false} spellCheck={true}>
                                <textarea rows={2} />
                            </FormField>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t dark:border-slate-600 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-500">
                            إلغاء
                        </button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">
                            {saveButtonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
