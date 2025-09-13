import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ToastContainer from './components/ToastContainer';

// Lazy load all page components
const Dashboard = lazy(() => import('./components/Dashboard'));
const AttendancePage = lazy(() => import('./components/AttendancePage'));
const LeavePage = lazy(() => import('./components/LeavePage'));
const PayslipPage = lazy(() => import('./components/PayslipPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const MyRequestsPage = lazy(() => import('./components/MyRequestsPage'));
const TeamDashboard = lazy(() => import('./components/TeamDashboard'));
const TeamAnalyticsPage = lazy(() => import('./components/TeamAnalyticsPage'));
const SystemAdminPage = lazy(() => import('./components/SystemAdminPage'));
const BranchAdminPage = lazy(() => import('./components/BranchAdminPage'));
const ManagerReportsPage = lazy(() => import('./components/ManagerReportsPage'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const MyOnboardingPage = lazy(() => import('./components/MyOnboardingPage'));
const MyOffboardingPage = lazy(() => import('./components/MyOffboardingPage'));
const OnboardingPage = lazy(() => import('./components/OnboardingPage'));
const OffboardingPage = lazy(() => import('./components/OffboardingPage'));
const OnboardingTemplatesPage = lazy(() => import('./components/OnboardingTemplatesPage'));
const OffboardingTemplatesPage = lazy(() => import('./components/OffboardingTemplatesPage'));
const MyDocumentsPage = lazy(() => import('./components/MyDocumentsPage'));
const DocumentManagementPage = lazy(() => import('./components/DocumentManagementPage'));
const MyAssetsPage = lazy(() => import('./components/MyAssetsPage'));
const AssetsManagementPage = lazy(() => import('./components/AssetsManagementPage'));
const LearningPage = lazy(() => import('./components/LearningPage'));
const LearningManagementPage = lazy(() => import('./components/LearningManagementPage'));
const PerformancePage = lazy(() => import('./components/PerformancePage'));
const ManagerPerformancePage = lazy(() => import('./components/ManagerPerformancePage'));
const RecruitmentPage = lazy(() => import('./components/RecruitmentPage'));
const MyTasksPage = lazy(() => import('./components/MyTasksPage'));
const ExternalTasksPage = lazy(() => import('./components/ExternalTasksPage'));
const TurnoverReportPage = lazy(() => import('./components/TurnoverReportPage'));
const SupportTicketsPage = lazy(() => import('./components/SupportTicketsPage'));
const OrgChartPage = lazy(() => import('./components/OrgChartPage'));
const BranchManagementPage = lazy(() => import('./components/BranchManagementPage'));
const JobTitlesPage = lazy(() => import('./components/JobTitlesPage'));
const CompensationPage = lazy(() => import('./components/CompensationPage'));
const AttendancePolicyPage = lazy(() => import('./components/AttendancePolicyPage'));
const OvertimePolicyPage = lazy(() => import('./components/OvertimePolicyPage'));
const LeavePolicyPage = lazy(() => import('./components/LeavePolicyPage'));
const ModuleManagementPage = lazy(() => import('./components/ModuleManagementPage'));
const HelpCenterPage = lazy(() => import('./components/HelpCenterPage'));
const EmployeeDirectoryPage = lazy(() => import('./components/EmployeeDirectoryPage'));
const ApprovalWorkflowsPage = lazy(() => import('./components/ApprovalWorkflowsPage'));


import { useUserContext } from './components/contexts/UserContext';
import { useCompanyStructureContext } from './components/contexts/CompanyStructureContext';
import { usePoliciesContext } from './components/contexts/PoliciesContext';
import { useRequestContext } from './components/contexts/RequestContext';
import { useAssetsContext } from './components/contexts/AssetsContext';
import { useHelpCenterContext } from './components/contexts/HelpCenterContext';

import Chatbot from './components/Chatbot';

import { useTranslation, Language } from './components/contexts/LanguageContext';
import { MOCK_DASHBOARD_DATA, MOCK_TEAM_DASHBOARD_DATA, MOCK_NOTIFICATIONS, MOCK_TEAM_REPORTS_DATA, MOCK_TEAM_PERFORMANCE_DATA, MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_ONBOARDING_PROCESSES, MOCK_OFFBOARDING_PROCESSES, MOCK_EMPLOYEE_DOCUMENTS, MOCK_ALL_COURSES, MOCK_EMPLOYEE_COURSES, MOCK_PERFORMANCE_REVIEWS, MOCK_MONTHLY_CHECKINS, MOCK_EXTERNAL_TASKS, MOCK_SUPPORT_TICKETS, MOCK_SALARY_COMPONENTS, MOCK_COMPENSATION_PACKAGES, MOCK_GOALS } from './constants';
import { AppModule, EmployeeProfile, HRRequest, UserRole } from './types';

// Custom hook to persist state in localStorage
const useStickyState = <T,>(defaultValue: T | (() => T), key: string): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(() => {
        try {
            const stickyValue = window.localStorage.getItem(key);
            if (stickyValue !== null) {
                return JSON.parse(stickyValue);
            }
        } catch (error) {
            console.error(`Error parsing localStorage key “${key}”:`, error);
        }
        return defaultValue instanceof Function ? defaultValue() : defaultValue;
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, value]);

    return [value, setValue];
};


const App: React.FC = () => {
    const { employees, ...userActions } = useUserContext();
    const { branches, jobTitles, ...structureActions } = useCompanyStructureContext();
    const { attendancePolicies, leavePolicies, overtimePolicies, approvalWorkflows, ...policyActions } = usePoliciesContext();
    const { leaveRequests, attendanceAdjustmentRequests, leavePermitRequests, pettyCashRequests, ...requestActions } = useRequestContext();
    const { assets, ...assetActions } = useAssetsContext();
    const { articles, categories, ...helpCenterActions } = useHelpCenterContext();

    const [currentUserId, setCurrentUserId] = useState('emp-001');
    const [activeModules, setActiveModules] = useState<Set<AppModule>>(new Set(['payroll', 'documents', 'recruitment', 'performance', 'learning', 'onboarding', 'offboarding', 'assets', 'support', 'help_center']));
    
    const currentUser = useMemo(() => employees.find(e => e.id === currentUserId)!, [employees, currentUserId]);
    
    const { language, setLanguage, t } = useTranslation();

    // Persisted state
    const [theme, setTheme] = useStickyState<'light' | 'dark'>('light', 'bokra-theme');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useStickyState<boolean>(false, 'bokra-sidebar-collapsed');

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

    const [activePage, setActivePage] = useStickyState<string>(() => getInitialPage(currentUser), `bokra-active-page-${currentUser.id}`);

    // Update active page when user switches, overriding the sticky state for the previous user.
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

    const userOnboardingProcess = useMemo(() => MOCK_ONBOARDING_PROCESSES.find(p => p.employeeId === currentUser.id), [currentUser.id]);
    const userOffboardingProcess = useMemo(() => MOCK_OFFBOARDING_PROCESSES.find(p => p.employeeId === currentUser.id), [currentUser.id]);
    
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

    const teamDetails = useMemo(() => {
        return employees
            .filter(e => e.isEmployee)
            .map(employee => {
                const stats = {
                    usedPermissionHours: parseFloat((Math.random() * 8).toFixed(1)),
                    usedAnnualLeavesDays: Math.floor(Math.random() * 15),
                    usedRemoteDays: Math.floor(Math.random() * 10),
                    emergencyDays: Math.floor(Math.random() * 2),
                };
                const reviews = MOCK_PERFORMANCE_REVIEWS.filter(r => r.employeeId === employee.id);
                const goals = MOCK_GOALS.filter(g => g.employeeId === employee.id);
                const pettyCash = pettyCashRequests.filter(r => r.employeeId === employee.id);
                const documents = MOCK_EMPLOYEE_DOCUMENTS.filter(d => d.employeeId === employee.id);
                const userAssets = assets.filter(a => a.assignedToId === employee.id);

                return {
                    profile: employee,
                    stats,
                    reviews,
                    goals,
                    pettyCashRequests: pettyCash,
                    documents,
                    assets: userAssets,
                };
            });
    }, [employees, pettyCashRequests, assets]);


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
    
    const pageComponentMap = useMemo(() => ({
        'sidebar.personalDashboard': <Dashboard currentUser={currentUser} dashboardData={MOCK_DASHBOARD_DATA} onClockIn={() => {}} setActivePage={setActivePage} activeModules={activeModules} />,
        'sidebar.myAttendance': <AttendancePage records={currentUser.attendanceRecords || []} attendanceEvents={[]} infractions={[]} currentUser={currentUser} externalTasks={MOCK_EXTERNAL_TASKS.filter(t => t.employeeId === currentUser.id)} />,
        'sidebar.leave': <LeavePage currentUser={currentUser} />,
        'sidebar.payrollAndExpenses': <PayslipPage payslips={currentUser.payslips || []} currentUser={currentUser} />,
        'sidebar.profile': <ProfilePage currentUser={currentUser} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} onUpdateProfile={userActions.updateProfile} />,
        'sidebar.myRequests': <MyRequestsPage currentUser={currentUser} />,
        'sidebar.myTasks': <MyTasksPage externalTasks={MOCK_EXTERNAL_TASKS.filter(t => t.employeeId === currentUser.id)} onNewRequest={() => {}} />,
        'sidebar.myDocuments': <MyDocumentsPage documents={MOCK_EMPLOYEE_DOCUMENTS.filter(d => d.employeeId === currentUser.id)} onSaveDocument={() => {}} />,
        'sidebar.myAssets': <MyAssetsPage currentUserId={currentUser.id} />,
        'sidebar.myOnboarding': userOnboardingProcess ? <MyOnboardingPage process={userOnboardingProcess} onUpdateTask={()=>{}} /> : <div className="p-6 text-center">{t('app.myOnboardingFallback')}</div>,
        'sidebar.myOffboarding': userOffboardingProcess ? <MyOffboardingPage process={userOffboardingProcess} onUpdateTask={()=>{}} /> : <div className="p-6 text-center">{t('app.myOffboardingFallback')}</div>,
        'sidebar.learning': <LearningPage currentUser={currentUser} allCourses={MOCK_ALL_COURSES} employeeCourses={MOCK_EMPLOYEE_COURSES.filter(ec => ec.employeeId === currentUser.id)} onRegisterExternalCourse={() => {}} onSubmitCourseUpdate={() => {}} />,
        'sidebar.performance': <PerformancePage reviews={MOCK_PERFORMANCE_REVIEWS.filter(r => r.employeeId === currentUser.id)} monthlyCheckIns={MOCK_MONTHLY_CHECKINS.filter(c => c.employeeId === currentUser.id)} />,
        'sidebar.support': <SupportTicketsPage currentUser={currentUser} allUsers={employees} allTickets={MOCK_SUPPORT_TICKETS} onCreateTicket={() => {}} onAddMessage={() => {}} onUpdateTicketStatus={() => {}} />,
        'sidebar.teamDashboard': <TeamDashboard teamDashboardData={MOCK_TEAM_DASHBOARD_DATA} onAction={handleRequestAction} />,
        'sidebar.branchDashboard': <BranchAdminPage branchEmployees={branchEmployees} branchPendingRequests={branchPendingRequests} onAction={handleRequestAction} currentUser={currentUser} />,
        'sidebar.teamAnalytics': <TeamAnalyticsPage teamDetails={teamDetails} currentUser={currentUser} onUpdateProfile={() => {}} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} onCourseApprovalAction={()=>{}} onSaveMonthlyCheckIn={()=>{}} performanceReviews={[]} onSavePerformanceReview={()=>{}} activeModules={activeModules} salaryComponents={MOCK_SALARY_COMPONENTS} compensationPackages={MOCK_COMPENSATION_PACKAGES} onSaveDocument={()=>{}} />,
        'sidebar.reports': <ManagerReportsPage reportsData={MOCK_TEAM_REPORTS_DATA} teamMembers={[]} teamGoals={[]} attendanceRecords={[]} requests={[]} externalTasks={[]}/>,
        'sidebar.performanceManagement': <ManagerPerformancePage data={MOCK_TEAM_PERFORMANCE_DATA} onSavePerformanceReview={()=>{}} performanceReviews={MOCK_PERFORMANCE_REVIEWS} currentUser={currentUser} />,
        'sidebar.turnoverAnalysis': <TurnoverReportPage teamMembers={employees.filter(e => e.managerId === currentUser.id)} />,
        'sidebar.employeeManagement': <SystemAdminPage allUsers={employees} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} compensationPackages={MOCK_COMPENSATION_PACKAGES} {...userActions} onAddNewUser={userActions.addNewUser} onUpdateUser={userActions.updateUser} onUpdateUserRole={userActions.updateUserRole} onDeactivateUser={userActions.deactivateUser} onReactivateUser={userActions.reactivateUser} onBulkDeactivateUsers={userActions.bulkDeactivateUsers} onBulkAssignAttendancePolicy={userActions.bulkAssignAttendancePolicy} onBulkAssignOvertimePolicy={userActions.bulkAssignOvertimePolicy} onBulkAssignLeavePolicy={userActions.bulkAssignLeavePolicy} />,
        'sidebar.recruitment': <RecruitmentPage jobOpenings={MOCK_JOB_OPENINGS} candidates={MOCK_CANDIDATES} onUpdateCandidateStage={() => {}} />,
        'sidebar.onboarding': <OnboardingPage onboardingProcesses={MOCK_ONBOARDING_PROCESSES} onboardingTemplates={policyActions.onboardingTemplates} employees={employees} onStartOnboarding={() => {}} onUpdateTask={() => {}} />,
        'sidebar.offboarding': <OffboardingPage offboardingProcesses={MOCK_OFFBOARDING_PROCESSES} offboardingTemplates={policyActions.offboardingTemplates} employees={employees} onStartOffboarding={() => {}} onUpdateTask={() => {}} />,
        'sidebar.branchManagement': <BranchManagementPage branches={branches} employees={employees} onAddBranch={(name) => { const newBranch=structureActions.addBranch(name); userActions.updateBranchManager(newBranch.id, ''); }} onUpdateBranch={(id, name, managerId) => { structureActions.updateBranch(id, name); userActions.updateBranchManager(id, managerId); }} onArchiveBranch={structureActions.archiveBranch} />,
        'sidebar.jobTitles': <JobTitlesPage jobTitles={jobTitles} employees={employees} onSaveJobTitle={structureActions.saveJobTitle} onDeleteJobTitle={structureActions.deleteJobTitle} />,
        'sidebar.compensation': <CompensationPage salaryComponents={policyActions.salaryComponents} compensationPackages={policyActions.compensationPackages} onSaveSalaryComponent={policyActions.saveSalaryComponent} onSaveCompensationPackage={policyActions.saveCompensationPackage} />,
        'sidebar.attendancePolicies': <AttendancePolicyPage attendancePolicies={attendancePolicies} employees={employees} onSaveAttendancePolicy={policyActions.saveAttendancePolicy} onArchivePolicy={() => {}} onBulkAssignPolicy={() => {}} onBulkArchivePolicies={()=>{}} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={()=>{}} workLocations={policyActions.workLocations} onAddWorkLocation={policyActions.addWorkLocation} onUpdateWorkLocation={policyActions.updateWorkLocation} />,
        'sidebar.overtimePolicies': <OvertimePolicyPage overtimePolicies={overtimePolicies} employees={employees} onSaveOvertimePolicy={policyActions.saveOvertimePolicy} onArchivePolicy={() => {}} onBulkAssignPolicy={() => {}} onBulkArchivePolicies={()=>{}} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={()=>{}} />,
        'sidebar.leavePolicies': <LeavePolicyPage leavePolicies={leavePolicies} employees={employees} onSaveLeavePolicy={policyActions.saveLeavePolicy} onArchivePolicy={() => {}} onBulkAssignPolicy={() => {}} onBulkArchivePolicies={()=>{}} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={()=>{}} />,
        'sidebar.onboardingTemplates': <OnboardingTemplatesPage onboardingTemplates={policyActions.onboardingTemplates} onboardingProcesses={MOCK_ONBOARDING_PROCESSES} onSaveTemplate={policyActions.saveOnboardingTemplate} onDeleteTemplate={policyActions.deleteOnboardingTemplate} />,
        'sidebar.offboardingTemplates': <OffboardingTemplatesPage offboardingTemplates={policyActions.offboardingTemplates} offboardingProcesses={MOCK_OFFBOARDING_PROCESSES} onSaveTemplate={policyActions.saveOffboardingTemplate} onDeleteTemplate={policyActions.deleteOffboardingTemplate} />,
        'sidebar.documentManagement': <DocumentManagementPage allDocuments={MOCK_EMPLOYEE_DOCUMENTS} employees={employees} onSaveDocument={() => {}} onBulkDeleteDocuments={() => {}} />,
        'sidebar.assetsManagement': <AssetsManagementPage employees={employees} />,
        'sidebar.learningManagement': <LearningManagementPage allCourses={MOCK_ALL_COURSES} onSaveCourse={() => {}} />,
        'sidebar.externalTasksManagement': <ExternalTasksPage teamMembers={employees} externalTasks={MOCK_EXTERNAL_TASKS} onSaveTask={()=>{}} onRequestAction={()=>{}} />,
        'sidebar.orgChart': <OrgChartPage />,
        'sidebar.moduleManagement': <ModuleManagementPage activeModules={activeModules} onToggleModule={onToggleModule} />,
        'sidebar.helpCenter': <HelpCenterPage isSuperAdmin={currentUser.role === 'Super Admin'} />,
        'sidebar.employeeDirectory': <EmployeeDirectoryPage />,
        'sidebar.approvalWorkflows': <ApprovalWorkflowsPage />,
        'sidebar.settings': <SettingsPage theme={theme} setTheme={setTheme} currentUser={currentUser} setActivePage={setActivePage} companyName="Bokra HRMS" onCompanyNameChange={()=>{}} />,
    }), [currentUser, employees, branches, attendancePolicies, overtimePolicies, leavePolicies, jobTitles, policyActions, assets, pettyCashRequests, teamDetails, MOCK_DASHBOARD_DATA, setActivePage, activeModules, MOCK_EXTERNAL_TASKS, userOnboardingProcess, userOffboardingProcess, MOCK_ALL_COURSES, MOCK_EMPLOYEE_COURSES, MOCK_PERFORMANCE_REVIEWS, MOCK_MONTHLY_CHECKINS, MOCK_SUPPORT_TICKETS, MOCK_TEAM_DASHBOARD_DATA, handleRequestAction, branchEmployees, branchPendingRequests, MOCK_TEAM_REPORTS_DATA, MOCK_TEAM_PERFORMANCE_DATA, MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_ONBOARDING_PROCESSES, MOCK_OFFBOARDING_PROCESSES, MOCK_EMPLOYEE_DOCUMENTS, MOCK_SALARY_COMPONENTS, MOCK_COMPENSATION_PACKAGES, userActions, structureActions, theme, onToggleModule, t]);

    const renderPage = () => {
        const page = pageComponentMap[activePage as keyof typeof pageComponentMap];
        return page || <div className="p-6">Page not found: {activePage}</div>;
    };
    
    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans ${language === 'ar' ? 'font-cairo' : ''}`}>
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                companyName="Bokra HRMS"
                currentUser={currentUser}
                hasOnboardingProcess={!!userOnboardingProcess}
                hasOffboardingProcess={!!userOffboardingProcess}
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
                    <Suspense fallback={<LoadingSpinner />}>
                        {renderPage()}
                    </Suspense>
                </div>
            </main>
            {currentUser.isEmployee && <Chatbot currentUser={currentUser}/>}
            <ToastContainer />
        </div>
    );
};

export default App;