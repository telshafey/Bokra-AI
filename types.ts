import type React from 'react';

export type AppModule = 'performance' | 'learning' | 'recruitment' | 'onboarding' | 'offboarding' | 'support' | 'compensation' | 'job_titles' | 'documents' | 'assets';

export interface NavItem {
  nameKey: string; // Key for translation
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
  requiresEmployee?: boolean; // Controls visibility for actual employees vs system accounts
  pageTitleKey?: string; // Key for translation
  roles?: UserRole[]; // Defines specific roles that can see this item
  module?: AppModule;
}

export interface NavGroup {
  groupNameKey: string; // Key for translation
  items: NavItem[];
}

export interface Employee {
  name:string;
  title: string;
  avatarUrl: string;
}

export type UserRole = 'Super Admin' | 'Admin' | 'Branch Admin' | 'General Manager' | 'HR Manager' | 'HR Specialist' | 'Finance Manager' | 'Team Lead' | 'Employee';

export interface Branch {
    id: string;
    name: string;
    status: 'Active' | 'Archived';
}

export type CheckInStatus = 'CheckedIn' | 'CheckedOut';
export type EmploymentStatus = 'دوام كامل' | 'System Account' | 'Inactive';

export interface JobTitle {
    id: string;
    name: string;
    parentId: string | null;
}

// --- Compensation & Benefits Types ---
export type SalaryComponentType = 'Allowance' | 'Deduction';
export type CalculationType = 'FixedAmount' | 'PercentageOfBase';

export interface SalaryComponent {
    id: string;
    name: string;
    type: SalaryComponentType;
    calculationType: CalculationType;
    value: number; // Can be a fixed amount or a percentage
}

export interface CompensationPackage {
    id: string;
    name: string;
    components: {
        componentId: string;
        value: number; // The specific value for this package, can override default
    }[];
}

// --- Asset Management Types ---
export type AssetCategory = 'Hardware' | 'Software' | 'Furniture' | 'Vehicle';
export type AssetStatus = 'Available' | 'Assigned' | 'UnderMaintenance' | 'Retired';
export type DepreciationMethod = 'Straight-line' | 'Declining Balance';

export interface Asset {
    id: string;
    name: string;
    category: AssetCategory;
    serialNumber: string;
    purchaseDate: string;
    purchaseValue: number; // Renamed from value
    status: AssetStatus;
    assignedToId: string | null;
    // New fields for depreciation
    depreciationMethod: DepreciationMethod;
    usefulLifeYears: number;
    currentValue?: number; // Will be calculated dynamically
    depreciationStatus?: 'Normal' | 'NearingEOL' | 'Depreciated';
}

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
    overtimePolicies: OvertimePolicy[];
    leavePolicies: LeavePolicy[];
    saveAttendancePolicy: (policy: AttendancePolicy) => void;
    archiveAttendancePolicy: (policyId: string) => void;
    bulkArchiveAttendancePolicies: (policyIds: string[]) => void;
    updateAttendancePolicyStatus: (policyId: string, newStatus: 'Active' | 'Rejected') => void;
    saveOvertimePolicy: (policy: OvertimePolicy) => void;
    archiveOvertimePolicy: (policyId: string) => void;
    bulkArchiveOvertimePolicies: (policyIds: string[]) => void;
    updateOvertimePolicyStatus: (policyId: string, newStatus: 'Active' | 'Rejected') => void;
    saveLeavePolicy: (policy: LeavePolicy) => void;
    archiveLeavePolicy: (policyId: string) => void;
    bulkArchiveLeavePolicies: (policyIds: string[]) => void;
    updateLeavePolicyStatus: (policyId: string, newStatus: 'Active' | 'Rejected') => void;
}

export interface PoliciesProviderProps {
    children: React.ReactNode;
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
    addNewUser: (newUserPayload: NewUserPayload) => void;
    updateUser: (userId: string, updatedData: NewUserPayload) => void;
    updateBranchManager: (branchId: string, newManagerId: string) => void;
}

