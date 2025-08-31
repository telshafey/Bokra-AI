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

const STATUS_BADGE: Record<RequestStatus, string> = {
    Approved: 'bg-emerald-100 text-emerald-800',
    Pending: 'bg-amber-100 text-amber-800',
    Rejected: 'bg-red-100 text-red-800',
};

const STATUS_TRANSLATION: Record<RequestStatus, string> = {
    Approved: 'موافق عليه',
    Pending: 'قيد الانتظار',
    Rejected: 'مرفوض',
};


interface AttendancePageProps {
  records: AttendanceRecord[];
  attendanceEvents: AttendanceEvent[];
  infractions: EmployeeInfraction[];
  currentUser: EmployeeProfile;
  attendancePolicies: AttendancePolicy[];
  adjustmentRequests: AttendanceAdjustmentRequest[];
  onNewAdjustmentRequest: (newRequest: Omit<AttendanceAdjustmentRequest, 'id' | 'status' | 'type' | 'submissionDate'>) => void;
  permitRequests: LeavePermitRequest[];
  onNewPermitRequest: (newRequest: Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'employeeId' | 'durationHours'>) => void;
  externalTasks: ExternalTask[];
}

const EmployeeAttendanceView: React.FC<AttendancePageProps> = ({ records, attendanceEvents, infractions, currentUser, attendancePolicies, adjustmentRequests, onNewAdjustmentRequest, permitRequests, onNewPermitRequest, externalTasks }) => {
  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
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
    const mappedAdjustments = adjustmentRequests.map(r => ({
        id: `adj-${r.id}`, date: r.date, type: r.adjustmentType === 'LateArrival' ? 'عذر تأخير' : 'انصراف مبكر', details: r.reason, status: r.status
    }));
    const mappedPermits = permitRequests.map(r => ({
        id: `prm-${r.id}`, date: r.date, type: 'إذن انصراف', details: `من ${r.startTime} إلى ${r.endTime}`, status: r.status
    }));
    return [...mappedAdjustments, ...mappedPermits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [adjustmentRequests, permitRequests]);

  return (
    <div className="space-y-6">
       <div className="flex justify-end items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
            <button onClick={() => setIsPermitModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                <ClockIcon className="w-6 h-6"/><span>طلب إذن انصراف (مسبق)</span>
            </button>
            <button onClick={() => setIsExcuseModalOpen(true)} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
                <PlusCircleIcon className="w-6 h-6"/><span>تقديم عذر (بعد الواقعة)</span>
            </button>
        </div>
      </div>
      <AttendanceSummary presentDays={totalPresent} absentDays={totalAbsent} overtimeHours={totalOvertime} lateDays={lateCount} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-slate-700">سجل الحضور لشهر أغسطس 2025</h2>
          <AttendanceLogTable records={records} events={attendanceEvents} infractions={infractions} policy={attendancePolicy} adjustmentRequests={adjustmentRequests} permitRequests={permitRequests} externalTasks={externalTasks} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-slate-700">تقويم الشهر</h2>
           <CalendarView records={records} year={2025} month={7} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-slate-700">سجل طلبات الحضور</h2>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm text-right text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">النوع</th><th scope="col" className="px-6 py-3">التاريخ</th><th scope="col" className="px-6 py-3">التفاصيل</th><th scope="col" className="px-6 py-3">الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedRequests.map(req => (
                            <tr key={req.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{req.type}</td>
                                <td className="px-6 py-4">{new Date(req.date).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                <td className="px-6 py-4">{req.details}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[req.status]}`}>{STATUS_TRANSLATION[req.status]}</span></td>
                            </tr>
                        ))}
                         {combinedRequests.length === 0 && (<tr><td colSpan={4} className="text-center py-12 text-slate-500"><p className="font-semibold text-lg">لا توجد طلبات متعلقة بالدوام.</p></td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
       <AttendanceAdjustmentModal isOpen={isExcuseModalOpen} onClose={() => setIsExcuseModalOpen(false)} onSubmit={(data) => onNewAdjustmentRequest({...data, employeeId: currentUser.id})} />
       <LeavePermitModal isOpen={isPermitModalOpen} onClose={() => setIsPermitModalOpen(false)} onSubmit={onNewPermitRequest} attendancePolicy={attendancePolicy} permitRequests={permitRequests} />
    </div>
  );
};


const ManagerAttendanceView: React.FC<AttendancePageProps> = ({ records, attendanceEvents, attendancePolicies, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [branchFilter, setBranchFilter] = useState('all');

    const { teamMembers, departments, branches } = useMemo(() => {
        const teamMemberIds = new Set(
            ALL_EMPLOYEES.filter(e => e.managerId === currentUser.id).map(e => e.id)
        );
        if (currentUser.role === 'HR Manager' || currentUser.role === 'General Manager') {
            ALL_EMPLOYEES.forEach(e => teamMemberIds.add(e.id));
        }
        const members = ALL_EMPLOYEES.filter(emp => teamMemberIds.has(emp.id));
        const depts = [...new Set(members.map(e => e.department))];
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
            const deptMatch = departmentFilter === 'all' || emp.department === departmentFilter;
            
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
                            placeholder="ابحث عن موظف..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pr-10 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                         <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="p-2 border border-slate-300 rounded-lg bg-slate-50"/>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="p-2 border border-slate-300 rounded-lg bg-slate-50">
                        <option value="all">كل الحالات</option>
                        <option value="Present">حاضر</option>
                        <option value="Absent">غائب</option>
                        <option value="Leave">إجازة</option>
                    </select>
                    <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg bg-slate-50">
                        <option value="all">كل الأقسام</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                     <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg bg-slate-50">
                        <option value="all">كل الفروع</option>
                         {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
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