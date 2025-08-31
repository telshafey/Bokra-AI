import React, { useState, useMemo } from 'react';
import { AttendanceRecord, AttendanceStatus, EmployeeInfraction, AttendancePolicy, AttendanceAdjustmentRequest, RequestStatus, LeavePermitRequest, AttendanceEvent, ExternalTask } from '../types';
import { ExclamationTriangleIcon, InformationCircleIcon, ShieldCheckIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon, ClipboardDocumentCheckIcon } from './icons/Icons';

const STATUS_BADGE: Record<AttendanceStatus, string> = {
    Present: 'bg-emerald-100 text-emerald-800',
    Absent: 'bg-red-100 text-red-800',
    Leave: 'bg-amber-100 text-amber-800',
    Holiday: 'bg-sky-100 text-sky-800',
    Weekend: 'bg-slate-200 text-slate-600',
};

const ADJUSTMENT_STATUS_STYLES: Record<RequestStatus, { text: string; iconColor: string; label: string }> = {
    Pending: { text: 'text-amber-600', iconColor: 'text-amber-500', label: 'قيد المراجعة' },
    Approved: { text: 'text-emerald-600', iconColor: 'text-emerald-500', label: 'تمت الموافقة' },
    Rejected: { text: 'text-red-600', iconColor: 'text-red-500', label: 'مرفوض' },
};

const STATUS_TRANSLATION: Record<AttendanceStatus, string> = {
    Present: 'حضور',
    Absent: 'غياب',
    Leave: 'إجازة',
    Holiday: 'عطلة رسمية',
    Weekend: 'عطلة أسبوعية',
}

interface AttendanceLogTableProps {
    records: AttendanceRecord[];
    events?: AttendanceEvent[];
    infractions: EmployeeInfraction[];
    policy?: AttendancePolicy | null;
    adjustmentRequests?: AttendanceAdjustmentRequest[];
    permitRequests?: LeavePermitRequest[];
    externalTasks: ExternalTask[];
}

