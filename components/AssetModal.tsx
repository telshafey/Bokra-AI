import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { Asset, AssetCategory, DepreciationMethod } from '../types';

interface AssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: Asset) => void;
    assetToEdit: Asset | null;
}

const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, onSave, assetToEdit }) => {
    const getInitialState = (): Omit<Asset, 'id' | 'status' | 'assignedToId' | 'currentValue'> => ({
        name: '',
        category: 'Hardware',
        serialNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseValue: 0,
        depreciationMethod: 'Straight-line',
        usefulLifeYears: 5,
    });

    const [assetData, setAssetData] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            if (assetToEdit) {
                setAssetData({
                    name: assetToEdit.name,
                    category: assetToEdit.category,
                    serialNumber: assetToEdit.serialNumber,
                    purchaseDate: assetToEdit.purchaseDate,
                    purchaseValue: assetToEdit.purchaseValue,
                    depreciationMethod: assetToEdit.depreciationMethod,
                    usefulLifeYears: assetToEdit.usefulLifeYears,
                });
            } else {
                setAssetData(getInitialState());
            }
        }
    }, [isOpen, assetToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setAssetData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalAsset: Asset = {
            id: assetToEdit?.id || `asset-${Date.now()}`,
            status: assetToEdit?.status || 'Available',
            assignedToId: assetToEdit?.assignedToId || null,
            ...assetData,
        };
        onSave(finalAsset);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{assetToEdit ? 'تعديل بيانات العهدة' : 'إضافة عهدة جديدة'}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم العهدة</label>
                            <input name="name" type="text" value={assetData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الفئة</label>
                            <select name="category" value={assetData.category} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50">
                                <option value="Hardware">أجهزة</option>
                                <option value="Software">برامج</option>
                                <option value="Furniture">أثاث</option>
                                <option value="Vehicle">مركبات</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">الرقم التسلسلي</label>
                        <input name="serialNumber" type="text" value={assetData.serialNumber} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ الشراء</label>
                            <input name="purchaseDate" type="date" value={assetData.purchaseDate} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">القيمة الشرائية (ج.م)</label>
                            <input name="purchaseValue" type="number" value={assetData.purchaseValue} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">طريقة الإهلاك</label>
                            <select name="depreciationMethod" value={assetData.depreciationMethod} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50">
                                <option value="Straight-line">القسط الثابت</option>
                                <option value="Declining Balance">القسط المتناقص</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">العمر الإنتاجي (سنوات)</label>
                            <input name="usefulLifeYears" type="number" value={assetData.usefulLifeYears} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-slate-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-sky-600 text-white rounded-lg">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssetModal;