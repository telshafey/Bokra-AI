
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

const EmployeeAttendanceView: React.FC<AttendancePageProps> = ({ records, attendanceEvents, infractions, currentUser, externalTasks }) => {
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
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm text-right text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('general.type')}</th><th scope="col" className="px-6 py-3">{t('general.date')}</th><th scope="col" className="px-6 py-3">{t('general.details')}</th><th scope="col" className="px-6 py-3">{t('general.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedRequests.map(req => (
                            <tr key={req.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{req.type}</td>
                                <td className="px-6 py-4">{new Date(req.date).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                <td className="px-6 py-4">{req.details}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[req.status]}`}>{t(`requestStatus.${req.status}`)}</span></td>
                            </tr>
                        ))}
                         {combinedRequests.length === 0 && (<tr><td colSpan={4} className="text-center py-12 text-slate-500"><p className="font-semibold text-lg">{t('attendance.noRequests')}</p></td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
       <AttendanceAdjustmentModal isOpen={isExcuseModalOpen} onClose={() => setIsExcuseModalOpen(false)} onSubmit={(data) => handleNewAttendanceAdjustmentRequest({...data, employeeId: currentUser.id})} />
       {/* FIX: Correctly pass the employeeId inside the new request object to resolve the type error. */}
       <LeavePermitModal isOpen={isPermitModalOpen} onClose={() => setIsPermitModalOpen(false)} onSubmit={(data) => handleNewLeavePermitRequest({...data, employeeId: currentUser.id})} attendancePolicy={attendancePolicy} permitRequests={userPermitRequests} />
    </div>
  );
};


const ManagerAttendanceView: React.FC<AttendancePageProps> = ({ records, attendanceEvents, currentUser }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [branchFilter, setBranchFilter] = useState('all');
    const { attendancePolicies } = usePoliciesContext();

    const { teamMembers, departments, branches } = useMemo(() => {
        const teamMemberIds = new Set(
            ALL_EMPLOYEES.filter(e => e.managerId === currentUser.id).map(e => e.id)
        );
        if (currentUser.role === 'HR Manager' || currentUser.role === 'General Manager') {
            ALL_EMPLOYEES.forEach(e => teamMemberIds.add(e.id));
        }
        const members = ALL_EMPLOYEES.filter(emp => teamMemberIds.has(emp.id));
        // FIX: Replaced property access from `department` to `departmentKey` to match the type definition.
        const depts = [...new Set(members.map(e => e.departmentKey))];
        const branchIds = [...new Set(members.map(e => e.branchId))];
        const brnchs = COMPANY_BRANCHES.filter(b => branchIds.includes(b.id));
        return { teamMembers: members, departments: depts, branches: brnchs };
    }, [currentUser]);

    const filteredEmployees = useMemo(() => {
        const dailyStatuses = new Map<string, AttendanceStatus>();
        records.forEach(r => {
            if (r.date === selectedDate) {
                dailyStatuses.set(r.employeeId, r.status);
            }
        });

        return teamMembers.filter(emp => {
            const searchTermMatch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
            const branchMatch = branchFilter === 'all' || emp.branchId === branchFilter;
            // FIX: Replaced property access from `department` to `departmentKey` to match the type definition.
            const deptMatch = departmentFilter === 'all' || emp.departmentKey === departmentFilter;
            
            const empStatusForDay = dailyStatuses.get(emp.id) || 'Absent';
            const statusMatch = statusFilter === 'all' || empStatusForDay === statusFilter;
            
            return searchTermMatch && branchMatch && deptMatch && statusMatch;
        });
    }, [teamMembers, searchTerm, selectedDate, statusFilter, departmentFilter, branchFilter, records]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="relative lg:col-span-2">
                        <input
                            type="text"
                            placeholder={t('attendance.searchEmployee')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pr-10 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                         <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="p-2 border border-slate-300 rounded-lg bg-slate-50"/>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="p-2 border border-slate-300 rounded-lg bg-slate-50">
                        <option value="all">{t('attendance.allStatuses')}</option>
                        <option value="Present">{t('attendance.statuses.Present')}</option>
                        <option value="Absent">{t('attendance.statuses.Absent')}</option>
                        <option value="Leave">{t('attendance.statuses.Leave')}</option>
                    </select>
                    <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg bg-slate-50">
                        <option value="all">{t('attendance.allDepartments')}</option>
                        {departments.map(d => <option key={d} value={d}>{t(`departments.${d}`)}</option>)}
                    </select>
                     <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg bg-slate-50">
                        <option value="all">{t('attendance.allBranches')}</option>
                         {/* FIX: Replaced property access from `name` to `nameKey` and wrapped it in the translation function to match the type definition. */}
                         {branches.map(b => <option key={b.id} value={b.id}>{t(b.nameKey)}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEmployees.map(employee => {
                     const recordsForDay = records.filter(r => r.employeeId === employee.id && r.date === selectedDate);
                     const eventsForDay = attendanceEvents.filter(e => e.employeeId === employee.id && e.timestamp.startsWith(selectedDate));
                     const policy = attendancePolicies.find(p => p.id === employee.attendancePolicyId);
                     return (
                        <EmployeeAttendanceCard
                            key={employee.id}
                            employee={employee}
                            recordsForDay={recordsForDay}
                            eventsForDay={eventsForDay}
                            policy={policy}
                        />
                     )
                })}
            </div>
        </div>
    )
};

const AttendancePage: React.FC<AttendancePageProps> = (props) => {
  const isManagerView = useMemo(() => 
    ['Super Admin', 'Admin', 'General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'].includes(props.currentUser.role),
    [props.currentUser.role]
  );
  
  const uniqueEmployeeIds = useMemo(() => new Set(props.records.map(r => r.employeeId)), [props.records]);
  
  // A more robust check: is it a manager role AND are they looking at records for more than just themself?
  if (isManagerView && (uniqueEmployeeIds.size > 1 || (uniqueEmployeeIds.size === 1 && !uniqueEmployeeIds.has(props.currentUser.id)))) {
     return <ManagerAttendanceView {...props} />;
  }
  
  return <EmployeeAttendanceView {...props} />;
};

export default AttendancePage;
