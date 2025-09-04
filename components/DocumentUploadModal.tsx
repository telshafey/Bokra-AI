
import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from './icons/Icons';
import type { EmployeeDocument, DocumentType } from '../types';
import { useTranslation } from './contexts/LanguageContext';

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (document: EmployeeDocument) => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [type, setType] = useState<DocumentType>('عقد عمل');
    const [expirationDate, setExpirationDate] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const documentTypes: DocumentType[] = ['عقد عمل', 'مسوغات تعيين', 'استمارة ١ (تأمينات)', 'استمارة ٢ (تأمينات)', 'استمارة ٦ (تأمينات)', 'شهادات تدريب'];

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !file) {
            alert("يرجى إدخال اسم المستند وإرفاق الملف.");
            return;
        }

        // In a real app, you would upload the file and get a URL.
        // For now, we'll just use the file name as a placeholder.
        const newDocument: EmployeeDocument = {
            id: `doc-${Date.now()}`,
            employeeId: '', // This will be set in the parent component
            name,
            type,
            uploadDate: new Date().toISOString().split('T')[0],
            expirationDate: expirationDate || null,
            fileUrl: file.name,
        };
        
        onSave(newDocument);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('myDocuments.uploadModal.title')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('myDocuments.uploadModal.docType')}</label>
                            <select value={type} onChange={e => setType(e.target.value as DocumentType)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white">
                                {documentTypes.map(docType => (
                                    <option key={docType} value={docType}>{t(`myDocuments.docTypes.${docType}`)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('myDocuments.uploadModal.expiryDate')}</label>
                            <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('myDocuments.uploadModal.docName')}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('myDocuments.uploadModal.docNamePlaceholder')} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg" required spellCheck="true"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('myDocuments.uploadModal.attachFile')}</label>
                        <label htmlFor="attachment" className="cursor-pointer bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600">
                           <ArrowUpTrayIcon className="w-8 h-8 mb-1"/>
                           <span className="text-sm">{file ? file.name : t('myDocuments.uploadModal.attachPrompt')}</span>
                           <input id="attachment" type="file" className="hidden" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
                        </label>
                    </div>
                     <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-500">{t('general.cancel')}</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-sm">{t('myDocuments.uploadModal.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentUploadModal;