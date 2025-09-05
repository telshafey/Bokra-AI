

import React, { useState, useMemo } from 'react';
import { AttendanceRecord, EmployeeInfraction, EmployeeProfile, AttendancePolicy, AttendanceAdjustmentRequest, LeavePermitRequest, RequestStatus, AttendanceEvent, ExternalTask, AttendanceStatus, Branch } from '../types';
import AttendanceSummary from './AttendanceSummary';
import CalendarView from './CalendarView';
import AttendanceLogTable from './AttendanceLogTable';
import { PlusCircleIcon, ClockIcon, MagnifyingGlassIcon, FunnelIcon } from './icons/Icons';
import AttendanceAdjustmentModal from './AttendanceAdjustmentModal';
import LeavePermitModal from './LeavePermitModal';
import EmployeeAttendanceCard from './EmployeeAttendanceCard';
import { ALL_EMPLOYEES, COMPANY_BRANCHES } from '../constants';
import { useRequestContext } from './contexts/RequestContext';
import { usePoliciesContext } from './contexts/PoliciesContext';
import { useTranslation } from './contexts/LanguageContext';

const STATUS_BADGE: Record<RequestStatus, string> = {
    Approved: 'bg-emerald-100 text-emerald-800',
    Pending: 'bg-amber-100 text-amber-800',
    Rejected: 'bg-red-100 text-red-800',
};

interface AttendancePageProps {
  records: AttendanceRecord[];
  attendanceEvents: AttendanceEvent[];
  infractions: EmployeeInfraction[];
  currentUser: EmployeeProfile;
  externalTasks: ExternalTask[];
}

// FIX: Renamed component from EmployeeAttendanceView to AttendancePage to match default import in App.tsx.
const AttendancePage: React.FC<AttendancePageProps> = ({ records, attendanceEvents, infractions, currentUser, externalTasks }) => {
  const { t } = useTranslation();
  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  // FIX: Destructure `leavePermitRequests` correctly from the context hook.
  const { attendanceAdjustmentRequests, leavePermitRequests, handleNewAttendanceAdjustmentRequest, handleNewLeavePermitRequest } = useRequestContext();
  const { attendancePolicies } = usePoliciesContext();

  const userAdjustmentRequests = attendanceAdjustmentRequests.filter(r => r.employeeId === currentUser.id);
  const userPermitRequests = leavePermitRequests.filter(r => r.employeeId === currentUser.id);

  const attendancePolicy = attendancePolicies.find(p => p.id === currentUser.attendancePolicyId);
  
  const calculateLateCount = () => {
    if (!attendancePolicy) {
        return records.filter(r => r.firstCheckIn && r.firstCheckIn > '09:00').length;
    }

    return records.filter(r => {
        if (!r.firstCheckIn) return false;
        const [hours, minutes] = r.firstCheckIn.split(':').map(Number);
        const checkInMinutes = hours * 60 + minutes;
        const officialStartMinutes = 9 * 60;
        return checkInMinutes > (officialStartMinutes + attendancePolicy.gracePeriodInMinutes);
    }).length;
  };

  const totalPresent = records.filter(r => r.status === 'Present').length;
  const totalAbsent = records.filter(r => r.status === 'Absent').length;
  const totalOvertime = records.reduce((acc, r) => acc + (r.overtime || 0), 0);
  const lateCount = calculateLateCount();

  const combinedRequests = useMemo(() => {
    const mappedAdjustments = userAdjustmentRequests.map(r => ({
        id: `adj-${r.id}`, date: r.date, type: t(`attendance.excuseType.${r.adjustmentType === 'LateArrival' ? 'late' : 'early'}`), details: r.reason, status: r.status
    }));
    const mappedPermits = userPermitRequests.map(r => ({
        id: `prm-${r.id}`, date: r.date, type: t('attendance.permitType'), details: t('attendance.permitDetails', { startTime: r.startTime, endTime: r.endTime }), status: r.status
    }));
    return [...mappedAdjustments, ...mappedPermits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [userAdjustmentRequests, userPermitRequests, t]);

  return (
    <div className="space-y-6">
       <div className="flex justify-end items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
            <button onClick={() => setIsPermitModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                <ClockIcon className="w-6 h-6"/><span>{t('attendance.requestPermit')}</span>
            </button>
            <button onClick={() => setIsExcuseModalOpen(true)} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                <PlusCircleIcon className="w-6 h-6"/><span>{t('attendance.submitExcuse')}</span>
            </button>
        </div>
      </div>
      <AttendanceSummary presentDays={totalPresent} absentDays={totalAbsent} overtimeHours={totalOvertime} lateDays={lateCount} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-slate-700">{t('attendance.logTitle', { month: 'أغسطس', year: 2025 })}</h2>
          <AttendanceLogTable records={records} events={attendanceEvents} infractions={infractions} policy={attendancePolicy} adjustmentRequests={userAdjustmentRequests} permitRequests={userPermitRequests} externalTasks={externalTasks} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-slate-700">{t('attendance.monthCalendar')}</h2>
           <CalendarView records={records} year={2025} month={7} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-slate-700">{t('attendance.requestsLog')}</h2>
            {combinedRequests.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-6 py-3">التاريخ</th>
                                <th className="px-6 py-3">النوع</th>
                                <th className="px-6 py-3">التفاصيل</th>
                                <th className="px-6 py-3">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinedRequests.map(req => (
                                <tr key={req.id} className="border-b">
                                    <td className="px-6 py-4">{new Date(req.date).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                    <td className="px-6 py-4">{req.type}</td>
                                    <td className="px-6 py-4">{req.details}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[req.status]}`}>{t(`requestStatus.${req.status}`)}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <p>{t('attendance.noRequests')}</p>
                </div>
            )}
        </div>
      
      <AttendanceAdjustmentModal 
        isOpen={isExcuseModalOpen}
        onClose={() => setIsExcuseModalOpen(false)}
        onSubmit={(data) => handleNewAttendanceAdjustmentRequest({ ...data, employeeId: currentUser.id })}
      />
      <LeavePermitModal
        isOpen={isPermitModalOpen}
        onClose={() => setIsPermitModalOpen(false)}
        onSubmit={(data) => handleNewLeavePermitRequest({ ...data, employeeId: currentUser.id })}
        attendancePolicy={attendancePolicy}
        permitRequests={userPermitRequests}
      />
    </div>
  );
};

export default AttendancePage;
