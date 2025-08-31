import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { Branch, EmployeeProfile, NewUserPayload, UserRole, AttendancePolicy, LeavePolicy, JobTitle, CompensationPackage, OvertimePolicy } from '../types';

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
}> = ({ label, name, value, onChange, type = 'text', required = true, children }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children ? (
            React.cloneElement(children as React.ReactElement<any>, { name, id: name, value, onChange, required, className: "w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500" })
        ) : (
            <input type={type} name={name} id={name} value={value} onChange={onChange} required={required} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
        )}
    </div>
);


const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, userToEdit, branches, managers, attendancePolicies, overtimePolicies, leavePolicies, jobTitles, compensationPackages }) => {
    const getInitialState = (): NewUserPayload => ({
        name: '',
        jobTitleId: '',
        department: '',
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
                department: userToEdit.department,
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
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-0 pb-4 z-10">
                    <h2 className="text-2xl font-bold text-slate-800">{modalTitle}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-7 h-7" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Job Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 col-span-full border-b pb-2">المعلومات الوظيفية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField label="الاسم الكامل" name="name" value={formData.name} onChange={handleChange} />
                            <FormField label="المسمى الوظيفي" name="jobTitleId" value={formData.jobTitleId} onChange={handleChange}>
                                <select><option value="">-- اختر --</option>{jobTitles.map(jt => <option key={jt.id} value={jt.id}>{jt.name}</option>)}</select>
                            </FormField>
                            <FormField label="القسم" name="department" value={formData.department} onChange={handleChange} />
                            <FormField label="تاريخ التعيين" name="hireDate" value={formData.hireDate} onChange={handleChange} type="date" />
                             <FormField label="الراتب الأساسي" name="baseSalary" value={String(formData.baseSalary || '')} onChange={handleChange} type="number" />
                            <FormField label="الفرع" name="branchId" value={formData.branchId} onChange={handleChange}>
                                <select>{branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
                            </FormField>
                             <FormField label="المدير المباشر" name="managerId" value={formData.managerId} onChange={handleChange} required={false}>
                                <select><option value="">لا يوجد</option>{managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                            </FormField>
                            <FormField label="الدور (Role)" name="role" value={formData.role} onChange={handleChange}>
                                <select>{roles.map(r => <option key={r} value={r}>{r}</option>)}</select>
                            </FormField>
                             <FormField label="حزمة التعويضات" name="compensationPackageId" value={formData.compensationPackageId} onChange={handleChange} required={false}>
                                <select>
                                    <option value="">-- اختر حزمة --</option>
                                    {compensationPackages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="سياسة الحضور" name="attendancePolicyId" value={formData.attendancePolicyId} onChange={handleChange} required={false}>
                                <select>
                                    <option value="">بدون سياسة</option>
                                    {attendancePolicies
                                        .filter(p => p.status === 'Active')
                                        .map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="سياسة الوقت الإضافي" name="overtimePolicyId" value={formData.overtimePolicyId} onChange={handleChange} required={false}>
                                <select>
                                    <option value="">بدون سياسة</option>
                                    {overtimePolicies
                                        .filter(p => p.status === 'Active')
                                        .map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </FormField>
                             <FormField label="سياسة الإجازات" name="leavePolicyId" value={formData.leavePolicyId} onChange={handleChange} required={false}>
                                 <select>
                                    <option value="">بدون سياسة</option>
                                    {leavePolicies
                                        .filter(p => p.status === 'Active')
                                        .map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                 </select>
                            </FormField>
                        </div>
                    </section>

                    {/* Contact Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 col-span-full border-b pb-2">معلومات الاتصال</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField label="البريد الإلكتروني للعمل" name="workEmail" value={formData.workEmail} onChange={handleChange} type="email" />
                            <FormField label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleChange} type="tel" />
                            <FormField label="البريد الإلكتروني الشخصي" name="personalEmail" value={formData.personalEmail} onChange={handleChange} type="email" required={false} />
                        </div>
                    </section>
                    
                    {/* Personal Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 col-span-full border-b pb-2">المعلومات الشخصية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField label="تاريخ الميلاد" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
                            <FormField label="الجنسية" name="nationality" value={formData.nationality} onChange={handleChange} />
                            <FormField label="الرقم القومي" name="nationalId" value={formData.nationalId} onChange={handleChange} />
                             <FormField label="الحالة الاجتماعية" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                                <select><option value="أعزب">أعزب</option><option value="متزوج">متزوج</option></select>
                            </FormField>
                            <FormField label="الجنس" name="gender" value={formData.gender} onChange={handleChange}>
                                <select><option value="Male">ذكر</option><option value="Female">أنثى</option></select>
                            </FormField>
                            <FormField label="الديانة" name="religion" value={formData.religion} onChange={handleChange}>
                                <select><option value="Muslim">مسلم</option><option value="Christian">مسيحي</option></select>
                            </FormField>
                        </div>
                    </section>

                     {/* Address Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 col-span-full border-b pb-2">العنوان</h3>
                        <FormField label="العنوان بالتفصيل" name="address" value={formData.address} onChange={handleChange}>
                           <textarea rows={3}></textarea>
                        </FormField>
                    </section>

                     <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">{saveButtonText}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;