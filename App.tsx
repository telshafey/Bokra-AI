import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AttendancePage from './components/AttendancePage';
import TeamDashboard from './components/TeamDashboard';
import { useUserContext } from './components/contexts/UserContext';
import { useCompanyStructureContext } from './components/contexts/CompanyStructureContext';
import { usePoliciesContext } from './components/contexts/PoliciesContext';
import { useAssetsContext } from './components/contexts/AssetsContext';
import Chatbot from './components/Chatbot';
import TeamAnalyticsPage from './components/TeamAnalyticsPage';
import ProfilePage from './components/ProfilePage';
import ManagerReportsPage from './components/ManagerReportsPage';
import PayslipPage from './components/PayslipPage';
import LeavePage from './components/LeavePage';
import MyRequestsPage from './components/MyRequestsPage';
import PerformancePage from './components/PerformancePage';
import LearningPage from './components/LearningPage';
import ContractsPage from './components/ContractsPage';
import TurnoverReportPage from './components/TurnoverReportPage';
import ManagerPerformancePage from './components/ManagerPerformancePage';
import SystemAdminPage from './components/SystemAdminPage';
import BranchManagementPage from './components/BranchManagementPage';
import RecruitmentPage from './components/RecruitmentPage';
import OnboardingPage from './components/OnboardingPage';
import OffboardingPage from './components/OffboardingPage';
import LearningManagementPage from './components/LearningManagementPage';
import MyDocumentsPage from './components/MyDocumentsPage';
import DocumentManagementPage from './components/DocumentManagementPage';
import AssetsManagementPage from './components/AssetsManagementPage';
import MyAssetsPage from './components/MyAssetsPage';
import SupportTicketsPage from './components/SupportTicketsPage';
import SettingsPage from './components/SettingsPage';
import MyOnboardingPage from './components/MyOnboardingPage';
import MyOffboardingPage from './components/MyOffboardingPage';
import MyTasksPage from './components/MyTasksPage';
import ExternalTasksPage from './components/ExternalTasksPage';
import JobTitlesPage from './components/JobTitlesPage';
import CompensationPage from './components/CompensationPage';
import AttendancePolicyPage from './components/AttendancePolicyPage';
import OvertimePolicyPage from './components/OvertimePolicyPage';
import LeavePolicyPage from './components/LeavePolicyPage';
import OnboardingTemplatesPage from './components/OnboardingTemplatesPage';
import OffboardingTemplatesPage from './components/OffboardingTemplatesPage';
import ModuleManagementPage from './components/ModuleManagementPage';
import OrgChartPage from './components/OrgChartPage';
import HelpCenterPage from './components/HelpCenterPage';
import EmployeeDirectoryPage from './components/EmployeeDirectoryPage';
import ApprovalWorkflowsPage from './components/ApprovalWorkflowsPage';
import LoadingSpinner from './components/LoadingSpinner';
import BranchAdminPage from './components/BranchAdminPage';
import { MOCK_DASHBOARD_DATA, MOCK_TEAM_DASHBOARD_DATA, MOCK_TEAM_REPORTS_DATA, MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_PERFORMANCE_REVIEWS, MOCK_MONTHLY_CHECKINS, MOCK_ALL_COURSES, MOCK_EMPLOYEE_COURSES, MOCK_GOALS, MOCK_TEAM_PERFORMANCE_DATA } from './constants';
import { useTranslation } from './components/contexts/LanguageContext';
import ToastContainer from './components/ToastContainer';

// Dummy data imports for now
import { MOCK_NOTIFICATIONS, MOCK_ONBOARDING_PROCESSES, MOCK_OFFBOARDING_PROCESSES, MOCK_EMPLOYEE_DOCUMENTS, MOCK_SUPPORT_TICKETS, MOCK_EXTERNAL_TASKS } from './constants';

function App() {
    const { employees, isLoading: usersLoading, ...userActions } = useUserContext();
    const { branches, jobTitles, ...structureActions } = useCompanyStructureContext();
    const { attendancePolicies, leavePolicies, overtimePolicies, onboardingTemplates, offboardingTemplates, salaryComponents, compensationPackages, ...policyActions } = usePoliciesContext();
    const { assets } = useAssetsContext();

    const [activePage, setActivePage] = useState('sidebar.personalDashboard');
    const [currentUserId, setCurrentUserId] = useState('emp-001');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const { language, setLanguage } = useTranslation();
    
    // Notifications state (simple version)
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);


    useEffect(() => {
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [language, theme]);


    if (usersLoading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><LoadingSpinner /></div>;
    }

    const currentUser = employees.find(e => e.id === currentUserId) || employees[0];

    const renderPage = () => {
        switch (activePage) {
            case 'sidebar.personalDashboard':
                return <Dashboard currentUser={currentUser} dashboardData={MOCK_DASHBOARD_DATA} onClockIn={() => {}} setActivePage={setActivePage} activeModules={new Set(['learning', 'support'])} />;
            case 'sidebar.myAttendance':
                return <AttendancePage currentUser={currentUser} attendanceRecords={currentUser.attendanceRecords || []} policy={attendancePolicies[0]} externalTasks={[]} />;
            case 'sidebar.teamDashboard':
                return <TeamDashboard teamDashboardData={MOCK_TEAM_DASHBOARD_DATA} onAction={() => {}} />;
            case 'sidebar.teamAnalytics':
                const teamDetails = employees.filter(e => e.managerId === currentUserId).map(e => ({ profile: e, stats: { usedPermissionHours: 2, usedAnnualLeavesDays: 5, usedRemoteDays: 1, emergencyDays: 0 }, goals: MOCK_GOALS.filter(g => g.employeeId === e.id), reviews: MOCK_PERFORMANCE_REVIEWS.filter(r => r.employeeId === e.id), documents: [], pettyCashRequests: [], assets: [] }));
                return <TeamAnalyticsPage teamDetails={teamDetails} currentUser={currentUser} branches={branches} salaryComponents={salaryComponents} compensationPackages={compensationPackages} onSaveDocument={() => {}} />;
            case 'sidebar.profile':
                return <ProfilePage currentUser={currentUser} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} onUpdateProfile={userActions.updateProfile} />;
            case 'sidebar.reports':
                return <ManagerReportsPage reportsData={MOCK_TEAM_REPORTS_DATA} teamMembers={employees.filter(e => e.managerId === currentUser.id)} teamGoals={MOCK_GOALS} attendanceRecords={employees.flatMap(e => e.attendanceRecords || [])} requests={[]} externalTasks={[]}/>;
            case 'sidebar.payrollAndExpenses':
                return <PayslipPage payslips={currentUser.payslips || []} pettyCashRequests={[]} />;
            case 'sidebar.leave':
                return <LeavePage leaveBalances={currentUser.leaveBalances} leaveHistory={[]} />;
            case 'sidebar.myRequests':
                return <MyRequestsPage allRequests={[]} currentUserId={currentUser.id} />;
             case 'sidebar.performance':
                return <PerformancePage reviews={MOCK_PERFORMANCE_REVIEWS.filter(r => r.employeeId === currentUser.id)} monthlyCheckIns={MOCK_MONTHLY_CHECKINS.filter(mc => mc.employeeId === currentUser.id)} />;
            case 'sidebar.learning':
                return <LearningPage currentUser={currentUser} allCourses={MOCK_ALL_COURSES} employeeCourses={MOCK_EMPLOYEE_COURSES.filter(ec => ec.employeeId === currentUser.id)} onRegisterExternalCourse={() => {}} onSubmitCourseUpdate={() => {}} />;
            case 'sidebar.turnoverAnalysis':
                return <TurnoverReportPage teamMembers={employees.filter(e => e.managerId === currentUser.id && e.isEmployee)} />;
            case 'sidebar.performanceManagement':
                return <ManagerPerformancePage data={MOCK_TEAM_PERFORMANCE_DATA} onSavePerformanceReview={() => {}} performanceReviews={MOCK_PERFORMANCE_REVIEWS} currentUser={currentUser}/>;
            case 'sidebar.employeeManagement':
                return <SystemAdminPage allUsers={employees} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} compensationPackages={compensationPackages} {...userActions} />;
            case 'sidebar.branchManagement':
                return <BranchManagementPage branches={branches} employees={employees} onAddBranch={() => {}} onUpdateBranch={() => {}} onArchiveBranch={() => {}} />;
            case 'sidebar.recruitment':
                return <RecruitmentPage jobOpenings={MOCK_JOB_OPENINGS} candidates={MOCK_CANDIDATES} onUpdateCandidateStage={() => {}} />;
            case 'sidebar.onboarding':
                return <OnboardingPage onboardingProcesses={MOCK_ONBOARDING_PROCESSES} onboardingTemplates={onboardingTemplates} employees={employees} onStartOnboarding={() => {}} onUpdateTask={() => {}} />;
            case 'sidebar.offboarding':
                 return <OffboardingPage offboardingProcesses={MOCK_OFFBOARDING_PROCESSES} offboardingTemplates={offboardingTemplates} employees={employees} onStartOffboarding={() => {}} onUpdateTask={() => {}} />;
            case 'sidebar.learningManagement':
                return <LearningManagementPage allCourses={MOCK_ALL_COURSES} onSaveCourse={() => {}} />;
            case 'sidebar.myDocuments':
                return <MyDocumentsPage documents={MOCK_EMPLOYEE_DOCUMENTS.filter(d => d.employeeId === currentUser.id)} onSaveDocument={() => {}} />;
            case 'sidebar.documentManagement':
                 return <DocumentManagementPage allDocuments={MOCK_EMPLOYEE_DOCUMENTS} employees={employees} onSaveDocument={() => {}} onBulkDeleteDocuments={() => {}} />;
            case 'sidebar.assetsManagement':
                return <AssetsManagementPage employees={employees} />;
            case 'sidebar.myAssets':
                return <MyAssetsPage currentUserId={currentUser.id} />;
            case 'sidebar.support':
                return <SupportTicketsPage currentUser={currentUser} allUsers={employees} allTickets={MOCK_SUPPORT_TICKETS} onCreateTicket={() => {}} onAddMessage={() => {}} onUpdateTicketStatus={() => {}}/>
            case 'sidebar.settings':
                return <SettingsPage theme={theme} setTheme={setTheme} currentUser={currentUser} setActivePage={setActivePage} companyName="Bokra HRMS" onCompanyNameChange={()=>{}} />;
            case 'sidebar.myOnboarding':
                const userOnboarding = MOCK_ONBOARDING_PROCESSES.find(p => p.employeeId === currentUser.id);
                return userOnboarding ? <MyOnboardingPage process={userOnboarding} onUpdateTask={()=>{}} /> : <div>No onboarding plan assigned.</div>;
            case 'sidebar.myOffboarding':
                 const userOffboarding = MOCK_OFFBOARDING_PROCESSES.find(p => p.employeeId === currentUser.id);
                return userOffboarding ? <MyOffboardingPage process={userOffboarding} onUpdateTask={()=>{}} /> : <div>No offboarding plan assigned.</div>;
            case 'sidebar.myTasks':
                return <MyTasksPage externalTasks={MOCK_EXTERNAL_TASKS.filter(t => t.employeeId === currentUser.id)} onNewRequest={() => {}} />;
            case 'sidebar.externalTasksManagement':
                return <ExternalTasksPage teamMembers={employees.filter(e => e.managerId === currentUser.id)} externalTasks={MOCK_EXTERNAL_TASKS} onSaveTask={() => {}} onRequestAction={() => {}} />;
            case 'sidebar.jobTitles':
                return <JobTitlesPage jobTitles={jobTitles} employees={employees} onSaveJobTitle={structureActions.saveJobTitle} onDeleteJobTitle={structureActions.deleteJobTitle} />;
            case 'sidebar.compensation':
                return <CompensationPage salaryComponents={salaryComponents} compensationPackages={compensationPackages} onSaveSalaryComponent={policyActions.saveSalaryComponent} onSaveCompensationPackage={policyActions.saveCompensationPackage} />;
            case 'sidebar.attendancePolicies':
                return <AttendancePolicyPage policies={attendancePolicies} onSavePolicy={policyActions.saveAttendancePolicy} allEmployees={employees} onAssignPolicy={userActions.bulkAssignAttendancePolicy} workLocations={[]} />;
            case 'sidebar.overtimePolicies':
                 return <OvertimePolicyPage policies={overtimePolicies} onSavePolicy={policyActions.saveOvertimePolicy} allEmployees={employees} onAssignPolicy={userActions.bulkAssignOvertimePolicy} />;
            case 'sidebar.leavePolicies':
                 return <LeavePolicyPage policies={leavePolicies} onSavePolicy={policyActions.saveLeavePolicy} allEmployees={employees} onAssignPolicy={userActions.bulkAssignLeavePolicy} />;
            case 'sidebar.onboardingTemplates':
                return <OnboardingTemplatesPage templates={onboardingTemplates} onSave={policyActions.saveOnboardingTemplate} onDelete={policyActions.deleteOnboardingTemplate} />;
            case 'sidebar.offboardingTemplates':
                 return <OffboardingTemplatesPage templates={offboardingTemplates} onSave={policyActions.saveOffboardingTemplate} onDelete={policyActions.deleteOffboardingTemplate} />;
            case 'sidebar.moduleManagement':
                return <ModuleManagementPage activeModules={new Set(['payroll', 'documents'])} onToggleModule={() => {}} />;
            case 'sidebar.orgChart':
                return <OrgChartPage />;
            case 'sidebar.helpCenter':
                return <HelpCenterPage isSuperAdmin={currentUser.role === 'Super Admin'} />;
            case 'sidebar.employeeDirectory':
                return <EmployeeDirectoryPage />;
            case 'sidebar.approvalWorkflows':
                return <ApprovalWorkflowsPage />;
            case 'sidebar.branchDashboard':
                 const branchEmployees = employees.filter(e => e.branchId === currentUser.branchId);
                return <BranchAdminPage branchEmployees={branchEmployees} branchPendingRequests={[]} onAction={() => {}} currentUser={currentUser} />;
            default:
                return <div>Page not found: {activePage}</div>;
        }
    };

    return (
        <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <ToastContainer />
            {isMobileSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileSidebarOpen(false)}></div>}
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
                companyName="Bokra HRMS"
                currentUser={currentUser}
                hasOnboardingProcess={!!MOCK_ONBOARDING_PROCESSES.find(p => p.employeeId === currentUser.id)}
                hasOffboardingProcess={!!MOCK_OFFBOARDING_PROCESSES.find(p => p.employeeId === currentUser.id)}
                activeModules={new Set(['payroll', 'documents', 'recruitment', 'performance', 'learning', 'onboarding', 'offboarding', 'assets', 'support', 'help_center'])}
                isSidebarCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                theme={theme}
                setTheme={setTheme}
                language={language}
                setLanguage={setLanguage}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    pageTitle={activePage}
                    currentUser={currentUser}
                    allEmployees={employees}
                    currentUserId={currentUserId}
                    setCurrentUserId={setCurrentUserId}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
                    onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
                    onClearAll={() => setNotifications([])}
                    branches={branches}
                    setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                />
                <main className="flex-1 overflow-y-auto p-6">
                    {renderPage()}
                </main>
            </div>
            {currentUser.isEmployee && <Chatbot currentUser={currentUser}/>}
        </div>
    );
}

export default App;
