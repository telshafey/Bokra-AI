

import React, { useState, useMemo } from 'react';
import type { Asset, EmployeeProfile, Branch } from '../types';
import { PlusCircleIcon, PencilIcon, ArrowsRightLeftIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';
import PageHeader from './PageHeader';
import Card from './Card';
import AssetModal from './AssetModal';
import AssignAssetModal from './AssignAssetModal';
import { useAssetsContext } from './contexts/AssetsContext';
import ActionBar from './ActionBar';
// FIX: Import COMPANY_BRANCHES to resolve reference error.
import { COMPANY_BRANCHES } from '../constants';

type SortableKeys = 'name' | 'category' | 'serialNumber' | 'status' | 'assignedToId' | 'purchaseValue' | 'currentValue';

interface AssetsManagementPageProps {
    employees: EmployeeProfile[];
}

const AssetsManagementPage: React.FC<AssetsManagementPageProps> = ({ employees }) => {
    const { assets: allAssets, saveAsset: onSaveAsset, assignAsset: onAssignAsset } = useAssetsContext();
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [assigningAsset, setAssigningAsset] = useState<Asset | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: 'asc' | 'desc' } | null>(null);
    const [branchFilter, setBranchFilter] = useState('all');
    const [depreciationFilter, setDepreciationFilter] = useState<'all' | Asset['depreciationStatus']>('all');

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);
    const branches = useMemo(() => {
        const branchMap = new Map<string, Branch>();
        employees.forEach(e => {
            const branch = COMPANY_BRANCHES.find(b => b.id === e.branchId);
            if(branch && !branchMap.has(branch.id)) {
                branchMap.set(branch.id, { id: branch.id, name: branch.name, status: 'Active' });
            }
        });
        return Array.from(branchMap.values());
    }, [employees]);


    const sortedAndFilteredAssets = useMemo(() => {
        let filteredAssets = [...allAssets];

        // Filter by branch
        if (branchFilter !== 'all') {
            filteredAssets = filteredAssets.filter(asset => {
                if (!asset.assignedToId) return false;
                const employee = employeeMap.get(asset.assignedToId);
                return employee?.branchId === branchFilter;
            });
        }
        
        // Filter by depreciation status
        if (depreciationFilter !== 'all') {
            filteredAssets = filteredAssets.filter(asset => asset.depreciationStatus === depreciationFilter);
        }

        if (sortConfig) {
            filteredAssets.sort((a, b) => {
                let aValue: string | number | undefined = a[sortConfig.key as keyof Asset] || '';
                let bValue: string | number | undefined = b[sortConfig.key as keyof Asset] || '';

                if (sortConfig.key === 'assignedToId') {
                    aValue = a.assignedToId ? employeeMap.get(a.assignedToId)?.name || '' : '';
                    bValue = b.assignedToId ? employeeMap.get(b.assignedToId)?.name || '' : '';
                }
                
                if (aValue === undefined) aValue = 0;
                if (bValue === undefined) bValue = 0;

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filteredAssets;
    }, [allAssets, sortConfig, employeeMap, branchFilter, depreciationFilter]);

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

    const handleOpenAddModal = () => {
        setEditingAsset(null);
        setIsAssetModalOpen(true);
    };

    const handleOpenEditModal = (asset: Asset) => {
        setEditingAsset(asset);
        setIsAssetModalOpen(true);
    };
    
    const handleOpenAssignModal = (asset: Asset) => {
        setAssigningAsset(asset);
        setIsAssignModalOpen(true);
    };

    const headerAction = (
        <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
        >
            <PlusCircleIcon className="w-6 h-6" />
            <span>إضافة عهدة جديدة</span>
        </button>
    );

    return (
        <div className="space-y-6">
            <PageHeader 
                title="إدارة العهد"
                subtitle="تتبع أصول الشركة المسلمة للموظفين."
                actionButton={headerAction}
            />
             <ActionBar>
                 <div className="flex items-center gap-4">
                     <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="p-2 border rounded-lg text-sm bg-slate-50">
                        <option value="all">كل الفروع</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                     <select value={depreciationFilter} onChange={(e) => setDepreciationFilter(e.target.value as any)} className="p-2 border rounded-lg text-sm bg-slate-50">
                        <option value="all">كل حالات الإهلاك</option>
                        <option value="Normal">عادي</option>
                        <option value="NearingEOL">قارب على الانتهاء</option>
                        <option value="Depreciated">مُهلك بالكامل</option>
                    </select>
                </div>
            </ActionBar>
            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-6 py-3"><button onClick={() => handleSort('name')} className="flex items-center gap-1">العهدة {getSortIcon('name')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('category')} className="flex items-center gap-1">الفئة {getSortIcon('category')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('purchaseValue')} className="flex items-center gap-1">القيمة الشرائية {getSortIcon('purchaseValue')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('currentValue')} className="flex items-center gap-1">القيمة الحالية {getSortIcon('currentValue')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('status')} className="flex items-center gap-1">الحالة {getSortIcon('status')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => handleSort('assignedToId')} className="flex items-center gap-1">مسلمة إلى {getSortIcon('assignedToId')}</button></th>
                                <th className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredAssets.map(asset => (
                                <tr key={asset.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-semibold text-slate-800">{asset.name}</td>
                                    <td className="px-6 py-4">{asset.category}</td>
                                    <td className="px-6 py-4">{asset.purchaseValue.toLocaleString('ar-EG')} ج.م</td>
                                    <td className="px-6 py-4 font-semibold">{asset.currentValue?.toLocaleString('ar-EG')} ج.م</td>
                                    <td className="px-6 py-4">{asset.status}</td>
                                    <td className="px-6 py-4">{asset.assignedToId ? employeeMap.get(asset.assignedToId)?.name || 'N/A' : '-'}</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button onClick={() => handleOpenAssignModal(asset)} className="p-2 text-slate-500 hover:text-emerald-600 rounded-full" title="تسليم/استلام">
                                            <ArrowsRightLeftIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleOpenEditModal(asset)} className="p-2 text-slate-500 hover:text-sky-600 rounded-full" title="تعديل">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AssetModal 
                isOpen={isAssetModalOpen}
                onClose={() => setIsAssetModalOpen(false)}
                onSave={onSaveAsset}
                assetToEdit={editingAsset}
            />

            {assigningAsset && (
                <AssignAssetModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    onSave={onAssignAsset}
                    asset={assigningAsset}
                    employees={employees.filter(e => e.isEmployee)}
                />
            )}
        </div>
    );
};

export default AssetsManagementPage;