import React, { ReactNode } from 'react';

// General & App Structure
export type UserRole = 'Super Admin' | 'Admin' | 'Branch Admin' | 'General Manager' | 'HR Manager' | 'HR Specialist' | 'Finance Manager' | 'Team Lead' | 'Employee';
export type EmploymentStatus = 'دوام كامل' | 'دوام جزئي' | 'متدرب' | 'Inactive';
export type CheckInStatus = 'CheckedIn' | 'CheckedOut';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type RequestType = 'Leave' | 'DataUpdate' | 'AttendanceAdjustment' | 'LeavePermit' | 'PettyCash';
export type Language = 'ar' | 'en';
export type AppModule = 'payroll' | 'documents' | 'recruitment' | 'performance' | 'learning' | 'onboarding' | 'offboarding' | 'assets' | 'support' | 'help_center';

export interface BilingualText {
    ar: string;
    en: string;
}

export interface NavItem {
    nameKey: string;
    path: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    module?: AppModule;
    roles?: UserRole[];
    requiresEmployee?: boolean;
}

export interface NavGroup {
    groupNameKey: string;
    items: NavItem[];
}

export interface Branch {
    id: string;
    nameKey: string;
    status: 'Active' | 'Archived';
}

export interface JobTitle {
    id: string;
    nameKey: string;
    parentId: string | null;
}

// Employee & User
export interface EmployeeProfile {
    id: string;
    employeeId: string;
    name: string;
    title: string;
    jobTitleId: string;
    role: UserRole;
    isEmployee: boolean;
    avatarUrl: string;
    departmentKey: string;
    hireDate: string;
    deactivationDate?: string;
    employmentStatus: EmploymentStatus;
    managerId?: string;
    manager?: string;
    branchId: string;
    branchName?: string;
    checkInStatus: CheckInStatus;
    contact: {
        phone: string;
        workEmail: string;
        personalEmail: string;
    };
    personal: {
        dateOfBirth: string;
        nationality: string;
        nationalId: string;
        maritalStatus: string;
        gender: string;
        religion: string;
    };
    address: string;
    leaveBalances: LeaveBalance[];
    baseSalary: number;
    attendancePolicyId?: string;
    attendancePolicyName?: string;
    overtimePolicyId?: string;
    overtimePolicyName?: string;
    leavePolicyId?: string;
    leavePolicyName?: string;
    compensationPackageId?: string;
    performanceScore: number;
    satisfactionSurveyScore: number;
    lastPromotionDate: string | null;
    salaryComparedToMarket: 'Below Average' | 'Average' | 'Above Average';
    attendanceRecords?: AttendanceRecord[];
    payslips?: Payslip[];
}

export interface NewUserPayload {
    name: string;
    jobTitleId: string;
    departmentKey: string;
    hireDate: string;
    branchId: string;
    role: UserRole;
    managerId: string;
    baseSalary: number;
    attendancePolicyId: string;
    overtimePolicyId: string;
    leavePolicyId: string;
    compensationPackageId: string;
    workEmail: string;
    phone: string;
    personalEmail: string;
    dateOfBirth: string;
    nationality: string;
    nationalId: string;
    maritalStatus: 'أعزب' | 'متزوج';
    gender: 'Male' | 'Female';
    religion: 'Muslim' | 'Christian';
    address: string;
}


// Dashboard & Widgets
export interface Stat {
    title: string;
    value: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
    chartData?: { name: string; value: number }[];
    chartColor?: string;
}

export interface RecentActivityItem {
    id: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
    timestamp: string;
    pageKey: string;
    details?: string;
}

export interface EmployeeDashboardData {
    stats: {
        remainingAnnualLeave: number;
        pendingRequestsCount: number;
        overtimeHoursThisMonth: number;
        overtimeTrend: { name: string, value: number }[];
    } | null;
    recentActivities: RecentActivityItem[];
    activeCourse: (Course & EmployeeCourse) | null;
    latestTicket: SupportTicket | null;
}

