
import React from 'react';
import { HomeIcon, CalendarIcon, DocumentTextIcon, UserCircleIcon, CogIcon, ArrowLeftOnRectangleIcon, BriefcaseIcon, BanknotesIcon, ChartPieIcon, AcademicCapIcon, UserGroupIcon, ClipboardDocumentListIcon, DocumentCheckIcon, BuildingOfficeIcon, PresentationChartLineIcon, CheckCircleIcon, ShieldCheckIcon, ShieldExclamationIcon, BookOpenIcon, UsersIcon, DocumentDuplicateIcon, ClockIcon, QuestionMarkCircleIcon, CheckBadgeIcon, ArchiveBoxIcon, ClipboardDocumentCheckIcon, UserPlusIcon, UserMinusIcon, ChevronDownIcon, ExclamationTriangleIcon, ArrowsUpDownIcon, ChevronUpIcon, ComputerDesktopIcon } from './components/icons/Icons';
import type { NavItem, EmployeeProfile, AttendanceRecord, Payslip, PayslipItem, LeaveRequest, HRRequest, TeamMemberDetails, LeaveType, LeaveDistributionDataItem, TeamWeeklyAttendanceItem, Branch, Goal, PerformanceReview, Skill, DevelopmentSuggestion, AttendancePolicy, LeavePolicy, EmployeeInfraction, JobTitle, Course, EmployeeCourse, Notification, MonthlyCheckIn, SalaryComponent, CompensationPackage, SupportTicket, EmployeeDashboardData, TeamDashboardData, RecentActivityItem, AttentionItem, TeamLearningStat, OvertimePolicy, AttendanceAdjustmentRequest, LeavePermitRequest, TeamMember, JobOpening, Candidate, OnboardingTemplate, OnboardingProcess, OnboardingTaskCategory, OnboardingResponsible, OffboardingTemplate, OffboardingProcess, OffboardingTaskCategory, OffboardingResponsible, NavGroup, EmployeeDocument, WorkLocation, AttendanceEvent, ExternalTask, TeamReportsData, TeamMemberStats, RequestType, AttendanceStatus, ApprovalContext, OverlappingLeave, PerformanceCycle, TeamMemberPerformanceData, ManagerPerformanceData, Asset } from './types';

// =================================================================================
// ===== COMPANY STRUCTURE & HIERARCHY =====
// =================================================================================

export const COMPANY_BRANCHES: Branch[] = [
    { id: 'branch-cai', name: 'المقر الرئيسي بالقاهرة', status: 'Active' },
    { id: 'branch-alex', name: 'فرع الإسكندرية', status: 'Active' },
];

export const MOCK_JOB_TITLES: JobTitle[] = [
    { id: 'jt-super-admin', name: 'Super Admin', parentId: null },
    { id: 'jt-admin-cai', name: 'مسؤول منصة القاهرة', parentId: 'jt-super-admin' },
    { id: 'jt-admin-alex', name: 'مسؤول منصة الإسكندرية', parentId: 'jt-super-admin' },
    { id: 'jt-gm', name: 'المدير العام', parentId: null },
    { id: 'jt-hr-manager', name: 'مدير الموارد البشرية', parentId: 'jt-gm' },
    { id: 'jt-branch-manager-alex', name: 'مدير فرع الإسكندرية', parentId: 'jt-gm' },
    { id: 'jt-dev-lead', name: 'قائد فريق التطوير', parentId: 'jt-hr-manager' },
    { id: 'jt-sse', name: 'مهندس برمجيات أول', parentId: 'jt-dev-lead' },
    { id: 'jt-se', name: 'مهندس برمجيات', parentId: 'jt-dev-lead' },
    { id: 'jt-sales-lead', name: 'قائد فريق المبيعات', parentId: 'jt-branch-manager-alex' },
    { id: 'jt-sales-rep', name: 'مسؤول مبيعات', parentId: 'jt-sales-lead' },
];

export const ALL_EMPLOYEES: EmployeeProfile[] = [
     {
        id: 'emp-999', employeeId: 'SYS-001', name: 'مسؤول النظام الخارق', jobTitleId: 'jt-super-admin', title: '', role: 'Super Admin', isEmployee: false, avatarUrl: 'https://i.pravatar.cc/100?u=superadmin', department: 'System', hireDate: '2020-01-01', employmentStatus: 'System Account', managerId: undefined, branchId: 'branch-cai', checkInStatus: 'CheckedOut',
        leaveBalances: [], baseSalary: 0,
        contact: { phone: '-', workEmail: 'superadmin@system.local', personalEmail: '-' },
        personal: { dateOfBirth: '-', nationality: '-', nationalId: '-', maritalStatus: '-', gender: 'Male', religion: '-' }, address: '-',
        performanceScore: 0, satisfactionSurveyScore: 0, lastPromotionDate: null, salaryComparedToMarket: 'Average',
    },
    {
        id: 'emp-000', employeeId: 'SYS-002', name: 'مسؤول منصة القاهرة', jobTitleId: 'jt-admin-cai', title: '', role: 'Admin', isEmployee: false, avatarUrl: 'https://i.pravatar.cc/100?u=admin', department: 'System', hireDate: '2020-01-10', employmentStatus: 'System Account', managerId: 'emp-999', branchId: 'branch-cai', checkInStatus: 'CheckedOut',
        leaveBalances: [], baseSalary: 0,
        contact: { phone: '-', workEmail: 'admin@system.local', personalEmail: '-' },
        personal: { dateOfBirth: '-', nationality: '-', nationalId: '-', maritalStatus: '-', gender: 'Male', religion: '-' }, address: '-',
        performanceScore: 0, satisfactionSurveyScore: 0, lastPromotionDate: null, salaryComparedToMarket: 'Average',
    },
    {
        id: 'emp-100', employeeId: 'SYS-003', name: 'أحمد محمود', jobTitleId: 'jt-admin-alex', title: '', role: 'Admin', isEmployee: false, avatarUrl: 'https://i.pravatar.cc/100?u=admin-alex', department: 'System', hireDate: '2022-02-15', employmentStatus: 'System Account', managerId: 'emp-999', branchId: 'branch-alex', checkInStatus: 'CheckedOut',
        leaveBalances: [], baseSalary: 0,
        contact: { phone: '-', workEmail: 'admin.alex@system.local', personalEmail: '-' },
        personal: { dateOfBirth: '-', nationality: '-', nationalId: '-', maritalStatus: '-', gender: 'Male', religion: '-' }, address: '-',
        performanceScore: 0, satisfactionSurveyScore: 0, lastPromotionDate: null, salaryComparedToMarket: 'Average',
    },
    {
        id: 'emp-gm', employeeId: 'BOK-0001', name: 'علي سالم', jobTitleId: 'jt-gm', title: '', role: 'General Manager', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=gm', department: 'الإدارة', hireDate: '2021-01-01', employmentStatus: 'دوام كامل', managerId: undefined, branchId: 'branch-cai', checkInStatus: 'CheckedOut', baseSalary: 40000,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 30, used: 5 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 2 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 1 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01012345678', workEmail: 'ali.salem@bokra.hr', personalEmail: 'ali.salem@email.com' },
        personal: { dateOfBirth: '1980-05-15', nationality: 'مصري', nationalId: '28005150100123', maritalStatus: 'متزوج', gender: 'Male', religion: 'Muslim' }, address: '123 شارع النيل، القاهرة',
        performanceScore: 4.8, satisfactionSurveyScore: 4.5, lastPromotionDate: '2023-01-01', salaryComparedToMarket: 'Above',
        leavePolicyId: 'leave-policy-management',
        compensationPackageId: 'pkg-manager',
    },
    {
        id: 'emp-001', employeeId: 'BOK-0002', name: 'فاطمة أحمد', jobTitleId: 'jt-hr-manager', title: '', role: 'HR Manager', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=fatima', department: 'الموارد البشرية', hireDate: '2022-03-10', employmentStatus: 'دوام كامل', managerId: 'emp-gm', branchId: 'branch-cai', checkInStatus: 'CheckedIn', baseSalary: 25000,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 5 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 1 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 3 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01123456789', workEmail: 'fatima.ahmed@bokra.hr', personalEmail: 'fatima.ahmed@email.com' },
        personal: { dateOfBirth: '1988-11-20', nationality: 'مصرية', nationalId: '28811200100456', maritalStatus: 'متزوج', gender: 'Female', religion: 'Muslim' }, address: '456 شارع الجمهورية، القاهرة',
        performanceScore: 4.5, satisfactionSurveyScore: 4.2, lastPromotionDate: null, salaryComparedToMarket: 'Average',
        attendancePolicyId: 'policy-standard-2025',
        overtimePolicyId: 'ot-policy-standard',
        leavePolicyId: 'leave-policy-standard',
        compensationPackageId: 'pkg-manager',
    },
    {
        id: 'emp-002', employeeId: 'BOK-0003', name: 'كريم عادل', jobTitleId: 'jt-dev-lead', title: '', role: 'Team Lead', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=karim', department: 'تكنولوجيا المعلومات', hireDate: '2021-08-15', employmentStatus: 'دوام كامل', managerId: 'emp-001', branchId: 'branch-cai', checkInStatus: 'CheckedOut', baseSalary: 20000,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 10 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 0 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 0 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01234567890', workEmail: 'karim.adel@bokra.hr', personalEmail: 'karim.adel@email.com' },
        personal: { dateOfBirth: '1992-02-10', nationality: 'مصري', nationalId: '29202100100789', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' }, address: '789 شارع التحرير، القاهرة',
        performanceScore: 4.2, satisfactionSurveyScore: 3.8, lastPromotionDate: '2023-08-15', salaryComparedToMarket: 'Average',
        overtimePolicyId: 'ot-policy-high-rate',
        leavePolicyId: 'leave-policy-standard',
        compensationPackageId: 'pkg-tech-l2',
    },
    {
        id: 'emp-003', employeeId: 'BOK-0004', name: 'هدى زكي', jobTitleId: 'jt-sse', title: '', role: 'Employee', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=hoda', department: 'تكنولوجيا المعلومات', hireDate: '2022-11-01', employmentStatus: 'دوام كامل', managerId: 'emp-002', branchId: 'branch-cai', checkInStatus: 'CheckedOut', baseSalary: 12000,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 2 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 3 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 1 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01098765432', workEmail: 'hoda.zaki@bokra.hr', personalEmail: 'hoda.zaki@email.com' },
        personal: { dateOfBirth: '1995-07-25', nationality: 'مصرية', nationalId: '29507250100123', maritalStatus: 'أعزب', gender: 'Female', religion: 'Muslim' }, address: '101 شارع عباس العقاد، القاهرة',
        performanceScore: 3.5, satisfactionSurveyScore: 3.2, lastPromotionDate: null, salaryComparedToMarket: 'Below',
        attendancePolicyId: 'policy-standard-2025',
        overtimePolicyId: 'ot-policy-standard',
        leavePolicyId: 'leave-policy-standard',
        compensationPackageId: 'pkg-tech-l1',
    },
    {
        id: 'emp-004', employeeId: 'BOK-0005', name: 'طارق حسن', jobTitleId: 'jt-se', title: '', role: 'Employee', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=tarek', department: 'تكنولوجيا المعلومات', hireDate: '2023-06-20', employmentStatus: 'دوام كامل', managerId: 'emp-002', branchId: 'branch-cai', checkInStatus: 'CheckedOut', baseSalary: 9000,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 0 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 0 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 4 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01187654321', workEmail: 'tarek.hassan@bokra.hr', personalEmail: 'tarek.hassan@email.com' },
        personal: { dateOfBirth: '1998-01-30', nationality: 'مصري', nationalId: '29801300100456', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' }, address: '202 شارع مكرم عبيد، القاهرة',
        performanceScore: 4.0, satisfactionSurveyScore: 4.5, lastPromotionDate: null, salaryComparedToMarket: 'Average',
        attendancePolicyId: 'policy-standard-2025',
        overtimePolicyId: 'ot-policy-standard',
        leavePolicyId: 'leave-policy-standard',
        compensationPackageId: 'pkg-tech-l1',
    },
     {
        id: 'emp-005', employeeId: 'BOK-0006', name: 'سارة كمال', jobTitleId: 'jt-se', title: '', role: 'Employee', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=sara', department: 'تكنولوجيا المعلومات', hireDate: '2025-09-01', employmentStatus: 'دوام كامل', managerId: 'emp-002', branchId: 'branch-cai', checkInStatus: 'CheckedOut', baseSalary: 9500,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 0 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 0 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 0 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01011223344', workEmail: 'sara.kamal@bokra.hr', personalEmail: 'sara.kamal@email.com' },
        personal: { dateOfBirth: '1999-03-15', nationality: 'مصرية', nationalId: '29903150100123', maritalStatus: 'أعزب', gender: 'Female', religion: 'Muslim' }, address: '303 شارع التسعين، القاهرة',
        performanceScore: 4.0, satisfactionSurveyScore: 4.0, lastPromotionDate: null, salaryComparedToMarket: 'Average',
        attendancePolicyId: 'policy-standard-2025',
        overtimePolicyId: 'ot-policy-standard',
        leavePolicyId: 'leave-policy-standard',
        compensationPackageId: 'pkg-tech-l1',
    },
    {
        id: 'emp-101', employeeId: 'BOK-1001', name: 'عمر فوزي', jobTitleId: 'jt-branch-manager-alex', title: '', role: 'Branch Admin', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=omar', department: 'الإدارة', hireDate: '2022-05-10', employmentStatus: 'دوام كامل', managerId: 'emp-gm', branchId: 'branch-alex', checkInStatus: 'CheckedOut', baseSalary: 22000,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 7 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 0 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 2 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01276543210', workEmail: 'omar.fawzy@bokra.hr', personalEmail: 'omar.fawzy@email.com' },
        personal: { dateOfBirth: '1989-09-09', nationality: 'مصري', nationalId: '28909090200789', maritalStatus: 'متزوج', gender: 'Male', religion: 'Muslim' }, address: '12 شارع فؤاد، الإسكندرية',
        performanceScore: 4.6, satisfactionSurveyScore: 4.8, lastPromotionDate: null, salaryComparedToMarket: 'Average',
        leavePolicyId: 'leave-policy-standard',
    },
    {
        id: 'emp-102', employeeId: 'BOK-1002', name: 'منى سيد', jobTitleId: 'jt-sales-lead', title: '', role: 'Team Lead', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=mona', department: 'المبيعات', hireDate: '2023-01-05', employmentStatus: 'دوام كامل', managerId: 'emp-101', branchId: 'branch-alex', checkInStatus: 'CheckedOut', baseSalary: 18000,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 4 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 1 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 0 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01065432109', workEmail: 'mona.sayed@bokra.hr', personalEmail: 'mona.sayed@email.com' },
        personal: { dateOfBirth: '1994-04-12', nationality: 'مصرية', nationalId: '29404120200123', maritalStatus: 'أعزب', gender: 'Female', religion: 'Muslim' }, address: '34 شارع صفية زغلول، الإسكندرية',
        performanceScore: 4.1, satisfactionSurveyScore: 4.0, lastPromotionDate: null, salaryComparedToMarket: 'Average',
        overtimePolicyId: 'ot-policy-high-rate',
        leavePolicyId: 'leave-policy-standard',
    },
    {
        id: 'emp-103', employeeId: 'BOK-1003', name: 'يوسف إبراهيم', jobTitleId: 'jt-sales-rep', title: '', role: 'Employee', isEmployee: true, avatarUrl: 'https://i.pravatar.cc/100?u=youssef', department: 'المبيعات', hireDate: '2023-09-01', employmentStatus: 'دوام كامل', managerId: 'emp-102', branchId: 'branch-alex', checkInStatus: 'CheckedOut', baseSalary: 8500,
        leaveBalances: [ { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 1 }, { type: 'Sick', typeName: 'إجازة مرضية', balance: 15, used: 0 }, { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 1 }, { type: 'Unpaid', typeName: 'بدون أجر', balance: 99, used: 0 } ],
        contact: { phone: '01154321098', workEmail: 'youssef.ibrahim@bokra.hr', personalEmail: 'youssef.ibrahim@email.com' },
        personal: { dateOfBirth: '1999-12-01', nationality: 'مصري', nationalId: '29912010200456', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' }, address: '56 شارع أبو قير، الإسكندرية',
        performanceScore: 3.9, satisfactionSurveyScore: 4.3, lastPromotionDate: null, salaryComparedToMarket: 'Average',
        overtimePolicyId: 'ot-policy-high-rate',
        leavePolicyId: 'leave-policy-standard',
    },
];

