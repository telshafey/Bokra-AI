import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { EmployeeDocument, EmployeeProfile, DocumentType } from '../types';

interface DocumentAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (document: EmployeeDocument) => void;
    documentToEdit: EmployeeDocument | null;
    employees: EmployeeProfile[];
}

const DocumentAdminModal: React.FC<DocumentAdminModalProps> = ({ isOpen, onClose, onSave, documentToEdit, employees }) => {
    const getInitialState = (): Omit<EmployeeDocument, 'id'> => ({
        employeeId: '',
        name: '',
        type: 'عقد عمل',
        uploadDate: new Date().toISOString().split('T')[0],
        expirationDate: null,
    });
    
    const [doc, setDoc] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            if(documentToEdit) {
                 setDoc({
                    employeeId: documentToEdit.employeeId,
                    name: documentToEdit.name,
                    type: documentToEdit.type,
                    uploadDate: documentToEdit.uploadDate,
                    expirationDate: documentToEdit.expirationDate,
                });
            } else {
                setDoc(getInitialState());
            }
        }
    }, [isOpen, documentToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDoc(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalDocument: EmployeeDocument = {
            id: documentToEdit?.id || `doc-${Date.now()}`,
            ...doc,
        };
        onSave(finalDocument);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{documentToEdit ? 'تعديل مستند' : 'إضافة مستند جديد'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الموظف</label>
                            <select name="employeeId" value={doc.employeeId} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50" required>
                                <option value="">-- اختر الموظف --</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">نوع المستند</label>
                            <select name="type" value={doc.type} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50">
                                <option value="عقد عمل">عقد عمل</option>
                                <option value="مسوغات تعيين">مسوغات تعيين</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم/عنوان المستند</label>
                        <input type="text" name="name" value={doc.name} onChange={handleChange} placeholder="مثال: عقد عمل 2024" className="w-full p-2 border rounded-lg" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ انتهاء الصلاحية (إن وجد)</label>
                        <input type="date" name="expirationDate" value={doc.expirationDate || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">الملف</label>
                         <p className="text-xs text-slate-500 p-3 bg-slate-100 rounded-md">ميزة رفع الملفات قيد التطوير. سيتم حفظ البيانات فقط.</p>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-emerald-600 text-white rounded-lg">حفظ المستند</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentAdminModal;
