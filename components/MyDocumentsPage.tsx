
import React, { useState, useMemo } from 'react';
import type { EmployeeDocument } from '../types';
import { PlusCircleIcon, ArrowDownTrayIcon } from './icons/Icons';
import DocumentUploadModal from './DocumentUploadModal';

interface MyDocumentsPageProps {
    documents: EmployeeDocument[];
    onSaveDocument: (document: EmployeeDocument) => void;
}

const MyDocumentsPage: React.FC<MyDocumentsPageProps> = ({ documents, onSaveDocument }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const sortedDocuments = useMemo(() => {
        return [...documents].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }, [documents]);

    const getStatus = (doc: EmployeeDocument): { text: string; color: string } => {
        if (!doc.expirationDate) {
            return { text: 'سارٍ', color: 'bg-emerald-100 text-emerald-800' };
        }
        const isExpired = new Date(doc.expirationDate) < new Date();
        if (isExpired) {
            return { text: 'منتهي الصلاحية', color: 'bg-red-100 text-red-800' };
        }
        return { text: 'سارٍ', color: 'bg-emerald-100 text-emerald-800' };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">أوراقي ومستنداتي</h1>
                    <p className="text-slate-500 mt-1">مكان مركزي لجميع مستنداتك الوظيفية الهامة.</p>
                </div>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>إضافة مستند جديد</span>
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-4">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المستند</th>
                                <th scope="col" className="px-6 py-3">النوع</th>
                                <th scope="col" className="px-6 py-3">تاريخ الرفع</th>
                                <th scope="col" className="px-6 py-3">تاريخ انتهاء الصلاحية</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDocuments.map(doc => {
                                const status = getStatus(doc);
                                return (
                                    <tr key={doc.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-semibold text-slate-800">{doc.name}</td>
                                        <td className="px-6 py-4">{doc.type}</td>
                                        <td className="px-6 py-4">{new Date(doc.uploadDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                        <td className="px-6 py-4">{doc.expirationDate ? new Date(doc.expirationDate).toLocaleDateString('ar-EG-u-nu-latn') : '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                {status.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 text-slate-400 hover:text-sky-600" title="تحميل">
                                                <ArrowDownTrayIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <DocumentUploadModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveDocument}
            />
        </div>
    );
};

export default MyDocumentsPage;