export const INITIAL_USER_ID = 'emp-003'; // Default to a regular employee view

// =================================================================================
// ===== MOCK DATA =====
// =================================================================================

export const LEAVE_TYPE_TRANSLATION: Record<LeaveType, string> = {
    'Annual': 'سنوية',
    'Sick': 'مرضية',
    'Casual': 'عارضة',
    'Unpaid': 'بدون أجر',
};

// FIX: Added missing 'type' and 'submissionDate' properties to match the LeaveRequest interface.
export const MOCK_LEAVE_REQUESTS_INITIAL: LeaveRequest[] = [
    { id: 1, employeeId: 'emp-003', type: 'Leave', submissionDate: '2025-05-15', leaveType: 'Sick', startDate: '2025-05-15', endDate: '2025-05-16', duration: 2, reason: 'نزلة برد', status: 'Approved' },
    { id: 2, employeeId: 'emp-003', type: 'Leave', submissionDate: '2025-06-10', leaveType: 'Annual', startDate: '2025-06-10', endDate: '2025-06-12', duration: 3, reason: 'إجازة قصيرة', status: 'Pending' },
    { id: 3, employeeId: 'emp-002', type: 'Leave', submissionDate: '2025-06-01', leaveType: 'Annual', startDate: '2025-06-01', endDate: '2025-06-05', duration: 5, reason: 'إجازة الصيف', status: 'Pending' },
    { id: 4, employeeId: 'emp-103', type: 'Leave', submissionDate: '2025-05-20', leaveType: 'Casual', startDate: '2025-05-20', endDate: '2025-05-20', duration: 1, reason: 'ظرف طارئ', status: 'Approved' },
    { id: 6, employeeId: 'emp-004', type: 'Leave', submissionDate: '2025-07-01', leaveType: 'Annual', startDate: '2025-07-01', endDate: '2025-07-05', duration: 5, reason: 'السفر', status: 'Pending' },
];

// FIX: Added missing 'type' and 'submissionDate' properties to match the AttendanceAdjustmentRequest interface.
export const MOCK_ADJUSTMENT_REQUESTS_INITIAL: AttendanceAdjustmentRequest[] = [
    { id: 8, employeeId: 'emp-003', type: 'AttendanceAdjustment', submissionDate: '2025-08-04', adjustmentType: 'LateArrival', date: '2025-08-04', time: '09:25', reason: 'ازدحام مروري شديد', status: 'Approved' },
    { id: 9, employeeId: 'emp-003', type: 'AttendanceAdjustment', submissionDate: '2025-08-06', adjustmentType: 'LateArrival', date: '2025-08-06', time: '09:40', reason: 'موعد طبي طارئ', status: 'Pending' },
];

// FIX: Added missing 'type' and 'submissionDate' properties to match the LeavePermitRequest interface.
export const MOCK_LEAVE_PERMIT_REQUESTS_INITIAL: LeavePermitRequest[] = [
    { id: 10, employeeId: 'emp-003', type: 'LeavePermit', submissionDate: '2025-08-08', date: '2025-08-08', startTime: '15:00', endTime: '17:00', durationHours: 2, reason: 'موعد طبيب أسنان', status: 'Approved' },
    { id: 11, employeeId: 'emp-003', type: 'LeavePermit', submissionDate: '2025-08-11', date: '2025-08-11', startTime: '10:00', endTime: '11:30', durationHours: 1.5, reason: 'إنهاء أوراق شخصية', status: 'Pending' },
    { id: 12, employeeId: 'emp-004', type: 'LeavePermit', submissionDate: '2025-08-12', date: '2025-08-12', startTime: '13:00', endTime: '15:00', durationHours: 2, reason: 'مشوار عائلي طارئ', status: 'Pending' },
];

const nonLeaveRequests: HRRequest[] = [
    { id: 5, employeeId: 'emp-003', type: 'Certificate', submissionDate: '2025-05-22', details: 'طلب شهادة راتب', status: 'Approved' },
    { id: 7, employeeId: 'emp-102', type: 'DataUpdate', submissionDate: '2025-05-18', details: 'تحديث عنوان السكن', status: 'Approved' },
];

// FIX: Replaced map functions with direct spreading to avoid creating objects with incorrect shapes.
export const MOCK_ALL_REQUESTS: HRRequest[] = [
    ...MOCK_LEAVE_REQUESTS_INITIAL,
    ...MOCK_ADJUSTMENT_REQUESTS_INITIAL,
    ...MOCK_LEAVE_PERMIT_REQUESTS_INITIAL,
    ...nonLeaveRequests,
].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());


export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { employeeId: 'emp-003', date: '2025-08-03', day: 'الأحد', status: 'Present', firstCheckIn: '09:15', lastCheckOut: '18:15', workedHours: 9, overtime: 1 },
  { employeeId: 'emp-003', date: '2025-08-04', day: 'الإثنين', status: 'Present', firstCheckIn: '09:25', lastCheckOut: '17:00', workedHours: 7.6, overtime: 0 },
  { employeeId: 'emp-003', date: '2025-08-05', day: 'الثلاثاء', status: 'Present', firstCheckIn: '09:05', lastCheckOut: '17:00', workedHours: 7.9, overtime: 0 },
  { employeeId: 'emp-003', date: '2025-08-06', day: 'الأربعاء', status: 'Present', firstCheckIn: '09:40', lastCheckOut: '17:00', workedHours: 7.3, overtime: 0 },
  { employeeId: 'emp-003', date: '2025-08-07', day: 'الخميس', status: 'Absent' },
  { employeeId: 'emp-001', date: '2025-08-28', day: 'الخميس', status: 'Present', firstCheckIn: '08:45' },
  { employeeId: 'emp-002', date: '2025-08-28', day: 'الخميس', status: 'Leave' },
  { employeeId: 'emp-004', date: '2025-08-28', day: 'الخميس', status: 'Absent' },
];

export const MOCK_GOALS: Goal[] = [
    { id: 'g1', employeeId: 'emp-003', title: 'تحسين أداء الواجهة الأمامية', description: 'زيادة سرعة تحميل الصفحات الرئيسية بنسبة 15%', type: 'Objective', parentId: null, status: 'On Track', progress: 60, dueDate: '2025-09-30' },
    { id: 'g2', employeeId: 'emp-003', title: 'تقليل حجم ملفات CSS', description: '', type: 'Key Result', parentId: 'g1', status: 'Completed', progress: 100, dueDate: '2025-09-30' },
    { id: 'g3', employeeId: 'emp-003', title: 'تطبيق التحميل الكسول للصور', description: '', type: 'Key Result', parentId: 'g1', status: 'On Track', progress: 40, dueDate: '2025-09-30' },
    { id: 'g4', employeeId: 'emp-004', title: 'إطلاق ميزة التقارير الجديدة', description: 'تسليم ميزة تقارير المديرين بحلول نهاية الربع', type: 'Objective', parentId: null, status: 'At Risk', progress: 30, dueDate: '2025-09-30' },
];

export const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [
    { id: 'r1', employeeId: 'emp-003', reviewerId: 'emp-002', cycle: 'منتصف العام 2025', status: 'Completed', overallRating: 4, strengths: 'مبادرة وتتعلم بسرعة. مهارات ممتازة في React.', areasForImprovement: 'تحتاج إلى تحسين إدارة الوقت في المهام الكبيرة.', finalComments: 'أداء جيد جداً ونتوقع المزيد من التطور.', reviewDate: '2025-07-15' },
    { id: 'r2', employeeId: 'emp-004', reviewerId: 'emp-002', cycle: 'منتصف العام 2025', status: 'Completed', overallRating: 3, strengths: 'مهارات جيدة في حل المشكلات', areasForImprovement: 'يحتاج إلى تحسين التواصل مع الفريق.', finalComments: 'أداء مقبول بشكل عام.', reviewDate: '2025-07-16' },
];

