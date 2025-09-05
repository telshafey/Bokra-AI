

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import AttendancePage from './components/AttendancePage';
import PayslipPage from './components/PayslipPage';
import LeavePage from './components/LeavePage';
import ProfilePage from './components/ProfilePage';
import TeamDashboard from './components/TeamDashboard';
import ManagerReportsPage from './components/ManagerReportsPage';
import TeamAnalyticsPage from './components/TeamAnalyticsPage';
// FIX: Changed import to default import as PerformancePage is now default exported.
import PerformancePage from './components/PerformancePage';
import MyDocumentsPage from './components/MyDocumentsPage';
import SettingsPage from './components/SettingsPage';
import SystemAdminPage from './components/SystemAdminPage';
import BranchManagementPage from './components/BranchManagementPage';
import LearningPage from './components/LearningPage';
import LearningManagementPage from './components/LearningManagementPage';
import AttendancePolicyPage from './components/AttendancePolicyPage';
import OvertimePolicyPage from './components/OvertimePolicyPage';
import LeavePolicyPage from './components/LeavePolicyPage';
import JobTitlesPage from './components/JobTitlesPage';
import CompensationPage from './components/CompensationPage';
import SupportTicketsPage from './components/SupportTicketsPage';
import RecruitmentPage from './components/RecruitmentPage';
import OnboardingPage from './components/OnboardingPage';
import OffboardingPage from './components/OffboardingPage';
import DocumentManagementPage from './components/DocumentManagementPage';
import OnboardingTemplatesPage from './components/OnboardingTemplatesPage';
import OffboardingTemplatesPage from './components/OffboardingTemplatesPage';
import MyOnboardingPage from './components/MyOnboardingPage';
import MyOffboardingPage from './components/MyOffboardingPage';
import ModuleManagementPage from './components/ModuleManagementPage';
import MyTasksPage from './components/MyTasksPage';
import ExternalTasksPage from './components/ExternalTasksPage';
import MyRequestsPage from './components/MyRequestsPage';
import TurnoverReportPage from './components/TurnoverReportPage';
import ManagerPerformancePage from './components/ManagerPerformancePage';
import AssetsManagementPage from './components/AssetsManagementPage';
import MyAssetsPage from './components/MyAssetsPage';
import ContractsPage from './components/ContractsPage';
import OrgChartPage from './components/OrgChartPage';
import HelpCenterPage from './components/HelpCenterPage';
import EmployeeDirectoryPage from './components/EmployeeDirectoryPage';
import { useTranslation } from './components/contexts/LanguageContext';

import { useAssetsContext } from './components/contexts/AssetsContext';
import { usePoliciesContext } from './components/contexts/PoliciesContext';
import { useUserContext } from './components/contexts/UserContext';
import { useCompanyStructureContext } from './components/contexts/CompanyStructureContext';
import { useRequestContext } from './components/contexts/RequestContext';
import { useHelpCenterContext } from './components/contexts/HelpCenterContext';


import { INITIAL_USER_ID, getDerivedData, MOCK_ATTENDANCE_RECORDS as INITIAL_ATTENDANCE, NAV_GROUPS, BOTTOM_NAV_ITEMS, MOCK_PERFORMANCE_REVIEWS as INITIAL_PERFORMANCE_REVIEWS, MOCK_EMPLOYEE_DOCUMENTS, generatePayslips, MOCK_COURSES, MOCK_EMPLOYEE_COURSES, MOCK_NOTIFICATIONS, MOCK_MONTHLY_CHECK_INS, MOCK_SALARY_COMPONENTS, MOCK_COMPENSATION_PACKAGES, MOCK_SUPPORT_TICKETS, MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_ONBOARDING_TEMPLATES, MOCK_ONBOARDING_PROCESSES, MOCK_OFFBOARDING_TEMPLATES, MOCK_OFFBOARDING_PROCESSES, MOCK_WORK_LOCATIONS, MOCK_ATTENDANCE_EVENTS, MOCK_EXTERNAL_TASKS, MOCK_GOALS, MOCK_EMPLOYEE_INFRACTIONS } from './constants';
// FIX: Added missing type imports. These types will be defined and exported in `types.ts`.
import { HRRequest, LeaveRequest, RequestStatus, PerformanceReview, EmployeeDocument, AttendanceRecord, AppModule, WorkLocation, AttendanceEvent, ExternalTask, CourseStatus, TicketStatus, Course, EmployeeCourse, Notification, MonthlyCheckIn, SalaryComponent, CompensationPackage, SupportTicket, AttendanceAdjustmentRequest, LeavePermitRequest, JobOpening, Candidate, CandidateStage, OnboardingProcess, OnboardingTemplate, OffboardingProcess, OffboardingTemplate, EmployeeProfile, AttentionItem, Goal, EmployeeInfraction, HelpArticle, HelpCategory } from './types';