const AttendanceLogTable: React.FC<AttendanceLogTableProps> = ({ records, events = [], infractions, policy, adjustmentRequests = [], permitRequests = [], externalTasks = [] }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const infractionsMap = useMemo(() => new Map(infractions.map(i => [i.date, i])), [infractions]);
    const adjustmentsMap = useMemo(() => new Map(adjustmentRequests.map(i => [i.date, i])), [adjustmentRequests]);
    const permitsMap = useMemo(() => new Map(permitRequests.map(p => [p.date, p])), [permitRequests]);
    const tasksMap = useMemo(() => new Map(externalTasks.map(t => [t.id, t])), [externalTasks]);


    const toggleRow = (date: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(date)) {
                newSet.delete(date);
            } else {
                newSet.add(date);
            }
            return newSet;
        });
    };

    return (
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            <table className="w-full text-sm text-right text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="px-4 py-3 w-8"></th>
                        <th scope="col" className="px-4 py-3">التاريخ</th>
                        <th scope="col" className="px-4 py-3">الحالة</th>
                        <th scope="col" className="px-4 py-3">أول حضور</th>
                        <th scope="col" className="px-4 py-3">آخر انصراف</th>
                        <th scope="col" className="px-4 py-3">ساعات العمل</th>
                        <th scope="col" className="px-4 py-3">المخالفات / الطلبات</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => {
                        const infraction = infractionsMap.get(record.date);
                        const adjustment = adjustmentsMap.get(record.date);
                        const permit = permitsMap.get(record.date);
                        const isExpanded = expandedRows.has(record.date);
                        const dailyEvents = events.filter(e => new Date(e.timestamp).toISOString().startsWith(record.date));

                        let isLate = false;
                        if (record.firstCheckIn) {
                            if (policy) {
                                const [hours, minutes] = record.firstCheckIn.split(':').map(Number);
                                const checkInMinutes = hours * 60 + minutes;
                                const officialStartMinutes = 9 * 60; // 09:00 AM
                                isLate = checkInMinutes > (officialStartMinutes + policy.gracePeriodInMinutes);
                            } else {
                                isLate = record.firstCheckIn > '09:00';
                            }
                        }

                        return (
                            <React.Fragment key={record.date}>
                                <tr className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-4 py-4">
                                        {dailyEvents.length > 0 && (
                                            <button onClick={() => toggleRow(record.date)} className="p-1 rounded-full hover:bg-slate-200">
                                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {new Date(record.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                                        <span className="block text-xs text-slate-500">{record.day}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[record.status]}`}>
                                            {STATUS_TRANSLATION[record.status]}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-4 font-mono ${isLate ? 'text-red-600 font-bold' : ''}`}>{record.firstCheckIn || '-'}</td>
                                    <td className="px-4 py-4 font-mono">{record.lastCheckOut || '-'}</td>
                                    <td className="px-4 py-4 font-bold text-slate-800">{record.workedHours?.toFixed(1) || '-'}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                        {permit ? (
                                            <div className="relative group">
                                                <ShieldCheckIcon className={`w-6 h-6 ${ADJUSTMENT_STATUS_STYLES[permit.status].iconColor}`} />
                                                <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                    <p className="font-bold">إذن انصراف: <span className={ADJUSTMENT_STATUS_STYLES[permit.status].text}>{ADJUSTMENT_STATUS_STYLES[permit.status].label}</span></p>
                                                    <p>الوقت: {permit.startTime} - {permit.endTime}</p>
                                                    <p>السبب: {permit.reason}</p>
                                                </div>
                                            </div>
                                        ) : adjustment ? (
                                            <div className="relative group">
                                                <InformationCircleIcon className={`w-6 h-6 ${ADJUSTMENT_STATUS_STYLES[adjustment.status].iconColor}`} />
                                                <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                    <p className="font-bold">طلب مقدم: <span className={ADJUSTMENT_STATUS_STYLES[adjustment.status].text}>{ADJUSTMENT_STATUS_STYLES[adjustment.status].label}</span></p>
                                                    <p>السبب: {adjustment.reason}</p>
                                                </div>
                                            </div>
                                        ) : infraction ? (
                                            <div className="relative group">
                                                <ExclamationTriangleIcon className={`w-6 h-6 ${infraction.penaltyApplied ? 'text-red-500' : 'text-amber-500'}`} />
                                                <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                    <p>{infraction.details}</p>
                                                    {infraction.penaltyApplied && <p className="font-bold">{infraction.penaltyDetails}</p>}
                                                </div>
                                            </div>
                                        ) : isLate ? (
                                            <div className="relative group">
                                                <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
                                                <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                    تأخير (لم يتم تطبيق جزاء بعد)
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                        </div>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr className="bg-slate-50">
                                        <td colSpan={7} className="p-0">
                                            <div className="p-3">
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="text-slate-600">
                                                            <th className="py-1 px-2 text-right">الوقت</th>
                                                            <th className="py-1 px-2 text-right">النوع</th>
                                                            <th className="py-1 px-2 text-right">حالة الموقع</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dailyEvents.map(event => {
                                                            const task = event.taskId ? tasksMap.get(event.taskId) : null;
                                                            return (
                                                            <tr key={event.id} className="border-t">
                                                                <td className="py-2 px-2 font-mono">{new Date(event.timestamp).toLocaleTimeString('ar-EG-u-nu-latn')}</td>
                                                                <td className="py-2 px-2">{event.type === 'CheckIn' ? 'تسجيل حضور' : 'تسجيل انصراف'}</td>
                                                                <td className="py-2 px-2">
                                                                    {task ? (
                                                                         <div className="flex items-center gap-1 text-blue-600" title={`Lat: ${event.coords?.latitude}, Lon: ${event.coords?.longitude}`}>
                                                                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                                                                            <span className="font-semibold">مهمة: {task.title}</span>
                                                                        </div>
                                                                    ) : event.isWithinGeofence ? 
                                                                        <span title="داخل النطاق" className="flex items-center gap-1 text-emerald-600"><CheckCircleIcon className="w-4 h-4" /><span>داخل النطاق</span></span> : 
                                                                        <span title="خارج النطاق" className="flex items-center gap-1 text-red-600"><XCircleIcon className="w-4 h-4" /><span>خارج النطاق</span></span>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )})}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceLogTable;