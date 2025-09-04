

import React, { useState, useMemo, useEffect } from 'react';
// FIX: Add SalaryComponent, CompensationPackage, and EmployeeDocument to the type imports.
import type { TeamMemberDetails, EmployeeProfile, PettyCashRequest, Asset, SalaryComponent, CompensationPackage, EmployeeDocument } from '../types';
import { UserCircleIcon, CalendarIcon, BriefcaseIcon, CheckCircleIcon, DocumentTextIcon, ClockIcon, BanknotesIcon, DocumentCheckIcon, ExclamationTriangleIcon, ComputerDesktopIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';

type DetailTab = 'general' | 'leave_profile' | 'salary' | 'documents' | 'petty_cash' | 'assets';

const NavItem: React.FC<{ label: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, isActive: boolean, onClick: () => void }> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-colors ${
            isActive ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
    >
        <Icon className="w-5 h-5"/>
        <span>{label}</span>
    </button>
);

const StatInfoCard: React.FC<{ title: string, value: string | number, subtext: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, color: string }> = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border dark:border-slate-700 flex items-center gap-3">
        <Icon className={`w-6 h-6 ${color}`}/>
        <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">{value} <span className="text-xs font-normal">{subtext}</span></p>
        </div>
    </div>
);

const STATUS_BADGE: Record<PettyCashRequest['status'], string> = { Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300', Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300', Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300' };

const formatCurrency = (amount: number, lang: 'ar' | 'en') => {
    const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
    }).format(amount);
};

// FIX: Add missing props to the interface to match its usage in TeamAnalyticsPage.
interface TeamMemberDetailViewProps {
    memberDetails: TeamMemberDetails;
    currentUser: EmployeeProfile;
    salaryComponents: SalaryComponent[];
    compensationPackages: CompensationPackage[];
    onSaveDocument: (document: EmployeeDocument) => void;
}