const App: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const [activePage, setActivePage] = useState('sidebar.personalDashboard'); // Use key
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  // Module Management
  const ALL_MODULES: AppModule[] = ['performance', 'learning', 'recruitment', 'onboarding', 'offboarding', 'support', 'compensation', 'job_titles', 'documents', 'assets', 'help_center'];
  const [activeModules, setActiveModules] = useState<Set<AppModule>>(new Set(ALL_MODULES));

  // State Management (non-refactored parts)
  const [currentUserId, setCurrentUserId] = useState(INITIAL_USER_ID);
  const [companyName, setCompanyName] = useState('Bokra HR');
  const [employeeDocuments, setEmployeeDocuments] = useState<EmployeeDocument[]>(MOCK_EMPLOYEE_DOCUMENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(INITIAL_PERFORMANCE_REVIEWS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [employeeCourses, setEmployeeCourses] = useState<EmployeeCourse[]>(MOCK_EMPLOYEE_COURSES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [monthlyCheckIns, setMonthlyCheckIns] = useState<MonthlyCheckIn[]>(MOCK_MONTHLY_CHECK_INS);
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>(MOCK_SALARY_COMPONENTS);
  const [compensationPackages, setCompensationPackages] = useState<CompensationPackage[]>(MOCK_COMPENSATION_PACKAGES);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(MOCK_JOB_OPENINGS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [onboardingTemplates, setOnboardingTemplates] = useState<OnboardingTemplate[]>(MOCK_ONBOARDING_TEMPLATES);
  const [onboardingProcesses, setOnboardingProcesses] = useState<OnboardingProcess[]>(MOCK_ONBOARDING_PROCESSES);
  const [offboardingTemplates, setOffboardingTemplates] = useState<OffboardingTemplate[]>(MOCK_OFFBOARDING_TEMPLATES);
  const [offboardingProcesses, setOffboardingProcesses] = useState<OffboardingProcess[]>(MOCK_OFFBOARDING_PROCESSES);
  const [workLocations, setWorkLocations] = useState<WorkLocation[]>(MOCK_WORK_LOCATIONS);
  const [attendanceEvents, setAttendanceEvents] = useState<AttendanceEvent[]>(MOCK_ATTENDANCE_EVENTS);
  const [externalTasks, setExternalTasks] = useState<ExternalTask[]>(MOCK_EXTERNAL_TASKS);
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [employeeInfractions, setEmployeeInfractions] = useState<EmployeeInfraction[]>(MOCK_EMPLOYEE_INFRACTIONS);
  

  // Context Consumers
  const { assets } = useAssetsContext();
  const { 
    attendancePolicies, 
    overtimePolicies, 
    leavePolicies,
    saveAttendancePolicy,
    archiveAttendancePolicy,
    bulkArchiveAttendancePolicies,
    updateAttendancePolicyStatus,
    saveOvertimePolicy,
    archiveOvertimePolicy,
    bulkArchiveOvertimePolicies,
    updateOvertimePolicyStatus,
    saveLeavePolicy,
    archiveLeavePolicy,
    bulkArchiveLeavePolicies,
    updateLeavePolicyStatus,
} = usePoliciesContext();
  const { 
    employees, 
    updateProfile,
    updateUserRole,
    deactivateUser,
    bulkDeactivateUsers,
    reactivateUser,
    bulkAssignAttendancePolicy,
    bulkAssignOvertimePolicy,
    bulkAssignLeavePolicy,
    addNewUser,
    updateUser,
    updateBranchManager,
} = useUserContext();
  const { 
    branches, 
    jobTitles,
    addBranch,
    updateBranch,
    archiveBranch,
    saveJobTitle,
    deleteJobTitle,
} = useCompanyStructureContext();

  const { 
    requests, 
    leaveRequests, 
    attendanceAdjustmentRequests, 
    leavePermitRequests,
    pettyCashRequests,
    handleRequestAction,
    handleNewLeaveRequest,
    handleNewAttendanceAdjustmentRequest,
    handleNewLeavePermitRequest,
    handleNewPettyCashRequest,
  } = useRequestContext();

  const { articles: helpArticles, categories: helpCategories } = useHelpCenterContext();

  const {
    currentUserProfile,
    teamMembersProfiles,
    mockTeamMemberDetails,
    employeeDashboardData,
    teamDashboardData,
    teamReportsData,
    teamGoals,
    managerPerformanceData,
  } = useMemo(() => getDerivedData(
    currentUserId,
    employees,
    branches,
    employeeInfractions,
    attendancePolicies,
    overtimePolicies,
    leavePolicies,
    jobTitles,
    courses,
    employeeCourses,
    monthlyCheckIns,
    supportTickets,
    notifications,
    requests,
    attendanceRecords,
    employeeDocuments,
    performanceReviews,
    externalTasks,
    goals,
    attendanceEvents,
    assets,
    t
  ), [
    currentUserId, employees, branches, employeeInfractions, attendancePolicies, overtimePolicies, leavePolicies, 
    jobTitles, courses, employeeCourses, monthlyCheckIns, supportTickets, notifications, 
    requests, attendanceRecords, employeeDocuments, performanceReviews, externalTasks, 
    goals, attendanceEvents, assets, t
  ]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, language]);

  useEffect(() => {
    if (mainContentRef.current) {
        mainContentRef.current.scrollTo(0, 0);
    }
  }, [activePage]);
  
  const handleSavePerformanceReview = (review: PerformanceReview) => {
    setPerformanceReviews(prev => {
        const isNew = !prev.some(r => r.id === review.id);
        if (isNew) {
            // When a new review is saved, make sure its status is at least 'In Progress'
            return [...prev, { ...review, status: 'In Progress' }];
        }
        return prev.map(r => r.id === review.id ? review : r);
    });
};

  // Handlers
  const handleClockIn = (coords: { latitude: number; longitude: number; }) => {
    const now = new Date();
    setAttendanceEvents(prev => [
      ...prev,
      {
        id: `evt-${Date.now()}`,
        employeeId: currentUserId,
        timestamp: now.toISOString(),
        type: currentUserProfile.checkInStatus === 'CheckedOut' ? 'CheckIn' : 'CheckOut',
        isWithinGeofence: true, // simplified for demo
        coords
      }
    ]);
    updateProfile({
      ...currentUserProfile,
      checkInStatus: currentUserProfile.checkInStatus === 'CheckedOut' ? 'CheckedIn' : 'CheckedOut',
    });
  };

  const handleMarkAsRead = (notificationId: string) => setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const handleClearAll = () => setNotifications([]);

  const handleSaveCourse = (course: Course) => {
    setCourses(prev => {
      const isNew = !prev.some(c => c.id === course.id);
      if (isNew) return [...prev, course];
      return prev.map(c => c.id === course.id ? course : c);
    });
  };

  const handleSaveDocument = (doc: EmployeeDocument) => {
    setEmployeeDocuments(prev => {
      const isNew = !prev.some(d => d.id === doc.id);
      if (isNew) return [...prev, { ...doc, employeeId: currentUserProfile.id }];
      return prev.map(d => d.id === doc.id ? doc : d);
    });
  };

  const handleUpdateCandidateStage = (candidateId: string, newStage: CandidateStage) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
  };
  
  const handleStartOnboarding = (employeeId: string, templateId: string, startDate: string) => {
    const template = onboardingTemplates.find(t => t.id === templateId);
    if (!template) return;
    const newProcess: OnboardingProcess = {
      id: `onboard-${Date.now()}`,
      employeeId,
      templateId,
      startDate,
      tasks: template.tasks.map(t => ({...t, id: `task-${Date.now()}-${Math.random()}`, isCompleted: false, dueDate: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + t.dueOffsetDays)).toISOString().split('T')[0] }))
    };
    setOnboardingProcesses(prev => [...prev, newProcess]);
  };

  const handleUpdateOnboardingTask = (processId: string, taskId: string, isCompleted: boolean) => {
    setOnboardingProcesses(prev => prev.map(p => p.id === processId ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, isCompleted } : t) } : p));
  };

  const handleStartOffboarding = (employeeId: string, templateId: string, lastDay: string) => {
    const template = offboardingTemplates.find(t => t.id === templateId);
    if (!template) return;
    const newProcess: OffboardingProcess = {
        id: `offboard-${Date.now()}`,
        employeeId,
        templateId,
        lastDay,
        tasks: template.tasks.map(t => ({...t, id: `task-off-${Date.now()}-${Math.random()}`, isCompleted: false, dueDate: new Date(new Date(lastDay).setDate(new Date(lastDay).getDate() - t.dueOffsetDays)).toISOString().split('T')[0] }))
    };
    setOffboardingProcesses(prev => [...prev, newProcess]);
  };

  const handleUpdateOffboardingTask = (processId: string, taskId: string, isCompleted: boolean) => {
    setOffboardingProcesses(prev => prev.map(p => p.id === processId ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, isCompleted } : t) } : p));
  };

  const currentPageInfo = useMemo(() => {
    for (const group of NAV_GROUPS) {
        const item = group.items.find(i => i.nameKey === activePage);
        if (item) return item;
    }
    const bottomItem = BOTTOM_NAV_ITEMS.find(i => i.nameKey === activePage);
    return bottomItem || { nameKey: 'sidebar.personalDashboard', pageTitleKey: 'pageTitles.personalDashboard' };
  }, [activePage]);

  const pageTitle = t(currentPageInfo?.pageTitleKey ?? 'pageTitles.personalDashboard');

  const renderPage = () => {
    // This logic ensures we don't show manager/admin pages to employees who might have those roles but are viewing as themselves.
    // FIX: Replaced a syntactically incorrect and type-unsafe check with a type-safe check using the 'in' operator to resolve errors.
    const isManagerialView = currentPageInfo && 'roles' in currentPageInfo && !!currentPageInfo.roles && currentPageInfo.roles.includes(currentUserProfile.role);
    
    // Fallback for My Onboarding/Offboarding if no process exists
    if (currentPageInfo?.nameKey === 'sidebar.myOnboarding' && !onboardingProcesses.some(p => p.employeeId === currentUserId)) {
        return <div className="text-center p-8">{t('app.myOnboardingFallback')}</div>;
    }
    if (currentPageInfo?.nameKey === 'sidebar.myOffboarding' && !offboardingProcesses.some(p => p.employeeId === currentUserId)) {
        return <div className="text-center p-8">{t('app.myOffboardingFallback')}</div>;
    }

    switch (currentPageInfo?.nameKey) {
        case 'sidebar.personalDashboard': return <Dashboard currentUser={currentUserProfile} dashboardData={employeeDashboardData} onClockIn={handleClockIn} setActivePage={setActivePage} activeModules={activeModules} />;
        case 'sidebar.myAttendance': return <AttendancePage records={attendanceRecords.filter(r => r.employeeId === currentUserId)} attendanceEvents={attendanceEvents.filter(e => e.employeeId === currentUserId)} infractions={employeeInfractions.filter(i => i.employeeId === currentUserId)} currentUser={currentUserProfile} externalTasks={externalTasks.filter(t => t.employeeId === currentUserId)} />;
        case 'sidebar.payrollAndExpenses': return <PayslipPage currentUser={currentUserProfile} payslips={generatePayslips(currentUserId, employees, attendanceRecords, attendancePolicies, overtimePolicies, salaryComponents, compensationPackages, attendanceAdjustmentRequests, leavePermitRequests, externalTasks, leaveRequests, t, language)} />;
        case 'sidebar.leave': return <LeavePage currentUser={currentUserProfile} />;
        case 'sidebar.profile': return <ProfilePage currentUser={currentUserProfile} onUpdateProfile={updateProfile} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} />;
        case 'sidebar.teamDashboard': return isManagerialView ? <TeamDashboard currentUser={currentUserProfile} teamMembers={teamMembersProfiles} dashboardData={teamDashboardData} setActivePage={setActivePage} /> : null;
        case 'sidebar.reports': return isManagerialView ? <ManagerReportsPage reportsData={teamReportsData} teamMembers={teamMembersProfiles} teamGoals={teamGoals} attendanceRecords={attendanceRecords} requests={requests} externalTasks={externalTasks} /> : null;
        case 'sidebar.teamAnalytics': return isManagerialView ? <TeamAnalyticsPage teamDetails={mockTeamMemberDetails} currentUser={currentUserProfile} onUpdateProfile={updateUser} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} onCourseApprovalAction={()=>{}} onSaveMonthlyCheckIn={()=>{}} performanceReviews={performanceReviews} onSavePerformanceReview={handleSavePerformanceReview} activeModules={activeModules} salaryComponents={salaryComponents} compensationPackages={compensationPackages} onSaveDocument={()=>{}} /> : null;
        case 'sidebar.performance': return <PerformancePage reviews={performanceReviews.filter(r => r.employeeId === currentUserId)} monthlyCheckIns={monthlyCheckIns.filter(m => m.employeeId === currentUserId)} />;
        case 'sidebar.myDocuments': return <MyDocumentsPage documents={employeeDocuments.filter(d => d.employeeId === currentUserId)} onSaveDocument={handleSaveDocument} />;
        case 'sidebar.settings': return <SettingsPage theme={theme} setTheme={setTheme} currentUser={currentUserProfile} setActivePage={setActivePage} companyName={companyName} onCompanyNameChange={setCompanyName} />;
        case 'sidebar.employeeManagement': return isManagerialView ? <SystemAdminPage allUsers={employees} onUpdateUserRole={updateUserRole} onDeactivateUser={deactivateUser} onReactivateUser={reactivateUser} onAddNewUser={addNewUser} onUpdateUser={updateUser} onBulkDeactivateUsers={bulkDeactivateUsers} onBulkAssignAttendancePolicy={bulkAssignAttendancePolicy} onBulkAssignOvertimePolicy={bulkAssignOvertimePolicy} onBulkAssignLeavePolicy={bulkAssignLeavePolicy} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} compensationPackages={compensationPackages} /> : null;
        case 'sidebar.branchManagement': return isManagerialView ? <BranchManagementPage branches={branches} employees={employees} onAddBranch={(name, managerId) => { const newBranch = addBranch(name); if (managerId) updateBranchManager(newBranch.id, managerId);}} onUpdateBranch={(id, name, managerId) => { updateBranch(id, name); if (managerId) updateBranchManager(id, managerId); }} onArchiveBranch={archiveBranch} /> : null;
        case 'sidebar.learning': return <LearningPage currentUser={currentUserProfile} allCourses={courses} employeeCourses={employeeCourses.filter(ec => ec.employeeId === currentUserId)} onRegisterExternalCourse={()=>{}} onSubmitCourseUpdate={()=>{}} />;
        case 'sidebar.learningManagement': return isManagerialView ? <LearningManagementPage allCourses={courses} onSaveCourse={handleSaveCourse} /> : null;
        case 'sidebar.attendancePolicies': return isManagerialView ? <AttendancePolicyPage attendancePolicies={attendancePolicies} employees={employees} onSaveAttendancePolicy={saveAttendancePolicy} onArchivePolicy={archiveAttendancePolicy} onBulkAssignPolicy={bulkAssignAttendancePolicy} onBulkArchivePolicies={bulkArchiveAttendancePolicies} currentUser={currentUserProfile} branches={branches} onUpdatePolicyStatus={() => {}} workLocations={workLocations} onAddWorkLocation={(loc) => setWorkLocations(p => [...p, {...loc, id: `loc-${Date.now()}`}])} onUpdateWorkLocation={(loc) => setWorkLocations(p => p.map(l => l.id === loc.id ? loc : l))} /> : null;
        case 'sidebar.overtimePolicies': return isManagerialView ? <OvertimePolicyPage overtimePolicies={overtimePolicies} employees={employees} onSaveOvertimePolicy={saveOvertimePolicy} onArchivePolicy={archiveOvertimePolicy} onBulkAssignPolicy={bulkAssignOvertimePolicy} onBulkArchivePolicies={bulkArchiveOvertimePolicies} currentUser={currentUserProfile} branches={branches} onUpdatePolicyStatus={() => {}} /> : null;
        case 'sidebar.leavePolicies': return isManagerialView ? <LeavePolicyPage leavePolicies={leavePolicies} employees={employees} onSaveLeavePolicy={saveLeavePolicy} onArchivePolicy={archiveLeavePolicy} onBulkAssignPolicy={bulkAssignLeavePolicy} onBulkArchivePolicies={bulkArchiveLeavePolicies} currentUser={currentUserProfile} branches={branches} onUpdatePolicyStatus={()=>{}} /> : null;
        case 'sidebar.jobTitles': return isManagerialView ? <JobTitlesPage jobTitles={jobTitles} employees={employees} onSaveJobTitle={saveJobTitle} onDeleteJobTitle={deleteJobTitle} /> : null;
        case 'sidebar.compensation': return isManagerialView ? <CompensationPage salaryComponents={salaryComponents} compensationPackages={compensationPackages} onSaveSalaryComponent={(c) => setSalaryComponents(p => [...p, c])} onSaveCompensationPackage={(p) => setCompensationPackages(prev => [...prev, p])} /> : null;
        case 'sidebar.support': return <SupportTicketsPage currentUser={currentUserProfile} allUsers={employees} allTickets={supportTickets} onCreateTicket={()=>{}} onAddMessage={()=>{}} onUpdateTicketStatus={()=>{}} />;
        case 'sidebar.recruitment': return isManagerialView ? <RecruitmentPage jobOpenings={jobOpenings} candidates={candidates} onUpdateCandidateStage={handleUpdateCandidateStage} /> : null;
        case 'sidebar.onboarding': return isManagerialView ? <OnboardingPage onboardingProcesses={onboardingProcesses} onboardingTemplates={onboardingTemplates} employees={employees} onStartOnboarding={handleStartOnboarding} onUpdateTask={handleUpdateOnboardingTask} /> : null;
        case 'sidebar.offboarding': return isManagerialView ? <OffboardingPage offboardingProcesses={offboardingProcesses} offboardingTemplates={offboardingTemplates} employees={employees} onStartOffboarding={handleStartOffboarding} onUpdateTask={handleUpdateOffboardingTask} /> : null;
        case 'sidebar.documentManagement': return isManagerialView ? <DocumentManagementPage allDocuments={employeeDocuments} employees={employees} onSaveDocument={()=>{}} onBulkDeleteDocuments={()=>{}} /> : null;
        case 'sidebar.onboardingTemplates': return isManagerialView ? <OnboardingTemplatesPage onboardingTemplates={onboardingTemplates} onboardingProcesses={onboardingProcesses} onSaveTemplate={(t) => setOnboardingTemplates(p => p.find(pt => pt.id === t.id) ? p.map(pt => pt.id === t.id ? t : pt) : [...p, t])} onDeleteTemplate={(id) => setOnboardingTemplates(p => p.filter(pt => pt.id !== id))} /> : null;
        case 'sidebar.offboardingTemplates': return isManagerialView ? <OffboardingTemplatesPage offboardingTemplates={offboardingTemplates} offboardingProcesses={offboardingProcesses} onSaveTemplate={(t) => setOffboardingTemplates(p => p.find(pt => pt.id === t.id) ? p.map(pt => pt.id === t.id ? t : pt) : [...p, t])} onDeleteTemplate={(id) => setOffboardingTemplates(p => p.filter(pt => pt.id !== id))} /> : null;
        case 'sidebar.myOnboarding': return <MyOnboardingPage process={onboardingProcesses.find(p => p.employeeId === currentUserId)!} onUpdateTask={handleUpdateOnboardingTask} />;
        case 'sidebar.myOffboarding': return <MyOffboardingPage process={offboardingProcesses.find(p => p.employeeId === currentUserId)!} onUpdateTask={handleUpdateOffboardingTask} />;
        case 'sidebar.moduleManagement': return isManagerialView ? <ModuleManagementPage activeModules={activeModules} onToggleModule={(m) => setActiveModules(p => { const n = new Set(p); if (n.has(m)) n.delete(m); else n.add(m); return n; })} /> : null;
        case 'sidebar.myTasks': return <MyTasksPage externalTasks={externalTasks.filter(t => t.employeeId === currentUserId)} onNewRequest={() => {}} />;
        case 'sidebar.externalTasksManagement': return isManagerialView ? <ExternalTasksPage teamMembers={teamMembersProfiles} externalTasks={externalTasks.filter(t => teamMembersProfiles.some(m => m.id === t.employeeId))} onSaveTask={()=>{}} onRequestAction={()=>{}} /> : null;
        case 'sidebar.myRequests': return <MyRequestsPage requests={requests.filter(r => r.employeeId === currentUserId)} currentUser={currentUserProfile} />;
        case 'sidebar.turnoverAnalysis': return isManagerialView ? <TurnoverReportPage teamMembers={teamMembersProfiles} /> : null;
        case 'sidebar.performanceManagement': return isManagerialView ? <ManagerPerformancePage data={managerPerformanceData} onSavePerformanceReview={handleSavePerformanceReview} performanceReviews={performanceReviews} currentUser={currentUserProfile} /> : null;
        case 'sidebar.assetsManagement': return isManagerialView ? <AssetsManagementPage employees={employees} /> : null;
        case 'sidebar.myAssets': return <MyAssetsPage currentUserId={currentUserId} />;
        case 'sidebar.contracts': return isManagerialView ? <ContractsPage /> : null;
        case 'sidebar.orgChart': return isManagerialView ? <OrgChartPage /> : null;
        case 'sidebar.helpCenter': return <HelpCenterPage isSuperAdmin={currentUserProfile.role === 'Super Admin'} />;
        case 'sidebar.employeeDirectory': return <EmployeeDirectoryPage />;
        default:
            return <Dashboard currentUser={currentUserProfile} dashboardData={employeeDashboardData} onClockIn={handleClockIn} setActivePage={setActivePage} activeModules={activeModules} />;
    }
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900`}>
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        companyName={companyName}
        currentUser={currentUserProfile}
        hasOnboardingProcess={onboardingProcesses.some(p => p.employeeId === currentUserId)}
        hasOffboardingProcess={offboardingProcesses.some(p => p.employeeId === currentUserId)}
        activeModules={activeModules}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(p => !p)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          pageTitle={pageTitle} 
          currentUser={currentUserProfile} 
          allEmployees={employees}
          currentUserId={currentUserId}
          setCurrentUserId={setCurrentUserId}
          notifications={notifications}
          unreadCount={notifications.filter(n => !n.isRead).length}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          branches={branches}
        />
        <main ref={mainContentRef} className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
       <Chatbot currentUser={currentUserProfile}/>
    </div>
  );
};

export default App;