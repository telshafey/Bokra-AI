
import React, { useState, useEffect } from 'react';
import type { Payslip, PayslipItem } from '../types';
import { BanknotesIcon, ArrowDownTrayIcon, PrinterIcon } from './icons/Icons';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
    }).format(amount);
};

const PayslipStatCard: React.FC<{ title: string; amount: number; color: string }> = ({ title, amount, color }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
        <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{formatCurrency(amount)}</p>
    </div>
);

const PayslipTable: React.FC<{ title: string; items: PayslipItem[]; color: string }> = ({ title, items, color }) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-full">
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 ${color.replace('text-', 'border-')}`}>{title}</h3>
            <table className="w-full text-sm">
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                            <td className="py-2.5 text-slate-600 dark:text-slate-300">{item.description}</td>
                            <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-100 text-left whitespace-nowrap">{formatCurrency(item.amount)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                        <td className="pt-3 font-extrabold text-slate-800 dark:text-slate-100 text-base">الإجمالي</td>
                        <td className={`pt-3 font-extrabold text-left whitespace-nowrap text-base ${color}`}>{formatCurrency(total)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

interface PayslipPageProps {
    payslips: Payslip[];
}

const PayslipPage: React.FC<PayslipPageProps> = ({ payslips }) => {
    const [selectedPayslipId, setSelectedPayslipId] = useState<string | undefined>(payslips[0]?.id);

    useEffect(() => {
        if (payslips.length > 0 && !payslips.find(p => p.id === selectedPayslipId)) {
            setSelectedPayslipId(payslips[0].id);
        } else if (payslips.length === 0) {
            setSelectedPayslipId(undefined);
        }
    }, [payslips, selectedPayslipId]);

    const selectedPayslip = payslips.find(p => p.id === selectedPayslipId);

    if (payslips.length === 0) {
        return (
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                <BanknotesIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">لا توجد كشوف رواتب متاحة.</h2>
                <p className="text-slate-500 dark:text-slate-400">لم يتم إنشاء أي كشوف رواتب لك بعد.</p>
            </div>
        );
    }

    return (
         <div className="space-y-6">
             {/* Header with selector and actions */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                     <BanknotesIcon className="w-8 h-8 text-sky-500" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">كشوف الرواتب</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">اختر كشف الراتب لعرض تفاصيله</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedPayslipId}
                        onChange={(e) => setSelectedPayslipId(e.target.value)}
                        className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white"
                    >
                        {payslips.map(p => <option key={p.id} value={p.id}>{p.month} {p.year}</option>)}
                    </select>
                    {selectedPayslip && (
                         <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg transition-colors text-sm">
                                <ArrowDownTrayIcon className="w-5 h-5"/>
                            </button>
                            <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg transition-colors text-sm">
                                <PrinterIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {selectedPayslip ? (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PayslipStatCard title="إجمالي المستحقات" amount={selectedPayslip.grossSalary} color="text-emerald-600 dark:text-emerald-500" />
                        <PayslipStatCard title="إجمالي الاستقطاعات" amount={selectedPayslip.totalDeductions} color="text-red-600 dark:text-red-500" />
                        <PayslipStatCard title="صافي الراتب" amount={selectedPayslip.netSalary} color="text-sky-700 dark:text-sky-400" />
                    </div>
                    {/* Details Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <PayslipTable title="المستحقات" items={selectedPayslip.earnings} color="text-emerald-600" />
                         <PayslipTable title="الاستقطاعات" items={selectedPayslip.deductions} color="text-red-600" />
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                     <p>الرجاء اختيار كشف راتب لعرض التفاصيل.</p>
                </div>
            )}
        </div>
    );
};

export default PayslipPage;