export interface UserProviderProps {
    children: React.ReactNode;
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

export interface CompanyStructureProviderProps {
    children: React.ReactNode;
}

export interface RequestContextType {
    requests: HRRequest[];
    leaveRequests: LeaveRequest[];
    attendanceAdjustmentRequests: AttendanceAdjustmentRequest[];
    leavePermitRequests: LeavePermitRequest[];
    handleRequestAction: (requestId: number, newStatus: RequestStatus) => void;
    handleNewLeaveRequest: (newRequestData: Omit<LeaveRequest, 'id' | 'status' | 'type' | 'submissionDate'>) => void;
    handleNewAttendanceAdjustmentRequest: (newRequestData: Omit<AttendanceAdjustmentRequest, 'id' | 'status' | 'type' | 'submissionDate'>) => void;
    // FIX: Corrected the type to expect `employeeId` to be passed, aligning it with other request handlers.
    handleNewLeavePermitRequest: (newRequestData: Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'durationHours'>) => void;
}

export interface RequestProviderProps {
    children: React.ReactNode;
}


export interface EmployeeProfile extends Employee {
    id: string;
    employeeId: string;
    jobTitleId?: string;
    role: UserRole;
    isEmployee: boolean; // Distinguishes real employees from system accounts
    branchId: string;
    branchName?: string; // Optional, can be added dynamically
    department: string;
    manager?: string; // Manager Name
    managerId?: string; // Manager ID for hierarchy
    hireDate: string;
    employmentStatus: EmploymentStatus; 
    deactivationDate?: string;
    checkInStatus: CheckInStatus;
    leaveBalances: LeaveBalance[];
    baseSalary?: number; // Added for payslip generation
    attendancePolicyId?: string; 
    attendancePolicyName?: string; // Added dynamically
    overtimePolicyId?: string;
    overtimePolicyName?: string;
    leavePolicyId?: string;
    leavePolicyName?: string; // Added dynamically
    compensationPackageId?: string; // New field
    assets?: Asset[]; // Added dynamically
    // New fields for turnover analysis
    performanceScore: number; // e.g., 1 to 5
    satisfactionSurveyScore: number; // e.g., 1 to 5
    lastPromotionDate: string | null;
    salaryComparedToMarket: 'Below' | 'Average' | 'Above';
    contact: {
        phone: string;
        workEmail: string;
        personalEmail: string;
    };
    personal: {
        dateOfBirth: string;
        nationality: string;
        nationalId: string;
        maritalStatus: 'أعزب' | 'متزوج' | '-';
        gender: 'Male' | 'Female';
        religion: 'Muslim' | 'Christian' | '-';
        isSpecialNeeds?: boolean;
    };
    address: string;
}

export interface Stat {
  title: string;
  value: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}

export interface Activity {
  description: string;
  timestamp: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Holiday' | 'Weekend';

export interface AttendanceRecord {
  employeeId: string;
  date: string;
  day: string;
  status: AttendanceStatus;
  firstCheckIn?: string;
  lastCheckOut?: string;
  workedHours?: number;
  overtime?: number;
}

export interface AttendanceEvent {
    id: string;
    employeeId: string;
    timestamp: string; // ISO string
    type: 'CheckIn' | 'CheckOut';
    isWithinGeofence: boolean;
    coords?: { latitude: number; longitude: number };
    taskId?: string;
}

export interface PayslipItem {
    description: string;
    amount: number;
}

export interface Payslip {
    id: string;
    month: string;
    year: number;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    earnings: PayslipItem[];
    deductions: PayslipItem[];
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Unpaid' | 'NewbornRegistration' | 'Exam';
export type RequestStatus = 'Approved' | 'Pending' | 'Rejected';

export interface LeaveBalance {
    type: LeaveType;
    typeName: string;
    balance: number;
    used: number;
}

// --- Unified & Discriminated Request Types ---
export type RequestType = 'Leave' | 'DataUpdate' | 'AttendanceAdjustment' | 'LeavePermit';

interface BaseRequest {
    id: number;
    employeeId: string;
    status: RequestStatus;
    submissionDate: string;
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
    durationHours: number;
    reason: string;
}

export interface DataUpdateRequest extends BaseRequest {
    type: 'DataUpdate';
    details: string;
}

export type HRRequest = LeaveRequest | AttendanceAdjustmentRequest | LeavePermitRequest | DataUpdateRequest;

export type AttendanceAdjustmentType = 'LateArrival' | 'EarlyDeparture';


// Manager View Types
export interface TeamMember {
    id: string;
    name: string;
    title: string;
    avatarUrl: string;
    attendanceStatus: 'Present' | 'Absent' | 'Leave';
}

// Context for approval modal
export interface OverlappingLeave {
    employeeName: string;
    avatarUrl: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
}

export interface ApprovalContext {
    employee: EmployeeProfile;
    overlappingLeaves: OverlappingLeave[];
}

export type PendingRequest = HRRequest & {
    employeeName: string;
    employeeAvatarUrl: string;
    context?: ApprovalContext;
};

// Manager Reports Types
export interface LeaveDistributionDataItem {
    name: LeaveType;
    value: number;
    typeName: string;
    fill: string;
}

export interface TeamWeeklyAttendanceItem {
    day: string;
    present: number;
    absent: number;
    leave: number;
}

export interface TeamReportsData {
    keyMetrics: {
        avgGoalCompletion: number;
        pendingRequests: number;
        avgTeamSentiment: number;
        totalOvertime: number;
    };
    leaveDistribution: LeaveDistributionDataItem[];
    weeklyAttendance: TeamWeeklyAttendanceItem[];
}

// Team Analytics & Skills Types
export interface Skill {
    name: string;
    currentLevel: number;
    requiredLevel: number;
}

export interface DevelopmentSuggestion {
    area: string;
    suggestion: string;
}

export type GoalStatus = 'On Track' | 'At Risk' | 'Completed' | 'Off Track' | 'Draft';

export interface Goal {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    type: 'Objective' | 'Key Result';
    parentId: string | null;
    status: GoalStatus;
    progress: number; // 0-100
    dueDate: string;
}

export type ReviewStatus = 'Draft' | 'In Progress' | 'Completed';

export interface PerformanceReview {
    id: string;
    employeeId: string;
    reviewerId: string;
    cycle: string; // e.g., "Mid-Year 2024"
    status: ReviewStatus;
    overallRating: number; // 1-5
    strengths: string;
    areasForImprovement: string;
    finalComments: string;
    reviewDate: string;
}

// --- New Employee Document System ---
export type DocumentType = 'عقد عمل' | 'مسوغات تعيين' | 'استمارة ١ (تأمينات)' | 'استمارة ٢ (تأمينات)' | 'استمارة ٦ (تأمينات)';

export interface EmployeeDocument {
    id: string;
    employeeId: string;
    name: string;
    type: DocumentType;
    uploadDate: string;
    expirationDate: string | null;
    fileUrl?: string; // Placeholder for file path/URL
}


// --- New Attendance & Leave Policy System Types ---

export type ViolationType = 'Lateness' | 'Absence';
export type PenaltyType = 'DeductLeave' | 'DeductSalary' | 'Warning';

export interface WorkLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
}

export interface ViolationRule {
    id: string;
    type: ViolationType;
    threshold: number; // e.g., 3 occurrences of unexcused absence
    period: 'Month';
    penaltyType: PenaltyType;
    penaltyValue?: number; // e.g., 2 days for absence
}

export interface LatenessTier {
    id: string;
    fromMinutes: number;
    toMinutes: number;
    penaltyHours: number;
}

export interface EarlyLeaveTier {
    id: string;
    fromMinutes: number; // minutes before shift end
    toMinutes: number;
    penaltyHours: number;
}

export interface AttendancePolicy {
    id: string;
    name: string;
    scope: 'company' | 'branch';
    branchId?: string;
    status: 'Active' | 'PendingApproval' | 'Archived' | 'Rejected';
    gracePeriodInMinutes: number;
    latenessTiers: LatenessTier[];
    absenceRules: ViolationRule[];
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
    status: 'Active' | 'PendingApproval' | 'Archived' | 'Rejected';
    allowOvertime: boolean;
    minOvertimeInMinutes: number;
    overtimeRateNormal: number; // e.g., 1.35 for 135%
    overtimeRateHoliday: number; // e.g., 2 for 200%
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
    status: 'Active' | 'PendingApproval' | 'Archived' | 'Rejected';
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


// Legacy type for reference, will be phased out.
export interface EmployeeInfraction {
    id: string;
    employeeId: string;
    policyId: string;
    ruleType: ViolationType;
    date: string;
    details: string; // e.g., "Arrived at 09:15"
    penaltyApplied: boolean;
    penaltyDetails?: string; // e.g., "0.5 days deducted from annual leave"
}

export interface TeamMemberStats {
    usedPermissionHours: number;
    usedAnnualLeavesDays: number;
    usedRemoteDays: number;
    emergencyDays: number;
    usedGraceMinutes: number;
    absentDays: number;
}

export interface TeamMemberDetails {
    profile: EmployeeProfile;
    attendance: AttendanceRecord[];
    leave: LeaveRequest[];
    skills: Skill[];
    developmentPlan: DevelopmentSuggestion[];
    goals: Goal[];
    reviews: PerformanceReview[];
    documents: EmployeeDocument[];
    assets: Asset[];
    infractions: EmployeeInfraction[];
    courses: (Course & EmployeeCourse)[];
    monthlyCheckIns: MonthlyCheckIn[];
    externalTasks: ExternalTask[];
    stats: TeamMemberStats;
    dailyPunches?: AttendanceEvent[];
}

// Turnover Analysis Types
export type TurnoverRiskLevel = 'Low' | 'Medium' | 'High' | 'Unknown';
export interface TurnoverAnalysisResult {
    riskLevel: TurnoverRiskLevel;
    riskScore: number;
    keyFactors: string[];
}

// Learning & Development Types
export type CourseCategory = 'Technical' | 'Soft Skills' | 'Compliance' | 'Leadership';
export type CourseStatus = 'Not Started' | 'In Progress' | 'Completed';
export type CourseType = 'Internal' | 'External';
export type ManagerApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'NotSubmitted';
export type ExternalCourseVenue = 'On-site' | 'Training Center' | 'Online';


export interface CourseModule {
    id: string;
    title: string;
    topics: string[];
}

export interface Course {
    id: string;
    title: string;
    category: CourseCategory;
    durationHours: number;
    description: string;
    learningObjectives?: string[];
    isMandatory: boolean;
    modules?: CourseModule[];
    type: CourseType;
    provider?: string; // e.g., Coursera, Udemy
    url?: string;
    venue?: ExternalCourseVenue;
    locationDetails?: string;
}

export interface EmployeeCourse {
    employeeId: string;
    courseId: string;
    status: CourseStatus;
    progress: number; // 0-100
    managerApprovalStatus: ManagerApprovalStatus;
    submittedNotes?: string;
    certificateUrl?: string; // Placeholder for file path/URL
    result?: string; // e.g., "Pass", "95/100"
    performanceRating?: number; // 1-5
}

export interface CourseOutline {
    description: string;
    learningObjectives: string[];
    modules: { title: string; topics: string[] }[];
}


// Add User Payload
export interface NewUserPayload {
    // Job Info
    name: string;
    jobTitleId: string;
    department: string;
    hireDate: string;
    branchId: string;
    role: UserRole;
    managerId?: string;
    baseSalary?: number;
    attendancePolicyId?: string;
    overtimePolicyId?: string;
    leavePolicyId?: string;
    compensationPackageId?: string;
    // Contact Info
    workEmail: string;
    phone: string;
    personalEmail: string;
    // Personal Info
    dateOfBirth: string;
    nationality: string;
    nationalId: string;
    maritalStatus: 'أعزب' | 'متزوج';
    gender: 'Male' | 'Female';
    religion: 'Muslim' | 'Christian';
    // Address
    address: string;
}

// --- Notification System Types ---
export type NotificationType = 'approval_request' | 'status_update';

export interface Notification {
    id: string;
    recipientId: string; // ID of the user who should see this
    senderId: string; // ID of the user who triggered the notification
    type: NotificationType;
    message: string;
    isRead: boolean;
    timestamp: string; // ISO string
    relatedEntity?: {
        type: 'course' | 'leave_request' | 'attendance_adjustment';
        id: string | number;
    };
}

// --- Performance Management ---
export type MonthlyCheckInRating = 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement';

export interface MonthlyCheckIn {
    id: string;
    employeeId: string;
    reviewerId: string;
    month: number; // 0-11
    year: number;
    rating: MonthlyCheckInRating;
    notes: string;
    date: string; // ISO string
}

export interface PerformanceCycle {
    name: string;
    status: 'Active' | 'Upcoming' | 'Closed';
    startDate: string;
    endDate: string;
}

export interface TeamMemberPerformanceData {
    member: EmployeeProfile;
    goalProgress: number;
    latestCheckIn: MonthlyCheckIn | null;
    reviewStatus: 'Not Started' | 'In Progress' | 'Completed';
}

export interface ManagerPerformanceData {
    cycle: PerformanceCycle;
    cycleStats: {
        totalReviews: number;
        reviewsCompleted: number;
        avgTeamGoalProgress: number;
    };
    teamPerformance: TeamMemberPerformanceData[];
}


// --- Support Ticket System Types ---
export type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketCategory = 'Payroll' | 'Leave Balance' | 'Technical Support' | 'Policy Question' | 'Other';

export interface TicketMessage {
    id: string;
    authorId: string;
    content: string;
    timestamp: string; // ISO string
}

export interface SupportTicket {
    id: string;
    employeeId: string;
    title: string;
    description: string; // The initial message from the employee
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    assignedToId?: string;
    messages: TicketMessage[];
}

// --- Dashboard Data Types ---
export interface RecentActivityItem {
    id: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
    timestamp: string;
    pageKey: string; // The page key to navigate to
}

export interface AttentionItem {
    id: string;
    type: 'leave' | 'course' | 'ticket' | 'check-in' | 'attendance_adjustment' | 'leave_permit' | 'external_task';
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
    employeeName: string;
    employeeAvatarUrl: string;
    timestamp: string;
    request: HRRequest; // The original request object
    context?: ApprovalContext;
}

export interface TeamLearningStat {
    name: string;
    progress: number;
}


export interface EmployeeDashboardData {
    activeCourse: (Course & EmployeeCourse) | null;
    latestTicket: SupportTicket | null;
    recentActivities: RecentActivityItem[];
    stats: {
        remainingAnnualLeave: number;
        pendingRequestsCount: number;
        overtimeHoursThisMonth: number;
    };
}

export interface TeamDashboardData {
    attentionItems: AttentionItem[];
    teamLearningStats: TeamLearningStat[];
    teamAttendance: {
        present: number;
        absent: number;
        onLeave: number;
    }
    teamMembersWithAttendance: TeamMember[];
}

// --- Recruitment (ATS) Types ---
export type JobOpeningStatus = 'Open' | 'Closed' | 'Draft';
export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface JobOpening {
    id: string;
    title: string;
    department: string;
    status: JobOpeningStatus;
    datePosted: string;
    description: string;
    requirements: string[];
}

export interface Candidate {
    id: string;
    jobOpeningId: string;
    name: string;
    email: string;
    phone: string;
    stage: CandidateStage;
    applicationDate: string;
    avatarUrl: string;
}

// --- Onboarding & Offboarding Types ---
export type OnboardingTaskCategory = 'الأوراق والمستندات' | 'إعدادات تقنية' | 'التعريف بالفريق' | 'سياسات الشركة';
export type OnboardingResponsible = 'الموظف الجديد' | 'المدير المباشر' | 'الموارد البشرية' | 'تقنية المعلومات';

export interface OnboardingTask {
    id: string;
    title: string;
    category: OnboardingTaskCategory;
    responsible: OnboardingResponsible;
    dueOffsetDays: number; // e.g., 0 for on start date, 1 for one day after
    isCompleted: boolean;
    dueDate?: string; // Will be calculated dynamically
}

export interface OnboardingTemplate {
    id: string;
    name: string;
    description: string;
    tasks: Omit<OnboardingTask, 'isCompleted' | 'dueDate' | 'id'>[];
}

export interface OnboardingProcess {
    id: string;
    employeeId: string;
    templateId: string;
    startDate: string;
    tasks: OnboardingTask[];
}

export type OffboardingTaskCategory = 'تسليم العهدة' | 'نقل المعرفة' | 'إجراءات الموارد البشرية' | 'التسوية المالية النهائية';
export type OffboardingResponsible = 'الموظف المغادر' | 'المدير المباشر' | 'الموارد البشرية' | 'تقنية المعلومات';

export interface OffboardingTask {
    id: string;
    title: string;
    category: OffboardingTaskCategory;
    responsible: OffboardingResponsible;
    dueOffsetDays: number; // Days *before* last day
    isCompleted: boolean;
    dueDate?: string;
}

export interface OffboardingTemplate {
    id: string;
    name: string;
    description: string;
    tasks: Omit<OffboardingTask, 'isCompleted' | 'dueDate' | 'id'>[];
}

export interface OffboardingProcess {
    id: string;
    employeeId: string;
    templateId: string;
    lastDay: string;
    tasks: OffboardingTask[];
}

// --- External Tasks ---
export type ExternalTaskStatus = 'PendingApproval' | 'Approved' | 'Rejected' | 'InProgress' | 'Completed' | 'Cancelled';

export interface ExternalTask {
    id: string;
    employeeId: string;
    managerId: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    status: ExternalTaskStatus;
    requestedById?: string; // Employee who requested it (if not manager)
    checkInTimestamp?: string;
    checkInCoords?: { latitude: number; longitude: number };
    checkOutTimestamp?: string;
    checkOutCoords?: { latitude: number; longitude: number };
}