export const MOCK_EMPLOYEE_DOCUMENTS: EmployeeDocument[] = [
    { id: 'doc-1', employeeId: 'emp-003', name: 'عقد عمل 2022', type: 'عقد عمل', uploadDate: '2022-11-01', expirationDate: '2023-10-31' },
    { id: 'doc-2', employeeId: 'emp-003', name: 'عقد عمل 2023 - الملحق', type: 'عقد عمل', uploadDate: '2023-11-01', expirationDate: '2024-10-31' },
    { id: 'doc-3', employeeId: 'emp-003', name: 'شهادة الميلاد', type: 'مسوغات تعيين', uploadDate: '2022-11-01', expirationDate: null },
    { id: 'doc-4', employeeId: 'emp-003', name: 'نموذج 1 تأمينات', type: 'مسوغات تعيين', uploadDate: '2022-11-01', expirationDate: null },
    { id: 'doc-5', employeeId: 'emp-004', name: 'عقد عمل 2023', type: 'عقد عمل', uploadDate: '2023-06-20', expirationDate: '2024-06-19' },
];


export const MOCK_ATTENDANCE_POLICY: AttendancePolicy[] = [
    { id: 'policy-standard-2025', name: 'سياسة الحضور القياسية للشركة', scope: 'company', status: 'Active', gracePeriodInMinutes: 15, latenessTiers: [ { id: 'tier1', fromMinutes: 16, toMinutes: 30, penaltyHours: 0.5 }, { id: 'tier2', fromMinutes: 31, toMinutes: 60, penaltyHours: 1 }, { id: 'tier3', fromMinutes: 61, toMinutes: 120, penaltyHours: 2 }, ], absenceRules: [ { id: 'abs1', type: 'Absence', threshold: 1, period: 'Month', penaltyType: 'DeductLeave', penaltyValue: 2 } ], earlyLeaveTiers: [ { id: 'el-tier1', fromMinutes: 16, toMinutes: 30, penaltyHours: 0.5 }, { id: 'el-tier2', fromMinutes: 31, toMinutes: 60, penaltyHours: 1 }, ], maxPermitsPerMonth: 4, minPermitDurationMinutes: 60, maxPermitDurationHours: 3, breakDurationHours: 1, workLocationIds: ['loc-cai-hq', 'loc-alex-branch'] },
    { id: 'policy-flexible-cairo', name: 'سياسة الحضور المرنة (فرع القاهرة)', scope: 'branch', branchId: 'branch-cai', status: 'Active', gracePeriodInMinutes: 30, latenessTiers: [ { id: 'tier1-flex', fromMinutes: 31, toMinutes: 60, penaltyHours: 0.5 }, ], absenceRules: [], earlyLeaveTiers: [], maxPermitsPerMonth: 2, minPermitDurationMinutes: 120, maxPermitDurationHours: 4, breakDurationHours: 1, workLocationIds: ['loc-cai-hq'] },
    { id: 'policy-sales-ot-pending', name: 'سياسة الحضور للمبيعات (مقترح)', scope: 'company', status: 'PendingApproval', gracePeriodInMinutes: 10, latenessTiers: [{ id: 'tier1-sales', fromMinutes: 11, toMinutes: 30, penaltyHours: 0.5 }], absenceRules: [], earlyLeaveTiers: [], maxPermitsPerMonth: 5, minPermitDurationMinutes: 30, maxPermitDurationHours: 2, breakDurationHours: 1, workLocationIds: [] }
];

export const MOCK_OVERTIME_POLICY: OvertimePolicy[] = [
    { id: 'ot-policy-standard', name: 'سياسة الوقت الإضافي القياسية', scope: 'company', status: 'Active', allowOvertime: true, minOvertimeInMinutes: 30, overtimeRateNormal: 1.35, overtimeRateHoliday: 2.0 },
    { id: 'ot-policy-high-rate', name: 'سياسة الوقت الإضافي للمبيعات', scope: 'company', status: 'Active', allowOvertime: true, minOvertimeInMinutes: 15, overtimeRateNormal: 1.75, overtimeRateHoliday: 2.5 },
    { id: 'ot-policy-restricted', name: 'سياسة إضافي مقيدة (القاهرة)', scope: 'branch', branchId: 'branch-cai', status: 'Active', allowOvertime: false, minOvertimeInMinutes: 60, overtimeRateNormal: 1.5, overtimeRateHoliday: 2.0 },
];

export const MOCK_LEAVE_POLICY: LeavePolicy[] = [
    { id: 'leave-policy-standard', name: 'سياسة الإجازات القياسية للشركة', scope: 'company', status: 'Active', annualLeaveBalance: 21, sickLeaveBalance: 15, casualLeaveBalance: 7 },
    { id: 'leave-policy-management', name: 'سياسة الإجازات للإدارة (خاص بالقاهرة)', scope: 'branch', branchId: 'branch-cai', status: 'Active', annualLeaveBalance: 30, sickLeaveBalance: 20, casualLeaveBalance: 7 }
];

export const MOCK_EMPLOYEE_INFRACTIONS: EmployeeInfraction[] = [
    { id: 'inf-1', employeeId: 'emp-003', policyId: 'policy-standard-2025', ruleType: 'Lateness', date: '2025-08-04', details: 'تأخير 25 دقيقة', penaltyApplied: true, penaltyDetails: 'خصم 0.5 ساعة' },
    { id: 'inf-2', employeeId: 'emp-003', policyId: 'policy-standard-2025', ruleType: 'Lateness', date: '2025-08-06', details: 'تأخير 40 دقيقة', penaltyApplied: true, penaltyDetails: 'خصم 1 ساعة' },
    { id: 'inf-3', employeeId: 'emp-003', policyId: 'policy-standard-2025', ruleType: 'Absence', date: '2025-08-07', details: 'غياب غير مبرر', penaltyApplied: true, penaltyDetails: 'خصم 2 يوم من رصيد الإجازات' },
];

export const MOCK_MONTHLY_CHECK_INS: MonthlyCheckIn[] = [
    { id: 'mci-1', employeeId: 'emp-003', reviewerId: 'emp-002', month: 6, year: 2025, rating: 'Exceeds Expectations', notes: 'أداء ممتاز هذا الشهر، خاصة في مشروع الواجهة الأمامية الجديد.', date: '2025-07-31T10:00:00Z' },
    { id: 'mci-2', employeeId: 'emp-003', reviewerId: 'emp-002', month: 5, year: 2025, rating: 'Meets Expectations', notes: 'أداء جيد ومستقر، تم تسليم المهام في الوقت المحدد.', date: '2025-06-30T10:00:00Z' },
    { id: 'mci-3', employeeId: 'emp-004', reviewerId: 'emp-002', month: 6, year: 2025, rating: 'Needs Improvement', notes: 'كان هناك بعض التأخير في تسليم تقرير الأداء. نحتاج إلى التركيز على إدارة الوقت.', date: '2025-07-30T10:00:00Z' },
    { id: 'mci-4', employeeId: 'emp-002', reviewerId: 'emp-001', month: 6, year: 2025, rating: 'Meets Expectations', notes: 'أداء جيد ومستقر، تم تسليم المهام في الوقت المحدد.', date: '2025-06-30T10:00:00Z' },

];

// =================================================================================
// ===== LEARNING & DEVELOPMENT MOCK DATA =====
// =================================================================================

export const MOCK_COURSES: Course[] = [
    { 
        id: 'c-01', 
        type: 'Internal',
        title: 'أساسيات React المتقدمة', 
        category: 'Technical', 
        durationHours: 12, 
        isMandatory: true, 
        description: 'دورة لتعميق الفهم في Hooks, Context API, and Performance Optimization.', 
        learningObjectives: [ 'إتقان استخدام React Hooks', 'بناء تطبيقات قابلة للتطوير', 'تحسين أداء التطبيقات' ],
        modules: [
            {id: 'm1', title: 'مقدمة في React Hooks', topics: ['useState', 'useEffect']},
            {id: 'm2', title: 'إدارة الحالة المتقدمة', topics: ['useContext', 'useReducer']},
            {id: 'm3', title: 'تحسين الأداء', topics: ['memo', 'useCallback', 'useMemo']},
        ]
    },
    { 
        id: 'c-02', 
        type: 'Internal',
        title: 'إدارة المشاريع Agile', 
        category: 'Soft Skills', 
        durationHours: 8, 
        isMandatory: false,
        description: 'تعلم مبادئ Agile و Scrum لتسليم المشاريع بكفاءة.',
        learningObjectives: ['فهم دورة حياة Agile', 'تطبيق تقنيات Scrum', 'تحسين التعاون في الفريق'],
        modules: [
            {id: 'm1', title: 'مقدمة Agile', topics: ['Manifesto', 'Principles']},
            {id: 'm2', title: 'إطار عمل Scrum', topics: ['Roles', 'Events', 'Artifacts']},
        ]
    },
    { 
        id: 'c-03', 
        type: 'Internal',
        title: 'مهارات القيادة للمديرين الجدد', 
        category: 'Leadership', 
        durationHours: 16, 
        isMandatory: false,
        description: 'تطوير المهارات القيادية الأساسية اللازمة للنجاح في دور إداري.',
        learningObjectives: ['تقديم الملاحظات البناءة', 'تحفيز أعضاء الفريق', 'إدارة النزاعات'],
        modules: [
            {id: 'm1', title: 'أساسيات القيادة', topics: ['Styles', 'Qualities']},
            {id: 'm2', title: 'بناء الفريق', topics: ['Motivation', 'Delegation']},
        ]
    },
    {
        id: 'c-ext-01',
        type: 'External',
        title: 'Python for Everybody',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/python',
        category: 'Technical',
        durationHours: 40,
        description: 'Learn to Program and Analyze Data with Python. Develop programs to gather, clean, analyze, and visualize data.',
        isMandatory: false,
        venue: 'Online',
        locationDetails: 'Coursera Platform',
    }
];

export const MOCK_EMPLOYEE_COURSES: EmployeeCourse[] = [
    { employeeId: 'emp-003', courseId: 'c-01', status: 'In Progress', progress: 45, managerApprovalStatus: 'Approved' },
    { employeeId: 'emp-004', courseId: 'c-01', status: 'Not Started', progress: 0, managerApprovalStatus: 'Approved' },
    { employeeId: 'emp-002', courseId: 'c-03', status: 'Completed', progress: 100, managerApprovalStatus: 'Approved' },
    { 
        employeeId: 'emp-003', 
        courseId: 'c-ext-01', 
        status: 'In Progress', 
        progress: 25, 
        managerApprovalStatus: 'Pending', 
        submittedNotes: "بدأت في هذه الدورة وأرغب في الحصول على موافقة المدير للمتابعة." 
    },
];

// =================================================================================
// ===== COMPENSATION & BENEFITS MOCK DATA =====
// =================================================================================

export const MOCK_SALARY_COMPONENTS: SalaryComponent[] = [
    { id: 'comp-01', name: 'بدل مواصلات', type: 'Allowance', calculationType: 'FixedAmount', value: 500 },
    { id: 'comp-02', name: 'بدل سكن', type: 'Allowance', calculationType: 'FixedAmount', value: 1500 },
    { id: 'comp-03', name: 'تأمينات اجتماعية', type: 'Deduction', calculationType: 'PercentageOfBase', value: 11 },
    { id: 'comp-04', name: 'ضريبة كسب عمل', type: 'Deduction', calculationType: 'PercentageOfBase', value: 10 },
    { id: 'comp-05', name: 'تأمين صحي تكميلي', type: 'Deduction', calculationType: 'FixedAmount', value: 350 },
];

export const MOCK_COMPENSATION_PACKAGES: CompensationPackage[] = [
    {
        id: 'pkg-tech-l1',
        name: 'حزمة المطورين - المستوى 1',
        components: [
            { componentId: 'comp-01', value: 750 },
            { componentId: 'comp-03', value: 11 },
            { componentId: 'comp-04', value: 10 },
            { componentId: 'comp-05', value: 350 },
        ]
    },
     {
        id: 'pkg-tech-l2',
        name: 'حزمة المطورين - المستوى 2',
        components: [
            { componentId: 'comp-01', value: 1000 },
            { componentId: 'comp-03', value: 11 },
            { componentId: 'comp-04', value: 15 },
            { componentId: 'comp-05', value: 450 },
        ]
    },
    {
        id: 'pkg-manager',
        name: 'حزمة المديرين',
        components: [
            { componentId: 'comp-01', value: 1000 },
            { componentId: 'comp-02', value: 2500 },
            { componentId: 'comp-03', value: 14 },
            { componentId: 'comp-04', value: 20 },
            { componentId: 'comp-05', value: 500 },
        ]
    }
];

