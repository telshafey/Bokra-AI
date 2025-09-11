import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AttendancePage from './components/AttendancePage';
import LeavePage from './components/LeavePage';
import PayslipPage from './components/PayslipPage';
import ProfilePage from './components/ProfilePage';
import MyRequestsPage from './components/MyRequestsPage';
import TeamDashboard from './components/TeamDashboard';
import TeamAnalyticsPage from './components/TeamAnalyticsPage';
import SystemAdminPage from './components/SystemAdminPage';
import BranchAdminPage from './components/BranchAdminPage';
import ManagerReportsPage from './components/ManagerReportsPage';
import SettingsPage from './components/SettingsPage';
import ContractsPage from './components/ContractsPage';
import MyOnboardingPage from './components/MyOnboardingPage';
import MyOffboardingPage from './components/MyOffboardingPage';
import OnboardingPage from './components/OnboardingPage';
import OffboardingPage from './components/OffboardingPage';
import OnboardingTemplatesPage from './components/OnboardingTemplatesPage';
import OffboardingTemplatesPage from './components/OffboardingTemplatesPage';
import MyDocumentsPage from './components/MyDocumentsPage';
import DocumentManagementPage from './components/DocumentManagementPage';
import MyAssetsPage from './components/MyAssetsPage';
import AssetsManagementPage from './components/AssetsManagementPage';
import LearningPage from './components/LearningPage';
import LearningManagementPage from './components/LearningManagementPage';
import PerformancePage from './components/PerformancePage';
import ManagerPerformancePage from './components/ManagerPerformancePage';
import RecruitmentPage from './components/RecruitmentPage';
import MyTasksPage from './components/MyTasksPage';
import ExternalTasksPage from './components/ExternalTasksPage';
import TurnoverReportPage from './components/TurnoverReportPage';
import SupportTicketsPage from './components/SupportTicketsPage';
import OrgChartPage from './components/OrgChartPage';
import BranchManagementPage from './components/BranchManagementPage';
import JobTitlesPage from './components/JobTitlesPage';
import CompensationPage from './components/CompensationPage';
import AttendancePolicyPage from './components/AttendancePolicyPage';
import OvertimePolicyPage from './components/OvertimePolicyPage';
import LeavePolicyPage from './components/LeavePolicyPage';
import ModuleManagementPage from './components/ModuleManagementPage';
import HelpCenterPage from './components/HelpCenterPage';
import EmployeeDirectoryPage from './components/EmployeeDirectoryPage';
import ApprovalWorkflowsPage from './components/ApprovalWorkflowsPage';

import { useUserContext } from './components/contexts/UserContext';
import { useCompanyStructureContext } from './components/contexts/CompanyStructureContext';
import { usePoliciesContext } from './components/contexts/PoliciesContext';
import { useRequestContext } from './components/contexts/RequestContext';
import { useAssetsContext } from './components/contexts/AssetsContext';
import { useHelpCenterContext } from './components/contexts/HelpCenterContext';

import Chatbot from './components/Chatbot';

import { useTranslation, Language } from './components/contexts/LanguageContext';
import { MOCK_DASHBOARD_DATA, MOCK_TEAM_DASHBOARD_DATA, MOCK_NOTIFICATIONS, MOCK_TEAM_REPORTS_DATA, MOCK_TEAM_PERFORMANCE_DATA, MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_ONBOARDING_PROCESSES, MOCK_OFFBOARDING_PROCESSES, MOCK_EMPLOYEE_DOCUMENTS, MOCK_ALL_COURSES, MOCK_EMPLOYEE_COURSES, MOCK_PERFORMANCE_REVIEWS, MOCK_MONTHLY_CHECKINS, MOCK_EXTERNAL_TASKS, MOCK_SUPPORT_TICKETS, MOCK_SALARY_COMPONENTS, MOCK_COMPENSATION_PACKAGES } from './constants';
import { AppModule, EmployeeProfile, HRRequest, UserRole } from './types';

