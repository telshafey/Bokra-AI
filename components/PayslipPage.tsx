// FIX: Implemented the PayslipPage component.
import React, { useState } from 'react';
import type { Payslip, PettyCashRequest } from '../types';
import { BanknotesIcon, PrinterIcon, ArrowDownTrayIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

const PayslipDetail: React.FC<{ payslip: Payslip; t: (key: string) => string }> = ({ payslip, t }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-t-4 border-primary-500">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('pageTitles.payrollAndExpenses')} - {payslip.month} {payslip.year}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">ID: {payslip.id}</p>
            </div>
            <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><ArrowDownTrayIcon className="w-5 h-5"/></button>
                <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><PrinterIcon className="w-5 h-5"/></button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg text-center">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">{t('payslip.grossSalary')}</p>
                <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200">{payslip.grossSalary.toLocaleString('ar-EG')} ج.م</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/50 rounded-lg text-center">
                <p className="text-sm text-red-700 dark:text-red-300 font-semibold">{t('payslip.totalDeductions')}</p>
                <p className="text-xl font-bold text-red-800 dark:text-red-200">{payslip.totalDeductions.toLocaleString('ar-EG')} ج.م</p>
            </div>
            <div className="p-4 bg-sky-50 dark:bg-sky-900/50 rounded-lg text-center">
                <p className="text-sm text-sky-700 dark:text-sky-300 font-semibold">{t('payslip.netSalary')}</p>
                <p className="text-xl font-bold text-sky-800 dark:text-sky-200">{payslip.netSalary.toLocaleString('ar-EG')} ج.م</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-lg text-emerald-600 mb-2">{t('payslip.earnings')}</h3>
                <ul className="space-y-1">{payslip.earnings.map((e, i) => <li key={i} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded"><span>{e.description}</span><span className="font-semibold">{e.amount.toLocaleString('ar-EG')} ج.م</span></li>)}</ul>
            </div>
             <div>
                <h3 className="font-bold text-lg text-red-600 mb-2">{t('payslip.deductions')}</h3>
                <ul className="space-y-1">{payslip.deductions.map((d, i) => <li key={i} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded"><span>{d.description}</span><span className="font-semibold">{d.amount.toLocaleString('ar-EG')} ج.م</span></li>)}</ul>
            </div>
        </div>
    </div>
);


const PayslipPage: React.FC<{ payslips: Payslip[]; pettyCashRequests: PettyCashRequest[] }> = ({ payslips, pettyCashRequests }) => {
    const [selectedPayslipId, setSelectedPayslipId] = useState<string | null>(payslips[0]?.id || null);
    const { t } = useTranslation();

    const selectedPayslip = payslips.find(p => p.id === selectedPayslipId);

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('pageTitles.payrollAndExpenses')}</h1>
            
            {payslips.length === 0 ? (
                 <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                    <BanknotesIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4"/>
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">{t('payslip.noPayslipsTitle')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t('payslip.noPayslipsSubtitle')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                        <h3 className="font-bold text-lg mb-2 p-2">{t('payslip.tabPayslips')}</h3>
                        <nav className="space-y-1">
                            {payslips.map(p => (
                                <button key={p.id} onClick={() => setSelectedPayslipId(p.id)} className={`w-full text-right p-3 rounded-lg font-semibold transition-colors ${selectedPayslipId === p.id ? 'bg-primary-100 text-primary-700 dark:bg-slate-700 dark:text-primary-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
                                    {p.month} {p.year}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="lg:col-span-3">
                        {selectedPayslip ? <PayslipDetail payslip={selectedPayslip} t={t} /> : (
                             <div className="h-full flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-md p-12 text-center text-slate-500 dark:text-slate-400">
                                {t('payslip.selectToView')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayslipPage;