// =================================================================================
// ===== RECRUITMENT (ATS) MOCK DATA =====
// =================================================================================
export const MOCK_JOB_OPENINGS: JobOpening[] = [
    {
        id: 'job-01',
        title: 'مهندس برمجيات أول (Frontend)',
        department: 'تكنولوجيا المعلومات',
        status: 'Open',
        datePosted: '2025-08-15',
        description: 'نبحث عن مهندس برمجيات أول متخصص في الواجهات الأمامية للانضمام إلى فريقنا الديناميكي.',
        requirements: ['+5 سنوات خبرة في React', 'خبرة ممتازة في TypeScript', 'فهم عميق لـ CSS-in-JS'],
    },
    {
        id: 'job-02',
        title: 'مسؤول مبيعات',
        department: 'المبيعات',
        status: 'Open',
        datePosted: '2025-08-10',
        description: 'مطلوب مسؤول مبيعات لديه شغف بتحقيق الأهداف لفرعنا في الإسكندرية.',
        requirements: ['+2 سنوات خبرة في المبيعات', 'مهارات تواصل ممتازة', 'القدرة على العمل تحت ضغط'],
    },
    {
        id: 'job-03',
        title: 'مصمم واجهة مستخدم (UI/UX)',
        department: 'تكنولوجيا المعلومات',
        status: 'Closed',
        datePosted: '2025-07-20',
        description: 'تم إغلاق هذه الوظيفة.',
        requirements: [],
    }
];

export const MOCK_CANDIDATES: Candidate[] = [
    // Candidates for job-01
    { id: 'cand-01', jobOpeningId: 'job-01', name: 'أحمد علي', email: 'ahmed.ali@example.com', phone: '01011112222', stage: 'Interview', applicationDate: '2025-08-16', avatarUrl: 'https://i.pravatar.cc/100?u=cand1' },
    { id: 'cand-02', jobOpeningId: 'job-01', name: 'سارة محمد', email: 'sara.mo@example.com', phone: '01122223333', stage: 'Applied', applicationDate: '2025-08-18', avatarUrl: 'https://i.pravatar.cc/100?u=cand2' },
    { id: 'cand-03', jobOpeningId: 'job-01', name: 'محمد حسن', email: 'm.hassan@example.com', phone: '01233334444', stage: 'Screening', applicationDate: '2025-08-17', avatarUrl: 'https://i.pravatar.cc/100?u=cand3' },
    { id: 'cand-04', jobOpeningId: 'job-01', name: 'فاطمة إبراهيم', email: 'fatima.i@example.com', phone: '01544445555', stage: 'Offer', applicationDate: '2025-08-16', avatarUrl: 'https://i.pravatar.cc/100?u=cand4' },
    { id: 'cand-05', jobOpeningId: 'job-01', name: 'خالد عمر', email: 'khaled.omar@example.com', phone: '01055556666', stage: 'Rejected', applicationDate: '2025-08-17', avatarUrl: 'https://i.pravatar.cc/100?u=cand5' },

    // Candidates for job-02
    { id: 'cand-06', jobOpeningId: 'job-02', name: 'نور ياسر', email: 'nour.yasser@example.com', phone: '01166667777', stage: 'Applied', applicationDate: '2025-08-11', avatarUrl: 'https://i.pravatar.cc/100?u=cand6' },
    { id: 'cand-07', jobOpeningId: 'job-02', name: 'علي مصطفى', email: 'ali.m@example.com', phone: '01277778888', stage: 'Hired', applicationDate: '2025-08-12', avatarUrl: 'https://i.pravatar.cc/100?u=cand7' },
    { id: 'cand-08', jobOpeningId: 'job-02', name: 'هنا شريف', email: 'hana.s@example.com', phone: '01588889999', stage: 'Screening', applicationDate: '2025-08-13', avatarUrl: 'https://i.pravatar.cc/100?u=cand8' },
];


// =================================================================================
// ===== ONBOARDING & OFFBOARDING MOCK DATA =====
// =================================================================================

export const ONBOARDING_TASK_CATEGORIES: OnboardingTaskCategory[] = ['الأوراق والمستندات', 'إعدادات تقنية', 'التعريف بالفريق', 'سياسات الشركة'];
export const ONBOARDING_RESPONSIBLE_PARTIES: OnboardingResponsible[] = ['الموظف الجديد', 'المدير المباشر', 'الموارد البشرية', 'تقنية المعلومات'];

export const OFFBOARDING_TASK_CATEGORIES: OffboardingTaskCategory[] = ['تسليم العهدة', 'نقل المعرفة', 'إجراءات الموارد البشرية', 'التسوية المالية النهائية'];
export const OFFBOARDING_RESPONSIBLE_PARTIES: OffboardingResponsible[] = ['الموظف المغادر', 'المدير المباشر', 'الموارد البشرية', 'تقنية المعلومات'];


export const MOCK_ONBOARDING_TEMPLATES: OnboardingTemplate[] = [
    {
        id: 'template-general',
        name: 'خطة تعيين عامة',
        description: 'قالب أساسي لجميع الموظفين الجدد.',
        tasks: [
            { title: 'توقيع عقد العمل', category: 'الأوراق والمستندات', responsible: 'الموظف الجديد', dueOffsetDays: 0 },
            { title: 'تقديم مسوغات التعيين', category: 'الأوراق والمستندات', responsible: 'الموظف الجديد', dueOffsetDays: 1 },
            { title: 'إنشاء بريد إلكتروني للشركة', category: 'إعدادات تقنية', responsible: 'تقنية المعلومات', dueOffsetDays: 0 },
            { title: 'التعريف بأعضاء الفريق', category: 'التعريف بالفريق', responsible: 'المدير المباشر', dueOffsetDays: 0 },
            { title: 'شرح سياسة الحضور والإجازات', category: 'سياسات الشركة', responsible: 'الموارد البشرية', dueOffsetDays: 1 },
            { title: 'جولة في مكان العمل', category: 'التعريف بالفريق', responsible: 'الموارد البشرية', dueOffsetDays: 0 },
        ]
    },
    {
        id: 'template-dev',
        name: 'خطة تعيين للمطورين',
        description: 'قالب مخصص للمطورين الجدد.',
        tasks: [
            { title: 'توقيع عقد العمل واتفاقية السرية', category: 'الأوراق والمستندات', responsible: 'الموظف الجديد', dueOffsetDays: 0 },
            { title: 'تقديم مسوغات التعيين', category: 'الأوراق والمستندات', responsible: 'الموظف الجديد', dueOffsetDays: 1 },
            { title: 'إعداد جهاز اللابتوب وتثبيت البرامج', category: 'إعدادات تقنية', responsible: 'تقنية المعلومات', dueOffsetDays: 0 },
            { title: 'منح صلاحيات الوصول إلى Github/Gitlab', category: 'إعدادات تقنية', responsible: 'المدير المباشر', dueOffsetDays: 1 },
            { title: 'جلسة تعريفية ببنية المشروع', category: 'التعريف بالفريق', responsible: 'المدير المباشر', dueOffsetDays: 2 },
            { title: 'حضور اجتماع الفريق الأسبوعي', category: 'التعريف بالفريق', responsible: 'الموظف الجديد', dueOffsetDays: 5 },
            { title: 'مراجعة دليل سياسات الشركة', category: 'سياسات الشركة', responsible: 'الموظف الجديد', dueOffsetDays: 3 },
        ]
    }
];

export const MOCK_ONBOARDING_PROCESSES: OnboardingProcess[] = [
    {
        id: 'onboard-1',
        employeeId: 'emp-005', // Sara Kamal
        templateId: 'template-dev',
        startDate: '2025-09-01',
        tasks: [
            { id: 't1-1', title: 'توقيع عقد العمل واتفاقية السرية', category: 'الأوراق والمستندات', responsible: 'الموظف الجديد', dueOffsetDays: 0, isCompleted: true, dueDate: '2025-09-01' },
            { id: 't1-2', title: 'تقديم مسوغات التعيين', category: 'الأوراق والمستندات', responsible: 'الموظف الجديد', dueOffsetDays: 1, isCompleted: true, dueDate: '2025-09-02' },
            { id: 't1-3', title: 'إعداد جهاز اللابتوب وتثبيت البرامج', category: 'إعدادات تقنية', responsible: 'تقنية المعلومات', dueOffsetDays: 0, isCompleted: true, dueDate: '2025-09-01' },
            { id: 't1-4', title: 'منح صلاحيات الوصول إلى Github/Gitlab', category: 'إعدادات تقنية', responsible: 'المدير المباشر', dueOffsetDays: 1, isCompleted: false, dueDate: '2025-09-02' },
            { id: 't1-5', title: 'جلسة تعريفية ببنية المشروع', category: 'التعريف بالفريق', responsible: 'المدير المباشر', dueOffsetDays: 2, isCompleted: false, dueDate: '2025-09-03' },
            { id: 't1-6', title: 'حضور اجتماع الفريق الأسبوعي', category: 'التعريف بالفريق', responsible: 'الموظف الجديد', dueOffsetDays: 5, isCompleted: false, dueDate: '2025-09-06' },
            { id: 't1-7', title: 'مراجعة دليل سياسات الشركة', category: 'سياسات الشركة', responsible: 'الموظف الجديد', dueOffsetDays: 3, isCompleted: false, dueDate: '2025-09-04' },
        ]
    },
    {
        id: 'onboard-2',
        employeeId: 'emp-003', // Hoda Zaki - For demo purposes
        templateId: 'template-general',
        startDate: '2022-11-01',
        tasks: [
            { id: 't2-1', title: 'توقيع عقد العمل', category: 'الأوراق والمستندات', responsible: 'الموظف الجديد', dueOffsetDays: 0, isCompleted: true, dueDate: '2022-11-01' },
            { id: 't2-2', title: 'تقديم مسوغات التعيين', category: 'الأوراق والمستندات', responsible: 'الموظف الجديد', dueOffsetDays: 1, isCompleted: true, dueDate: '2022-11-02' },
            { id: 't2-3', title: 'إنشاء بريد إلكتروني للشركة', category: 'إعدادات تقنية', responsible: 'تقنية المعلومات', dueOffsetDays: 0, isCompleted: true, dueDate: '2022-11-01' },
            { id: 't2-4', title: 'التعريف بأعضاء الفريق', category: 'التعريف بالفريق', responsible: 'المدير المباشر', dueOffsetDays: 0, isCompleted: false, dueDate: '2022-11-01' },
            { id: 't2-5', title: 'شرح سياسة الحضور والإجازات', category: 'سياسات الشركة', responsible: 'الموارد البشرية', dueOffsetDays: 1, isCompleted: false, dueDate: '2022-11-02' },
        ]
    }
];

export const MOCK_OFFBOARDING_TEMPLATES: OffboardingTemplate[] = [
    {
        id: 'template-off-general',
        name: 'خطة إنهاء خدمة عامة',
        description: 'قالب أساسي لجميع الموظفين المغادرين.',
        tasks: [
            { title: 'تسليم اللابتوب والهاتف وجميع العهد', category: 'تسليم العهدة', responsible: 'الموظف المغادر', dueOffsetDays: 0 },
            { title: 'إلغاء الوصول إلى الأنظمة والبريد الإلكتروني', category: 'تسليم العهدة', responsible: 'تقنية المعلومات', dueOffsetDays: 0 },
            { title: 'جلسة نقل المعرفة مع الفريق/البديل', category: 'نقل المعرفة', responsible: 'المدير المباشر', dueOffsetDays: 2 },
            { title: 'إجراء المقابلة الختامية (Exit Interview)', category: 'إجراءات الموارد البشرية', responsible: 'الموارد البشرية', dueOffsetDays: 1 },
            { title: 'تسوية المستحقات المالية النهائية', category: 'التسوية المالية النهائية', responsible: 'الموارد البشرية', dueOffsetDays: 0 },
        ]
    }
];

export const MOCK_OFFBOARDING_PROCESSES: OffboardingProcess[] = [
    {
        id: 'offboard-1',
        employeeId: 'emp-004', // Tarek Hassan
        templateId: 'template-off-general',
        lastDay: '2025-09-30',
        tasks: [
            { id: 't-off-1-1', title: 'تسليم اللابتوب والهاتف وجميع العهد', category: 'تسليم العهدة', responsible: 'الموظف المغادر', dueOffsetDays: 0, isCompleted: false, dueDate: '2025-09-30' },
            { id: 't-off-1-2', title: 'إلغاء الوصول إلى الأنظمة والبريد الإلكتروني', category: 'تسليم العهدة', responsible: 'تقنية المعلومات', dueOffsetDays: 0, isCompleted: false, dueDate: '2025-09-30' },
            { id: 't-off-1-3', title: 'جلسة نقل المعرفة مع الفريق/البديل', category: 'نقل المعرفة', responsible: 'المدير المباشر', dueOffsetDays: 2, isCompleted: true, dueDate: '2025-09-28' },
            { id: 't-off-1-4', title: 'إجراء المقابلة الختامية (Exit Interview)', category: 'إجراءات الموارد البشرية', responsible: 'الموارد البشرية', dueOffsetDays: 1, isCompleted: false, dueDate: '2025-09-29' },
            { id: 't-off-1-5', title: 'تسوية المستحقات المالية النهائية', category: 'التسوية المالية النهائية', responsible: 'الموارد البشرية', dueOffsetDays: 0, isCompleted: false, dueDate: '2025-09-30' },
        ]
    }
];


// =================================================================================
// ===== NOTIFICATIONS MOCK DATA =====
// =================================================================================

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        recipientId: 'emp-002', // Karim Adel (Manager)
        senderId: 'emp-003', // Hoda Zaki
        type: 'approval_request',
        message: 'قدمت هدى زكي طلبًا للموافقة على دورة "Python for Everybody".',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        relatedEntity: { type: 'course', id: 'c-ext-01' }
    },
    {
        id: 'notif-2',
        recipientId: 'emp-003', // Hoda Zaki
        senderId: 'emp-002', // Karim Adel (Manager)
        type: 'status_update',
        message: 'تمت الموافقة على دورتك "أساسيات React المتقدمة".',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        relatedEntity: { type: 'course', id: 'c-01' }
    },
    {
        id: 'notif-3',
        recipientId: 'emp-003',
        senderId: 'emp-002',
        type: 'status_update',
        message: 'أضاف مديرك "كريم عادل" متابعة شهرية جديدة لك.',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
];

// =================================================================================
// ===== SUPPORT TICKETS MOCK DATA =====
// =================================================================================

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
    {
        id: 'tkt-1',
        employeeId: 'emp-003',
        title: 'خطأ في حساب رصيد الإجازات السنوية',
        description: 'مرحباً، لاحظت أن رصيدي من الإجازات السنوية يبدو غير صحيح بعد آخر إجازة أخذتها. هل يمكنكم المراجعة؟',
        category: 'Leave Balance',
        priority: 'Medium',
        status: 'In Progress',
        assignedToId: 'emp-001',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        messages: [
            { id: 'msg-1', authorId: 'emp-003', content: 'مرحباً، لاحظت أن رصيدي من الإجازات السنوية يبدو غير صحيح بعد آخر إجازة أخذتها. هل يمكنكم المراجعة؟', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
            { id: 'msg-2', authorId: 'emp-001', content: 'أهلاً بك، جارِ مراجعة سجل إجازاتك وسنعود إليك في أقرب وقت.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
        ]
    },
    {
        id: 'tkt-2',
        employeeId: 'emp-004',
        title: 'استفسار عن خصم التأمينات',
        description: 'أريد أن أفهم كيف يتم حساب خصم التأمينات الاجتماعية في كشف الراتب.',
        category: 'Payroll',
        priority: 'Low',
        status: 'Resolved',
        assignedToId: 'emp-001',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        messages: [
             { id: 'msg-3', authorId: 'emp-004', content: 'أريد أن أفهم كيف يتم حساب خصم التأمينات الاجتماعية في كشف الراتب.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
             { id: 'msg-4', authorId: 'emp-001', content: 'مرحباً، يتم حساب التأمينات كنسبة من الراتب الأساسي وفقاً للقانون. لقد أرسلت لك تفصيلاً على بريدك الإلكتروني. هل لديك أي استفسارات أخرى؟', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
             { id: 'msg-5', authorId: 'emp-004', content: 'شكراً جزيلاً، كل شيء واضح الآن.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
        ]
    },
    {
        id: 'tkt-3',
        employeeId: 'emp-103',
        title: 'مشكلة في تسجيل الحضور من التطبيق',
        description: 'عندما أحاول تسجيل الحضور، تظهر لي رسالة خطأ "فشل تحديد الموقع" مع أني أعطيت الصلاحيات اللازمة.',
        category: 'Technical Support',
        priority: 'High',
        status: 'New',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        messages: [
            { id: 'msg-6', authorId: 'emp-103', content: 'عندما أحاول تسجيل الحضور، تظهر لي رسالة خطأ "فشل تحديد الموقع" مع أني أعطيت الصلاحيات اللازمة.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
        ]
    }
];

// =================================================================================
// ===== ASSETS MOCK DATA =====
// =================================================================================

export const MOCK_ASSETS: Asset[] = [
    { id: 'asset-1', name: 'MacBook Pro 16"', category: 'Hardware', serialNumber: 'C02Z1234ABCD', purchaseDate: '2023-01-15', purchaseValue: 75000, status: 'Assigned', assignedToId: 'emp-002', depreciationMethod: 'Declining Balance', usefulLifeYears: 5 },
    { id: 'asset-2', name: 'Dell Latitude 7420', category: 'Hardware', serialNumber: 'DL123456789', purchaseDate: '2022-11-01', purchaseValue: 35000, status: 'Assigned', assignedToId: 'emp-003', depreciationMethod: 'Straight-line', usefulLifeYears: 4 },
    { id: 'asset-3', name: 'iPhone 14 Pro', category: 'Hardware', serialNumber: 'IP14P987654', purchaseDate: '2023-01-05', purchaseValue: 40000, status: 'Assigned', assignedToId: 'emp-102', depreciationMethod: 'Declining Balance', usefulLifeYears: 3 },
    { id: 'asset-4', name: 'Lenovo ThinkPad T14', category: 'Hardware', serialNumber: 'LVTP123456', purchaseDate: '2023-06-20', purchaseValue: 32000, status: 'Available', assignedToId: null, depreciationMethod: 'Straight-line', usefulLifeYears: 4 },
    { id: 'asset-5', name: 'Adobe Creative Cloud', category: 'Software', serialNumber: 'AD-CC-LICENSE-1', purchaseDate: '2024-01-01', purchaseValue: 15000, status: 'Assigned', assignedToId: 'emp-001', depreciationMethod: 'Straight-line', usefulLifeYears: 1 },
    { id: 'asset-6', name: 'Herman Miller Aeron', category: 'Furniture', serialNumber: 'HM-Aeron-001', purchaseDate: '2021-01-01', purchaseValue: 25000, status: 'Assigned', assignedToId: 'emp-gm', depreciationMethod: 'Straight-line', usefulLifeYears: 10 },
];


// =================================================================================
// ===== NAVIGATION & STATIC CONTENT =====
// =================================================================================

export const NAV_GROUPS: NavGroup[] = [
  {
    groupName: 'الخطة الشخصية',
    items: [
      { name: 'خطتي للتعيين', icon: CheckBadgeIcon, path: '/my-onboarding', requiresEmployee: true, pageTitle: 'خطة التعيين', module: 'onboarding' },
      { name: 'خطتي لإنهاء الخدمة', icon: ArchiveBoxIcon, path: '/my-offboarding', requiresEmployee: true, pageTitle: 'خطة إنهاء الخدمة', module: 'offboarding' },
      { name: 'ملفي الشخصي', icon: UserCircleIcon, path: '/profile', requiresEmployee: true, pageTitle: 'ملفي الشخصي' },
      { name: 'طلباتي', icon: DocumentTextIcon, path: '/my-requests', requiresEmployee: true, pageTitle: 'طلباتي' },
      { name: 'الأداء', icon: ChartPieIcon, path: '/performance', requiresEmployee: true, pageTitle: 'الأداء', module: 'performance' },
      { name: 'التطوير والتدريب', icon: BookOpenIcon, path: '/learning', requiresEmployee: true, pageTitle: 'التطوير والتدريب', module: 'learning' },
      { name: 'أوراقي', icon: DocumentDuplicateIcon, path: '/documents', requiresEmployee: true, pageTitle: 'أوراقي ومستنداتي', module: 'documents' },
      { name: 'عهدتي', icon: ComputerDesktopIcon, path: '/my-assets', requiresEmployee: true, pageTitle: 'عهدتي', module: 'assets' },
      { name: 'تذاكر الدعم', icon: QuestionMarkCircleIcon, path: '/support', pageTitle: 'تذاكر الدعم', module: 'support' },
    ]
  },
  {
    groupName: 'الخدمة الذاتية',
    items: [
      { name: 'لوحة التحكم الشخصية', icon: HomeIcon, path: '/', requiresEmployee: true, pageTitle: 'لوحة التحكم' },
      { name: 'مهامي الخارجية', icon: ClipboardDocumentListIcon, path: '/my-tasks', requiresEmployee: true, pageTitle: 'مهامي الخارجية' },
      { name: 'كشف الراتب', icon: BanknotesIcon, path: '/payslip', requiresEmployee: true, pageTitle: 'كشف الراتب' },
      { name: 'حضوري وانصرافي', icon: CalendarIcon, path: '/my-attendance', requiresEmployee: true, pageTitle: 'حضوري وانصرافي' },
      { name: 'الإجازات', icon: BriefcaseIcon, path: '/leave', requiresEmployee: true, pageTitle: 'الإجازات' },
    ]
  },
  {
    groupName: 'أدوات المدير',
    items: [
      { name: 'لوحة تحكم الفريق', icon: UserGroupIcon, path: '/team-dashboard', roles: ['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'], pageTitle: 'لوحة تحكم الفريق' },
      { name: 'سجل الحضور', icon: CalendarIcon, path: '/attendance', roles: ['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'], pageTitle: 'سجل الحضور' },
      { name: 'إدارة المهام الخارجية', icon: ClipboardDocumentCheckIcon, path: '/external-tasks', roles: ['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'], pageTitle: 'إدارة المهام الخارجية' },
      { name: 'التقارير', icon: PresentationChartLineIcon, path: '/reports', roles: ['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'], pageTitle: 'التقارير' },
      { name: 'إدارة الأداء', icon: PresentationChartLineIcon, path: '/manager-performance', roles: ['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'], pageTitle: 'إدارة الأداء', module: 'performance' },
      { name: 'تحليل مخاطر التسرب', icon: ExclamationTriangleIcon, path: '/turnover-analysis', roles: ['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'], pageTitle: 'تحليل مخاطر التسرب', module: 'performance' },
      { name: 'تحليلات الفريق', icon: ChartPieIcon, path: '/team-analytics', roles: ['General Manager', 'HR Manager', 'Team Lead', 'Branch Admin'], pageTitle: 'تحليلات الفريق' },
    ]
  },
  {
    groupName: 'إدارة المواهب',
    items: [
      { name: 'التوظيف', icon: ClipboardDocumentListIcon, path: '/recruitment', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'إدارة التوظيف', module: 'recruitment' },
      { name: 'التعيينات الجديدة', icon: CheckBadgeIcon, path: '/onboarding', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'إدارة التعيينات الجديدة', module: 'onboarding' },
      { name: 'إنهاء الخدمة', icon: ArchiveBoxIcon, path: '/offboarding', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'إدارة إنهاء الخدمة', module: 'offboarding' },
    ]
  },
  {
    groupName: 'إدارة المنظمة',
    items: [
      { name: 'إدارة الموظفين', icon: UsersIcon, path: '/system-admin', roles: ['Admin', 'Super Admin', 'Branch Admin'], pageTitle: 'إدارة الموظفين' },
      { name: 'إدارة الوحدات', icon: CogIcon, path: '/module-management', roles: ['Super Admin'], pageTitle: 'إدارة الوحدات' },
      { name: 'إدارة الفروع', icon: BuildingOfficeIcon, path: '/branch-management', roles: ['Super Admin'], pageTitle: 'إدارة الفروع' },
      { name: 'إدارة التدريب', icon: AcademicCapIcon, path: '/learning-management', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'إدارة التدريب', module: 'learning' },
      { name: 'إدارة المستندات', icon: DocumentCheckIcon, path: '/document-management', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'إدارة المستندات', module: 'documents' },
      { name: 'إدارة العهد', icon: ComputerDesktopIcon, path: '/assets-management', roles: ['Admin', 'Super Admin'], pageTitle: 'إدارة العهد', module: 'assets' },
      { name: 'قوالب التعيين', icon: ClipboardDocumentCheckIcon, path: '/onboarding-templates', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'إدارة قوالب التعيين', module: 'onboarding' },
      { name: 'قوالب إنهاء الخدمة', icon: DocumentDuplicateIcon, path: '/offboarding-templates', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'إدارة قوالب إنهاء الخدمة', module: 'offboarding' },
      { name: 'سياسات الحضور', icon: ClockIcon, path: '/attendance-policy', roles: ['HR Manager', 'Admin', 'Super Admin', 'Branch Admin'], pageTitle: 'سياسات الحضور' },
      { name: 'سياسات الوقت الإضافي', icon: ClockIcon, path: '/overtime-policy', roles: ['HR Manager', 'Admin', 'Super Admin', 'Branch Admin'], pageTitle: 'سياسات الوقت الإضافي' },
      { name: 'سياسات الإجازات', icon: BriefcaseIcon, path: '/leave-policy', roles: ['HR Manager', 'Admin', 'Super Admin', 'Branch Admin'], pageTitle: 'سياسات الإجازات' },
      { name: 'الهيكل الوظيفي', icon: DocumentDuplicateIcon, path: '/job-titles', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'الهيكل الوظيفي', module: 'job_titles' },
      { name: 'التعويضات والمزايا', icon: BanknotesIcon, path: '/compensation', roles: ['HR Manager', 'Admin', 'Super Admin'], pageTitle: 'التعويضات والمزايا', module: 'compensation' },
    ]
  }
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { name: 'الإعدادات', icon: CogIcon, path: '/settings', pageTitle: 'الإعدادات' },
  { name: 'تسجيل الخروج', icon: ArrowLeftOnRectangleIcon, path: '/logout', pageTitle: 'تسجيل الخروج' },
];

export const MOCK_LEAVE_DISTRIBUTION: LeaveDistributionDataItem[] = [
  { name: 'Annual', value: 25, typeName: 'سنوية', fill: '#0ea5e9' },
  { name: 'Sick', value: 12, typeName: 'مرضية', fill: '#10b981' },
  { name: 'Casual', value: 8, typeName: 'عارضة', fill: '#f59e0b' },
  { name: 'Unpaid', value: 2, typeName: 'بدون أجر', fill: '#64748b' },
];

export const MOCK_TEAM_WEEKLY_ATTENDANCE: TeamWeeklyAttendanceItem[] = [
  { day: 'الأحد', present: 8, absent: 1, leave: 1 },
  { day: 'الإثنين', present: 9, absent: 0, leave: 1 },
  { day: 'الثلاثاء', present: 10, absent: 0, leave: 0 },
  { day: 'الأربعاء', present: 7, absent: 2, leave: 1 },
  { day: 'الخميس', present: 9, absent: 1, leave: 0 },
];

// =================================================================================
// ===== DERIVED DATA & HELPER FUNCTIONS =====
// =================================================================================

export const MOCK_WORK_LOCATIONS: WorkLocation[] = [
    { id: 'loc-cai-hq', name: 'المقر الرئيسي بالقاهرة', latitude: 30.0444, longitude: 31.2357, radiusMeters: 200 },
    { id: 'loc-alex-branch', name: 'فرع الإسكندرية', latitude: 31.2001, longitude: 29.9187, radiusMeters: 200 },
];

export const MOCK_ATTENDANCE_EVENTS: AttendanceEvent[] = [
    { id: 'evt-1', employeeId: 'emp-003', timestamp: '2025-08-03T07:15:00.000Z', type: 'CheckIn', isWithinGeofence: true },
    { id: 'evt-2', employeeId: 'emp-003', timestamp: '2025-08-03T16:15:00.000Z', type: 'CheckOut', isWithinGeofence: true },
    { id: 'evt-3', employeeId: 'emp-003', timestamp: '2025-08-04T07:25:00.000Z', type: 'CheckIn', isWithinGeofence: false },
    { id: 'evt-4', employeeId: 'emp-003', timestamp: '2025-08-04T15:00:00.000Z', type: 'CheckOut', isWithinGeofence: true },
    { id: 'evt-5', employeeId: 'emp-001', timestamp: '2025-08-28T06:45:00.000Z', type: 'CheckIn', isWithinGeofence: true },
    { id: 'evt-6', employeeId: 'emp-003', timestamp: '2025-08-27T07:05:00.000Z', type: 'CheckIn', isWithinGeofence: false, taskId: 'task-3', coords: { latitude: 30.05, longitude: 31.24 }},
    { id: 'evt-7', employeeId: 'emp-003', timestamp: '2025-08-27T15:00:00.000Z', type: 'CheckOut', isWithinGeofence: false, taskId: 'task-3', coords: { latitude: 30.05, longitude: 31.24 }}
];

export const MOCK_EXTERNAL_TASKS: ExternalTask[] = [
    {
        id: 'task-1',
        employeeId: 'emp-103', // Youssef Ibrahim (Sales)
        managerId: 'emp-102',
        title: 'زيارة العميل (شركة النصر)',
        description: 'مقابلة لمناقشة تجديد العقد السنوي.',
        date: new Date().toISOString().split('T')[0], // Today for demo
        startTime: '10:00',
        endTime: '12:00',
        status: 'Approved',
    },
    {
        id: 'task-req-1',
        employeeId: 'emp-103',
        managerId: 'emp-102',
        requestedById: 'emp-103',
        title: 'طلب زيارة عميل جديد',
        description: 'مقابلة أولى مع العميل المحتمل (شركة الأمل).',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        startTime: '14:00',
        endTime: '15:00',
        status: 'PendingApproval',
    },
     {
        id: 'task-req-2',
        employeeId: 'emp-004',
        managerId: 'emp-002',
        requestedById: 'emp-004',
        title: 'شراء مكونات للخادم',
        description: 'شراء RAM و SSD جديد للخادم من مول البستان.',
        date: new Date().toISOString().split('T')[0], // Today
        startTime: '15:00',
        endTime: '17:00',
        status: 'PendingApproval',
    },
    {
        id: 'task-3',
        employeeId: 'emp-003', // Hoda Zaki (Developer)
        managerId: 'emp-002',
        title: 'حضور مؤتمر Tech Summit',
        description: 'تمثيل الشركة وحضور جلسات عن الواجهات الأمامية.',
        date: '2025-08-27',
        startTime: '09:00',
        endTime: '17:00',
        status: 'Completed',
        checkInTimestamp: '2025-08-27T07:05:00.000Z',
        checkInCoords: { latitude: 30.05, longitude: 31.24 },
        checkOutTimestamp: '2025-08-27T15:00:00.000Z',
        checkOutCoords: { latitude: 30.05, longitude: 31.24 },
    },
];

export const timeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return `منذ ${Math.floor(interval)} سنة`;
    interval = seconds / 2592000;
    if (interval > 1) return `منذ ${Math.floor(interval)} شهر`;
    interval = seconds / 86400;
    if (interval > 1) return `منذ ${Math.floor(interval)} يوم`;
    interval = seconds / 3600;
    if (interval > 1) return `منذ ${Math.floor(interval)} ساعة`;
    interval = seconds / 60;
    if (interval > 1) return `منذ ${Math.floor(interval)} دقيقة`;
    return 'الآن';
};

export const generatePayslips = (
    employeeId: string, 
    employees: EmployeeProfile[], 
    allAttendance: AttendanceRecord[],
    attendancePolicies: AttendancePolicy[],
    overtimePolicies: OvertimePolicy[],
    salaryComponents: SalaryComponent[],
    compensationPackages: CompensationPackage[],
    attendanceAdjustmentRequests: AttendanceAdjustmentRequest[],
    leavePermitRequests: LeavePermitRequest[],
    externalTasks: ExternalTask[]
): Payslip[] => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee || !employee.baseSalary) return [];

    const attendancePolicy = attendancePolicies.find(p => p.id === employee.attendancePolicyId);
    const overtimePolicy = overtimePolicies.find(p => p.id === employee.overtimePolicyId);
    const compPackage = compensationPackages.find(p => p.id === employee.compensationPackageId);
    
    const payslips: Payslip[] = [];
    for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('ar-EG', { month: 'long' });
        const year = date.getFullYear();
        
        const monthAttendance = allAttendance.filter(r => 
            r.employeeId === employeeId && 
            new Date(r.date).getMonth() === date.getMonth() &&
            new Date(r.date).getFullYear() === year
        );
        
        const baseSalary = employee.baseSalary;
        const earnings: PayslipItem[] = [{ description: 'الراتب الأساسي', amount: baseSalary }];
        const deductions: PayslipItem[] = [];
        const hourlyRate = baseSalary / 22 / 8; // Assuming 22 working days, 8 hours/day

        // Add allowances and deductions from compensation package
        if (compPackage) {
            compPackage.components.forEach(pkgComponent => {
                const componentDetails = salaryComponents.find(sc => sc.id === pkgComponent.componentId);
                if (componentDetails) {
                    let calculatedAmount = 0;
                    if (componentDetails.calculationType === 'FixedAmount') {
                        calculatedAmount = pkgComponent.value;
                    } else { // PercentageOfBase
                        calculatedAmount = (baseSalary * pkgComponent.value) / 100;
                    }

                    const item: PayslipItem = {
                        description: componentDetails.name,
                        amount: parseFloat(calculatedAmount.toFixed(2)),
                    };

                    if (componentDetails.type === 'Allowance') {
                        earnings.push(item);
                    } else {
                        deductions.push(item);
                    }
                }
            });
        }
        
        // Calculate overtime
        const overtimeHours = monthAttendance.reduce((sum, rec) => {
            if (!overtimePolicy || !overtimePolicy.allowOvertime || !rec.workedHours) return sum;
    
            const dailyOvertimeMinutes = Math.max(0, (rec.workedHours - 8) * 60);
            if (dailyOvertimeMinutes >= overtimePolicy.minOvertimeInMinutes) {
                return sum + (dailyOvertimeMinutes / 60);
            }
            return sum;
        }, 0);
        
        if (overtimeHours > 0 && overtimePolicy) {
            const overtimePay = (overtimeHours * hourlyRate * overtimePolicy.overtimeRateNormal);
            earnings.push({ description: 'أجر إضافي', amount: parseFloat(overtimePay.toFixed(2)) });
        }
        
        // Calculate lateness deductions
        const lateDeductions = monthAttendance.reduce((sum, rec) => {
            if (!attendancePolicy || !rec.firstCheckIn) return sum;

            // Check for approved external task for the day
            const hasApprovedTask = externalTasks.some(task => 
                task.employeeId === employeeId && 
                task.date === rec.date &&
                ['Approved', 'InProgress', 'Completed'].includes(task.status)
            );
            if (hasApprovedTask) return sum; // Skip deduction if task exists

            const isExcusedByAdjustment = attendanceAdjustmentRequests.some(adj => 
                adj.employeeId === employeeId && 
                adj.date === rec.date &&
                adj.adjustmentType === 'LateArrival' &&
                adj.status === 'Approved'
            );
            if (isExcusedByAdjustment) return sum;

            const [h, m] = rec.firstCheckIn.split(':').map(Number);
            const checkInMinutes = h * 60 + m;
            
            const isExcusedByPermit = leavePermitRequests.some(p => {
                if (p.employeeId !== employeeId || p.date !== rec.date || p.status !== 'Approved') return false;
                const [startH, startM] = p.startTime.split(':').map(Number);
                const [endH, endM] = p.endTime.split(':').map(Number);
                const permitStartMinutes = startH * 60 + startM;
                const permitEndMinutes = endH * 60 + endM;
                return checkInMinutes >= permitStartMinutes && checkInMinutes <= permitEndMinutes;
            });
            if (isExcusedByPermit) return sum;

            const gracePeriodEnd = 9 * 60 + attendancePolicy.gracePeriodInMinutes;
            if (checkInMinutes > gracePeriodEnd) {
                const latenessMinutes = checkInMinutes - (9 * 60);
                const tier = attendancePolicy.latenessTiers.find(t => latenessMinutes >= t.fromMinutes && latenessMinutes <= t.toMinutes);
                if (tier) {
                    return sum + (tier.penaltyHours * hourlyRate);
                }
            }
            return sum;
        }, 0);

        if (lateDeductions > 0) {
             deductions.push({ description: 'خصم تأخير', amount: parseFloat(lateDeductions.toFixed(2)) });
        }

        // Calculate early leave deductions
        const earlyLeaveDeductions = monthAttendance.reduce((sum, rec) => {
            if (!attendancePolicy || !rec.lastCheckOut || !attendancePolicy.earlyLeaveTiers || attendancePolicy.earlyLeaveTiers.length === 0) return sum;
    
            // Check for approved external task for the day
            const hasApprovedTask = externalTasks.some(task => 
                task.employeeId === employeeId && 
                task.date === rec.date &&
                ['Approved', 'InProgress', 'Completed'].includes(task.status)
            );
            if (hasApprovedTask) return sum; // Skip deduction if task exists

            const isExcusedByAdjustment = attendanceAdjustmentRequests.some(adj => 
                adj.employeeId === employeeId && 
                adj.date === rec.date &&
                adj.adjustmentType === 'EarlyDeparture' &&
                adj.status === 'Approved'
            );
            if (isExcusedByAdjustment) return sum;

            const [h, m] = rec.lastCheckOut.split(':').map(Number);
            const checkOutMinutes = h * 60 + m;

            const isExcusedByPermit = leavePermitRequests.some(p => {
                if (p.employeeId !== employeeId || p.date !== rec.date || p.status !== 'Approved') return false;
                const [startH, startM] = p.startTime.split(':').map(Number);
                const [endH, endM] = p.endTime.split(':').map(Number);
                const permitStartMinutes = startH * 60 + startM;
                const permitEndMinutes = endH * 60 + endM;
                return checkOutMinutes >= permitStartMinutes && checkOutMinutes <= permitEndMinutes;
            });
            if (isExcusedByPermit) return sum;

            const shiftEndHour = 18; // Assume 6 PM
            
            const shiftEndMinutesFromMidnight = shiftEndHour * 60;
            
            if (checkOutMinutes < shiftEndMinutesFromMidnight) {
                const earlyLeaveMinutes = shiftEndMinutesFromMidnight - checkOutMinutes;
                const tier = attendancePolicy.earlyLeaveTiers.find(t => earlyLeaveMinutes >= t.fromMinutes && earlyLeaveMinutes <= t.toMinutes);
                if (tier) {
                    return sum + (tier.penaltyHours * hourlyRate);
                }
            }
            return sum;
        }, 0);

        if (earlyLeaveDeductions > 0) {
            deductions.push({ description: 'خصم انصراف مبكر', amount: parseFloat(earlyLeaveDeductions.toFixed(2)) });
        }


        const grossSalary = earnings.reduce((sum, item) => sum + item.amount, 0);
        const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
        const netSalary = grossSalary - totalDeductions;

        payslips.push({
            id: `payslip-${employeeId}-${year}-${date.getMonth()}`,
            month: monthName,
            year: year,
            grossSalary: parseFloat(grossSalary.toFixed(2)),
            totalDeductions: parseFloat(totalDeductions.toFixed(2)),
            netSalary: parseFloat(netSalary.toFixed(2)),
            earnings,
            deductions,
        });
    }
    return payslips;
};

export const getDerivedData = (
  currentUserId: string,
  employees: EmployeeProfile[],
  branches: Branch[],
  employeeInfractions: EmployeeInfraction[],
  attendancePolicies: AttendancePolicy[],
  overtimePolicies: OvertimePolicy[],
  leavePolicies: LeavePolicy[],
  jobTitles: JobTitle[],
  courses: Course[],
  employeeCourses: EmployeeCourse[],
  monthlyCheckIns: MonthlyCheckIn[],
  supportTickets: SupportTicket[],
  notifications: Notification[],
  requests: HRRequest[],
  attendanceRecords: AttendanceRecord[],
  documents: EmployeeDocument[],
  performanceReviews: PerformanceReview[],
  externalTasks: ExternalTask[],
  goals: Goal[],
  attendanceEvents: AttendanceEvent[],
  assets: Asset[],
) => {

// FIX: Explicitly type the return value of the map function to ensure type safety.
  const assetsWithDepreciation = assets.map((asset): Asset => {
    const purchaseDate = new Date(asset.purchaseDate);
    const now = new Date('2025-09-01'); // Fixed date for demo consistency
    const yearsSincePurchase = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    let depreciationStatus: Asset['depreciationStatus'] = 'Normal';


    if (yearsSincePurchase <= 0 || asset.usefulLifeYears <= 0 || asset.purchaseValue <= 0) {
        return { ...asset, currentValue: asset.purchaseValue, depreciationStatus: 'Normal' };
    }

    let currentValue;

    if (asset.depreciationMethod === 'Straight-line') {
        const annualDepreciation = asset.purchaseValue / asset.usefulLifeYears;
        const totalDepreciation = Math.min(annualDepreciation * yearsSincePurchase, asset.purchaseValue);
        currentValue = asset.purchaseValue - totalDepreciation;
    } else if (asset.depreciationMethod === 'Declining Balance') {
        let bookValue = asset.purchaseValue;
        const rate = 2 / asset.usefulLifeYears; // Double declining rate

        const fullYearsPassed = Math.floor(yearsSincePurchase);
        for (let i = 0; i < fullYearsPassed; i++) {
             if (i < asset.usefulLifeYears) {
                const depreciationAmount = bookValue * rate;
                bookValue -= depreciationAmount;
             }
        }
        
        if(yearsSincePurchase > fullYearsPassed && fullYearsPassed < asset.usefulLifeYears) {
            const partialYearFraction = yearsSincePurchase - fullYearsPassed;
            const depreciationForPartialYear = bookValue * rate * partialYearFraction;
            bookValue -= depreciationForPartialYear;
        }

        currentValue = bookValue;
    } else {
        currentValue = asset.purchaseValue;
    }

    currentValue = Math.max(0, currentValue);
    
    if (currentValue === 0) {
        depreciationStatus = 'Depreciated';
    } else if (asset.usefulLifeYears - yearsSincePurchase <= 1) { // Nearing EOL if 1 year or less remains
        depreciationStatus = 'NearingEOL';
    }
    
    return { ...asset, currentValue: parseFloat(currentValue.toFixed(2)), depreciationStatus };
  });

  const allEmployeesWithDetails = employees.map(emp => {
      const branch = branches.find(b => b.id === emp.branchId);
      const attendancePolicy = attendancePolicies.find(p => p.id === emp.attendancePolicyId);
      const overtimePolicy = overtimePolicies.find(p => p.id === emp.overtimePolicyId);
      const leavePolicy = leavePolicies.find(p => p.id === emp.leavePolicyId);
      const jobTitle = jobTitles.find(jt => jt.id === emp.jobTitleId);
      const assignedAssets = assetsWithDepreciation.filter(a => a.assignedToId === emp.id);
      return {
          ...emp,
          branchName: branch?.name || 'N/A',
          attendancePolicyName: attendancePolicy?.name || 'N/A',
          overtimePolicyName: overtimePolicy?.name || 'N/A',
          leavePolicyName: leavePolicy?.name || 'N/A',
          title: jobTitle?.name || emp.title,
          assets: assignedAssets,
      };
  });

  const currentUserProfile = allEmployeesWithDetails.find(e => e.id === currentUserId)!;
  const teamMembersProfiles = allEmployeesWithDetails.filter(emp => emp.managerId === currentUserId && emp.isEmployee);
  const teamMemberIds = teamMembersProfiles.map(m => m.id);
  
  // --- Employee Dashboard Stats ---
  const pendingRequestsCount = requests.filter(r => r.employeeId === currentUserId && r.status === 'Pending').length;
  
  const userAttendanceRecords = attendanceRecords.filter(r => r.employeeId === currentUserId);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const overtimeHoursThisMonth = userAttendanceRecords
      .filter(r => {
          const recordDate = new Date(r.date);
          return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      })
      .reduce((sum, record) => sum + (record.overtime || 0), 0);

  const annualLeaveBalance = currentUserProfile.leaveBalances.find(b => b.type === 'Annual');
  const remainingAnnualLeave = annualLeaveBalance ? annualLeaveBalance.balance - annualLeaveBalance.used : 0;

  // --- Employee Dashboard Data ---
  const employeeDashboardData: EmployeeDashboardData = {
      activeCourse: employeeCourses
          .filter(ec => ec.employeeId === currentUserId && ec.status === 'In Progress')
          .map(ec => {
              const courseDetails = courses.find(c => c.id === ec.courseId);
              return { ...courseDetails, ...ec } as (Course & EmployeeCourse);
          })[0] || null,
      latestTicket: supportTickets
          .filter(t => t.employeeId === currentUserId && t.status !== 'Closed')
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] || null,
      recentActivities: notifications
          .filter(n => n.recipientId === currentUserId)
          .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 4)
          .map(n => {
              let page = 'لوحة التحكم الشخصية'; // Default
              if (n.relatedEntity?.type === 'course') page = 'التطوير والتدريب';
              else if (n.relatedEntity?.type === 'leave_request') page = 'الإجازات';
              else if (n.relatedEntity?.type === 'attendance_adjustment') page = 'حضوري وانصرافي';
              else if (n.message.includes('متابعة شهرية')) page = 'الأداء';
              return {
                  id: n.id,
                  icon: CheckCircleIcon, // Placeholder
                  text: n.message,
                  timestamp: timeSince(n.timestamp),
                  page,
              };
          }),
      stats: {
        remainingAnnualLeave,
        pendingRequestsCount,
        overtimeHoursThisMonth: parseFloat(overtimeHoursThisMonth.toFixed(1)),
      }
  };

  const getRequestDetailsText = (request: HRRequest): string => {
        switch (request.type) {
            case 'Leave':
                return `طلب إجازة ${LEAVE_TYPE_TRANSLATION[request.leaveType]}`;
            case 'AttendanceAdjustment':
                return `طلب ${request.adjustmentType === 'LateArrival' ? 'عذر تأخير' : 'انصراف مبكر'}`;
            case 'LeavePermit':
                return `طلب إذن انصراف من ${request.startTime} إلى ${request.endTime}`;
            case 'Certificate':
            case 'DataUpdate':
                return request.details;
            default:
                return 'طلب غير محدد';
        }
    }

  // --- Team Dashboard Data ---
  const attentionItems: AttentionItem[] = [];
  const allApprovedLeaveRequests = requests.filter(r => r.type === 'Leave' && r.status === 'Approved') as LeaveRequest[];

  // 1. Pending HR Requests
  requests
      .filter(r => teamMemberIds.includes(r.employeeId) && r.status === 'Pending')
      .forEach(r => {
          const emp = allEmployeesWithDetails.find(e => e.id === r.employeeId);
          if (emp) {
              let itemType: AttentionItem['type'] = 'leave'; // Default
              let icon = BriefcaseIcon;
              let context: ApprovalContext | undefined = undefined;

              switch(r.type) {
                case 'Leave':
                    itemType = 'leave';
                    icon = BriefcaseIcon;
                    const reqStart = new Date(r.startDate).getTime();
                    const reqEnd = new Date(r.endDate).getTime();

                    const overlappingLeaves = allApprovedLeaveRequests
                        .filter(otherReq => {
                            if (otherReq.employeeId === r.employeeId) return false; // Not the same employee
                            if (!teamMemberIds.includes(otherReq.employeeId)) return false; // Must be in the same team
                            const otherStart = new Date(otherReq.startDate).getTime();
                            const otherEnd = new Date(otherReq.endDate).getTime();
                            // Check for overlap
                            return (reqStart <= otherEnd && reqEnd >= otherStart);
                        })
                        .map(ol => {
                            const overlappingEmp = allEmployeesWithDetails.find(e => e.id === ol.employeeId)!;
                            return {
                                employeeName: overlappingEmp.name,
                                avatarUrl: overlappingEmp.avatarUrl,
                                leaveType: ol.leaveType,
                                startDate: ol.startDate,
                                endDate: ol.endDate,
                            };
                        });
                    
                    context = {
                        employee: emp,
                        overlappingLeaves,
                    };

                    break;
                case 'AttendanceAdjustment':
                    itemType = 'attendance_adjustment';
                    icon = ClockIcon;
                    break;
                case 'LeavePermit':
                    itemType = 'leave_permit';
                    icon = ClockIcon;
                    break;
                case 'Certificate':
                case 'DataUpdate':
                    // Not handled as attention items for now
                    return;
              }

              if (r.type === 'Leave' || r.type === 'AttendanceAdjustment' || r.type === 'LeavePermit') {
                attentionItems.push({
                    id: `req-${r.id}`,
                    type: itemType,
                    icon: icon,
                    text: getRequestDetailsText(r),
                    employeeName: emp.name,
                    employeeAvatarUrl: emp.avatarUrl,
                    timestamp: r.submissionDate,
                    request: r,
                    context,
                });
              }
          }
      });
  // 2. Pending Course Approvals
    employeeCourses
        .filter(ec => teamMemberIds.includes(ec.employeeId) && ec.managerApprovalStatus === 'Pending')
        .forEach(ec => {
            const emp = allEmployeesWithDetails.find(e => e.id === ec.employeeId);
            const course = courses.find(c => c.id === ec.courseId);
            if (emp && course) {
                attentionItems.push({
                    id: `course-${emp.id}-${course.id}`,
                    type: 'course',
                    icon: AcademicCapIcon,
                    text: `طلب موافقة على دورة: ${course.title}`,
                    employeeName: emp.name,
                    employeeAvatarUrl: emp.avatarUrl,
                    timestamp: new Date().toISOString(), // Placeholder
                    request: {} as HRRequest, // Placeholder
                });
            }
        });

    // 3. Pending External Task Requests
    externalTasks
        .filter(t => teamMemberIds.includes(t.employeeId) && t.status === 'PendingApproval' && t.requestedById === t.employeeId)
        .forEach(t => {
            const emp = allEmployeesWithDetails.find(e => e.id === t.employeeId);
            if(emp) {
                attentionItems.push({
                    id: `task-${t.id}`,
                    type: 'external_task',
                    icon: ClipboardDocumentListIcon,
                    text: `طلب مهمة خارجية: ${t.title}`,
                    employeeName: emp.name,
                    employeeAvatarUrl: emp.avatarUrl,
                    timestamp: new Date().toISOString(), // Placeholder for request time
                    request: {} as HRRequest, // Placeholder
                });
            }
        });


  const teamLearningStats: TeamLearningStat[] = teamMembersProfiles.map(member => {
      const memberCourses = employeeCourses.filter(ec => ec.employeeId === member.id && ec.status !== 'Not Started');
      if (memberCourses.length === 0) return { name: member.name, progress: 0 };
      const avgProgress = memberCourses.reduce((sum, c) => sum + c.progress, 0) / memberCourses.length;
      return { name: member.name, progress: Math.round(avgProgress) };
  });

  const today = new Date().toISOString().split('T')[0];
  const teamAttendanceToday = attendanceRecords.filter(r => teamMemberIds.includes(r.employeeId) && r.date === today);
  const presentCount = teamAttendanceToday.filter(r => r.status === 'Present').length;
  const onLeaveCount = teamAttendanceToday.filter(r => r.status === 'Leave').length;
  
  const teamDashboardData: TeamDashboardData = {
      attentionItems: attentionItems.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      teamLearningStats,
      teamAttendance: {
          present: presentCount,
          onLeave: onLeaveCount,
          absent: teamMembersProfiles.length - presentCount - onLeaveCount,
      },
      teamMembersWithAttendance: teamMembersProfiles.map(member => {
          const attendance = teamAttendanceToday.find(r => r.employeeId === member.id);
          const status = attendance?.status || 'Absent';
          // FIX: Correctly map AttendanceStatus to TeamMember['attendanceStatus'] to avoid type errors.
          const teamMemberStatus: TeamMember['attendanceStatus'] = status === 'Present' ? 'Present' : status === 'Absent' ? 'Absent' : 'Leave';
          return {
              id: member.id,
              name: member.name,
              title: member.title,
              avatarUrl: member.avatarUrl,
              attendanceStatus: teamMemberStatus,
          };
      })
  };
  
  // --- Team Reports Data ---
  const teamGoals = MOCK_GOALS.filter(g => teamMemberIds.includes(g.employeeId));
  const avgGoalCompletion = teamGoals.length > 0 ? Math.round(teamGoals.reduce((sum, g) => sum + g.progress, 0) / teamGoals.length) : 0;
  
  const avgTeamSentiment = teamMembersProfiles.length > 0 ? parseFloat((teamMembersProfiles.reduce((sum, m) => sum + m.satisfactionSurveyScore, 0) / teamMembersProfiles.length).toFixed(1)) : 0;
  
  const totalOvertime = attendanceRecords
      .filter(r => {
          const recordDate = new Date(r.date);
          return teamMemberIds.includes(r.employeeId) && recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      })
      .reduce((sum, record) => sum + (record.overtime || 0), 0);

    const teamLeaveRequests = requests.filter(r => r.type === 'Leave' && teamMemberIds.includes(r.employeeId)) as LeaveRequest[];
    const leaveDistribution = teamLeaveRequests.reduce((acc, req) => {
        acc[req.leaveType] = (acc[req.leaveType] || 0) + req.duration;
        return acc;
    }, {} as Record<LeaveType, number>);

    const leaveDistributionData: LeaveDistributionDataItem[] = Object.entries(leaveDistribution).map(([type, value]) => ({
        name: type as LeaveType,
        value,
        typeName: LEAVE_TYPE_TRANSLATION[type as LeaveType],
        fill: ({ Annual: '#0ea5e9', Sick: '#10b981', Casual: '#f59e0b', Unpaid: '#64748b' })[type as LeaveType]
    }));
    
    const todayDate = new Date();
    const last7Days: TeamWeeklyAttendanceItem[] = [];
    for(let i=6; i>=0; i--) {
        const d = new Date(todayDate);
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('ar-EG', { weekday: 'short' });

        const recordsForDay = attendanceRecords.filter(r => teamMemberIds.includes(r.employeeId) && r.date === dayStr);
        const present = recordsForDay.filter(r => r.status === 'Present').length;
        const leave = recordsForDay.filter(r => r.status === 'Leave').length;
        const absent = teamMembersProfiles.length - present - leave;

        last7Days.push({ day: dayName, present, absent, leave });
    }
      
  const teamReportsData: TeamReportsData = {
    keyMetrics: {
      avgGoalCompletion,
      pendingRequests: requests.filter(r => teamMemberIds.includes(r.employeeId) && r.status === 'Pending').length,
      avgTeamSentiment,
      totalOvertime: parseFloat(totalOvertime.toFixed(1)),
    },
    leaveDistribution: leaveDistributionData,
    weeklyAttendance: last7Days,
  };


  // --- Team Analytics Details ---
  const todayStr = new Date().toISOString().split('T')[0];
  const mockTeamMemberDetails: TeamMemberDetails[] = teamMembersProfiles.map(profile => {
      const memberCourses = employeeCourses
        .filter(ec => ec.employeeId === profile.id)
        .map(ec => {
            const courseDetails = courses.find(c => c.id === ec.courseId);
            return { ...courseDetails, ...ec } as (Course & EmployeeCourse);
        });

      // Simple stats generation
      const memberPermits = requests.filter(r => r.employeeId === profile.id && r.type === 'LeavePermit' && r.status === 'Approved') as LeavePermitRequest[];
      const usedPermissionHours = memberPermits.reduce((sum, p) => sum + p.durationHours, 0);
      const annualLeaves = requests.filter(r => r.employeeId === profile.id && r.type === 'Leave' && (r as LeaveRequest).leaveType === 'Annual' && r.status === 'Approved') as LeaveRequest[];
      const usedAnnualLeavesDays = annualLeaves.reduce((sum, l) => sum + l.duration, 0);
      
      const stats: TeamMemberStats = {
          usedPermissionHours: usedPermissionHours,
          usedAnnualLeavesDays: usedAnnualLeavesDays,
          usedRemoteDays: 5, // mock
          emergencyDays: 1, // mock
          usedGraceMinutes: 45, // mock
          absentDays: attendanceRecords.filter(r => r.employeeId === profile.id && r.status === 'Absent').length,
      };

      const dailyPunches = attendanceEvents.filter(e => e.employeeId === profile.id && e.timestamp.startsWith(todayStr));

      return {
          profile: profile,
          attendance: attendanceRecords.filter(r => r.employeeId === profile.id),
          leave: requests.filter(r => r.employeeId === profile.id && r.type === 'Leave') as LeaveRequest[],
          skills: [ // MOCK SKILLS
                { name: 'React', currentLevel: 4, requiredLevel: 4 },
                { name: 'TypeScript', currentLevel: 3, requiredLevel: 4 },
                { name: 'CSS', currentLevel: 5, requiredLevel: 4 },
                { name: 'Testing', currentLevel: 2, requiredLevel: 3 },
                { name: 'Communication', currentLevel: 4, requiredLevel: 4 },
            ],
          developmentPlan: [ // MOCK PLAN
                { area: 'Testing', suggestion: 'Enroll in "Advanced Testing with Jest" course.' },
                { area: 'TypeScript', suggestion: 'Contribute to a project with a strict TypeScript configuration.' },
            ],
          goals: MOCK_GOALS.filter(g => g.employeeId === profile.id),
          reviews: performanceReviews.filter(r => r.employeeId === profile.id),
          documents: documents.filter(d => d.employeeId === profile.id),
          assets: assetsWithDepreciation.filter(a => a.assignedToId === profile.id),
          infractions: employeeInfractions.filter(i => i.employeeId === profile.id),
          courses: memberCourses,
          monthlyCheckIns: monthlyCheckIns.filter(mci => mci.employeeId === profile.id),
          externalTasks: externalTasks.filter(t => t.employeeId === profile.id),
          stats: stats,
          dailyPunches: dailyPunches,
      };
  });
  
  // --- Manager Performance Data ---
  const performanceCycle: PerformanceCycle = {
      name: `تقييم منتصف العام ${new Date().getFullYear()}`,
      status: 'Active',
      startDate: `${new Date().getFullYear()}-06-01`,
      endDate: `${new Date().getFullYear()}-07-31`,
  };

  const teamPerformanceData: TeamMemberPerformanceData[] = teamMembersProfiles.map(member => {
      const memberGoals = goals.filter(g => g.employeeId === member.id);
      const goalProgress = memberGoals.length > 0 ? Math.round(memberGoals.reduce((sum, g) => sum + g.progress, 0) / memberGoals.length) : 0;
      
      const latestCheckIn = monthlyCheckIns
          .filter(mci => mci.employeeId === member.id)
          .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;

      const review = performanceReviews.find(r => r.employeeId === member.id && r.cycle === performanceCycle.name);
      let reviewStatus: 'Not Started' | 'In Progress' | 'Completed' = 'Not Started';
      if (review) {
          if (review.status === 'Completed') reviewStatus = 'Completed';
          else reviewStatus = 'In Progress';
      }

      return {
          member,
          goalProgress,
          latestCheckIn,
          reviewStatus,
      };
  });

  const reviewsCompleted = teamPerformanceData.filter(d => d.reviewStatus === 'Completed').length;
  const avgTeamGoalProgress = teamPerformanceData.length > 0 ? Math.round(teamPerformanceData.reduce((sum, d) => sum + d.goalProgress, 0) / teamPerformanceData.length) : 0;

  const managerPerformanceData: ManagerPerformanceData = {
      cycle: performanceCycle,
      cycleStats: {
          totalReviews: teamMembersProfiles.length,
          reviewsCompleted,
          avgTeamGoalProgress,
      },
      teamPerformance: teamPerformanceData,
  };


  return {
    currentUserProfile,
    teamMembersProfiles,
    mockTeamMemberDetails,
    employeeDashboardData,
    teamDashboardData,
    teamReportsData,
    teamGoals,
    managerPerformanceData,
  };
};
