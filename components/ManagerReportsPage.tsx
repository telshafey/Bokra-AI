
import React, { useState, useMemo } from 'react';
import LeaveDistributionChart from './LeaveDistributionChart';
import TeamAttendanceBarChart from './TeamAttendanceBarChart';
import { EmployeeProfile, Goal, TeamReportsData, AttendanceRecord, HRRequest, ExternalTask, LeaveRequest } from '../types';
import ProductivityAnalysis from './ProductivityAnalysis';
import SentimentAnalysis from './SentimentAnalysis';
import StatCard from './StatCard';
import { ChartPieIcon, DocumentTextIcon, UserGroupIcon, ClockIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';
import DateRangePicker from './DateRangePicker';
import Card from './Card';
import ActionBar from './ActionBar';
import { LEAVE_TYPE_TRANSLATION } from '../constants';

type ReportTab = 'attendance' | 'absences' | 'leaves' | 'tasks';
type SortableKeys<T> = keyof T;


interface ManagerReportsPageProps {
  reportsData: TeamReportsData;
  teamMembers: EmployeeProfile[];
  teamGoals: Goal[];
  attendanceRecords: AttendanceRecord[];
  requests: HRRequest[];
  externalTasks: ExternalTask[];
}

const ReportTabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
    >
        {label}
    </button>
);

