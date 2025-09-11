import {
  HomeIcon, CalendarIcon, DocumentTextIcon, UserCircleIcon, CogIcon, ArrowLeftOnRectangleIcon, BriefcaseIcon, UserGroupIcon, PresentationChartLineIcon, ShieldCheckIcon, UsersIcon, BuildingOfficeIcon, ShieldExclamationIcon, SitemapIcon, DocumentDuplicateIcon, BanknotesIcon, StarIcon, CheckBadgeIcon, QuestionMarkCircleIcon, LifebuoyIcon, BookOpenIcon, ClipboardDocumentListIcon, DocumentCheckIcon, ComputerDesktopIcon, ChartPieIcon
} from './components/icons/Icons';
import type { NavGroup, NavItem, EmployeeProfile, Branch, JobTitle, LeaveBalance, AttendanceRecord, Payslip, Stat, RecentActivityItem, TeamMember, PendingRequest, HRRequest, Notification, TeamReportsData, TeamWeeklyAttendanceItem, LeaveDistributionDataItem, ManagerPerformanceData, TeamMemberPerformanceData, JobOpening, Candidate, OnboardingProcess, OnboardingTemplate, OffboardingProcess, OffboardingTemplate, EmployeeDocument, Asset, Course, EmployeeCourse, PerformanceReview, MonthlyCheckIn, ExternalTask, SupportTicket, SalaryComponent, CompensationPackage, WorkLocation, HelpCategory, HelpArticle, ApprovalWorkflow, OnboardingTaskCategory, OnboardingResponsible, OffboardingTaskCategory, OffboardingResponsible } from './types';

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
      { nameKey: 'sidebar.contracts', path: '/contracts', icon: DocumentCheckIcon, roles: ['HR Specialist', 'HR Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.documentManagement', path: '/document-management', icon: DocumentDuplicateIcon, module: 'documents', roles: ['HR Specialist', 'HR Manager', 'Admin', 'Super Admin'] },
      { nameKey: 'sidebar.assetsManagement', path: '/assets-management', icon: ComputerDesktopIcon, module: 'assets', roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.attendancePolicies', path: '/policies/attendance', icon: ShieldCheckIcon, roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.overtimePolicies', path: '/policies/overtime', icon: ShieldCheckIcon, roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.leavePolicies', path: '/policies/leave', icon: ShieldCheckIcon, roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.onboardingTemplates', path: '/templates/onboarding', icon: DocumentTextIcon, module: 'onboarding', roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.offboardingTemplates', path: '/templates/offboarding', icon: DocumentTextIcon, module: 'offboarding', roles: ['Admin', 'Super Admin'] },
      { nameKey: 'sidebar.moduleManagement', path: '/module-management', icon: CogIcon, roles: ['Super Admin'] },
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
        personal: { dateOfBirth: '1998-11-10', nationality: 'مصرية', nationalId: '29811100200456', maritalStatus: 'متزوجة', gender: 'Female', religion: 'Muslim' },
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
        personal: { dateOfBirth: '1988-08-08', nationality: 'مصرية', nationalId: '28808080100789', maritalStatus: 'متزوجة', gender: 'Female', religion: 'Muslim' },
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
      personal: { dateOfBirth: '', nationality: '', nationalId: '', maritalStatus: '', gender: '', religion: '' },
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
      personal: { dateOfBirth: '', nationality: '', nationalId: '', maritalStatus: '', gender: '', religion: '' },
      address: '',
      performanceScore: 0,
      satisfactionSurveyScore: 0,
      lastPromotionDate: null,
      salaryComparedToMarket: 'Average',
    }
];

export const timeSince = (dateString: string, t: (key: string, replacements?: { [key: string]: string | number }) => string): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return t('time.yearsAgo', { count: Math.floor(interval) });
  interval = seconds / 2592000;
  if (interval > 1) return t('time.monthsAgo', { count: Math.floor(interval) });
  interval = seconds / 86400;
  if (interval > 1) return t('time.daysAgo', { count: Math.floor(interval) });
  interval = seconds / 3600;
  if (interval > 1) return t('time.hoursAgo', { count: Math.floor(interval) });
  interval = seconds / 60;
  if (interval > 1) return t('time.minutesAgo', { count: Math.floor(interval) });
  return t('time.now', {});
};

export const MOCK_ASSETS: Asset[] = [];
export const MOCK_HELP_ARTICLES: HelpArticle[] = [];
export const MOCK_HELP_CATEGORIES: HelpCategory[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];
export const MOCK_DASHBOARD_DATA = { stats: null, recentActivities: [], activeCourse: null, latestTicket: null };
export const MOCK_TEAM_DASHBOARD_DATA = { teamSize: 0, onLeaveToday: 0, pendingRequestsCount: 0, pendingRequests: [], teamAttendance: [] };
export const MOCK_TEAM_REPORTS_DATA = { keyMetrics: { avgGoalCompletion: 0, avgTeamSentiment: 0, pendingRequests: 0, totalOvertime: 0 }, weeklyAttendance: [], leaveDistribution: [] };
export const MOCK_TEAM_PERFORMANCE_DATA: ManagerPerformanceData = { cycle: { name: '', status: 'Active' }, cycleStats: { totalReviews: 0, reviewsCompleted: 0, avgTeamGoalProgress: 0 }, teamPerformance: [] };
export const MOCK_JOB_OPENINGS: JobOpening[] = [];
export const MOCK_CANDIDATES: Candidate[] = [];
export const MOCK_ONBOARDING_PROCESSES: OnboardingProcess[] = [];
export const MOCK_OFFBOARDING_PROCESSES: OffboardingProcess[] = [];
export const MOCK_EMPLOYEE_DOCUMENTS: EmployeeDocument[] = [];
export const MOCK_ALL_COURSES: Course[] = [];
export const MOCK_EMPLOYEE_COURSES: EmployeeCourse[] = [];
export const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [];
export const MOCK_MONTHLY_CHECKINS: MonthlyCheckIn[] = [];
export const MOCK_EXTERNAL_TASKS: ExternalTask[] = [];
export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [];
export const MOCK_SALARY_COMPONENTS: SalaryComponent[] = [];
export const MOCK_COMPENSATION_PACKAGES: CompensationPackage[] = [];
export const MAIN_MODULES_CONFIG: any[] = [];
export const OPTIONAL_MODULES_CONFIG: any[] = [];
export const ONBOARDING_TASK_CATEGORIES: OnboardingTaskCategory[] = ['الأوراق والمستندات', 'إعدادات النظام والحسابات', 'التعريف بالشركة والفريق', 'مهام أول أسبوع'];
export const ONBOARDING_RESPONSIBLE_PARTIES: OnboardingResponsible[] = ['الموظف الجديد', 'المدير المباشر', 'الموارد البشرية', 'تكنولوجيا المعلومات'];
export const OFFBOARDING_TASK_CATEGORIES: OffboardingTaskCategory[] = ['تسليم العهدة', 'إجراءات إدارية', 'نقل المعرفة', 'إجراءات الخروج النهائية'];
export const OFFBOARDING_RESPONSIBLE_PARTIES: OffboardingResponsible[] = ['الموظف المغادر', 'المدير المباشر', 'الموارد البشرية', 'تكنولوجيا المعلومات', 'المالية'];