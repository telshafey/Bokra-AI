import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';
import type { WorkLocation } from '../types';

interface WorkLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (location: Omit<WorkLocation, 'id'> | WorkLocation) => void;
    locationToEdit: WorkLocation | null;
}

const WorkLocationModal: React.FC<WorkLocationModalProps> = ({ isOpen, onClose, onSave, locationToEdit }) => {
    const getInitialState = (): Omit<WorkLocation, 'id'> => ({
        name: '',
        latitude: 0,
        longitude: 0,
        radiusMeters: 200,
    });

    const [location, setLocation] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            setLocation(locationToEdit || getInitialState());
        }
    }, [isOpen, locationToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setLocation(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(locationToEdit ? { ...locationToEdit, ...location } : location);
        onClose();
    };

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{locationToEdit ? 'تعديل موقع عمل' : 'إضافة موقع عمل جديد'}</h2>
                    <button type="button" onClick={onClose}><XMarkIcon className="w-7 h-7 text-slate-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" type="text" value={location.name} onChange={handleChange} placeholder="اسم الموقع (مثال: المقر الرئيسي)" className="w-full p-2 border rounded-lg" required />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="latitude" type="number" step="any" value={location.latitude} onChange={handleChange} placeholder="خط العرض (Latitude)" className="w-full p-2 border rounded-lg" required />
                        <input name="longitude" type="number" step="any" value={location.longitude} onChange={handleChange} placeholder="خط الطول (Longitude)" className="w-full p-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">نطاق الموقع المسموح به (بالمتر)</label>
                        <input name="radiusMeters" type="number" value={location.radiusMeters} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
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

export default WorkLocationModal;