const ManagerReportsPage: React.FC<ManagerReportsPageProps> = ({ reportsData, teamMembers, teamGoals, attendanceRecords, requests, externalTasks }) => {
  const { keyMetrics, weeklyAttendance, leaveDistribution } = reportsData;
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const teamMemberIds = useMemo(() => new Set(teamMembers.map(m => m.id)), [teamMembers]);
  const employeeMap = useMemo(() => new Map(teamMembers.map(e => [e.id, e.name])), [teamMembers]);

  const filteredData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) {
        return { attendance: [], absences: [], leaves: [], tasks: [] };
    }

    const startDate = new Date(dateRange.start);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    const isInDateRange = (dateStr: string) => {
        const recordTime = new Date(dateStr).getTime();
        return recordTime >= startDate.getTime() && recordTime <= endDate.getTime();
    };

    const teamAttendance = attendanceRecords.filter(r => teamMemberIds.has(r.employeeId) && isInDateRange(r.date));
    const teamRequests = requests.filter(r => teamMemberIds.has(r.employeeId) && isInDateRange(r.submissionDate));
    const teamTasks = externalTasks.filter(t => teamMemberIds.has(t.employeeId) && isInDateRange(t.date));
    
    const absences = teamAttendance.filter(r => r.status === 'Absent');

    return {
        attendance: teamAttendance.filter(r => r.status === 'Present'),
        absences,
        leaves: teamRequests.filter(r => r.type === 'Leave') as LeaveRequest[],
        tasks: teamTasks,
    };
  }, [dateRange, teamMemberIds, attendanceRecords, requests, externalTasks]);
  
  const sortedData = useMemo(() => {
    let dataToSort = filteredData[activeTab] || [];
    if (sortConfig !== null) {
        (dataToSort as any[]).sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
            
            if (sortConfig.key === 'employeeId') {
                aValue = employeeMap.get(aValue) || '';
                bValue = employeeMap.get(bValue) || '';
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return dataToSort;
  }, [filteredData, activeTab, sortConfig, employeeMap]);


    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
        return sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
    };


  const renderActiveTable = () => {
    if (sortedData.length === 0) {
        return (
             <div className="text-center p-12 text-slate-500">
                <p>لا توجد بيانات لعرضها في الفترة الزمنية المحددة.</p>
            </div>
        )
    }

    const commonHeaderClass = "flex items-center gap-1";

    switch (activeTab) {
        case 'attendance':
            return (
                <table className="w-full text-sm text-right text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th className="px-6 py-3"><button onClick={() => handleSort('employeeId')} className={commonHeaderClass}>الموظف {getSortIcon('employeeId')}</button></th>
                            <th className="px-6 py-3"><button onClick={() => handleSort('date')} className={commonHeaderClass}>التاريخ {getSortIcon('date')}</button></th>
                            <th className="px-6 py-3">أول حضور</th><th className="px-6 py-3">آخر انصراف</th>
                            <th className="px-6 py-3"><button onClick={() => handleSort('workedHours')} className={commonHeaderClass}>ساعات العمل {getSortIcon('workedHours')}</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sortedData as AttendanceRecord[]).map(r => (
                            <tr key={`${r.employeeId}-${r.date}`} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium">{employeeMap.get(r.employeeId) || r.employeeId}</td>
                                <td className="px-6 py-4">{r.date}</td>
                                <td className="px-6 py-4">{r.firstCheckIn || '-'}</td>
                                <td className="px-6 py-4">{r.lastCheckOut || '-'}</td>
                                <td className="px-6 py-4">{r.workedHours?.toFixed(2) || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        case 'absences':
            return (
                 <table className="w-full text-sm text-right text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th className="px-6 py-3"><button onClick={() => handleSort('employeeId')} className={commonHeaderClass}>الموظف {getSortIcon('employeeId')}</button></th>
                            <th className="px-6 py-3"><button onClick={() => handleSort('date')} className={commonHeaderClass}>تاريخ الغياب {getSortIcon('date')}</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sortedData as AttendanceRecord[]).map(r => (
                            <tr key={`${r.employeeId}-${r.date}`} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium">{employeeMap.get(r.employeeId) || r.employeeId}</td>
                                <td className="px-6 py-4">{r.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        case 'leaves':
            return (
                <table className="w-full text-sm text-right text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th className="px-6 py-3"><button onClick={() => handleSort('employeeId')} className={commonHeaderClass}>الموظف {getSortIcon('employeeId')}</button></th>
                            <th className="px-6 py-3"><button onClick={() => handleSort('leaveType')} className={commonHeaderClass}>نوع الإجازة {getSortIcon('leaveType')}</button></th>
                            <th className="px-6 py-3"><button onClick={() => handleSort('startDate')} className={commonHeaderClass}>من {getSortIcon('startDate')}</button></th>
                            <th className="px-6 py-3">إلى</th>
                            <th className="px-6 py-3"><button onClick={() => handleSort('duration')} className={commonHeaderClass}>المدة {getSortIcon('duration')}</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sortedData as LeaveRequest[]).map(r => (
                            <tr key={r.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium">{employeeMap.get(r.employeeId) || r.employeeId}</td>
                                <td className="px-6 py-4">{LEAVE_TYPE_TRANSLATION[r.leaveType]}</td>
                                <td className="px-6 py-4">{r.startDate}</td>
                                <td className="px-6 py-4">{r.endDate}</td>
                                <td className="px-6 py-4">{r.duration} أيام</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        case 'tasks':
            return (
                <table className="w-full text-sm text-right text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                             <th className="px-6 py-3"><button onClick={() => handleSort('employeeId')} className={commonHeaderClass}>الموظف {getSortIcon('employeeId')}</button></th>
                             <th className="px-6 py-3"><button onClick={() => handleSort('title')} className={commonHeaderClass}>المهمة {getSortIcon('title')}</button></th>
                             <th className="px-6 py-3"><button onClick={() => handleSort('date')} className={commonHeaderClass}>التاريخ {getSortIcon('date')}</button></th>
                             <th className="px-6 py-3">الوقت</th>
                             <th className="px-6 py-3"><button onClick={() => handleSort('status')} className={commonHeaderClass}>الحالة {getSortIcon('status')}</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sortedData as ExternalTask[]).map(t => (
                            <tr key={t.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium">{employeeMap.get(t.employeeId) || t.employeeId}</td>
                                <td className="px-6 py-4">{t.title}</td>
                                <td className="px-6 py-4">{t.date}</td>
                                <td className="px-6 py-4">{t.startTime} - {t.endTime}</td>
                                <td className="px-6 py-4">{t.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        default:
            return null;
    }
  }


  return (
    <div className="space-y-6">
        {/* Top dashboard section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800">تقارير وتحليلات الفريق</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="متوسط إنجاز الأهداف" value={`${keyMetrics.avgGoalCompletion}%`} icon={ChartPieIcon} color="bg-emerald-500" />
            <StatCard title="متوسط معنويات الفريق" value={`${keyMetrics.avgTeamSentiment}/5`} icon={UserGroupIcon} color="bg-sky-500" />
            <StatCard title="الطلبات المعلقة" value={`${keyMetrics.pendingRequests}`} icon={DocumentTextIcon} color="bg-amber-500" />
            <StatCard title="إجمالي الإضافي (الشهر)" value={`${keyMetrics.totalOvertime} س`} icon={ClockIcon} color="bg-purple-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductivityAnalysis goals={teamGoals} />
            <SentimentAnalysis teamMembers={teamMembers} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-700">ملخص حضور الفريق الأسبوعي</h2>
                <div className="h-80"><TeamAttendanceBarChart data={weeklyAttendance} /></div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-700">توزيع إجازات الفريق</h2>
                <div className="h-80"><LeaveDistributionChart data={leaveDistribution} /></div>
            </div>
        </div>

        {/* New Detailed Reports Section */}
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">تقارير تفصيلية</h2>
            <ActionBar>
                <div className="flex items-center gap-2">
                    <ReportTabButton label="تقرير الحضور" isActive={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                    <ReportTabButton label="تقرير الغياب" isActive={activeTab === 'absences'} onClick={() => setActiveTab('absences')} />
                    <ReportTabButton label="تقرير الإجازات" isActive={activeTab === 'leaves'} onClick={() => setActiveTab('leaves')} />
                    <ReportTabButton label="تقرير المهام الخارجية" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
                </div>
                <DateRangePicker onDateChange={(start, end) => setDateRange({ start, end })} />
            </ActionBar>

            <Card paddingClass="p-0">
                <div className="flex justify-end p-4 border-b">
                    <button className="text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 py-2 px-4 rounded-lg">تصدير التقرير</button>
                </div>
                <div className="overflow-x-auto min-h-[200px]">
                    {renderActiveTable()}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default ManagerReportsPage;