const App: React.FC = () => {
    const { employees, ...userActions } = useUserContext();
    const { branches, jobTitles, ...structureActions } = useCompanyStructureContext();
    const { attendancePolicies, leavePolicies, overtimePolicies, approvalWorkflows, ...policyActions } = usePoliciesContext();
    const { leaveRequests, attendanceAdjustmentRequests, leavePermitRequests, pettyCashRequests, ...requestActions } = useRequestContext();
    const { assets, ...assetActions } = useAssetsContext();
    const { articles, categories, ...helpCenterActions } = useHelpCenterContext();

    const [currentUserId, setCurrentUserId] = useState('emp-001');
    
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const { language, setLanguage } = useTranslation();

    const [activeModules, setActiveModules] = useState<Set<AppModule>>(new Set(['payroll', 'documents', 'recruitment', 'performance', 'learning', 'onboarding', 'offboarding', 'assets', 'support', 'help_center']));

    const currentUser = useMemo(() => employees.find(e => e.id === currentUserId)!, [employees, currentUserId]);
    
    const getInitialPage = (user: EmployeeProfile): string => {
        const managerRoles: UserRole[] = ['Super Admin', 'Admin', 'General Manager', 'HR Manager', 'Team Lead'];
        if (managerRoles.includes(user.role)) {
            return 'sidebar.teamDashboard';
        }
        if (user.role === 'Branch Admin') {
            return 'sidebar.branchDashboard';
        }
        return 'sidebar.personalDashboard';
    };

    const [activePage, setActivePage] = useState(getInitialPage(currentUser));

    useEffect(() => {
        setActivePage(getInitialPage(currentUser));
    }, [currentUserId]);
    
    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [language, theme]);
    
    // Derived data for BranchAdminPage
    const branchEmployees = useMemo(() => {
        if (currentUser.role === 'Branch Admin') {
            return employees.filter(e => e.branchId === currentUser.branchId && e.isEmployee);
        }
        return [];
    }, [employees, currentUser]);

    const branchPendingRequests = useMemo(() => {
        if (currentUser.role !== 'Branch Admin') return [];

        const branchEmployeeIds = new Set(branchEmployees.map(e => e.id));
        const allRequests: HRRequest[] = [
            ...leaveRequests,
            ...attendanceAdjustmentRequests,
            ...leavePermitRequests,
            ...pettyCashRequests
        ];

        return allRequests
            .filter(req => branchEmployeeIds.has(req.employeeId) && req.status === 'Pending')
            .map(req => {
                const employee = employees.find(e => e.id === req.employeeId);
                return {
                    ...req,
                    employeeName: employee?.name || 'Unknown',
                    employeeAvatarUrl: employee?.avatarUrl || '',
                };
            });
    }, [currentUser, branchEmployees, employees, leaveRequests, attendanceAdjustmentRequests, leavePermitRequests, pettyCashRequests]);


    const onToggleModule = (moduleKey: AppModule) => {
        setActiveModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduleKey)) {
                newSet.delete(moduleKey);
            } else {
                newSet.add(moduleKey);
            }
            return newSet;
        });
    };
    
    const handleRequestAction = (requestId: string, newStatus: 'Approved' | 'Rejected', notes: string) => {
        requestActions.handleRequestAction(requestId, newStatus, notes, currentUser.id, currentUser.name);
    };

    const renderPage = () => {
        switch (activePage) {
            case 'sidebar.personalDashboard': return <Dashboard currentUser={currentUser} dashboardData={MOCK_DASHBOARD_DATA} onClockIn={() => {}} setActivePage={setActivePage} activeModules={activeModules} />;
            case 'sidebar.myAttendance': return <AttendancePage records={currentUser.attendanceRecords || []} attendanceEvents={[]} infractions={[]} currentUser={currentUser} externalTasks={MOCK_EXTERNAL_TASKS.filter(t => t.employeeId === currentUser.id)} />;
            case 'sidebar.leave': return <LeavePage currentUser={currentUser} />;
            case 'sidebar.payrollAndExpenses': return <PayslipPage payslips={currentUser.payslips || []} currentUser={currentUser} />;
            case 'sidebar.profile': return <ProfilePage currentUser={currentUser} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} onUpdateProfile={userActions.updateProfile} />;
            case 'sidebar.myRequests': return <MyRequestsPage currentUser={currentUser} />;
            case 'sidebar.myTasks': return <MyTasksPage externalTasks={MOCK_EXTERNAL_TASKS.filter(t => t.employeeId === currentUser.id)} onNewRequest={() => {}} />;
            case 'sidebar.myDocuments': return <MyDocumentsPage documents={MOCK_EMPLOYEE_DOCUMENTS.filter(d => d.employeeId === currentUser.id)} onSaveDocument={() => {}} />;
            case 'sidebar.myAssets': return <MyAssetsPage currentUserId={currentUser.id} />;
            case 'sidebar.myOnboarding': return <MyOnboardingPage process={MOCK_ONBOARDING_PROCESSES[0]} onUpdateTask={()=>{}} />;
            case 'sidebar.myOffboarding': return <MyOffboardingPage process={MOCK_OFFBOARDING_PROCESSES[0]} onUpdateTask={()=>{}} />;
            case 'sidebar.learning': return <LearningPage currentUser={currentUser} allCourses={MOCK_ALL_COURSES} employeeCourses={MOCK_EMPLOYEE_COURSES.filter(ec => ec.employeeId === currentUser.id)} onRegisterExternalCourse={() => {}} onSubmitCourseUpdate={() => {}} />;
            case 'sidebar.performance': return <PerformancePage reviews={MOCK_PERFORMANCE_REVIEWS.filter(r => r.employeeId === currentUser.id)} monthlyCheckIns={MOCK_MONTHLY_CHECKINS.filter(c => c.employeeId === currentUser.id)} />;
            case 'sidebar.support': return <SupportTicketsPage currentUser={currentUser} allUsers={employees} allTickets={MOCK_SUPPORT_TICKETS} onCreateTicket={() => {}} onAddMessage={() => {}} onUpdateTicketStatus={() => {}} />;
            
            // Manager Pages
            case 'sidebar.teamDashboard': return <TeamDashboard teamDashboardData={MOCK_TEAM_DASHBOARD_DATA} onAction={handleRequestAction} />;
            case 'sidebar.branchDashboard': return <BranchAdminPage branchEmployees={branchEmployees} branchPendingRequests={branchPendingRequests} onAction={handleRequestAction} currentUser={currentUser} />;
            case 'sidebar.teamAnalytics': return <TeamAnalyticsPage teamDetails={[]} currentUser={currentUser} onUpdateProfile={() => {}} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} onCourseApprovalAction={()=>{}} onSaveMonthlyCheckIn={()=>{}} performanceReviews={[]} onSavePerformanceReview={()=>{}} activeModules={activeModules} salaryComponents={MOCK_SALARY_COMPONENTS} compensationPackages={MOCK_COMPENSATION_PACKAGES} onSaveDocument={()=>{}} />;
            case 'sidebar.reports': return <ManagerReportsPage reportsData={MOCK_TEAM_REPORTS_DATA} teamMembers={[]} teamGoals={[]} attendanceRecords={[]} requests={[]} externalTasks={[]}/>;
            case 'sidebar.performanceManagement': return <ManagerPerformancePage data={MOCK_TEAM_PERFORMANCE_DATA} onSavePerformanceReview={()=>{}} performanceReviews={MOCK_PERFORMANCE_REVIEWS} currentUser={currentUser} />;
            case 'sidebar.turnoverAnalysis': return <TurnoverReportPage teamMembers={employees.filter(e => e.managerId === currentUser.id)} />;
            
            // HR/Admin Pages
            case 'sidebar.employeeManagement': return <SystemAdminPage allUsers={employees} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} compensationPackages={MOCK_COMPENSATION_PACKAGES} {...userActions} onAddNewUser={userActions.addNewUser} onUpdateUser={userActions.updateUser} onUpdateUserRole={userActions.updateUserRole} onDeactivateUser={userActions.deactivateUser} onReactivateUser={userActions.reactivateUser} onBulkDeactivateUsers={userActions.bulkDeactivateUsers} onBulkAssignAttendancePolicy={userActions.bulkAssignAttendancePolicy} onBulkAssignOvertimePolicy={userActions.bulkAssignOvertimePolicy} onBulkAssignLeavePolicy={userActions.bulkAssignLeavePolicy} />;
            case 'sidebar.recruitment': return <RecruitmentPage jobOpenings={MOCK_JOB_OPENINGS} candidates={MOCK_CANDIDATES} onUpdateCandidateStage={() => {}} />;
            case 'sidebar.onboarding': return <OnboardingPage onboardingProcesses={MOCK_ONBOARDING_PROCESSES} onboardingTemplates={policyActions.onboardingTemplates} employees={employees} onStartOnboarding={() => {}} onUpdateTask={() => {}} />;
            case 'sidebar.offboarding': return <OffboardingPage offboardingProcesses={MOCK_OFFBOARDING_PROCESSES} offboardingTemplates={policyActions.offboardingTemplates} employees={employees} onStartOffboarding={() => {}} onUpdateTask={() => {}} />;
            case 'sidebar.branchManagement': return <BranchManagementPage branches={branches} employees={employees} onAddBranch={(name) => { const newBranch=structureActions.addBranch(name); userActions.updateBranchManager(newBranch.id, ''); }} onUpdateBranch={(id, name, managerId) => { structureActions.updateBranch(id, name); userActions.updateBranchManager(id, managerId); }} onArchiveBranch={structureActions.archiveBranch} />;
            case 'sidebar.jobTitles': return <JobTitlesPage jobTitles={jobTitles} employees={employees} onSaveJobTitle={structureActions.saveJobTitle} onDeleteJobTitle={structureActions.deleteJobTitle} />;
            case 'sidebar.compensation': return <CompensationPage salaryComponents={policyActions.salaryComponents} compensationPackages={policyActions.compensationPackages} onSaveSalaryComponent={policyActions.saveSalaryComponent} onSaveCompensationPackage={policyActions.saveCompensationPackage} />;
            case 'sidebar.contracts': return <ContractsPage />;
            case 'sidebar.attendancePolicies': return <AttendancePolicyPage attendancePolicies={attendancePolicies} employees={employees} onSaveAttendancePolicy={policyActions.saveAttendancePolicy} onArchivePolicy={() => {}} onBulkAssignPolicy={() => {}} onBulkArchivePolicies={()=>{}} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={()=>{}} workLocations={policyActions.workLocations} onAddWorkLocation={policyActions.addWorkLocation} onUpdateWorkLocation={policyActions.updateWorkLocation} />;
            case 'sidebar.overtimePolicies': return <OvertimePolicyPage overtimePolicies={overtimePolicies} employees={employees} onSaveOvertimePolicy={policyActions.saveOvertimePolicy} onArchivePolicy={() => {}} onBulkAssignPolicy={() => {}} onBulkArchivePolicies={()=>{}} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={()=>{}} />;
            case 'sidebar.leavePolicies': return <LeavePolicyPage leavePolicies={leavePolicies} employees={employees} onSaveLeavePolicy={policyActions.saveLeavePolicy} onArchivePolicy={() => {}} onBulkAssignPolicy={() => {}} onBulkArchivePolicies={()=>{}} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={()=>{}} />;
            case 'sidebar.onboardingTemplates': return <OnboardingTemplatesPage onboardingTemplates={policyActions.onboardingTemplates} onboardingProcesses={MOCK_ONBOARDING_PROCESSES} onSaveTemplate={policyActions.saveOnboardingTemplate} onDeleteTemplate={policyActions.deleteOnboardingTemplate} />;
            case 'sidebar.offboardingTemplates': return <OffboardingTemplatesPage offboardingTemplates={policyActions.offboardingTemplates} offboardingProcesses={MOCK_OFFBOARDING_PROCESSES} onSaveTemplate={policyActions.saveOffboardingTemplate} onDeleteTemplate={policyActions.deleteOffboardingTemplate} />;
            case 'sidebar.documentManagement': return <DocumentManagementPage allDocuments={MOCK_EMPLOYEE_DOCUMENTS} employees={employees} onSaveDocument={() => {}} onBulkDeleteDocuments={() => {}} />;
            case 'sidebar.assetsManagement': return <AssetsManagementPage employees={employees} />;
            case 'sidebar.learningManagement': return <LearningManagementPage allCourses={MOCK_ALL_COURSES} onSaveCourse={() => {}} />;
            case 'sidebar.externalTasksManagement': return <ExternalTasksPage teamMembers={employees} externalTasks={MOCK_EXTERNAL_TASKS} onSaveTask={()=>{}} onRequestAction={()=>{}} />;
            case 'sidebar.orgChart': return <OrgChartPage />;
            case 'sidebar.moduleManagement': return <ModuleManagementPage activeModules={activeModules} onToggleModule={onToggleModule} />;
            case 'sidebar.helpCenter': return <HelpCenterPage isSuperAdmin={currentUser.role === 'Super Admin'} />;
            case 'sidebar.employeeDirectory': return <EmployeeDirectoryPage />;
            case 'sidebar.approvalWorkflows': return <ApprovalWorkflowsPage />;

            case 'sidebar.settings': return <SettingsPage theme={theme} setTheme={setTheme} currentUser={currentUser} setActivePage={setActivePage} companyName="Bokra HRMS" onCompanyNameChange={()=>{}} />;
            default: return <div className="p-6">Page not found: {activePage}</div>;
        }
    };
    
    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans ${language === 'ar' ? 'font-cairo' : ''}`}>
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                companyName="Bokra HRMS"
                currentUser={currentUser}
                hasOnboardingProcess={!!MOCK_ONBOARDING_PROCESSES.find(p => p.employeeId === currentUser.id)}
                hasOffboardingProcess={!!MOCK_OFFBOARDING_PROCESSES.find(p => p.employeeId === currentUser.id)}
                activeModules={activeModules}
                isSidebarCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    pageTitle={activePage}
                    currentUser={currentUser}
                    allEmployees={employees}
                    currentUserId={currentUserId}
                    setCurrentUserId={setCurrentUserId}
                    notifications={MOCK_NOTIFICATIONS}
                    unreadCount={MOCK_NOTIFICATIONS.filter(n => !n.isRead).length}
                    onMarkAsRead={() => {}}
                    onMarkAllAsRead={() => {}}
                    onClearAll={() => {}}
                    theme={theme}
                    setTheme={setTheme}
                    language={language}
                    setLanguage={(lang: Language) => setLanguage(lang)}
                    branches={branches}
                />
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderPage()}
                </div>
            </main>
            {currentUser.isEmployee && <Chatbot currentUser={currentUser}/>}
        </div>
    );
};

export default App;