export interface TeamDashboardData {
    teamSize: number;
    onLeaveToday: number;
    pendingRequestsCount: number;
    pendingRequests: PendingRequest[];
    teamAttendance: TeamMember[];
}

export interface AttentionItem {
    id: string;
    type: 'request' | 'approval';
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
    timestamp: string;
    employeeName: string;
    employeeAvatarUrl: string;
    pageKey: string;
    relatedId: string;
}

// Attendance & Leave
export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Holiday' | 'Weekend';
export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Unpaid' | 'NewbornRegistration' | 'Exam';

export interface LeaveBalance {
    type: LeaveType;
    typeName: string;
    balance: number;
    used: number;
}

export interface AttendanceRecord {
    date: string;
    day: string;
    status: AttendanceStatus;
    firstCheckIn?: string;
    lastCheckOut?: string;
    workedHours?: number;
    overtime?: number;
    employeeId: string;
}

export interface EmployeeInfraction {
    date: string;
    details: string;
    penaltyApplied: boolean;
    penaltyDetails?: string;
}

// Policies
export interface LatenessTier {
    id: string;
    fromMinutes: number;
    toMinutes: number;
    penaltyHours: number;
}

export interface EarlyLeaveTier {
    id: string;
    fromMinutes: number;
    toMinutes: number;
    penaltyHours: number;
}


export interface AttendancePolicy {
    id: string;
    name: string;
    scope: 'company' | 'branch';
    branchId?: string;
    status: 'Active' | 'Archived' | 'PendingApproval' | 'Rejected';
    gracePeriodInMinutes: number;
    latenessTiers: LatenessTier[];
    absenceRules: any[]; // Define further if needed
    earlyLeaveTiers: EarlyLeaveTier[];
    maxPermitsPerMonth: number;
    minPermitDurationMinutes: number;
    maxPermitDurationHours: number;
    breakDurationHours: number;
    workLocationIds: string[];
}

export interface OvertimePolicy {
    id: string;
    name: string;
    scope: 'company' | 'branch';
    branchId?: string;
    status: 'Active' | 'Archived' | 'PendingApproval' | 'Rejected';
    allowOvertime: boolean;
    minOvertimeInMinutes: number;
    overtimeRateNormal: number;
    overtimeRateHoliday: number;
}

export interface AnnualLeaveTier {
    id: string;
    afterYears: number;
    days: number;
}

export interface LeavePolicy {
    id: string;
    name: string;
    scope: 'company' | 'branch';
    branchId?: string;
    status: 'Active' | 'Archived' | 'PendingApproval' | 'Rejected';
    newEmployeeBalance: number;
    newEmployeeEligibilityMonths: number;
    annualLeaveTiers: AnnualLeaveTier[];
    specialAnnualLeave: {
        over50YearsOld: number;
        specialNeeds: number;
    };
    maternityLeaveMonths: number;
    casualLeaveBalance: number;
}

// Requests
export interface ApprovalHistoryEntry {
    approverId: string;
    approverName: string;
    status: 'Approved' | 'Rejected';
    timestamp: string;
    notes?: string;
}

export interface BaseRequest {
    id: string;
    employeeId: string;
    type: RequestType;
    status: RequestStatus;
    submissionDate: string;
    approvalHistory: ApprovalHistoryEntry[];
}

export interface LeaveRequest extends BaseRequest {
    type: 'Leave';
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    duration: number;
    attachmentUrl?: string;
}

export type AttendanceAdjustmentType = 'LateArrival' | 'EarlyDeparture';
export interface AttendanceAdjustmentRequest extends BaseRequest {
    type: 'AttendanceAdjustment';
    adjustmentType: AttendanceAdjustmentType;
    date: string;
    time: string;
    reason: string;
}

export interface LeavePermitRequest extends BaseRequest {
    type: 'LeavePermit';
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
    durationHours: number;
}

export type PettyCashCategory = 'Transportation' | 'OfficeSupplies' | 'ClientMeeting' | 'Other';
export interface PettyCashRequest extends BaseRequest {
    type: 'PettyCash';
    date: string;
    category: PettyCashCategory;
    amount: number;
    description: string;
    attachmentUrl?: string;
}

export interface DataUpdateRequest extends BaseRequest {
    type: 'DataUpdate';
    details: string;
    requestedChanges: Partial<EmployeeProfile>;
}

export type HRRequest = LeaveRequest | AttendanceAdjustmentRequest | LeavePermitRequest | DataUpdateRequest | PettyCashRequest;

export type PendingRequest = HRRequest & {
    employeeName: string;
    employeeAvatarUrl: string;
};


// Payroll & Finance
export interface PayslipItem {
    description: string;
    amount: number;
}

export interface Payslip {
    id: string;
    employeeId: string;
    month: string;
    year: number;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    earnings: PayslipItem[];
    deductions: PayslipItem[];
}

export type SalaryComponentType = 'Allowance' | 'Deduction';
export type CalculationType = 'FixedAmount' | 'PercentageOfBase';
export interface SalaryComponent {
    id: string;
    name: string;
    type: SalaryComponentType;
    calculationType: CalculationType;
    value: number;
}

export interface CompensationPackage {
    id: string;
    name: string;
    components: {
        componentId: string;
        value: number;
    }[];
}


// Team & Manager
export interface TeamMember {
    id: string;
    name: string;
    title: string;
    avatarUrl: string;
    attendanceStatus: 'Present' | 'Absent' | 'Leave';
}

export interface TeamMemberDetails {
    profile: EmployeeProfile;
    stats: {
        usedPermissionHours: number;
        usedAnnualLeavesDays: number;
        usedRemoteDays: number;
        emergencyDays: number;
    };
    reviews: PerformanceReview[];
    goals: Goal[];
    pettyCashRequests: PettyCashRequest[];
    documents: EmployeeDocument[];
    assets: Asset[];
}

export interface TeamReportsData {
    keyMetrics: {
        avgGoalCompletion: number;
        avgTeamSentiment: number;
        pendingRequests: number;
        totalOvertime: number;
    };
    weeklyAttendance: TeamWeeklyAttendanceItem[];
    leaveDistribution: LeaveDistributionDataItem[];
}

export interface TeamWeeklyAttendanceItem {
    day: string;
    present: number;
    leave: number;
    absent: number;
}

export interface LeaveDistributionDataItem {
    type: LeaveType;
    typeName: string;
    value: number;
    fill: string;
}

// Performance & Goals
export type GoalStatus = 'On Track' | 'At Risk' | 'Off Track' | 'Completed' | 'Draft';
export type GoalType = 'Objective' | 'Key Result';

export interface Goal {
    id: string;
    title: string;
    description: string;
    type: GoalType;
    status: GoalStatus;
    progress: number;
    dueDate: string;
    parentId: string | null;
}

export type ReviewStatus = 'Draft' | 'In Progress' | 'Completed';
export type MonthlyCheckInRating = 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement';

export interface MonthlyCheckIn {
    id: string;
    employeeId: string;
    reviewerId: string;
    date: string;
    month: number;
    year: number;
    rating: MonthlyCheckInRating;
    notes: string;
}

export interface PerformanceReview {
    id: string;
    employeeId: string;
    reviewerId: string;
    cycle: string;
    status: ReviewStatus;
    reviewDate: string;
    ratings: Record<string, number>;
    comments: Record<string, string>;
    overallRating: number;
    strengths: string;
    areasForImprovement: string;
    finalComments: string;
}

export interface TeamMemberPerformanceData {
    member: EmployeeProfile;
    goalProgress: number;
    latestCheckIn: MonthlyCheckIn | null;
    reviewStatus: 'Completed' | 'In Progress' | 'Not Started';
}

