import React, { useState, useMemo } from 'react';
import { EmployeeDocument, EmployeeProfile, DocumentType } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';
import DocumentAdminModal from './DocumentAdminModal';
import PageHeader from './PageHeader';
import Card from './Card';
import ActionBar from './ActionBar';

type SortableKeys = 'name' | 'employeeId' | 'uploadDate';

interface DocumentManagementPageProps {
    allDocuments: EmployeeDocument[];
    employees: EmployeeProfile[];
    onSaveDocument: (document: EmployeeDocument) => void;
    onBulkDeleteDocuments: (documentIds: string[]) => void;
}

const DocumentManagementPage: React.FC<DocumentManagementPageProps> = ({ allDocuments, employees, onSaveDocument, onBulkDeleteDocuments }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<EmployeeDocument | null>(null);
    const [filter, setFilter] = useState<{ type: string, employeeId: string }>({ type: 'all', employeeId: 'all' });
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: 'asc' | 'desc' } | null>({ key: 'uploadDate', direction: 'desc' });
    const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e.name])), [employees]);

    const filteredAndSortedDocuments = useMemo(() => {
        let docs = allDocuments.filter(d => {
            const typeMatch = filter.type === 'all' || d.type === filter.type;
            const employeeMatch = filter.employeeId === 'all' || d.employeeId === filter.employeeId;
            return typeMatch && employeeMatch;
        });

        if (sortConfig) {
            docs.sort((a, b) => {
                let aValue: string | number = a[sortConfig.key];
                let bValue: string | number = b[sortConfig.key];
                
                if(sortConfig.key === 'employeeId') {
                    aValue = employeeMap.get(aValue) || '';
                    bValue = employeeMap.get(bValue) || '';
                } else if (sortConfig.key === 'uploadDate') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return docs;
    }, [allDocuments, filter, sortConfig, employeeMap]);

    const handleSort = (key: SortableKeys) => {
        setSortConfig(prev => {
            const isAsc = prev?.key === key && prev.direction === 'asc';
            return { key, direction: isAsc ? 'desc' : 'asc' };
        });
    };
    
    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
        return sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
    };

    const handleToggleSelect = (docId: string) => {
        setSelectedDocIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(docId)) newSet.delete(docId);
            else newSet.add(docId);
            return newSet;
        });
    };

    const handleToggleSelectAll = () => {
        if (selectedDocIds.size === filteredAndSortedDocuments.length) {
            setSelectedDocIds(new Set());
        } else {
            setSelectedDocIds(new Set(filteredAndSortedDocuments.map(d => d.id)));
        }
    };

    const handleBulkDelete = () => {
        if(confirm(`هل أنت متأكد من حذف ${selectedDocIds.size} مستندات؟`)) {
            onBulkDeleteDocuments(Array.from(selectedDocIds));
            setSelectedDocIds(new Set());
        }
    };


    const handleOpenAddModal = () => {
        setEditingDocument(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (doc: EmployeeDocument) => {
        setEditingDocument(doc);
        setIsModalOpen(true);
    };

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

    const headerAction = (
        <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
            <PlusCircleIcon className="w-6 h-6" />
            <span>إضافة مستند لموظف</span>
        </button>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="إدارة المستندات"
                subtitle="تتبع جميع المستندات الرسمية للموظفين في مكان واحد."
                actionButton={headerAction}
            />
             <ActionBar>
                <div className="flex items-center gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600 mr-2">النوع:</label>
                        <select value={filter.type} onChange={e => setFilter(f => ({...f, type: e.target.value}))} className="p-2 border rounded-lg text-sm bg-slate-50">
                            <option value="all">الكل</option>
                            <option value="عقد عمل">عقد عمل</option>
                            <option value="مسوغات تعيين">مسوغات تعيين</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-600 mr-2">الموظف:</label>
                        <select value={filter.employeeId} onChange={e => setFilter(f => ({...f, employeeId: e.target.value}))} className="p-2 border rounded-lg text-sm bg-slate-50">
                            <option value="all">الكل</option>
                            {employees.filter(e => e.isEmployee).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                </div>
                <div/>
            </ActionBar>
            
             {selectedDocIds.size > 0 && (
                <div className="bg-sky-100 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-sky-800 font-semibold">{selectedDocIds.size} مستندات محددة</span>
                    <button onClick={handleBulkDelete} className="bg-red-500 text-white font-semibold px-3 py-1 rounded-md text-sm hover:bg-red-600">حذف المحدد</button>
                </div>
            )}


            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                         <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="p-4"><input type="checkbox" onChange={handleToggleSelectAll} checked={selectedDocIds.size === filteredAndSortedDocuments.length && filteredAndSortedDocuments.length > 0}/></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('name')} className="flex items-center gap-1">اسم المستند {getSortIcon('name')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('employeeId')} className="flex items-center gap-1">الموظف {getSortIcon('employeeId')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('uploadDate')} className="flex items-center gap-1">تاريخ الرفع {getSortIcon('uploadDate')}</button></th>
                                <th className="px-6 py-3">انتهاء الصلاحية</th>
                                <th className="px-6 py-3">الحالة</th>
                                <th className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedDocuments.map(doc => {
                                const status = getStatus(doc);
                                return (
                                <tr key={doc.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="p-4"><input type="checkbox" checked={selectedDocIds.has(doc.id)} onChange={() => handleToggleSelect(doc.id)} /></td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">{doc.name}</td>
                                    <td className="px-6 py-4">{employeeMap.get(doc.employeeId) || 'N/A'}</td>
                                    <td className="px-6 py-4">{new Date(doc.uploadDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                    <td className="px-6 py-4">{doc.expirationDate ? new Date(doc.expirationDate).toLocaleDateString('ar-EG-u-nu-latn') : '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-1">
                                        <button onClick={() => handleOpenEditModal(doc)} className="p-2 text-slate-500 hover:text-sky-600" title="تعديل">
                                            <PencilIcon className="w-5 h-5"/>
                                        </button>
                                         <button onClick={() => onBulkDeleteDocuments([doc.id])} className="p-2 text-slate-500 hover:text-red-600" title="حذف">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>

             <DocumentAdminModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveDocument}
                documentToEdit={editingDocument}
                employees={employees.filter(e => e.isEmployee)}
            />
        </div>
    );
};

export default DocumentManagementPage;