// FIX: Implemented all missing type definitions.
import React from "react";

export type Language = 'ar' | 'en';

export type AppModule = 'payroll' | 'documents' | 'recruitment' | 'performance' | 'learning' | 'onboarding' | 'offboarding' | 'assets' | 'support' | 'help_center';

export interface NavItem {
    nameKey: string;
    path: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    module?: string;
    roles?: UserRole[];
    requiresEmployee?: boolean;
}

export interface NavGroup {
    groupNameKey: string;
    items: NavItem[];
}

export type UserRole = 'Super Admin' | 'Admin' | 'Branch Admin' | 'General Manager' | 'HR Manager' | 'HR Specialist' | 'Finance Manager' | 'Team Lead' | 'Employee';

export interface EmployeeProfile {
    id: string;
    employeeId: string;
    name: string;
    title: string;
    jobTitleId: string | null;
    role: UserRole;
    isEmployee: boolean;
    avatarUrl: string;
    departmentKey: string;
    hireDate: string;
    employmentStatus: 'دوام كامل' | 'Inactive';
    managerId?: string;
    manager?: string;
    branchId: string;
    branchName?: string;
    checkInStatus: CheckInStatus;
    leaveBalances: LeaveBalance[];
    baseSalary: number;
    attendancePolicyId?: string;
    attendancePolicyName?: string;
    overtimePolicyId?: string;
    overtimePolicyName?: string;
    leavePolicyId?: string;
    leavePolicyName?: string;
    compensationPackageId?: string;
    contact: {
        phone: string;
        workEmail: string;
        personalEmail: string;
    };
    personal: {
        dateOfBirth: string;
        nationality: string;
        nationalId: string;
        maritalStatus: 'أعزب' | 'متزوج';
        gender: 'Male' | 'Female';
        religion: 'Muslim' | 'Christian';
    };
    address: string;
    performanceScore: number;
    satisfactionSurveyScore: number;
    lastPromotionDate: string | null;
    salaryComparedToMarket: 'Average' | 'Above Average' | 'Below Average';
    attendanceRecords?: AttendanceRecord[];
    payslips?: Payslip[];
}

export type CheckInStatus = 'CheckedIn' | 'CheckedOut';

export interface LeaveBalance {
    type: string;
    typeName: string;
    balance: number;
    used: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Weekend' | 'Leave' | 'Holiday';

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

export interface Payslip {
    id: string;
    employeeId: string;
    month: string;
    year: number;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    earnings: { description: string, amount: number }[];
    deductions: { description: string, amount: number }[];
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

export interface Stat {
    title: string;
    value: string | number;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
    chartData?: { name: string, value: number }[];
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

export interface TeamMember {
    id: string;
    name: string;
    title: string;
    avatarUrl: string;
    attendanceStatus: 'Present' | 'Absent' | 'Leave';
}


export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
}

export interface EmployeeDashboardData {
    stats: {
        remainingAnnualLeave: number;
        pendingRequestsCount: number;
        overtimeHoursThisMonth: number;
        overtimeTrend: { name: string; value: number }[];
    };
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


export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Unpaid' | 'NewbornRegistration' | 'Exam';

interface BaseRequest {
    id: string;
    employeeId: string;
    type: 'Leave' | 'DataUpdate' | 'AttendanceAdjustment' | 'LeavePermit' | 'PettyCash' | 'CourseApproval' | 'ExternalTask';
    status: RequestStatus;
    submissionDate: string;
    approvalHistory: { approverId: string; status: 'Approved' | 'Rejected'; timestamp: string; notes?: string }[];
}

export interface LeaveRequest extends BaseRequest {
    type: 'Leave';
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    duration: number;
    reason: string;
    attachmentUrl?: string;
}

export interface DataUpdateRequest extends BaseRequest {
    type: 'DataUpdate';
    details: string;
}

export interface AttendanceAdjustmentRequest extends BaseRequest {
    type: 'AttendanceAdjustment';
    date: string;
    adjustmentType: 'LateArrival' | 'EarlyDeparture';
    actualTime: string;
    reason: string;
}

export interface LeavePermitRequest extends BaseRequest {
    type: 'LeavePermit';
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
}

export interface PettyCashRequest extends BaseRequest {
    type: 'PettyCash';
    date: string;
    category: 'Transportation' | 'OfficeSupplies' | 'ClientMeeting' | 'Other';
    amount: number;
    description: string;
    attachmentUrl?: string;
}

export interface CourseApprovalRequest extends BaseRequest {
    type: 'CourseApproval';
    courseTitle: string;
    courseProvider: string;
    courseUrl?: string;
}

export interface ExternalTaskRequest extends BaseRequest {
    type: 'ExternalTask';
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
}

export type HRRequest = LeaveRequest | DataUpdateRequest | AttendanceAdjustmentRequest | LeavePermitRequest | PettyCashRequest | CourseApprovalRequest | ExternalTaskRequest;

// FIX: Changed PendingRequest from an interface to a type to correctly extend a union type.
export type PendingRequest = HRRequest & {
    employeeName: string;
    employeeAvatarUrl: string;
};

export interface TeamWeeklyAttendanceItem {
    day: string;
    present: number;
    leave: number;
    absent: number;
}

export interface LeaveDistributionDataItem {
    type: string;
    typeName: string;
    value: number;
    fill: string;
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

export interface ManagerPerformanceData {
    cycle: { name: string, status: 'Active' | 'Upcoming' | 'Closed' };
    cycleStats: {
        totalReviews: number;
        reviewsCompleted: number;
        avgTeamGoalProgress: number;
    };
    teamPerformance: TeamMemberPerformanceData[];
}

export interface TeamMemberPerformanceData {
    member: EmployeeProfile;
    goalProgress: number;
    latestCheckIn: MonthlyCheckIn | null;
    reviewStatus: 'Completed' | 'In Progress' | 'Not Started';
}

export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface Candidate {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    jobOpeningId: string;
    stage: CandidateStage;
}

export interface JobOpening {
    id: string;
    title: string;
    departmentKey: string;
    status: 'Open' | 'Closed';
}

export type OnboardingTaskCategory = 'paperwork' | 'systemSetup' | 'companyIntro' | 'firstWeekTasks';
export type OnboardingResponsible = 'newEmployee' | 'directManager' | 'hr' | 'it';

export interface OnboardingTask {
    id: string;
    title: string;
    category: OnboardingTaskCategory;
    responsible: OnboardingResponsible;
    dueOffsetDays: number;
    dueDate: string;
    isCompleted: boolean;
}

export interface OnboardingProcess {
    id: string;
    employeeId: string;
    templateId: string;
    startDate: string;
    tasks: OnboardingTask[];
}

export interface OnboardingTemplate {
    id: string;
    name: string;
    description: string;
    tasks: Omit<OnboardingTask, 'id' | 'isCompleted' | 'dueDate'>[];
}

export type OffboardingTaskCategory = 'assetHandover' | 'adminProcedures' | 'knowledgeTransfer' | 'finalExit';
export type OffboardingResponsible = 'departingEmployee' | 'directManager' | 'hr' | 'it' | 'finance';

export interface OffboardingTask {
    id: string;
    title: string;
    category: OffboardingTaskCategory;
    responsible: OffboardingResponsible;
    dueOffsetDays: number;
    dueDate: string;
    isCompleted: boolean;
}

export interface OffboardingProcess {
    id: string;
    employeeId: string;
    templateId: string;
    lastDay: string;
    tasks: OffboardingTask[];
}

export interface OffboardingTemplate {
    id: string;
    name: string;
    description: string;
    tasks: Omit<OffboardingTask, 'id' | 'isCompleted' | 'dueDate'>[];
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

export interface Asset {
    id: string;
    name: string;
    category: AssetCategory;
    serialNumber: string;
    purchaseDate: string;
    purchaseValue: number;
    depreciationMethod: DepreciationMethod;
    usefulLifeYears: number;
    status: 'Assigned' | 'Available' | 'Under Maintenance' | 'Retired';
    assignedToId: string | null;
    currentValue?: number;
    depreciationStatus?: 'Normal' | 'NearingEOL' | 'Depreciated';
}

export type CourseCategory = 'Technical' | 'Soft Skills' | 'Compliance' | 'Leadership';
export type CourseStatus = 'Not Started' | 'In Progress' | 'Completed';
export type ManagerApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'NotSubmitted';
export type ExternalCourseVenue = 'Online' | 'On-site' | 'Training Center';

export interface Course {
    id: string;
    title: string;
    description: string;
    category: CourseCategory;
    durationHours: number;
    isMandatory: boolean;
    type: 'Internal' | 'External';
    modules?: { title: string; duration: number }[];
    provider?: string;
    url?: string;
    venue?: ExternalCourseVenue;
    locationDetails?: string;
    learningObjectives?: string[];
}

export interface EmployeeCourse {
    employeeId: string;
    courseId: string;
    status: CourseStatus;
    progress: number;
    enrollmentDate: string;
    completionDate?: string;
    managerApprovalStatus: ManagerApprovalStatus;
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

export type ReviewStatus = 'Completed' | 'In Progress' | 'Draft';


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

export type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketCategory = 'Payroll' | 'Leave Balance' | 'Technical Support' | 'Policy Question' | 'Other';

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
    messages: { id: string; authorId: string; timestamp: string; content: string }[];
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
    components: { componentId: string; value: number }[];
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

export interface BilingualText {
    ar: string;
    en: string;
}

export interface HelpArticle {
    id: string;
    categoryId: string;
    title: BilingualText;
    content: BilingualText;
    keywords: string[];
}

export interface ApprovalStep {
    id: string;
    approverRole: 'Direct Manager' | 'Branch Admin' | 'HR Manager' | 'General Manager';
    order: number;
}

export interface ApprovalWorkflow {
    id: string;
    name: string;
    requestType: HRRequest['type'];
    steps: ApprovalStep[];
}


export type GoalType = 'Objective' | 'Key Result';
export type GoalStatus = 'On Track' | 'At Risk' | 'Off Track' | 'Completed' | 'Draft';

export interface Goal {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    type: GoalType;
    status: GoalStatus;
    progress: number;
    dueDate: string;
    parentId: string | null;
}

export interface LatenessTier {
    id: string;
    fromMinutes: number;
    toMinutes: number;
    penaltyHours: number;
}

export interface AbsenceRule {
    id: string;
    consecutiveDays: number;
    penalty: string;
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
    scope: 'company' | 'branch' | 'department' | 'individual';
    status: 'Active' | 'Archived';
    gracePeriodInMinutes: number;
    latenessTiers: LatenessTier[];
    absenceRules: AbsenceRule[];
    earlyLeaveTiers: EarlyLeaveTier[];
    maxPermitsPerMonth: number;
    minPermitDurationMinutes: number;
    maxPermitDurationHours: number;
    breakDurationHours: number;
    workLocationIds: string[];
}

export interface AnnualLeaveTier {
    id: string;
    afterYears: number;
    days: number;
}
export interface LeavePolicy {
    id: string;
    name: string;
    scope: 'company' | 'branch' | 'department' | 'individual';
    status: 'Active' | 'Archived';
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
export interface OvertimePolicy {
    id: string;
    name: string;
    scope: 'company' | 'branch' | 'department' | 'individual';
    status: 'Active' | 'Archived';
    allowOvertime: boolean;
    minOvertimeInMinutes: number;
    overtimeRateNormal: number;
    overtimeRateHoliday: number;
}
export interface NewUserPayload {
    name: string;
    jobTitleId: string;
    departmentKey: string;
    hireDate: string;
    branchId: string;
    role: UserRole;
    managerId?: string;
    attendancePolicyId?: string;
    overtimePolicyId?: string;
    leavePolicyId?: string;
    compensationPackageId?: string;
    baseSalary: number;
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
export interface TeamMemberDetails {
    profile: EmployeeProfile;
    stats: {
        usedPermissionHours: number;
        usedAnnualLeavesDays: number;
        usedRemoteDays: number;
        emergencyDays: number;
    };
    goals: Goal[];
    reviews: PerformanceReview[];
    documents: EmployeeDocument[];
    pettyCashRequests: PettyCashRequest[];
    assets: Asset[];
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
export interface AttentionItem {
    id: string;
    type: 'leaveRequest' | 'attendanceAdjustment' | 'leavePermit' | 'courseApprovalRequest' | 'externalTaskRequest';
    text: string;
    timestamp: string;
    employeeName: string;
    employeeAvatarUrl: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface TeamLearningStat {
    name: string;
    progress: number;
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

export interface EmployeeInfraction {
    id: string;
    employeeId: string;
    date: string;
    type: 'Lateness' | 'Absence' | 'EarlyLeave';
    details: string;
    penaltyApplied: boolean;
    penaltyDetails?: string;
}

export interface CourseOutline {
    description: string;
    learningObjectives: string[];
    modules: {
        title: string;
        topics: string[];
    }[];
}

// FIX: Added missing type.
export interface AppModuleConfig {
    key: string;
    nameKey: string;
    descriptionKey: string;
}

// FIX: Added missing OrgTreeNode type for organizational chart.
export interface OrgTreeNode extends EmployeeProfile {
    children: OrgTreeNode[];
}

// Context Types
export interface AssetsContextType {
    assets: Asset[];
    saveAsset: (asset: Asset) => void;
    assignAsset: (assetId: string, employeeId: string | null) => void;
}
export interface AssetsProviderProps {
    children: React.ReactNode;
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
    saveAttendancePolicy: (policy: AttendancePolicy) => Promise<any>;
    saveLeavePolicy: (policy: LeavePolicy) => Promise<any>;
    saveOvertimePolicy: (policy: OvertimePolicy) => Promise<any>;
    saveOnboardingTemplate: (template: OnboardingTemplate) => Promise<any>;
    deleteOnboardingTemplate: (templateId: string) => Promise<any>;
    saveOffboardingTemplate: (template: OffboardingTemplate) => Promise<any>;
    deleteOffboardingTemplate: (templateId: string) => Promise<any>;
    addWorkLocation: (location: Omit<WorkLocation, 'id'>) => Promise<any>;
    updateWorkLocation: (location: WorkLocation) => Promise<any>;
    saveSalaryComponent: (component: SalaryComponent) => Promise<any>;
    saveCompensationPackage: (pkg: CompensationPackage) => Promise<any>;
    saveApprovalWorkflow: (workflow: ApprovalWorkflow) => Promise<any>;
    deleteApprovalWorkflow: (workflowId: string) => Promise<any>;
}
export interface PoliciesProviderProps {
    children: React.ReactNode;
}

export interface CompanyStructureContextType {
    branches: Branch[];
    jobTitles: JobTitle[];
    addBranch: (name: string) => Promise<Branch>;
    updateBranch: (id: string, name: string) => Promise<Branch>;
    archiveBranch: (id: string) => Promise<Branch>;
    saveJobTitle: (jobTitle: JobTitle) => Promise<JobTitle>;
    deleteJobTitle: (jobTitleId: string) => Promise<{ id: string }>;
}
export interface CompanyStructureProviderProps {
    children: React.ReactNode;
}
export interface UserContextType {
    employees: EmployeeProfile[];
    isLoading: boolean;
    updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
    deactivateUser: (userId: string) => Promise<void>;
    reactivateUser: (userId: string) => Promise<void>;
    bulkDeactivateUsers: (userIds: string[]) => Promise<void>;
    bulkAssignAttendancePolicy: (policyId: string, employeeIds: string[]) => Promise<void>;
    bulkAssignOvertimePolicy: (policyId: string, employeeIds: string[]) => Promise<void>;
    bulkAssignLeavePolicy: (policyId: string, employeeIds: string[]) => Promise<void>;
    updateProfile: (updatedProfile: EmployeeProfile) => Promise<void>;
    addNewUser: (newUser: NewUserPayload) => Promise<void>;
    updateUser: (userId: string, updatedData: NewUserPayload) => Promise<void>;
    updateBranchManager: (branchId: string, newManagerId: string) => Promise<void>;
    updateEmployeeManager: (employeeId: string, newManagerId: string) => Promise<void>;
}

export interface UserProviderProps {
    children: React.ReactNode;
}

export interface RequestContextType {
    requests: HRRequest[];
    submitRequest: (request: Omit<HRRequest, 'id' | 'status' | 'submissionDate' | 'approvalHistory'>) => void;
    approveRequest: (requestId: string, approverId: string, notes: string) => void;
    rejectRequest: (requestId: string, approverId: string, notes: string) => void;
}

export interface RequestProviderProps {
    children: React.ReactNode;
}

// FIX: Added missing HelpCenterContextType
export interface HelpCenterContextType {
    articles: HelpArticle[];
    categories: HelpCategory[];
    addArticle: (articleData: Omit<HelpArticle, 'id'>) => void;
    updateArticle: (updatedArticle: HelpArticle) => void;
    deleteArticle: (articleId: string) => void;
    addCategory: (categoryData: Omit<HelpCategory, 'id' | 'icon'>) => void;
    updateCategory: (updatedCategory: Omit<HelpCategory, 'icon'>) => void;
    deleteCategory: (categoryId: string) => void;
}