export interface ManagerPerformanceData {
    cycle: { name: string; status: 'Active' | 'Upcoming' | 'Closed' };
    cycleStats: {
        totalReviews: number;
        reviewsCompleted: number;
        avgTeamGoalProgress: number;
    };
    teamPerformance: TeamMemberPerformanceData[];
}

// Learning & Development
export type CourseCategory = 'Technical' | 'Soft Skills' | 'Compliance' | 'Leadership';
export type CourseStatus = 'Not Started' | 'In Progress' | 'Completed';
export type ManagerApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'NotSubmitted';
export type ExternalCourseVenue = 'Online' | 'On-site' | 'Training Center';
export type CourseType = 'Internal' | 'External';

export interface Course {
    id: string;
    title: string;
    description: string;
    category: CourseCategory;
    durationHours: number;
    isMandatory: boolean;
    type: CourseType;
    learningObjectives?: string[];
    // Internal
    modules?: { title: string; topics: string[] }[];
    // External
    provider?: string;
    url?: string;
    venue?: ExternalCourseVenue;
    locationDetails?: string;
}

export interface EmployeeCourse {
    employeeId: string;
    courseId: string;
    status: CourseStatus;
    progress: number;
    enrollmentDate: string;
    completionDate?: string;
    managerApprovalStatus: ManagerApprovalStatus;
    notes?: string;
    certificateUrl?: string;
}

export interface CourseOutline {
    description: string;
    learningObjectives: string[];
    modules: {
        title: string;
        topics: string[];
    }[];
}

// Recruitment
export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
export interface JobOpening {
    id: string;
    title: string;
    departmentKey: string;
    status: 'Open' | 'Closed';
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    jobOpeningId: string;
    stage: CandidateStage;
}

// Onboarding & Offboarding
export type OnboardingTaskCategory = 'الأوراق والمستندات' | 'إعدادات النظام والحسابات' | 'التعريف بالشركة والفريق' | 'مهام أول أسبوع';
export type OnboardingResponsible = 'الموظف الجديد' | 'المدير المباشر' | 'الموارد البشرية' | 'تكنولوجيا المعلومات';

export interface OnboardingTask {
    id?: string;
    title: string;
    category: OnboardingTaskCategory;
    responsible: OnboardingResponsible;
    dueOffsetDays: number;
    dueDate?: string;
    isCompleted?: boolean;
}

export interface OnboardingTemplate {
    id: string;
    name: string;
    description: string;
    tasks: Omit<OnboardingTask, 'id' | 'isCompleted' | 'dueDate'>[];
}

export interface OnboardingProcess {
    id: string;
    employeeId: string;
    templateId: string;
    startDate: string;
    tasks: (Omit<OnboardingTask, 'id'> & { id: string; isCompleted: boolean; dueDate: string; })[];
}

export type OffboardingTaskCategory = 'تسليم العهدة' | 'إجراءات إدارية' | 'نقل المعرفة' | 'إجراءات الخروج النهائية';
export type OffboardingResponsible = 'الموظف المغادر' | 'المدير المباشر' | 'الموارد البشرية' | 'تكنولوجيا المعلومات' | 'المالية';

export interface OffboardingTask {
    id?: string;
    title: string;
    category: OffboardingTaskCategory;
    responsible: OffboardingResponsible;
    dueOffsetDays: number; // days before last day
    dueDate?: string;
    isCompleted?: boolean;
}

export interface OffboardingTemplate {
    id: string;
    name: string;
    description: string;
    tasks: Omit<OffboardingTask, 'id' | 'isCompleted' | 'dueDate'>[];
}

export interface OffboardingProcess {
    id: string;
    employeeId: string;
    templateId: string;
    lastDay: string;
    tasks: (Omit<OffboardingTask, 'id'> & { id: string; isCompleted: boolean; dueDate: string; })[];
}


