
import React, { useState, useMemo } from 'react';
import type { EmployeeDocument } from '../types';
import { PlusCircleIcon, ArrowDownTrayIcon } from './icons/Icons';
import DocumentUploadModal from './DocumentUploadModal';
import { useTranslation } from './contexts/LanguageContext';

interface MyDocumentsPageProps {
    documents: EmployeeDocument[];
    onSaveDocument: (document: EmployeeDocument) => void;
}

const MyDocumentsPage: React.FC<MyDocumentsPageProps> = ({ documents, onSaveDocument }) => {
    const { t, language } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const locale = language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
    
    const sortedDocuments = useMemo(() => {
        return [...documents].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }, [documents]);

    const getStatus = (doc: EmployeeDocument): { text: string; color: string } => {
        if (!doc.expirationDate) {
            return { text: t('myDocuments.statuses.valid'), color: 'bg-emerald-100 text-emerald-800' };
        }
        const isExpired = new Date(doc.expirationDate) < new Date();
        if (isExpired) {
            return { text: t('myDocuments.statuses.expired'), color: 'bg-red-100 text-red-800' };
        }
        return { text: t('myDocuments.statuses.valid'), color: 'bg-emerald-100 text-emerald-800' };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{t('myDocuments.pageHeaderTitle')}</h1>
                    <p className="text-slate-500 mt-1">{t('myDocuments.pageHeaderSubtitle')}</p>
                </div>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>{t('myDocuments.addDocument')}</span>
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-4">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('myDocuments.table.name')}</th>
                                <th scope="col" className="px-6 py-3">{t('myDocuments.table.type')}</th>
                                <th scope="col" className="px-6 py-3">{t('myDocuments.table.uploadDate')}</th>
                                <th scope="col" className="px-6 py-3">{t('myDocuments.table.expiryDate')}</th>
                                <th scope="col" className="px-6 py-3">{t('myDocuments.table.status')}</th>
                                <th scope="col" className="px-6 py-3">{t('myDocuments.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDocuments.map(doc => {
                                const status = getStatus(doc);
                                return (
                                    <tr key={doc.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-semibold text-slate-800">{doc.name}</td>
                                        {/* FIX: Removed invalid second argument from translation function `t`. The function expects an object for replacements, but a string was provided. */}
                                        <td className="px-6 py-4">{t(`myDocuments.docTypes.${doc.type}`)}</td>
                                        <td className="px-6 py-4">{new Date(doc.uploadDate).toLocaleDateString(locale)}</td>
                                        <td className="px-6 py-4">{doc.expirationDate ? new Date(doc.expirationDate).toLocaleDateString(locale) : '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                {status.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 text-slate-400 hover:text-sky-600" title={t('myDocuments.download')}>
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
