

import React, { useState, useEffect, useMemo } from 'react';
import type { Payslip, PayslipItem, EmployeeProfile, PettyCashRequest, RequestStatus } from '../types';
import { BanknotesIcon, ArrowDownTrayIcon, PrinterIcon, PlusCircleIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';
import { useRequestContext } from './contexts/RequestContext';
import PettyCashRequestModal from './PettyCashRequestModal';

const formatCurrency = (amount: number, lang: 'ar' | 'en') => {
    const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
    }).format(amount);
};

const PayslipStatCard: React.FC<{ title: string; amount: number; color: string, lang: 'ar' | 'en' }> = ({ title, amount, color, lang }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
        <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{formatCurrency(amount, lang)}</p>
    </div>
);

const PayslipTable: React.FC<{ title: string; items: PayslipItem[]; color: string, lang: 'ar' | 'en' }> = ({ title, items, color, lang }) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-full">
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 ${color.replace('text-', 'border-')}`}>{title}</h3>
            <table className="w-full text-sm">
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                            <td className="py-2.5 text-slate-600 dark:text-slate-300">{item.description}</td>
                            <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-100 text-left whitespace-nowrap">{formatCurrency(item.amount, lang)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                        <td className="pt-3 font-extrabold text-slate-800 dark:text-slate-100 text-base">الإجمالي</td>
                        <td className={`pt-3 font-extrabold text-left whitespace-nowrap text-base ${color}`}>{formatCurrency(total, lang)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
            isActive
                ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
    >
        {label}
    </button>
);

const STATUS_BADGE: Record<RequestStatus, string> = {
    Approved: 'bg-emerald-100 text-emerald-800',
    Pending: 'bg-amber-100 text-amber-800',
    Rejected: 'bg-red-100 text-red-800',
};

interface PayslipPageProps {
    payslips: Payslip[];
    currentUser: EmployeeProfile;
}

const PayslipPage: React.FC<PayslipPageProps> = ({ payslips, currentUser }) => {
    const { t, language } = useTranslation();
    const { pettyCashRequests, handleNewPettyCashRequest } = useRequestContext();
    
    const [activeTab, setActiveTab] = useState<'payslip' | 'expenses'>('payslip');
    const [selectedPayslipId, setSelectedPayslipId] = useState<string | undefined>(payslips[0]?.id);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    const userPettyCashRequests = useMemo(() =>
        pettyCashRequests.filter(r => r.employeeId === currentUser.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [pettyCashRequests, currentUser.id]
    );

    useEffect(() => {
        if (payslips.length > 0 && !payslips.find(p => p.id === selectedPayslipId)) {
            setSelectedPayslipId(payslips[0].id);
        } else if (payslips.length === 0) {
            setSelectedPayslipId(undefined);
        }
    }, [payslips, selectedPayslipId]);

    const selectedPayslip = payslips.find(p => p.id === selectedPayslipId);

    const renderPayslipContent = () => {
        if (payslips.length === 0) {
            return (
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                    <BanknotesIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('payslip.noPayslipsTitle')}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t('payslip.noPayslipsSubtitle')}</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {selectedPayslip ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PayslipStatCard title={t('payslip.grossSalary')} amount={selectedPayslip.grossSalary} color="text-emerald-600 dark:text-emerald-500" lang={language} />
                            <PayslipStatCard title={t('payslip.totalDeductions')} amount={selectedPayslip.totalDeductions} color="text-red-600 dark:text-red-500" lang={language} />
                            <PayslipStatCard title={t('payslip.netSalary')} amount={selectedPayslip.netSalary} color="text-sky-700 dark:text-sky-400" lang={language} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <PayslipTable title={t('payslip.earnings')} items={selectedPayslip.earnings} color="text-emerald-600" lang={language} />
                             <PayslipTable title={t('payslip.deductions')} items={selectedPayslip.deductions} color="text-red-600" lang={language} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                         <p>{t('payslip.selectToView')}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderExpensesContent = () => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('expenses.title')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('expenses.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md">
                    <PlusCircleIcon className="w-6 h-6"/>
                    <span>{t('expenses.newRequestButton')}</span>
                </button>
            </div>
             <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700 sticky top-0">
                        <tr>
                            <th className="px-6 py-3">{t('expenses.table.date')}</th>
                            <th className="px-6 py-3">{t('expenses.table.category')}</th>
                            <th className="px-6 py-3">{t('expenses.table.amount')}</th>
                            <th className="px-6 py-3">{t('expenses.table.description')}</th>
                            <th className="px-6 py-3">{t('expenses.table.status')}</th>
                            <th className="px-6 py-3">{t('expenses.table.attachment')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userPettyCashRequests.map(req => (
                            <tr key={req.id} className="border-b dark:border-slate-700">
                                <td className="px-6 py-4">{new Date(req.date).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                <td className="px-6 py-4">{t(`expenses.categories.${req.category}`)}</td>
                                <td className="px-6 py-4 font-semibold">{formatCurrency(req.amount, language)}</td>
                                <td className="px-6 py-4">{req.description}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[req.status]}`}>{t(`requestStatus.${req.status}`)}</span></td>
                                <td className="px-6 py-4">
                                    {req.attachmentUrl ? (
                                        <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline"><ArrowDownTrayIcon className="w-5 h-5"/></a>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))}
                        {userPettyCashRequests.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-12 text-slate-500">{t('expenses.noRequests')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );


    return (
         <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex justify-between items-center">
                <div className="flex items-center gap-3">
                     <BanknotesIcon className="w-8 h-8 text-sky-500" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('pageTitles.payrollAndExpenses')}</h1>
                    </div>
                </div>
                {activeTab === 'payslip' && (
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
                )}
            </div>
            
            <div className="border-b border-slate-200 dark:border-slate-700">
                <TabButton label={t('payslip.tabPayslips')} isActive={activeTab === 'payslip'} onClick={() => setActiveTab('payslip')} />
                <TabButton label={t('payslip.tabExpenses')} isActive={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
            </div>

            {activeTab === 'payslip' ? renderPayslipContent() : renderExpensesContent()}
            
            <PettyCashRequestModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                onSubmit={(data) => handleNewPettyCashRequest({ ...data, employeeId: currentUser.id })}
            />
        </div>
    );
};

export default PayslipPage;