// Misc
export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    senderId: string; // 'system' or employeeId
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface TurnoverAnalysisResult {
    riskLevel: TurnoverRiskLevel;
    riskScore: number;
    keyFactors: string[];
}
export type TurnoverRiskLevel = 'Low' | 'Medium' | 'High' | 'Unknown';

export interface Skill {
    name: string;
    currentLevel: number;
    requiredLevel: number;
}

export type DocumentType = 'عقد عمل' | 'مسوغات تعيين' | 'استمارة ١ (تأمينات)' | 'استمارة ٢ (تأمينات)' | 'استمارة ٦ (تأمينات)' | 'شهادات تدريب';
export interface EmployeeDocument {
    id: string;
    employeeId: string;
    name: string;
    type: DocumentType;
    uploadDate: string;
    expirationDate: string | null;
    fileUrl?: string;
}

export type AssetCategory = 'Hardware' | 'Software' | 'Furniture' | 'Vehicle';
export type DepreciationMethod = 'Straight-line' | 'Declining Balance';
export type AssetStatus = 'Available' | 'Assigned' | 'In-Repair' | 'Retired';

export interface Asset {
    id: string;
    name: string;
    category: AssetCategory;
    serialNumber: string;
    purchaseDate: string;
    purchaseValue: number;
    depreciationMethod: DepreciationMethod;
    usefulLifeYears: number;
    status: AssetStatus;
    assignedToId: string | null;
    currentValue?: number;
    depreciationStatus?: 'Normal' | 'NearingEOL' | 'Depreciated';
}

export interface AttendanceEvent {
    id: string;
    employeeId: string;
    timestamp: string;
    type: 'CheckIn' | 'CheckOut';
    isWithinGeofence: boolean;
    coords?: { latitude: number; longitude: number };
    taskId?: string;
}

export interface ExternalTask {
    id: string;
    employeeId: string;
    managerId: string;
    requestedById?: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'PendingApproval' | 'Approved' | 'Rejected' | 'InProgress' | 'Completed' | 'Cancelled';
    checkInTimestamp?: string;
    checkOutTimestamp?: string;
}

export type TicketCategory = 'Payroll' | 'Leave Balance' | 'Technical Support' | 'Policy Question' | 'Other';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';

export interface SupportTicketMessage {
    id: string;
    authorId: string;
    timestamp: string;
    content: string;
}

export interface SupportTicket {
    id: string;
    employeeId: string;
    assignedToId?: string;
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string;
    updatedAt: string;
    messages: SupportTicketMessage[];
}

export interface OrgTreeNode extends EmployeeProfile {
    children: OrgTreeNode[];
}

export interface WorkLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
}

export interface HelpCategory {
    id: string;
    name: BilingualText;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface HelpArticle {
    id: string;
    categoryId: string;
    title: BilingualText;
    content: BilingualText;
    keywords: string[];
}

export type ApproverRole = 'Direct Manager' | 'Branch Admin' | 'HR Manager' | 'General Manager';
export interface ApprovalStep {
    id: string;
    approverRole: ApproverRole;
    order: number;
}
export interface ApprovalWorkflow {
    id: string;
    name: string;
    requestType: RequestType;
    steps: ApprovalStep[];
}


// Context Provider Props
export interface AssetsProviderProps {
  children: ReactNode;
}
export interface AssetsContextType {
  assets: Asset[];
  saveAsset: (asset: Asset) => void;
  assignAsset: (assetId: string, employeeId: string | null) => void;
}

export interface CompanyStructureProviderProps {
    children: ReactNode;
}
export interface CompanyStructureContextType {
    branches: Branch[];
    jobTitles: JobTitle[];
    addBranch: (name: string) => Branch;
    updateBranch: (id: string, name: string) => void;
    archiveBranch: (id: string) => void;
    saveJobTitle: (jobTitle: JobTitle) => void;
    deleteJobTitle: (jobTitleId: string) => void;
}

export interface UserProviderProps {
    children: ReactNode;
}
export interface UserContextType {
    employees: EmployeeProfile[];
    updateUserRole: (userId: string, newRole: UserRole) => void;
    deactivateUser: (userId: string) => void;
    bulkDeactivateUsers: (userIds: string[]) => void;
    reactivateUser: (userId: string) => void;
    bulkAssignAttendancePolicy: (policyId: string, employeeIds: string[]) => void;
    bulkAssignOvertimePolicy: (policyId: string, employeeIds: string[]) => void;
    bulkAssignLeavePolicy: (policyId: string, employeeIds: string[]) => void;
    updateProfile: (updatedProfile: EmployeeProfile) => void;
    addNewUser: (newUser: NewUserPayload) => void;
    updateUser: (userId: string, updatedData: NewUserPayload) => void;
    updateBranchManager: (branchId: string, newManagerId: string) => void;
    updateEmployeeManager: (employeeId: string, newManagerId: string) => void;
}

export interface TeamLearningStat {
    name: string;
    progress: number;
}

export interface HelpCenterContextType {
    articles: HelpArticle[];
    categories: HelpCategory[];
    addArticle: (articleData: Omit<HelpArticle, 'id'>) => void;
    updateArticle: (updatedArticle: HelpArticle) => void;
    deleteArticle: (articleId: string) => void;
    addCategory: (categoryData: Omit<HelpCategory, 'id' | 'icon'> & { name: BilingualText }) => void;
    updateCategory: (updatedCategory: Omit<HelpCategory, 'icon'>) => void;
    deleteCategory: (categoryId: string) => void;
}

export interface PoliciesContextType {
    attendancePolicies: AttendancePolicy[];
    leavePolicies: LeavePolicy[];
    overtimePolicies: OvertimePolicy[];
    onboardingTemplates: OnboardingTemplate[];
    offboardingTemplates: OffboardingTemplate[];
    workLocations: WorkLocation[];
    salaryComponents: SalaryComponent[];
    compensationPackages: CompensationPackage[];
    approvalWorkflows: ApprovalWorkflow[];
    saveAttendancePolicy: (policy: AttendancePolicy) => void;
    saveLeavePolicy: (policy: LeavePolicy) => void;
    saveOvertimePolicy: (policy: OvertimePolicy) => void;
    saveOnboardingTemplate: (template: OnboardingTemplate) => void;
    deleteOnboardingTemplate: (templateId: string) => void;
    saveOffboardingTemplate: (template: OffboardingTemplate) => void;
    deleteOffboardingTemplate: (templateId: string) => void;
    addWorkLocation: (location: Omit<WorkLocation, 'id'>) => void;
    updateWorkLocation: (location: WorkLocation) => void;
    saveSalaryComponent: (component: SalaryComponent) => void;
    saveCompensationPackage: (pkg: CompensationPackage) => void;
    saveApprovalWorkflow: (workflow: ApprovalWorkflow) => void;
    deleteApprovalWorkflow: (workflowId: string) => void;
}

export interface RequestProviderProps {
    children: ReactNode;
}
export interface RequestContextType {
    leaveRequests: LeaveRequest[];
    attendanceAdjustmentRequests: AttendanceAdjustmentRequest[];
    leavePermitRequests: LeavePermitRequest[];
    pettyCashRequests: PettyCashRequest[];
    handleNewLeaveRequest: (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'approvalHistory'>) => void;
    handleNewAttendanceAdjustmentRequest: (newRequest: Omit<AttendanceAdjustmentRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'approvalHistory'>) => void;
    handleNewLeavePermitRequest: (newRequest: Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'durationHours' | 'approvalHistory'>) => void;
    handleNewPettyCashRequest: (newRequest: Omit<PettyCashRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'approvalHistory'>) => void;
    handleRequestAction: (requestId: string, newStatus: 'Approved' | 'Rejected', notes: string, approverId: string, approverName: string) => void;
}