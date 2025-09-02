
import React, { useState, useMemo } from 'react';
import { XMarkIcon, BanknotesIcon } from './icons/Icons';

interface CompensationCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
    }).format(amount);
};

const CompensationCalculatorModal: React.FC<CompensationCalculatorModalProps> = ({ isOpen, onClose }) => {
    const [monthlySalary, setMonthlySalary] = useState('');
    const [yearsOfService, setYearsOfService] = useState('');
    const [contractType, setContractType] = useState<'indefinite' | 'fixed'>('indefinite');
    const [remainingYears, setRemainingYears] = useState('');
    const [compensation, setCompensation] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleCalculate = () => {
        const salary = parseFloat(monthlySalary);
        const years = parseFloat(yearsOfService);
        const remaining = parseFloat(remainingYears);

        if (isNaN(salary) || salary <= 0 || isNaN(years) || years < 0) {
            alert("يرجى إدخال قيم صالحة للراتب وسنوات الخدمة.");
            return;
        }

        let calculatedCompensation = 0;

        if (contractType === 'indefinite') {
            // Indefinite contract logic: 2 months per year for first 10 years, 1 month for subsequent years.
            if (years <= 10) {
                calculatedCompensation = years * 2 * salary;
            } else {
                calculatedCompensation = (10 * 2 * salary) + ((years - 10) * 1 * salary);
            }
        } else { // Fixed-term contract
            if (isNaN(remaining) || remaining < 0) {
                alert("يرجى إدخال عدد السنوات المتبقية في العقد.");
                return;
            }
             // Fixed-term contract logic: Salary for the remaining period of the contract.
            calculatedCompensation = remaining * 12 * salary;
        }

        setCompensation(calculatedCompensation);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">حاسبة تعويضات نهاية الخدمة</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">آخر راتب شهري شامل</label>
                            <input type="number" value={monthlySalary} onChange={e => setMonthlySalary(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="مثال: 10000" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">سنوات الخدمة</label>
                            <input type="number" value={yearsOfService} onChange={e => setYearsOfService(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="مثال: 5.5" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">نوع العقد</label>
                        <select value={contractType} onChange={e => setContractType(e.target.value as any)} className="w-full p-2 border rounded-lg bg-slate-50">
                            <option value="indefinite">غير محدد المدة</option>
                            <option value="fixed">محدد المدة</option>
                        </select>
                    </div>
                     {contractType === 'fixed' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">السنوات المتبقية في العقد</label>
                            <input type="number" value={remainingYears} onChange={e => setRemainingYears(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="مثال: 1.5" />
                        </div>
                    )}
                    <button onClick={handleCalculate} className="w-full bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700">
                        احسب التعويض
                    </button>

                    {compensation !== null && (
                        <div className="mt-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-center rounded-r-lg">
                            <p className="text-sm font-semibold text-emerald-800">مبلغ التعويض المستحق هو</p>
                            <p className="text-3xl font-bold text-emerald-700">{formatCurrency(compensation)}</p>
                            <p className="text-xs text-emerald-600 mt-1">(هذا تقدير بناءً على البيانات المدخلة والقوانين الجديدة)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompensationCalculatorModal;