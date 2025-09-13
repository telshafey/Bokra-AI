import {
  HomeIcon, CalendarIcon, DocumentTextIcon, UserCircleIcon, CogIcon, ArrowLeftOnRectangleIcon, BriefcaseIcon, UserGroupIcon, PresentationChartLineIcon, ShieldCheckIcon, UsersIcon, BuildingOfficeIcon, ShieldExclamationIcon, SitemapIcon, DocumentDuplicateIcon, BanknotesIcon, StarIcon, CheckBadgeIcon, QuestionMarkCircleIcon, LifebuoyIcon, BookOpenIcon, ClipboardDocumentListIcon, DocumentCheckIcon, ComputerDesktopIcon, ChartPieIcon
} from './components/icons/Icons';
import type { NavGroup, NavItem, EmployeeProfile, Branch, JobTitle, LeaveBalance, AttendanceRecord, Payslip, Stat, RecentActivityItem, TeamMember, PendingRequest, HRRequest, Notification, TeamReportsData, TeamWeeklyAttendanceItem, LeaveDistributionDataItem, ManagerPerformanceData, TeamMemberPerformanceData, JobOpening, Candidate, OnboardingProcess, OnboardingTemplate, OffboardingProcess, OffboardingTemplate, EmployeeDocument, Asset, Course, EmployeeCourse, PerformanceReview, MonthlyCheckIn, ExternalTask, SupportTicket, SalaryComponent, CompensationPackage, WorkLocation, HelpCategory, HelpArticle, ApprovalWorkflow, OnboardingTaskCategory, OnboardingResponsible, OffboardingTaskCategory, OffboardingResponsible, EmployeeDashboardData, TeamDashboardData, Goal, AttendancePolicy, LeavePolicy, OvertimePolicy } from './types';

// Icons mapping for recent activities
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from './components/icons/Icons';
import { useTranslation } from './components/contexts/LanguageContext';

export const NAV_GROUPS: NavGroup[] = [
  {
    groupNameKey: 'sidebar.selfService',
    items: [
      { nameKey: 'sidebar.personalDashboard', path: '/dashboard', icon: HomeIcon, requiresEmployee: true },
      { nameKey: 'sidebar.myAttendance', path: '/my-attendance', icon: ClockIcon, requiresEmployee: true },
      { nameKey: 'sidebar.leave', path: '/leave', icon: CalendarIcon, requiresEmployee: true },
      { nameKey: 'sidebar.payrollAndExpenses', path: '/payslip', icon: BanknotesIcon, requiresEmployee: true },
      { nameKey: 'sidebar.myRequests', path: '/my-requests', icon: DocumentTextIcon, requiresEmployee: true },
      { nameKey: 'sidebar.myTasks', path: '/my-tasks', icon: ClipboardDocumentListIcon, requiresEmployee: true },
    ]
  },
  {
    groupNameKey: 'sidebar.personalPlan',
    items: [
      { nameKey: 'sidebar.profile', path: '/profile', icon: UserCircleIcon, requiresEmployee: true },
      { nameKey: 'sidebar.performance', path: '/performance', icon: StarIcon, module: 'performance', requiresEmployee: true },
      { nameKey: 'sidebar.learning', path: '/learning', icon: BookOpenIcon, module: 'learning', requiresEmployee: true },
      { nameKey: 'sidebar.myDocuments', path: '/my-documents', icon: DocumentDuplicateIcon, module: 'documents', requiresEmployee: true },
      { nameKey: 'sidebar.myAssets', path: '/my-assets', icon: ComputerDesktopIcon, module: 'assets', requiresEmployee: true },
      { nameKey: 'sidebar.myOnboarding', path: '/my-onboarding', icon: CheckBadgeIcon, module: 'onboarding', requiresEmployee: true },
      { nameKey: 'sidebar.myOffboarding', path: '/my-offboarding', icon: ShieldExclamationIcon, module: 'offboarding', requiresEmployee: true },
    ]
  },
  {
    groupNameKey: 'sidebar.managerTools',
    items: [
      { nameKey: 'sidebar.teamDashboard', path: '/team-dashboard', icon: UserGroupIcon, roles: ['Team Lead', 'HR Manager', 'General Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.branchDashboard', path: '/branch-dashboard', icon: BuildingOfficeIcon, roles: ['Branch Admin'] },
      { nameKey: 'sidebar.teamAnalytics', path: '/team-analytics', icon: ChartPieIcon, roles: ['Team Lead', 'HR Manager', 'General Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.reports', path: '/reports', icon: PresentationChartLineIcon, roles: ['HR Manager', 'General Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.performanceManagement', path: '/performance-management', icon: StarIcon, module: 'performance', roles: ['Team Lead', 'HR Manager', 'General Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.turnoverAnalysis', path: '/turnover-analysis', icon: PresentationChartLineIcon, roles: ['HR Manager', 'General Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.externalTasksManagement', path: '/external-tasks', icon: ClipboardDocumentListIcon, roles: ['Team Lead', 'HR Manager', 'General Manager', 'Admin', 'Super Admin'] },

    ]
  },
  {
    groupNameKey: 'sidebar.talentManagement',
    items: [
      { nameKey: 'sidebar.recruitment', path: '/recruitment', icon: UsersIcon, module: 'recruitment', roles: ['HR Specialist', 'HR Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.onboarding', path: '/onboarding', icon: CheckBadgeIcon, module: 'onboarding', roles: ['HR Specialist', 'HR Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.offboarding', path: '/offboarding', icon: ShieldExclamationIcon, module: 'offboarding', roles: ['HR Specialist', 'HR Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.learningManagement', path: '/learning-management', icon: BookOpenIcon, module: 'learning', roles: ['HR Manager', 'Admin', 'Super Admin'] },
    ]
  },
  {
    groupNameKey: 'sidebar.orgManagement',
    items: [
      { nameKey: 'sidebar.employeeManagement', path: '/employee-management', icon: UsersIcon, roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.branchManagement', path: '/branch-management', icon: BuildingOfficeIcon, roles: ['Super Admin'] },
      { nameKey: 'sidebar.jobTitles', path: '/job-titles', icon: SitemapIcon, roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.compensation', path: '/compensation', icon: BanknotesIcon, module: 'payroll', roles: ['HR Manager', 'Finance Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.documentManagement', path: '/document-management', icon: DocumentDuplicateIcon, module: 'documents', roles: ['HR Specialist', 'HR Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.assetsManagement', path: '/assets-management', icon: ComputerDesktopIcon, module: 'assets', roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.attendancePolicies', path: '/policies/attendance', icon: ShieldCheckIcon, roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.overtimePolicies', path: '/policies/overtime', icon: ShieldCheckIcon, roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.leavePolicies', path: '/policies/leave', icon: ShieldCheckIcon, roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.onboardingTemplates', path: '/templates/onboarding', icon: DocumentTextIcon, module: 'onboarding', roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.offboardingTemplates', path: '/templates/offboarding', icon: DocumentTextIcon, module: 'offboarding', roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.moduleManagement', path: '/module-management', icon: CogIcon, roles: ['Super Admin', 'Admin'] },
      { nameKey: 'sidebar.approvalWorkflows', path: '/approval-workflows', icon: SitemapIcon, roles: ['Super Admin'] },

    ]
  },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { nameKey: 'sidebar.support', path: '/support', icon: QuestionMarkCircleIcon, module: 'support' },
  { nameKey: 'sidebar.helpCenter', path: '/help-center', icon: LifebuoyIcon, module: 'help_center' },
  { nameKey: 'sidebar.settings', path: '/settings', icon: CogIcon },
  { nameKey: 'sidebar.logout', path: '/logout', icon: ArrowLeftOnRectangleIcon },
];

export const COMPANY_BRANCHES: Branch[] = [
  { id: 'branch-cai', nameKey: 'branches.cairo', status: 'Active' },
  { id: 'branch-alex', nameKey: 'branches.alexandria', status: 'Active' },
  { id: 'branch-rs', nameKey: 'branches.rasSedr', status: 'Active' },
];

export const MOCK_JOB_TITLES: JobTitle[] = [
    { id: 'jt-gm', nameKey: 'jobTitles.gm', parentId: null },
    { id: 'jt-hrm', nameKey: 'jobTitles.hrManager', parentId: 'jt-gm' },
    { id: 'jt-devlead', nameKey: 'jobTitles.devLead', parentId: 'jt-gm' },
    { id: 'jt-sse', nameKey: 'jobTitles.sse', parentId: 'jt-devlead' },
    { id: 'jt-se', nameKey: 'jobTitles.se', parentId: 'jt-sse' },
];

const MOCK_LEAVE_BALANCES: LeaveBalance[] = [
  { type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 5 },
  { type: 'Casual', typeName: 'إجازة عارضة', balance: 7, used: 2 },
  { type: 'Sick', typeName: 'إجازة مرضية', balance: 14, used: 1 },
];

const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const date = new Date(2025, 7, day);
    const dayOfWeek = date.getDay();
    let status: 'Present' | 'Absent' | 'Weekend' = 'Present';
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Fri, Sat
        status = 'Weekend';
    } else if (Math.random() > 0.9) {
        status = 'Absent';
    }
    return {
        date: `2025-08-${String(day).padStart(2, '0')}`,
        day: date.toLocaleDateString('ar-EG', { weekday: 'long' }),
        status,
        firstCheckIn: status === 'Present' ? (Math.random() > 0.2 ? '08:55' : '09:17') : undefined,
        lastCheckOut: status === 'Present' ? (Math.random() > 0.2 ? '17:05' : '17:35') : undefined,
        workedHours: status === 'Present' ? 8 + (Math.random() - 0.5) : 0,
        overtime: status === 'Present' && Math.random() > 0.5 ? 0.5 : 0,
        employeeId: 'emp-001',
    }
});

const MOCK_PAYSLIPS: Payslip[] = [{
    id: 'ps-1',
    employeeId: 'emp-001',
    month: 'أغسطس',
    year: 2025,
    grossSalary: 18000,
    totalDeductions: 2500,
    netSalary: 15500,
    earnings: [{ description: 'الراتب الأساسي', amount: 18000 }],
    deductions: [{ description: 'تأمينات اجتماعية', amount: 2500 }],
}];


export const ALL_EMPLOYEES: EmployeeProfile[] = [
    {
        id: 'emp-001',
        employeeId: 'BOK-0001',
        name: 'أحمد المصري',
        title: 'مهندس برمجيات أول',
        jobTitleId: 'jt-sse',
        role: 'Employee',
        isEmployee: true,
        avatarUrl: 'https://i.pravatar.cc/100?u=emp-001',
        departmentKey: 'it',
        hireDate: '2022-01-15',
        employmentStatus: 'دوام كامل',
        managerId: 'emp-003',
        manager: 'محمد عبد الله',
        branchId: 'branch-cai',
        branchName: 'المقر الرئيسي بالقاهرة',
        checkInStatus: 'CheckedOut',
        leaveBalances: MOCK_LEAVE_BALANCES,
        baseSalary: 18000,
        attendancePolicyId: 'att-p-1',
        attendancePolicyName: 'سياسة الحضور القياسية',
        leavePolicyId: 'leave-p-1',
        leavePolicyName: 'سياسة الإجازات القياسية',
        contact: { phone: '01001234567', workEmail: 'ahmed.elmasry@bokra.com', personalEmail: 'ahmed.elmasry@gmail.com' },
        personal: { dateOfBirth: '1995-05-20', nationality: 'مصري', nationalId: '29505200100123', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' },
        address: '123 شارع التحرير، الدقي، القاهرة',
        performanceScore: 4.5,
        satisfactionSurveyScore: 4.2,
        lastPromotionDate: '2024-01-01',
        salaryComparedToMarket: 'Average',
        attendanceRecords: MOCK_ATTENDANCE_RECORDS,
        payslips: MOCK_PAYSLIPS,
    },
    {
        id: 'emp-002',
        employeeId: 'BOK-0002',
        name: 'فاطمة الزهراء',
        title: 'مسؤولة مبيعات',
        jobTitleId: 'jt-salesrep',
        role: 'Employee',
        isEmployee: true,
        avatarUrl: 'https://i.pravatar.cc/100?u=emp-002',
        departmentKey: 'sales',
        hireDate: '2023-03-01',
        employmentStatus: 'دوام كامل',
        managerId: 'emp-004',
        manager: 'علي حسن',
        branchId: 'branch-alex',
        branchName: 'فرع الإسكندرية',
        checkInStatus: 'CheckedIn',
        leaveBalances: [{ type: 'Annual', typeName: 'إجازة سنوية', balance: 21, used: 2 }],
        baseSalary: 12000,
        attendancePolicyId: 'att-p-1',
        attendancePolicyName: 'سياسة الحضور القياسية',
        contact: { phone: '01112345678', workEmail: 'fatma.elzahraa@bokra.com', personalEmail: 'fatma.elzahraa@gmail.com' },
        personal: { dateOfBirth: '1998-11-10', nationality: 'مصرية', nationalId: '29811100200456', maritalStatus: 'متزوج', gender: 'Female', religion: 'Muslim' },
        address: '456 شارع فؤاد، الإسكندرية',
        performanceScore: 4.8,
        satisfactionSurveyScore: 4.5,
        lastPromotionDate: null,
        salaryComparedToMarket: 'Average',
    },
    {
        id: 'emp-003',
        employeeId: 'BOK-0003',
        name: 'محمد عبد الله',
        title: 'قائد فريق التطوير',
        jobTitleId: 'jt-devlead',
        role: 'Team Lead',
        isEmployee: true,
        avatarUrl: 'https://i.pravatar.cc/100?u=emp-003',
        departmentKey: 'it',
        hireDate: '2020-06-10',
        employmentStatus: 'دوام كامل',
        managerId: 'emp-005',
        manager: 'خالد محمود',
        branchId: 'branch-cai',
        branchName: 'المقر الرئيسي بالقاهرة',
        checkInStatus: 'CheckedOut',
        leaveBalances: [],
        baseSalary: 25000,
        contact: { phone: '01223456789', workEmail: 'mohamed.abdallah@bokra.com', personalEmail: 'mohamed.abdallah@gmail.com' },
        personal: { dateOfBirth: '1990-02-15', nationality: 'مصري', nationalId: '29002150100789', maritalStatus: 'متزوج', gender: 'Male', religion: 'Muslim' },
        address: '789 شارع شهاب، المهندسين، القاهرة',
        performanceScore: 4.6,
        satisfactionSurveyScore: 3.8,
        lastPromotionDate: '2022-06-10',
        salaryComparedToMarket: 'Average',
    },
    {
        id: 'emp-004',
        employeeId: 'BOK-0004',
        name: 'علي حسن',
        title: 'قائد فريق المبيعات',
        jobTitleId: 'jt-saleslead',
        role: 'Team Lead',
        isEmployee: true,
        avatarUrl: 'https://i.pravatar.cc/100?u=emp-004',
        departmentKey: 'sales',
        hireDate: '2021-09-20',
        employmentStatus: 'دوام كامل',
        managerId: 'emp-005',
        manager: 'خالد محمود',
        branchId: 'branch-alex',
        branchName: 'فرع الإسكندرية',
        checkInStatus: 'CheckedOut',
        leaveBalances: [],
        baseSalary: 22000,
        contact: { phone: '01556789012', workEmail: 'ali.hassan@bokra.com', personalEmail: 'ali.hassan@gmail.com' },
        personal: { dateOfBirth: '1992-07-30', nationality: 'مصري', nationalId: '29207300200123', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' },
        address: '101 شارع أبو قير، الإسكندرية',
        performanceScore: 4.2,
        satisfactionSurveyScore: 4.0,
        lastPromotionDate: '2023-09-20',
        salaryComparedToMarket: 'Average',
    },
    {
        id: 'emp-005',
        employeeId: 'BOK-0005',
        name: 'خالد محمود',
        title: 'المدير العام',
        jobTitleId: 'jt-gm',
        role: 'General Manager',
        isEmployee: true,
        avatarUrl: 'https://i.pravatar.cc/100?u=emp-005',
        departmentKey: 'management',
        hireDate: '2018-02-01',
        employmentStatus: 'دوام كامل',
        branchId: 'branch-cai',
        branchName: 'المقر الرئيسي بالقاهرة',
        checkInStatus: 'CheckedOut',
        leaveBalances: [],
        baseSalary: 45000,
        contact: { phone: '01098765432', workEmail: 'khaled.mahmoud@bokra.com', personalEmail: 'khaled.mahmoud@gmail.com' },
        personal: { dateOfBirth: '1985-12-25', nationality: 'مصري', nationalId: '28512250100456', maritalStatus: 'متزوج', gender: 'Male', religion: 'Muslim' },
        address: '12 شارع الجزيرة، الزمالك، القاهرة',
        performanceScore: 4.9,
        satisfactionSurveyScore: 4.8,
        lastPromotionDate: '2020-02-01',
        salaryComparedToMarket: 'Above Average',
    },
    {
        id: 'emp-006',
        employeeId: 'BOK-0006',
        name: 'سارة إبراهيم',
        title: 'مديرة الموارد البشرية',
        jobTitleId: 'jt-hrm',
        role: 'HR Manager',
        isEmployee: true,
        avatarUrl: 'https://i.pravatar.cc/100?u=emp-006',
        departmentKey: 'hr',
        hireDate: '2019-11-11',
        employmentStatus: 'دوام كامل',
        managerId: 'emp-005',
        manager: 'خالد محمود',
        branchId: 'branch-cai',
        branchName: 'المقر الرئيسي بالقاهرة',
        checkInStatus: 'CheckedOut',
        leaveBalances: [],
        baseSalary: 30000,
        contact: { phone: '01123456789', workEmail: 'sara.ibrahim@bokra.com', personalEmail: 'sara.ibrahim@gmail.com' },
        personal: { dateOfBirth: '1988-08-08', nationality: 'مصرية', nationalId: '28808080100789', maritalStatus: 'متزوج', gender: 'Female', religion: 'Muslim' },
        address: '34 شارع مكرم عبيد، مدينة نصر، القاهرة',
        performanceScore: 4.7,
        satisfactionSurveyScore: 4.6,
        lastPromotionDate: '2021-11-11',
        salaryComparedToMarket: 'Average',
    },
    {
      id: 'emp-007',
      employeeId: 'BOK-0007',
      name: 'هالة مصطفى',
      title: 'أخصائية موارد بشرية',
      jobTitleId: 'jt-hrspec',
      role: 'HR Specialist',
      isEmployee: true,
      avatarUrl: 'https://i.pravatar.cc/100?u=emp-007',
      departmentKey: 'hr',
      hireDate: '2023-05-15',
      employmentStatus: 'دوام كامل',
      managerId: 'emp-006',
      manager: 'سارة إبراهيم',
      branchId: 'branch-cai',
      branchName: 'المقر الرئيسي بالقاهرة',
      checkInStatus: 'CheckedOut',
      leaveBalances: MOCK_LEAVE_BALANCES,
      baseSalary: 9500,
      contact: { phone: '01011122233', workEmail: 'hala.mostafa@bokra.com', personalEmail: 'hala.mostafa@gmail.com' },
      personal: { dateOfBirth: '1997-03-12', nationality: 'مصرية', nationalId: '29703120100123', maritalStatus: 'أعزب', gender: 'Female', religion: 'Muslim' },
      address: '45 شارع عباس العقاد، مدينة نصر، القاهرة',
      performanceScore: 4.3,
      satisfactionSurveyScore: 4.1,
      lastPromotionDate: null,
      salaryComparedToMarket: 'Average',
    },
    {
      id: 'emp-008',
      employeeId: 'BOK-0008',
      name: 'عمر شريف',
      title: 'مدير مالي',
      jobTitleId: 'jt-finman',
      role: 'Finance Manager',
      isEmployee: true,
      avatarUrl: 'https://i.pravatar.cc/100?u=emp-008',
      departmentKey: 'management',
      hireDate: '2021-02-20',
      employmentStatus: 'دوام كامل',
      managerId: 'emp-005',
      manager: 'خالد محمود',
      branchId: 'branch-cai',
      branchName: 'المقر الرئيسي بالقاهرة',
      checkInStatus: 'CheckedOut',
      leaveBalances: [],
      baseSalary: 28000,
      contact: { phone: '01233344455', workEmail: 'omar.sherif@bokra.com', personalEmail: 'omar.sherif@gmail.com' },
      personal: { dateOfBirth: '1989-10-05', nationality: 'مصري', nationalId: '28910050100789', maritalStatus: 'متزوج', gender: 'Male', religion: 'Muslim' },
      address: '67 شارع 9، المعادي، القاهرة',
      performanceScore: 4.5,
      satisfactionSurveyScore: 4.4,
      lastPromotionDate: null,
      salaryComparedToMarket: 'Average',
    },
    {
      id: 'emp-009',
      employeeId: 'BOK-0009',
      name: 'نورهان كامل',
      title: 'مسؤول فرع الإسكندرية',
      jobTitleId: 'jt-branchadmin',
      role: 'Branch Admin',
      isEmployee: true,
      avatarUrl: 'https://i.pravatar.cc/100?u=emp-009',
      departmentKey: 'management',
      hireDate: '2022-08-01',
      employmentStatus: 'دوام كامل',
      managerId: 'emp-005',
      manager: 'خالد محمود',
      branchId: 'branch-alex',
      branchName: 'فرع الإسكندرية',
      checkInStatus: 'CheckedOut',
      leaveBalances: [],
      baseSalary: 19000,
      contact: { phone: '01155566677', workEmail: 'nourhan.kamel@bokra.com', personalEmail: 'nourhan.kamel@gmail.com' },
      personal: { dateOfBirth: '1994-01-22', nationality: 'مصرية', nationalId: '29401220200123', maritalStatus: 'أعزب', gender: 'Female', religion: 'Muslim' },
      address: '22 شارع المعز، الإسكندرية',
      performanceScore: 4.6,
      satisfactionSurveyScore: 4.3,
      lastPromotionDate: null,
      salaryComparedToMarket: 'Average',
    },
    {
      id: 'emp-010',
      employeeId: 'BOK-0010',
      name: 'كريم عادل',
      title: 'مندوب مبيعات',
      jobTitleId: 'jt-salesrep',
      role: 'Employee',
      isEmployee: true,
      avatarUrl: 'https://i.pravatar.cc/100?u=emp-010',
      departmentKey: 'sales',
      hireDate: '2024-01-10',
      employmentStatus: 'دوام كامل',
      managerId: 'emp-009',
      manager: 'نورهان كامل',
      branchId: 'branch-alex',
      branchName: 'فرع الإسكندرية',
      checkInStatus: 'CheckedOut',
      leaveBalances: MOCK_LEAVE_BALANCES,
      baseSalary: 8000,
      contact: { phone: '01098765432', workEmail: 'karim.adel@bokra.com', personalEmail: 'karim.adel@gmail.com' },
      personal: { dateOfBirth: '2000-06-15', nationality: 'مصري', nationalId: '30006150200789', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' },
      address: '88 شارع البحر، الإسكندرية',
      performanceScore: 4.0,
      satisfactionSurveyScore: 4.5,
      lastPromotionDate: null,
      salaryComparedToMarket: 'Below Average',
    },
     {
        id: 'emp-011',
        employeeId: 'BOK-0011',
        name: 'يوسف جمال',
        title: 'مهندس برمجيات',
        jobTitleId: 'jt-se',
        role: 'Employee',
        isEmployee: true,
        avatarUrl: 'https://i.pravatar.cc/100?u=emp-011',
        departmentKey: 'it',
        hireDate: '2023-09-01',
        employmentStatus: 'دوام كامل',
        managerId: 'emp-003',
        manager: 'محمد عبد الله',
        branchId: 'branch-cai',
        branchName: 'المقر الرئيسي بالقاهرة',
        checkInStatus: 'CheckedOut',
        leaveBalances: MOCK_LEAVE_BALANCES,
        baseSalary: 13000,
        contact: { phone: '01287654321', workEmail: 'youssef.gamal@bokra.com', personalEmail: 'youssef.gamal@gmail.com' },
        personal: { dateOfBirth: '1999-04-18', nationality: 'مصري', nationalId: '29904180100555', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' },
        address: '5 شارع النيل، الجيزة',
        performanceScore: 4.7,
        satisfactionSurveyScore: 4.4,
        lastPromotionDate: null,
        salaryComparedToMarket: 'Average',
    },
    {
      id: 'admin-001',
      employeeId: 'ADMIN-001',
      name: 'مدير النظام الخارق',
      title: 'مسؤول النظام الخارق',
      jobTitleId: 'jt-superadmin',
      role: 'Super Admin',
      isEmployee: false,
      avatarUrl: 'https://i.pravatar.cc/100?u=admin-001',
      departmentKey: 'system',
      hireDate: '2018-01-01',
      employmentStatus: 'دوام كامل',
      branchId: 'branch-cai',
      checkInStatus: 'CheckedOut',
      leaveBalances: [],
      baseSalary: 0,
      contact: { phone: '', workEmail: 'super@bokra.com', personalEmail: '' },
      personal: { dateOfBirth: '', nationality: '', nationalId: '', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' },
      address: '',
      performanceScore: 0,
      satisfactionSurveyScore: 0,
      lastPromotionDate: null,
      salaryComparedToMarket: 'Average',
    },
    {
      id: 'admin-002',
      employeeId: 'ADMIN-002',
      name: 'مسؤول النظام',
      title: 'مسؤول منصة',
      jobTitleId: 'jt-admin',
      role: 'Admin',
      isEmployee: false,
      avatarUrl: 'https://i.pravatar.cc/100?u=admin-002',
      departmentKey: 'system',
      hireDate: '2019-01-01',
      employmentStatus: 'دوام كامل',
      managerId: 'admin-001',
      branchId: 'branch-cai',
      checkInStatus: 'CheckedOut',
      leaveBalances: [],
      baseSalary: 0,
      contact: { phone: '', workEmail: 'admin@bokra.com', personalEmail: '' },
      personal: { dateOfBirth: '', nationality: '', nationalId: '', maritalStatus: 'أعزب', gender: 'Male', religion: 'Muslim' },
      address: '',
      performanceScore: 0,
      satisfactionSurveyScore: 0,
      lastPromotionDate: null,
      salaryComparedToMarket: 'Average',
    }
];

export const MOCK_ASSETS: Asset[] = [
    { id: 'asset-1', name: 'لابتوب Dell Latitude 7420', category: 'Hardware', serialNumber: 'SN-DELL-12345', purchaseDate: '2022-01-20', purchaseValue: 25000, depreciationMethod: 'Straight-line', usefulLifeYears: 3, status: 'Assigned', assignedToId: 'emp-001', currentValue: 12000, depreciationStatus: 'Normal' },
    { id: 'asset-2', name: 'شاشة LG 27"', category: 'Hardware', serialNumber: 'SN-LG-67890', purchaseDate: '2022-01-20', purchaseValue: 6000, depreciationMethod: 'Straight-line', usefulLifeYears: 4, status: 'Assigned', assignedToId: 'emp-001', currentValue: 3500, depreciationStatus: 'Normal' },
    { id: 'asset-3', name: 'لابتوب HP ProBook 450', category: 'Hardware', serialNumber: 'SN-HP-54321', purchaseDate: '2023-09-01', purchaseValue: 18000, depreciationMethod: 'Straight-line', usefulLifeYears: 3, status: 'Assigned', assignedToId: 'emp-011', currentValue: 15000, depreciationStatus: 'Normal' },
    { id: 'asset-4', name: 'رخصة Adobe Creative Cloud', category: 'Software', serialNumber: 'N/A', purchaseDate: '2024-01-01', purchaseValue: 12000, depreciationMethod: 'Straight-line', usefulLifeYears: 1, status: 'Available', assignedToId: null, currentValue: 6000, depreciationStatus: 'NearingEOL' },
];
export const MOCK_HELP_ARTICLES: HelpArticle[] = [];
export const MOCK_HELP_CATEGORIES: HelpCategory[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', message: 'وافق <strong>محمد عبد الله</strong> على طلب الإجازة الخاص بك.', timestamp: '2025-08-20T10:00:00Z', isRead: false, senderId: 'emp-003' },
    { id: 'notif-2', message: 'تم تحديث سياسة الحضور والانصراف. يرجى مراجعتها.', timestamp: '2025-08-19T14:30:00Z', isRead: false, senderId: 'emp-006' },
    { id: 'notif-3', message: 'تم إيداع راتب شهر أغسطس في حسابك.', timestamp: '2025-08-18T11:00:00Z', isRead: true, senderId: 'admin-001' },
    { id: 'notif-4', message: 'تذكير: تقييم الأداء نصف السنوي مستحق خلال أسبوع.', timestamp: '2025-08-15T09:00:00Z', isRead: true, senderId: 'admin-001' },
];
export const MOCK_DASHBOARD_DATA: EmployeeDashboardData = {
    stats: {
        remainingAnnualLeave: 16,
        pendingRequestsCount: 2,
        overtimeHoursThisMonth: 8.5,
        overtimeTrend: [
            { name: 'Week 1', value: 2 }, { name: 'Week 2', value: 3.5 }, { name: 'Week 3', value: 1.5 }, { name: 'Week 4', value: 1.5 }
        ],
    },
    recentActivities: [
        { id: 'act-1', icon: ClockIcon, text: 'لقد قمت بتسجيل الحضور في <strong>08:55 ص</strong>', timestamp: '2025-08-20T08:55:00Z', pageKey: 'sidebar.myAttendance' },
        { id: 'act-2', icon: CheckCircleIcon, text: 'تمت الموافقة على <strong>طلب إجازة</strong>', timestamp: '2025-08-20T10:00:00Z', pageKey: 'sidebar.myRequests', details: 'إجازة سنوية من 25 إلى 28 أغسطس' },
        { id: 'act-3', icon: XCircleIcon, text: 'تم رفض <strong>طلب إذن انصراف</strong>', timestamp: '2025-08-19T16:00:00Z', pageKey: 'sidebar.myRequests', details: 'السبب: لا يمكن الموافقة على أذونات في آخر يوم عمل بالأسبوع.' },
    ],
    activeCourse: {
        id: 'course-101', title: 'أساسيات القيادة الفعالة', description: '', category: 'Leadership', durationHours: 12, isMandatory: false, type: 'Internal',
        employeeId: 'emp-001', courseId: 'course-101', status: 'In Progress', progress: 65, enrollmentDate: '2025-08-01', managerApprovalStatus: 'Approved'
    },
    latestTicket: {
        id: 'ticket-1', employeeId: 'emp-001', title: 'مشكلة في طباعة كشف الراتب', description: '', category: 'Technical Support', priority: 'Medium', status: 'In Progress', createdAt: '2025-08-18T14:00:00Z', updatedAt: '2025-08-19T11:00:00Z', messages: []
    }
};
export const MOCK_TEAM_DASHBOARD_DATA: TeamDashboardData = {
    teamSize: 2, // Ahmed El Masry and Youssef Gamal report to Mohamed Abdallah
    onLeaveToday: 0,
    pendingRequestsCount: 1,
    pendingRequests: [
        { 
            id: 'lr-002', employeeId: 'emp-011', type: 'Leave', status: 'Pending', submissionDate: '2025-08-20T11:00:00Z', approvalHistory: [],
            leaveType: 'Casual', startDate: '2025-08-22', endDate: '2025-08-22', reason: 'ظرف شخصي طارئ', duration: 1,
            employeeName: 'يوسف جمال', employeeAvatarUrl: 'https://i.pravatar.cc/100?u=emp-011'
        }
    ],
    teamAttendance: [
        { id: 'emp-001', name: 'أحمد المصري', title: 'مهندس برمجيات أول', avatarUrl: 'https://i.pravatar.cc/100?u=emp-001', attendanceStatus: 'Present' },
        { id: 'emp-011', name: 'يوسف جمال', title: 'مهندس برمجيات', avatarUrl: 'https://i.pravatar.cc/100?u=emp-011', attendanceStatus: 'Present' },
    ],
};
export const MOCK_TEAM_REPORTS_DATA: TeamReportsData = {
    keyMetrics: { avgGoalCompletion: 85, avgTeamSentiment: 4.3, pendingRequests: 3, totalOvertime: 42 },
    weeklyAttendance: [
        { day: 'الأحد', present: 10, leave: 1, absent: 1 },
        { day: 'الاثنين', present: 11, leave: 1, absent: 0 },
        { day: 'الثلاثاء', present: 12, leave: 0, absent: 0 },
        { day: 'الأربعاء', present: 11, leave: 0, absent: 1 },
        { day: 'الخميس', present: 10, leave: 2, absent: 0 },
    ],
    leaveDistribution: [
        { type: 'Annual', typeName: 'سنوية', value: 12, fill: '#0ea5e9' },
        { type: 'Sick', typeName: 'مرضية', value: 5, fill: '#10b981' },
        { type: 'Casual', typeName: 'عارضة', value: 8, fill: '#f59e0b' },
    ]
};
export const MOCK_TEAM_PERFORMANCE_DATA: ManagerPerformanceData = {
    cycle: { name: 'مراجعة منتصف العام 2025', status: 'Active' },
    cycleStats: { totalReviews: 2, reviewsCompleted: 1, avgTeamGoalProgress: 78 },
    teamPerformance: [
        { member: ALL_EMPLOYEES[0], goalProgress: 90, latestCheckIn: { id: 'mc-1', employeeId: 'emp-001', reviewerId: 'emp-003', date: '2025-08-01', month: 7, year: 2025, rating: 'Exceeds Expectations', notes: 'أداء ممتاز هذا الشهر.' }, reviewStatus: 'Completed' },
        { member: ALL_EMPLOYEES[10], goalProgress: 65, latestCheckIn: { id: 'mc-2', employeeId: 'emp-011', reviewerId: 'emp-003', date: '2025-08-01', month: 7, year: 2025, rating: 'Meets Expectations', notes: 'يحتاج إلى التركيز أكثر على تسليم المهام في الوقت المحدد.' }, reviewStatus: 'In Progress' }
    ]
};
export const MOCK_JOB_OPENINGS: JobOpening[] = [
    { id: 'job-1', title: 'مهندس برمجيات React', departmentKey: 'it', status: 'Open' },
    { id: 'job-2', title: 'مسؤول مبيعات (فرع الإسكندرية)', departmentKey: 'sales', status: 'Open' },
];
export const MOCK_CANDIDATES: Candidate[] = [
    { id: 'cand-1', name: 'علي محمد', email: 'ali.m@example.com', avatarUrl: 'https://i.pravatar.cc/100?u=cand-1', jobOpeningId: 'job-1', stage: 'Applied' },
    { id: 'cand-2', name: 'منى السيد', email: 'mona.s@example.com', avatarUrl: 'https://i.pravatar.cc/100?u=cand-2', jobOpeningId: 'job-1', stage: 'Screening' },
    { id: 'cand-3', name: 'حسن كامل', email: 'hassan.k@example.com', avatarUrl: 'https://i.pravatar.cc/100?u=cand-2', jobOpeningId: 'job-2', stage: 'Interview' },
];
export const MOCK_ONBOARDING_PROCESSES: OnboardingProcess[] = [
    { id: 'on-1', employeeId: 'emp-010', templateId: 'ot-1', startDate: '2024-01-10', tasks: [
        { id: 't-1-1', title: 'توقيع العقد واستمارة 1', category: 'paperwork', responsible: 'newEmployee', dueOffsetDays: 0, isCompleted: true, dueDate: '2024-01-10' },
        { id: 't-1-2', title: 'إنشاء حساب بريد إلكتروني', category: 'systemSetup', responsible: 'it', dueOffsetDays: 1, isCompleted: false, dueDate: '2024-01-11' }
    ] }
];
export const MOCK_OFFBOARDING_PROCESSES: OffboardingProcess[] = [];
export const MOCK_EMPLOYEE_DOCUMENTS: EmployeeDocument[] = [
    { id: 'doc-1', employeeId: 'emp-001', name: 'عقد عمل 2022', type: 'عقد عمل', uploadDate: '2022-01-15', expirationDate: '2023-01-14', fileUrl: '#' },
    { id: 'doc-2', employeeId: 'emp-001', name: 'شهادة تخرج', type: 'مسوغات تعيين', uploadDate: '2022-01-15', expirationDate: null, fileUrl: '#' },
];
export const MOCK_ALL_COURSES: Course[] = [
    { id: 'course-101', title: 'أساسيات القيادة الفعالة', description: 'دورة لتطوير المهارات القيادية للمديرين وقادة الفرق.', category: 'Leadership', durationHours: 12, isMandatory: false, type: 'Internal' },
    { id: 'course-102', title: 'مقدمة في React Hooks', description: 'تعلم كيفية استخدام React Hooks لبناء واجهات مستخدم حديثة.', category: 'Technical', durationHours: 8, isMandatory: true, type: 'Internal' },
];
export const MOCK_EMPLOYEE_COURSES: EmployeeCourse[] = [
    { employeeId: 'emp-001', courseId: 'course-101', status: 'In Progress', progress: 65, enrollmentDate: '2025-08-01', managerApprovalStatus: 'Approved' },
    { employeeId: 'emp-003', courseId: 'course-101', status: 'Completed', progress: 100, enrollmentDate: '2025-07-15', completionDate: '2025-08-10', managerApprovalStatus: 'Approved' },
];
export const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [
    { id: 'pr-1', employeeId: 'emp-001', reviewerId: 'emp-003', cycle: 'مراجعة منتصف العام 2025', status: 'Completed', reviewDate: '2025-07-20', ratings: {}, comments: {}, overallRating: 4, strengths: 'مبادرة عالية وقدرة على حل المشكلات.', areasForImprovement: 'تحسين الالتزام بالمواعيد النهائية للمشاريع.', finalComments: 'أداء جيد بشكل عام مع وجود مجال للتحسن.' }
];
export const MOCK_MONTHLY_CHECKINS: MonthlyCheckIn[] = [
    { id: 'mc-1', employeeId: 'emp-001', reviewerId: 'emp-003', date: '2025-08-01', month: 7, year: 2025, rating: 'Exceeds Expectations', notes: 'أداء ممتاز هذا الشهر، خصوصاً في مشروع X.' }
];
export const MOCK_EXTERNAL_TASKS: ExternalTask[] = [
    { id: 'et-1', employeeId: 'emp-001', managerId: 'emp-003', title: 'اجتماع مع العميل Y', description: 'مناقشة متطلبات المرحلة الثانية.', date: '2025-08-25', startTime: '10:00', endTime: '12:00', status: 'Approved' },
];
export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
    { id: 'ticket-1', employeeId: 'emp-001', assignedToId: 'emp-006', title: 'مشكلة في طباعة كشف الراتب', description: 'لا يمكنني طباعة كشف راتب شهر يوليو.', category: 'Technical Support', priority: 'Medium', status: 'In Progress', createdAt: '2025-08-18T14:00:00Z', updatedAt: '2025-08-19T11:00:00Z', messages: [
        { id: 'msg-1', authorId: 'emp-001', timestamp: '2025-08-18T14:00:00Z', content: 'مرحباً، أواجه مشكلة عند محاولة طباعة كشف راتب شهر يوليو من البوابة.'},
        { id: 'msg-2', authorId: 'emp-006', timestamp: '2025-08-19T11:00:00Z', content: 'أهلاً بك، جاري مراجعة المشكلة. هل يمكنك إرسال لقطة شاشة للخطأ الذي يظهر لك؟'},
    ]},
    { id: 'ticket-2', employeeId: 'emp-002', assignedToId: 'emp-006', title: 'استفسار عن رصيد الإجازات', description: 'أعتقد أن هناك خطأ في حساب رصيد إجازاتي السنوية.', category: 'Policy Question', priority: 'Low', status: 'New', createdAt: '2025-08-20T09:00:00Z', updatedAt: '2025-08-20T09:00:00Z', messages: [
        { id: 'msg-3', authorId: 'emp-002', timestamp: '2025-08-20T09:00:00Z', content: 'صباح الخير، أود الاستفسار عن رصيد إجازاتي حيث يبدو أنه لم يتم تحديثه بعد آخر إجازة أخذتها.'},
    ]}
];
export const MOCK_SALARY_COMPONENTS: SalaryComponent[] = [
    { id: 'sc-1', name: 'بدل مواصلات', type: 'Allowance', calculationType: 'FixedAmount', value: 500 },
    { id: 'sc-2', name: 'بدل وجبة', type: 'Allowance', calculationType: 'FixedAmount', value: 300 },
    { id: 'sc-3', name: 'تأمينات اجتماعية', type: 'Deduction', calculationType: 'PercentageOfBase', value: 14 },
    { id: 'sc-4', name: 'ضريبة كسب عمل', type: 'Deduction', calculationType: 'PercentageOfBase', value: 10 },
];
export const MOCK_COMPENSATION_PACKAGES: CompensationPackage[] = [
    { id: 'cp-1', name: 'الحزمة القياسية للموظفين', components: [
        { componentId: 'sc-1', value: 500 },
        { componentId: 'sc-2', value: 300 },
        { componentId: 'sc-3', value: 14 },
        { componentId: 'sc-4', value: 10 },
    ]},
    { id: 'cp-2', name: 'حزمة قادة الفرق', components: [
        { componentId: 'sc-1', value: 800 },
        { componentId: 'sc-2', value: 500 },
        { componentId: 'sc-3', value: 14 },
        { componentId: 'sc-4', value: 15 },
    ]},
];
export const MAIN_MODULES_CONFIG: any[] = [
    { key: 'employees', nameKey: 'modules.main.employees.name', descriptionKey: 'modules.main.employees.description' },
    { key: 'attendance', nameKey: 'modules.main.attendance.name', descriptionKey: 'modules.main.attendance.description' },
    { key: 'leave', nameKey: 'modules.main.leave.name', descriptionKey: 'modules.main.leave.description' },
    { key: 'job_titles', nameKey: 'modules.main.job_titles.name', descriptionKey: 'modules.main.job_titles.description' },
];
export const OPTIONAL_MODULES_CONFIG: any[] = [
    { key: 'payroll', nameKey: 'modules.optional.payroll.name', descriptionKey: 'modules.optional.payroll.description' },
    { key: 'documents', nameKey: 'modules.optional.documents.name', descriptionKey: 'modules.optional.documents.description' },
    { key: 'recruitment', nameKey: 'modules.optional.recruitment.name', descriptionKey: 'modules.optional.recruitment.description' },
    { key: 'performance', nameKey: 'modules.optional.performance.name', descriptionKey: 'modules.optional.performance.description' },
    { key: 'learning', nameKey: 'modules.optional.learning.name', descriptionKey: 'modules.optional.learning.description' },
    { key: 'onboarding/offboarding', nameKey: 'modules.optional.onboardingOffboarding.name', descriptionKey: 'modules.optional.onboardingOffboarding.description' },
    { key: 'assets', nameKey: 'modules.optional.assets.name', descriptionKey: 'modules.optional.assets.description' },
    { key: 'support', nameKey: 'modules.optional.support.name', descriptionKey: 'modules.optional.support.description' },
    { key: 'help_center', nameKey: 'modules.optional.help_center.name', descriptionKey: 'modules.optional.help_center.description' },
];
export const ONBOARDING_TASK_CATEGORIES: OnboardingTaskCategory[] = ['paperwork', 'systemSetup', 'companyIntro', 'firstWeekTasks'];
export const ONBOARDING_RESPONSIBLE_PARTIES: OnboardingResponsible[] = ['newEmployee', 'directManager', 'hr', 'it'];
export const OFFBOARDING_TASK_CATEGORIES: OffboardingTaskCategory[] = ['assetHandover', 'adminProcedures', 'knowledgeTransfer', 'finalExit'];
export const OFFBOARDING_RESPONSIBLE_PARTIES: OffboardingResponsible[] = ['departingEmployee', 'directManager', 'hr', 'it', 'finance'];
export const MOCK_GOALS: Goal[] = [
    { id: 'g1', employeeId: 'emp-001', title: 'إطلاق النسخة 2.0 من لوحة التحكم', description: 'تطوير وإطلاق النسخة الجديدة من لوحة تحكم المستخدمين.', type: 'Objective', status: 'On Track', progress: 75, dueDate: '2025-09-30', parentId: null },
    { id: 'g2', employeeId: 'emp-001', title: 'إكمال وحدة عرض البيانات الجديدة', description: '', type: 'Key Result', status: 'Completed', progress: 100, dueDate: '2025-08-30', parentId: 'g1' },
    { id: 'g3', employeeId: 'emp-001', title: 'تقليل وقت تحميل الصفحة بنسبة 20%', description: '', type: 'Key Result', status: 'On Track', progress: 60, dueDate: '2025-09-15', parentId: 'g1' },
    { id: 'g4', employeeId: 'emp-011', title: 'إصلاح 10 أخطاء برمجية حرجة', description: 'إصلاح الأخطاء ذات الأولوية العالية في النظام.', type: 'Objective', status: 'At Risk', progress: 50, dueDate: '2025-09-10', parentId: null },
];

export const MOCK_WORK_LOCATIONS: WorkLocation[] = [
    { id: 'loc-1', name: 'المقر الرئيسي بالقاهرة', latitude: 30.0444, longitude: 31.2357, radiusMeters: 200 },
    { id: 'loc-2', name: 'فرع الإسكندرية', latitude: 31.2001, longitude: 29.9187, radiusMeters: 200 },
];
export const MOCK_ATTENDANCE_POLICIES: AttendancePolicy[] = [
    { id: 'att-p-1', name: 'سياسة الحضور القياسية', scope: 'company', status: 'Active', gracePeriodInMinutes: 15, latenessTiers: [{id: 't1', fromMinutes: 16, toMinutes: 60, penaltyHours: 1}], absenceRules: [], earlyLeaveTiers: [], maxPermitsPerMonth: 4, minPermitDurationMinutes: 30, maxPermitDurationHours: 3, breakDurationHours: 1, workLocationIds: ['loc-1', 'loc-2'] },
];
export const MOCK_LEAVE_POLICIES: LeavePolicy[] = [
    { id: 'leave-p-1', name: 'سياسة الإجازات القياسية', scope: 'company', status: 'Active', newEmployeeBalance: 15, newEmployeeEligibilityMonths: 6, annualLeaveTiers: [{id:'at1', afterYears: 1, days: 21}, {id:'at2', afterYears: 10, days: 30}], specialAnnualLeave: { over50YearsOld: 30, specialNeeds: 45 }, maternityLeaveMonths: 4, casualLeaveBalance: 7 },
];
export const MOCK_OVERTIME_POLICIES: OvertimePolicy[] = [
    { id: 'ot-p-1', name: 'سياسة الوقت الإضافي للمطورين', scope: 'company', status: 'Active', allowOvertime: true, minOvertimeInMinutes: 30, overtimeRateNormal: 1.5, overtimeRateHoliday: 2 },
];
export const MOCK_ONBOARDING_TEMPLATES: OnboardingTemplate[] = [
    { id: 'ot-1', name: 'قالب التعيين القياسي', description: 'يستخدم لجميع الموظفين الجدد.', tasks: [{ title: 'توقيع العقد', category: 'paperwork', responsible: 'newEmployee', dueOffsetDays: 0 }] },
];
export const MOCK_OFFBOARDING_TEMPLATES: OffboardingTemplate[] = [
     { id: 'off-t-1', name: 'قالب إنهاء الخدمة القياسي', description: 'يستخدم لجميع الموظفين المغادرين.', tasks: [{ title: 'تسليم اللابتوب', category: 'assetHandover', responsible: 'departingEmployee', dueOffsetDays: 1 }] },
];
export const MOCK_APPROVAL_WORKFLOWS: ApprovalWorkflow[] = [
    { id: 'aw-1', name: 'موافقة الإجازة القياسية', requestType: 'Leave', steps: [{id: 's1', approverRole: 'Direct Manager', order: 1}, {id: 's2', approverRole: 'HR Manager', order: 2}]},
];