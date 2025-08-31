import React, { useState } from 'react';
import { SalaryComponent, CompensationPackage, SalaryComponentType, CalculationType } from '../types';
import { PlusCircleIcon, ArrowsRightLeftIcon, BanknotesIcon } from './icons/Icons';

interface CompensationManagementProps {
    salaryComponents: SalaryComponent[];
    compensationPackages: CompensationPackage[];
    onSaveSalaryComponent: (component: SalaryComponent) => void;
    onSaveCompensationPackage: (pkg: CompensationPackage) => void;
}

const CompensationManagement: React.FC<CompensationManagementProps> = ({
    salaryComponents,
    compensationPackages,
    onSaveSalaryComponent,
    onSaveCompensationPackage,
}) => {
    // State for new component form
    const [newComponentName, setNewComponentName] = useState('');
    const [newComponentType, setNewComponentType] = useState<SalaryComponentType>('Allowance');
    const [newComponentCalcType, setNewComponentCalcType] = useState<CalculationType>('FixedAmount');
    const [newComponentValue, setNewComponentValue] = useState(0);

    // State for new package form
    const [newPackageName, setNewPackageName] = useState('');
    const [selectedComponents, setSelectedComponents] = useState<Map<string, number>>(new Map());

    const handleAddComponent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComponentName.trim() || newComponentValue <= 0) return;
        
        onSaveSalaryComponent({
            id: `comp-${Date.now()}`,
            name: newComponentName.trim(),
            type: newComponentType,
            calculationType: newComponentCalcType,
            value: newComponentValue,
        });

        setNewComponentName('');
        setNewComponentType('Allowance');
        setNewComponentCalcType('FixedAmount');
        setNewComponentValue(0);
    };

    const handleToggleComponentInPackage = (componentId: string) => {
        setSelectedComponents(prev => {
            const newMap = new Map(prev);
            if (newMap.has(componentId)) {
                newMap.delete(componentId);
            } else {
                const defaultValue = salaryComponents.find(c => c.id === componentId)?.value || 0;
                newMap.set(componentId, defaultValue);
            }
            return newMap;
        });
    };
    
    const handlePackageComponentValueChange = (componentId: string, value: number) => {
        setSelectedComponents(prev => {
            const newMap = new Map(prev);
            if (newMap.has(componentId)) {
                newMap.set(componentId, value);
            }
            return newMap;
        });
    };

    const handleAddPackage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPackageName.trim() || selectedComponents.size === 0) return;

        const newPackage: CompensationPackage = {
            id: `pkg-${Date.now()}`,
            name: newPackageName.trim(),
            components: Array.from(selectedComponents.entries()).map(([componentId, value]) => ({
                componentId,
                value,
            })),
        };
        onSaveCompensationPackage(newPackage);

        setNewPackageName('');
        setSelectedComponents(new Map());
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Salary Components */}
            <div className="lg:col-span-1 space-y-4">
                <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                    <BanknotesIcon className="w-6 h-6" />
                    مكونات الراتب
                </h3>
                <form onSubmit={handleAddComponent} className="p-4 bg-slate-100 rounded-lg space-y-3">
                    <input
                        type="text"
                        placeholder="اسم المكون (مثال: بدل مواصلات)"
                        value={newComponentName}
                        onChange={(e) => setNewComponentName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <select value={newComponentType} onChange={e => setNewComponentType(e.target.value as SalaryComponentType)} className="w-full p-2 border rounded-md">
                            <option value="Allowance">بدل (إضافة)</option>
                            <option value="Deduction">خصم (استقطاع)</option>
                        </select>
                         <select value={newComponentCalcType} onChange={e => setNewComponentCalcType(e.target.value as CalculationType)} className="w-full p-2 border rounded-md">
                            <option value="FixedAmount">مبلغ ثابت</option>
                            <option value="PercentageOfBase">نسبة من الأساسي</option>
                        </select>
                    </div>
                    <div className="relative">
                         <input
                            type="number"
                            placeholder="القيمة"
                            value={newComponentValue}
                            onChange={(e) => setNewComponentValue(Number(e.target.value))}
                            className="w-full p-2 border rounded-md pr-12"
                            required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                           {newComponentCalcType === 'FixedAmount' ? 'EGP' : '%'}
                        </span>
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 text-white font-semibold py-2 rounded-md hover:bg-emerald-600">
                        إضافة مكون
                    </button>
                </form>
                <div className="space-y-2">
                    {salaryComponents.map(comp => (
                        <div key={comp.id} className="p-3 bg-white border rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{comp.name}</p>
                                <p className={`text-sm ${comp.type === 'Allowance' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {comp.calculationType === 'FixedAmount' ? `${comp.value.toLocaleString()} EGP` : `${comp.value}% من الأساسي`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 2 & 3: Compensation Packages */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                     <ArrowsRightLeftIcon className="w-6 h-6" />
                    حزم الرواتب
                </h3>
                 <form onSubmit={handleAddPackage} className="p-4 bg-slate-100 rounded-lg space-y-4">
                    <input
                        type="text"
                        placeholder="اسم الحزمة (مثال: حزمة المطورين)"
                        value={newPackageName}
                        onChange={(e) => setNewPackageName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                     <div className="max-h-60 overflow-y-auto p-2 bg-white rounded-md border">
                        <h4 className="font-semibold mb-2">اختر المكونات:</h4>
                        {salaryComponents.map(comp => (
                            <div key={comp.id} className="flex items-center justify-between p-2 hover:bg-slate-50">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedComponents.has(comp.id)}
                                        onChange={() => handleToggleComponentInPackage(comp.id)}
                                        className="form-checkbox h-5 w-5 rounded text-sky-600"
                                    />
                                    <span>{comp.name}</span>
                                </label>
                                {selectedComponents.has(comp.id) && (
                                    <div className="relative">
                                         <input 
                                            type="number" 
                                            value={selectedComponents.get(comp.id)} 
                                            onChange={e => handlePackageComponentValueChange(comp.id, Number(e.target.value))}
                                            className="w-28 p-1 border rounded text-sm text-center pr-10"
                                         />
                                         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">
                                            {comp.calculationType === 'FixedAmount' ? 'EGP' : '%'}
                                         </span>
                                    </div>
                                )}
                            </div>
                        ))}
                     </div>
                     <button type="submit" className="w-full bg-sky-600 text-white font-semibold py-2 rounded-md hover:bg-sky-700">
                        إنشاء حزمة جديدة
                    </button>
                </form>

                <div className="space-y-3">
                    {compensationPackages.map(pkg => (
                        <div key={pkg.id} className="p-4 bg-white border rounded-md">
                            <h4 className="font-bold text-lg">{pkg.name}</h4>
                            <ul className="mt-2 text-sm space-y-1">
                                {pkg.components.map(pkgComp => {
                                    const details = salaryComponents.find(c => c.id === pkgComp.componentId);
                                    if (!details) return null;
                                    const displayValue = details.calculationType === 'FixedAmount' ? `${pkgComp.value.toLocaleString()} EGP` : `${pkgComp.value}%`;
                                    return (
                                        <li key={pkgComp.componentId} className={`flex justify-between p-1 rounded ${details.type === 'Allowance' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                            <span>{details.name}</span>
                                            <span className={`font-semibold ${details.type === 'Allowance' ? 'text-emerald-700' : 'text-red-700'}`}>{displayValue}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompensationManagement;