import React, { useState } from 'react';
import type { LeaveBalance, LeaveRequest } from '../types';
import { CalendarIcon, PlusCircleIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';
import RequestLeaveModal from './RequestLeaveModal';
import AttendanceAdjustmentModal from './AttendanceAdjustmentModal';
import LeavePermitModal from './LeavePermitModal';

const LeaveBalanceCard: React.FC<{ balance: LeaveBalance; t: (key: string, replacements?: any) => string }> = ({ balance, t }) => {
    const remaining = balance.balance - balance.used;
    const progress = balance.balance > 0 ? (remaining / balance.balance) * 100 : 0;
    const unit = t('leave.balanceCard.dayUnit', { count: balance.balance });

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md transition-shadow hover:shadow-lg">
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">{balance.typeName}</h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 my-2">{remaining} <span className="text-base font-normal text-slate-500 dark:text-slate-400">/ {balance.balance} {unit}</span></p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

const LeavePage: React.FC<{ leaveBalances: LeaveBalance[]; leaveHistory: LeaveRequest[] }> = ({ leaveBalances, leaveHistory }) => {
    const { t } = useTranslation();
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
    const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('pageTitles.leave')}</h1>
                <div className="flex gap-2">
                    <button onClick={() => setIsLeaveModalOpen(true)} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg"><PlusCircleIcon className="w-5 h-5"/>{t('leave.newRequest')}</button>
                    <button onClick={() => setIsPermitModalOpen(true)} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg">{t('attendance.requestPermit')}</button>
                    <button onClick={() => setIsExcuseModalOpen(true)} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg">{t('attendance.submitExcuse')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaveBalances.map(balance => <LeaveBalanceCard key={balance.type} balance={balance} t={t} />)}
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t('leave.balanceHistory')}</h2>
                {/* History table would go here */}
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">لا يوجد سجل إجازات لعرضه.</p>
            </div>

            <RequestLeaveModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} onSubmit={() => {}} />
            <LeavePermitModal isOpen={isPermitModalOpen} onClose={() => setIsPermitModalOpen(false)} onSubmit={() => {}} />
            <AttendanceAdjustmentModal isOpen={isExcuseModalOpen} onClose={() => setIsExcuseModalOpen(false)} onSubmit={() => {}} />
        </div>
    );
};

export default LeavePage;