const TeamMemberDetailView: React.FC<TeamMemberDetailViewProps> = ({ 
    memberDetails, 
    currentUser, 
    salaryComponents, 
    compensationPackages, 
    onSaveDocument 
}) => {
    const [activeTab, setActiveTab] = useState<DetailTab>('general');
    const { profile, stats } = memberDetails;
    const { t, language } = useTranslation();
    const locale = language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatInfoCard title="ساعات الأذونات" value={stats.usedPermissionHours.toFixed(1)} subtext="ساعة" icon={ClockIcon} color="text-sky-500"/>
                        <StatInfoCard title="الإجازات السنوية" value={stats.usedAnnualLeavesDays} subtext="يوم" icon={CalendarIcon} color="text-emerald-500"/>
                        <StatInfoCard title="أيام العمل عن بعد" value={stats.usedRemoteDays} subtext="يوم" icon={BriefcaseIcon} color="text-purple-500"/>
                        <StatInfoCard title="أيام الطوارئ" value={stats.emergencyDays} subtext="يوم" icon={ExclamationTriangleIcon} color="text-orange-500"/>
                    </div>
                );
            case 'leave_profile':
                return (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.leaveBalances.map(balance => (
                            <div key={balance.type} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border dark:border-slate-700">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{balance.typeName}</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    {balance.balance - balance.used} <span className="text-base font-normal">/ {balance.balance} {t('general.day')}</span>
                                </p>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-2">
                                    <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${((balance.balance - balance.used) / balance.balance) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'salary':
                const pkg = compensationPackages.find(p => p.id === profile.compensationPackageId);
                const baseSalary = profile.baseSalary || 0;
                
                const getComponentValue = (c: { componentId: string; value: number }) => {
                    const compDetails = salaryComponents.find(sc => sc.id === c.componentId);
                    if (!compDetails) return 0;
                    return compDetails.calculationType === 'FixedAmount' ? c.value : (baseSalary * c.value) / 100;
                };
                
                const allowances = pkg?.components
                    .map(c => ({ component: salaryComponents.find(sc => sc.id === c.componentId), value: getComponentValue(c) }))
                    .filter(item => item.component?.type === 'Allowance') || [];
                    
                const deductions = pkg?.components
                    .map(c => ({ component: salaryComponents.find(sc => sc.id === c.componentId), value: getComponentValue(c) }))
                    .filter(item => item.component?.type === 'Deduction') || [];

                return (
                    <div className="p-6 space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-700">
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('payslip.baseSalary')}</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(baseSalary, language)}</p>
                        </div>
                        {pkg ? (
                            <div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">حزمة التعويضات: {pkg.name}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                        <h5 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">{t('payslip.earnings')}</h5>
                                        <ul className="space-y-1">{allowances.map(a => a.component && <li key={a.component.id} className="flex justify-between text-sm"><span>{a.component.name}</span><span className="font-semibold">{formatCurrency(a.value, language)}</span></li>)}</ul>
                                    </div>
                                    <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                                        <h5 className="font-semibold text-red-800 dark:text-red-300 mb-2">{t('payslip.deductions')}</h5>
                                        <ul className="space-y-1">{deductions.map(d => d.component && <li key={d.component.id} className="flex justify-between text-sm"><span>{d.component.name}</span><span className="font-semibold">{formatCurrency(d.value, language)}</span></li>)}</ul>
                                    </div>
                                </div>
                            </div>
                        ) : <p className="text-sm text-center text-slate-500 dark:text-slate-400 p-4">لم يتم تعيين حزمة تعويضات لهذا الموظف.</p>}
                    </div>
                );
            case 'documents':
                 return (
                    <div className="p-4">
                        <div className="overflow-x-auto max-h-[calc(100vh-20rem)]">
                            <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">{t('myDocuments.table.name')}</th>
                                        <th className="px-6 py-3">{t('myDocuments.table.type')}</th>
                                        <th className="px-6 py-3">{t('myDocuments.table.uploadDate')}</th>
                                        <th className="px-6 py-3">{t('myDocuments.table.expiryDate')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberDetails.documents.map(doc => (
                                        <tr key={doc.id} className="border-b dark:border-slate-700">
                                            <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{doc.name}</td>
                                            <td className="px-6 py-4">{t(`myDocuments.docTypes.${doc.type}`)}</td>
                                            <td className="px-6 py-4">{new Date(doc.uploadDate).toLocaleDateString(locale)}</td>
                                            <td className="px-6 py-4">{doc.expirationDate ? new Date(doc.expirationDate).toLocaleDateString(locale) : '-'}</td>
                                        </tr>
                                    ))}
                                    {memberDetails.documents.length === 0 && (
                                        <tr><td colSpan={4} className="text-center py-12 text-slate-500">لا توجد مستندات لهذا الموظف.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'petty_cash':
                 return (
                    <div className="p-4">
                        <div className="overflow-x-auto max-h-[calc(100vh-20rem)]">
                            <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">{t('expenses.table.date')}</th>
                                        <th className="px-6 py-3">{t('expenses.table.category')}</th>
                                        <th className="px-6 py-3">{t('expenses.table.amount')}</th>
                                        <th className="px-6 py-3">{t('expenses.table.description')}</th>
                                        <th className="px-6 py-3">{t('expenses.table.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberDetails.pettyCashRequests.map(req => (
                                        <tr key={req.id} className="border-b dark:border-slate-700">
                                            <td className="px-6 py-4">{new Date(req.date).toLocaleDateString(locale)}</td>
                                            <td className="px-6 py-4">{t(`expenses.categories.${req.category}`)}</td>
                                            <td className="px-6 py-4 font-semibold">{formatCurrency(req.amount, language)}</td>
                                            <td className="px-6 py-4">{req.description}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[req.status]}`}>{t(`requestStatus.${req.status}`)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {memberDetails.pettyCashRequests.length === 0 && (
                                        <tr><td colSpan={5} className="text-center py-12 text-slate-500">{t('expenses.noRequests')}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'assets':
                return (
                    <div className="p-4">
                        <div className="overflow-x-auto max-h-[calc(100vh-20rem)]">
                            <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">{t('myAssets.assetName')}</th>
                                        <th className="px-6 py-3">{t('myAssets.category')}</th>
                                        <th className="px-6 py-3">{t('myAssets.serialNumber')}</th>
                                        <th className="px-6 py-3">{t('myAssets.receivedDate')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberDetails.assets.map(asset => (
                                        <tr key={asset.id} className="border-b dark:border-slate-700">
                                            <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{asset.name}</td>
                                            <td className="px-6 py-4">{t(`assets.categories.${asset.category}`)}</td>
                                            <td className="px-6 py-4 font-mono">{asset.serialNumber}</td>
                                            <td className="px-6 py-4">{new Date(asset.purchaseDate).toLocaleDateString(locale)}</td>
                                        </tr>
                                    ))}
                                    {memberDetails.assets.length === 0 && (
                                        <tr><td colSpan={4} className="text-center py-12 text-slate-500">{t('myAssets.noAssets')}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return <div className="p-6 text-center text-slate-500 dark:text-slate-400">محتوى "{t(`teamMemberDetail.tabs.${activeTab}`)}" غير متاح بعد.</div>;
        }
    };

    const navItems: {id: DetailTab, label: string, icon: React.FC<React.SVGProps<SVGSVGElement>>}[] = [
        { id: 'general', label: t('teamMemberDetail.tabs.general'), icon: DocumentTextIcon },
        { id: 'leave_profile', label: t('teamMemberDetail.tabs.leave_profile'), icon: BriefcaseIcon },
        { id: 'salary', label: t('teamMemberDetail.tabs.salary'), icon: BanknotesIcon },
        { id: 'documents', label: t('teamMemberDetail.tabs.documents'), icon: DocumentCheckIcon },
        { id: 'petty_cash', label: t('teamMemberDetail.tabs.petty_cash'), icon: BanknotesIcon },
        { id: 'assets', label: t('teamMemberDetail.tabs.assets'), icon: ComputerDesktopIcon },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 h-full rounded-xl shadow-md flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-full" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profile.name}</h2>
                            <p className="text-md text-slate-500 dark:text-slate-400">{profile.title} • {t('departments.' + profile.departmentKey)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex min-h-0">
                <aside className="w-56 border-l border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800/50">
                    <nav className="space-y-1">
                        {navItems.map(item => (
                            <NavItem
                                key={item.id}
                                label={item.label}
                                icon={item.icon}
                                isActive={activeTab === item.id}
                                onClick={() => setActiveTab(item.id)}
                            />
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-800">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default TeamMemberDetailView;