


import React, { useState, useMemo, useEffect } from 'react';
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
import { useTranslation } from './components/contexts/LanguageContext';

import { useAssetsContext } from './components/contexts/AssetsContext';
import { usePoliciesContext } from './components/contexts/PoliciesContext';
import { useUserContext } from './components/contexts/UserContext';
import { useCompanyStructureContext } from './components/contexts/CompanyStructureContext';
import { useRequestContext } from './components/contexts/RequestContext';


import { INITIAL_USER_ID, getDerivedData, MOCK_ATTENDANCE_RECORDS as INITIAL_ATTENDANCE, NAV_GROUPS, BOTTOM_NAV_ITEMS, MOCK_PERFORMANCE_REVIEWS as INITIAL_PERFORMANCE_REVIEWS, MOCK_EMPLOYEE_DOCUMENTS, generatePayslips, MOCK_COURSES, MOCK_EMPLOYEE_COURSES, MOCK_NOTIFICATIONS, MOCK_MONTHLY_CHECK_INS, MOCK_SALARY_COMPONENTS, MOCK_COMPENSATION_PACKAGES, MOCK_SUPPORT_TICKETS, MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_ONBOARDING_TEMPLATES, MOCK_ONBOARDING_PROCESSES, MOCK_OFFBOARDING_TEMPLATES, MOCK_OFFBOARDING_PROCESSES, MOCK_WORK_LOCATIONS, MOCK_ATTENDANCE_EVENTS, MOCK_EXTERNAL_TASKS, MOCK_GOALS, MOCK_EMPLOYEE_INFRACTIONS } from './constants';
// FIX: Added missing type imports. These types will be defined and exported in `types.ts`.
import { HRRequest, LeaveRequest, RequestStatus, PerformanceReview, EmployeeDocument, AttendanceRecord, AppModule, WorkLocation, AttendanceEvent, ExternalTask, CourseStatus, TicketStatus, Course, EmployeeCourse, Notification, MonthlyCheckIn, SalaryComponent, CompensationPackage, SupportTicket, AttendanceAdjustmentRequest, LeavePermitRequest, JobOpening, Candidate, CandidateStage, OnboardingProcess, OnboardingTemplate, OffboardingProcess, OffboardingTemplate, EmployeeProfile, AttentionItem } from './types';


const App: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const [activePage, setActivePage] = useState('sidebar.personalDashboard'); // Use key
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Module Management
  const ALL_MODULES: AppModule[] = ['performance', 'learning', 'recruitment', 'onboarding', 'offboarding', 'support', 'compensation', 'job_titles', 'documents', 'assets'];
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
  const { requests, attendanceAdjustmentRequests, leavePermitRequests, leaveRequests } = useRequestContext();


  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // Theme management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Language management
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);


  const allNavItems = useMemo(() => NAV_GROUPS.flatMap(group => group.items), []);


  // Derived Data based on currentUserId
  const derivedData = useMemo(() => getDerivedData(
      currentUserId, employees, branches, MOCK_EMPLOYEE_INFRACTIONS, attendancePolicies, 
      overtimePolicies, leavePolicies, jobTitles, courses, employeeCourses, monthlyCheckIns, 
      supportTickets, notifications, requests, attendanceRecords, 
      employeeDocuments, performanceReviews, externalTasks, MOCK_GOALS, attendanceEvents, assets
  ), [
      currentUserId, employees, branches, attendancePolicies, 
      overtimePolicies, leavePolicies, jobTitles, courses, employeeCourses, monthlyCheckIns, 
      supportTickets, notifications, requests, attendanceRecords, 
      employeeDocuments, performanceReviews, externalTasks, attendanceEvents, assets
  ]);

  const { currentUserProfile: currentUser, teamMembersProfiles: teamMembers, employeeDashboardData } = derivedData;
  
    // This is a helper function to translate request details.
    const getTranslatedRequestDetailsText = (request: HRRequest): string => {
        switch (request.type) {
            case 'Leave':
                return t('attention.leaveRequest', { leaveType: t(`leaveTypes.${request.leaveType}`) });
            case 'AttendanceAdjustment':
                const adjType = request.adjustmentType === 'LateArrival' ? t('attention.lateArrival') : t('attention.earlyDeparture');
                return t('attention.attendanceAdjustment', { adjustmentType: adjType });
            case 'LeavePermit':
                return t('attention.leavePermit', { startTime: request.startTime, endTime: request.endTime });
            case 'DataUpdate':
                return request.details;
            default:
                return t('attention.unspecifiedRequest');
        }
    };

    // This block translates dynamic data after it's been derived.
    const { teamDashboardData, teamReportsData, teamGoals, managerPerformanceData, mockTeamMemberDetails: teamDetails } = useMemo(() => {
        const translatedAttentionItems = derivedData.teamDashboardData.attentionItems.map((item): AttentionItem => ({
            ...item,
            text: getTranslatedRequestDetailsText(item.request),
        }));

        const translatedNotifications = derivedData.employeeDashboardData.recentActivities.map(activity => ({
          ...activity,
          text: t(activity.text, {name: 'كريم عادل'})
        }));

        return {
            ...derivedData,
            teamDashboardData: {
                ...derivedData.teamDashboardData,
                attentionItems: translatedAttentionItems,
            },
             employeeDashboardData: {
                ...derivedData.employeeDashboardData,
                recentActivities: translatedNotifications,
            },
        };
    }, [derivedData, t]);


  const currentUserOnboardingProcess = useMemo(() => onboardingProcesses.find(p => p.employeeId === currentUserId), [onboardingProcesses, currentUserId]);
  const currentUserOffboardingProcess = useMemo(() => offboardingProcesses.find(p => p.employeeId === currentUserId), [offboardingProcesses, currentUserId]);


  const generatedPayslips = useMemo(() => generatePayslips(
    currentUserId, employees, attendanceRecords, attendancePolicies, 
    overtimePolicies, salaryComponents, compensationPackages, 
    attendanceAdjustmentRequests, leavePermitRequests, externalTasks, leaveRequests
  ), [
    currentUserId, employees, attendanceRecords, attendancePolicies, 
    overtimePolicies, salaryComponents, compensationPackages, 
    attendanceAdjustmentRequests, leavePermitRequests, externalTasks, leaveRequests
  ]);
  
  // Set default page on user change
  useEffect(() => {
    let homePageKey = 'sidebar.personalDashboard'; // Default for Employee role
    
    if (currentUserOnboardingProcess && activeModules.has('onboarding')) {
        homePageKey = 'sidebar.myOnboarding';
    } else if (currentUserOffboardingProcess && activeModules.has('offboarding')) {
        homePageKey = 'sidebar.myOffboarding';
    } else if (['Super Admin', 'Admin', 'Branch Admin'].includes(currentUser.role)) {
        homePageKey = 'sidebar.employeeManagement';
    } else if (['General Manager', 'HR Manager', 'Team Lead'].includes(currentUser.role)) {
        homePageKey = 'sidebar.teamDashboard';
    }

    const allNavItemsAndBottom = [...allNavItems, ...BOTTOM_NAV_ITEMS];
    const currentNavItem = allNavItemsAndBottom.find(item => item.nameKey === activePage);
    
    let canSeeCurrentPage = true;

    if (!currentNavItem) {
        canSeeCurrentPage = false;
    } else {
        const roleCheck = !currentNavItem.roles || currentNavItem.roles.includes(currentUser.role);
        const employeeCheck = !currentNavItem.requiresEmployee || currentUser.isEmployee;
        const moduleCheck = !currentNavItem.module || activeModules.has(currentNavItem.module);
        
        canSeeCurrentPage = roleCheck && employeeCheck && moduleCheck;

        if (currentNavItem?.nameKey === 'sidebar.myOnboarding') {
            canSeeCurrentPage = !!currentUserOnboardingProcess && activeModules.has('onboarding');
        }
        if (currentNavItem?.nameKey === 'sidebar.myOffboarding') {
            canSeeCurrentPage = !!currentUserOffboardingProcess && activeModules.has('offboarding');
        }
    }

    if (!canSeeCurrentPage) {
        setActivePage(homePageKey);
    }
  }, [currentUserId, currentUser, activePage, currentUserOnboardingProcess, currentUserOffboardingProcess, allNavItems, activeModules]);


  const handleToggleModule = (moduleKey: AppModule) => {
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

  // Workflow Handlers
    const handleCourseApprovalAction = (employeeId: string, courseId: string, action: 'Approve' | 'Reject') => {
        setEmployeeCourses(prev => prev.map(ec => 
            (ec.employeeId === employeeId && ec.courseId === courseId) 
            ? { ...ec, managerApprovalStatus: action === 'Approve' ? 'Approved' : 'Rejected' } 
            : ec
        ));
    };

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    };
    
    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => n.recipientId === currentUserId ? { ...n, isRead: true } : n));
    };
    
    const handleClearAllNotifications = () => {
        setNotifications(prev => prev.filter(n => n.recipientId !== currentUserId));
    };
    
    const handleSaveMonthlyCheckIn = (checkInData: Omit<MonthlyCheckIn, 'id' | 'reviewerId' | 'date'>) => {
        const newCheckIn: MonthlyCheckIn = {
            id: `mci-${Date.now()}`,
            reviewerId: currentUserId,
            date: new Date().toISOString(),
            ...checkInData
        };
        setMonthlyCheckIns(prev => [newCheckIn, ...prev]);
    };
    
    const handleSaveSalaryComponent = (component: SalaryComponent) => {
        setSalaryComponents(prev => [...prev, component]);
    };
    
    const handleSaveCompensationPackage = (pkg: CompensationPackage) => {
        setCompensationPackages(prev => [...prev, pkg]);
    };
    
    const handleCreateTicket = (ticketData: Omit<SupportTicket, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt' | 'messages'>) => {
        const now = new Date().toISOString();
        const newTicket: SupportTicket = {
            id: `tkt-${Date.now()}`,
            employeeId: currentUser.id,
            status: 'New',
            createdAt: now,
            updatedAt: now,
            messages: [{
                id: `msg-${Date.now()}`,
                authorId: currentUser.id,
                content: ticketData.description,
                timestamp: now,
            }],
            ...ticketData
        };
        setSupportTickets(prev => [newTicket, ...prev]);
    };
    
    const handleAddMessage = (ticketId: string, messageContent: string) => {
        const now = new Date().toISOString();
        const newMessage = {
            id: `msg-${Date.now()}`,
            authorId: currentUserId,
            content: messageContent,
            timestamp: now,
        };
        setSupportTickets(prev => prev.map(t => 
            t.id === ticketId ? { ...t, messages: [...t.messages, newMessage], updatedAt: now } : t
        ));
    };
    
    const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
        setSupportTickets(prev => prev.map(t => 
            t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
        ));
    };

    const handleUpdateCandidateStage = (candidateId: string, newStage: CandidateStage) => {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
    };

    const handleSaveDocument = (document: EmployeeDocument) => {
        const isNew = !employeeDocuments.some(d => d.id === document.id);
        if (isNew) {
            const docToSave = document.employeeId ? document : {...document, employeeId: currentUserId};
            setEmployeeDocuments(prev => [...prev, docToSave]);
        } else {
            setEmployeeDocuments(prev => prev.map(d => d.id === document.id ? document : d));
        }
    };

    const handleBulkDeleteDocuments = (documentIds: string[]) => {
        setEmployeeDocuments(prev => prev.filter(doc => !documentIds.includes(doc.id)));
    };

    const handleSavePerformanceReview = (review: PerformanceReview) => {
        setPerformanceReviews(prev => {
            const existingIndex = prev.findIndex(r => r.id === review.id);
            if (existingIndex !== -1) {
                const newReviews = [...prev];
                newReviews[existingIndex] = review;
                return newReviews;
            } else {
                return [...prev, review];
            }
        });
    };

    const handleStartOnboarding = (employeeId: string, templateId: string, startDate: string) => {
        const template = onboardingTemplates.find(t => t.id === templateId);
        if (!template) return;

        const newProcess: OnboardingProcess = {
            id: `onboard-${Date.now()}`,
            employeeId,
            templateId,
            startDate,
            tasks: template.tasks.map((taskTemplate, index) => {
                const dueDate = new Date(startDate);
                dueDate.setDate(dueDate.getDate() + taskTemplate.dueOffsetDays);
                return {
                    ...taskTemplate,
                    id: `task-${index}-${Date.now()}`,
                    isCompleted: false,
                    dueDate: dueDate.toISOString().split('T')[0],
                };
            }),
        };
        setOnboardingProcesses(prev => [...prev, newProcess]);
    };

    const handleUpdateOnboardingTask = (processId: string, taskId: string, isCompleted: boolean) => {
        setOnboardingProcesses(prev => prev.map(process => {
            if (process.id === processId) {
                return {
                    ...process,
                    tasks: process.tasks.map(task =>
                        task.id === taskId ? { ...task, isCompleted } : task
                    ),
                };
            }
            return process;
        }));
    };

    const handleSaveOnboardingTemplate = (template: OnboardingTemplate) => {
        const isNew = !onboardingTemplates.some(t => t.id === template.id);
        if (isNew) {
            setOnboardingTemplates(prev => [...prev, template]);
        } else {
            setOnboardingTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        }
    };

    const handleDeleteOnboardingTemplate = (templateId: string) => {
        const isInUse = onboardingProcesses.some(p => p.templateId === templateId);
        if (isInUse) {
            alert(t('alerts.templateInUse'));
            return;
        }
        setOnboardingTemplates(prev => prev.filter(t => t.id !== templateId));
    };

    const handleStartOffboarding = (employeeId: string, templateId: string, lastDay: string) => {
        const template = offboardingTemplates.find(t => t.id === templateId);
        if (!template) return;

        const newProcess: OffboardingProcess = {
            id: `offboard-${Date.now()}`,
            employeeId,
            templateId,
            lastDay,
            tasks: template.tasks.map((taskTemplate, index) => {
                const dueDate = new Date(lastDay);
                dueDate.setDate(dueDate.getDate() - taskTemplate.dueOffsetDays); // Subtract days from last day
                return {
                    ...taskTemplate,
                    id: `task-off-${index}-${Date.now()}`,
                    isCompleted: false,
                    dueDate: dueDate.toISOString().split('T')[0],
                };
            }),
        };
        setOffboardingProcesses(prev => [...prev, newProcess]);
    };

    const handleUpdateOffboardingTask = (processId: string, taskId: string, isCompleted: boolean) => {
        setOffboardingProcesses(prev => prev.map(process => {
            if (process.id === processId) {
                return {
                    ...process,
                    tasks: process.tasks.map(task =>
                        task.id === taskId ? { ...task, isCompleted } : task
                    ),
                };
            }
            return process;
        }));
    };

    const handleSaveOffboardingTemplate = (template: OffboardingTemplate) => {
        const isNew = !offboardingTemplates.some(t => t.id === template.id);
        if (isNew) {
            setOffboardingTemplates(prev => [...prev, template]);
        } else {
            setOffboardingTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        }
    };

    const handleDeleteOffboardingTemplate = (templateId: string) => {
        const isInUse = offboardingProcesses.some(p => p.templateId === templateId);
        if (isInUse) {
            alert(t('alerts.templateInUse'));
            return;
        }
        setOffboardingTemplates(prev => prev.filter(t => t.id !== templateId));
    };

    const handleAddWorkLocation = (location: Omit<WorkLocation, 'id'>) => {
        const newLocation: WorkLocation = {
            id: `loc-${Date.now()}`,
            ...location
        };
        setWorkLocations(prev => [...prev, newLocation]);
    };

    const handleUpdateWorkLocation = (location: WorkLocation) => {
        setWorkLocations(prev => prev.map(l => l.id === location.id ? location : l));
    };

     const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    };

    const handleAttendancePunch = (coords: { latitude: number; longitude: number }) => {
        const policy = attendancePolicies.find(p => p.id === currentUser.attendancePolicyId);
        if (!policy) {
            alert(t('alerts.noAttendancePolicy'));
            return;
        }

        const userLocations = workLocations.filter(loc => policy.workLocationIds.includes(loc.id));
        const isWithinGeofence = userLocations.some(loc => {
            const distance = haversineDistance(coords.latitude, coords.longitude, loc.latitude, loc.longitude);
            return distance <= loc.radiusMeters;
        });
        
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const nextEventType = currentUser.checkInStatus === 'CheckedIn' ? 'CheckOut' : 'CheckIn';
        let associatedTaskId: string | undefined = undefined;

        if (!isWithinGeofence) {
             const todaysTasks = externalTasks.filter(task => 
                task.employeeId === currentUserId && 
                task.date === todayStr && 
                (task.status === 'Approved' || task.status === 'InProgress')
            );

            if (todaysTasks.length === 0) {
                alert(t('alerts.punchOutsideGeofence'));
                return;
            }

            associatedTaskId = todaysTasks[0].id;
            
            setExternalTasks(prev => prev.map(task => {
                if (task.id === associatedTaskId) {
                    if (nextEventType === 'CheckIn') {
                        return { ...task, status: 'InProgress', checkInTimestamp: now.toISOString(), checkInCoords: coords };
                    } else { 
                        return { ...task, status: 'Completed', checkOutTimestamp: now.toISOString(), checkOutCoords: coords };
                    }
                }
                return task;
            }));
        }

        const newEvent: AttendanceEvent = {
            id: `evt-${Date.now()}`,
            employeeId: currentUser.id,
            timestamp: now.toISOString(),
            type: nextEventType,
            isWithinGeofence,
            coords,
            taskId: associatedTaskId,
        };
        setAttendanceEvents(prev => [...prev, newEvent]);

        // Update daily summary record
        setAttendanceRecords(prev => {
            const existingRecordIndex = prev.findIndex(r => r.employeeId === currentUser.id && r.date === todayStr);

            if (existingRecordIndex !== -1) {
                // Update existing record
                const updatedRecords = [...prev];
                const record = { ...updatedRecords[existingRecordIndex] };
                
                if (nextEventType === 'CheckIn' && !record.firstCheckIn) {
                    record.firstCheckIn = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                    record.status = 'Present';
                }
                
                if (nextEventType === 'CheckOut') {
                    record.lastCheckOut = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                }

                if (record.firstCheckIn && record.lastCheckOut) {
                    const checkInTime = new Date(`${todayStr}T${record.firstCheckIn}`);
                    const checkOutTime = new Date(`${todayStr}T${record.lastCheckOut}`);
                    let workedHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
                    // Subtract break hours if applicable
                    if (policy && workedHours > policy.breakDurationHours) {
                        workedHours -= policy.breakDurationHours;
                    }
                    record.workedHours = parseFloat(workedHours.toFixed(2));
    
                    // Calculate overtime
                    const overtimePolicy = overtimePolicies.find(p => p.id === currentUser.overtimePolicyId);
                    const shiftHours = 8; // Assuming 8 hours for a standard shift
                    if (overtimePolicy && overtimePolicy.allowOvertime && record.workedHours > shiftHours) {
                        const overtimeInMinutes = (record.workedHours - shiftHours) * 60;
                        if (overtimeInMinutes >= overtimePolicy.minOvertimeInMinutes) {
                            record.overtime = parseFloat((overtimeInMinutes / 60).toFixed(2));
                        } else {
                             record.overtime = 0;
                        }
                    } else {
                        record.overtime = 0;
                    }
                }

                updatedRecords[existingRecordIndex] = record;
                return updatedRecords;
            } else {
                // Create new record
                const newRecord: AttendanceRecord = {
                    employeeId: currentUser.id,
                    date: todayStr,
                    day: now.toLocaleDateString('ar-EG', { weekday: 'long' }),
                    status: 'Present',
                    firstCheckIn: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                };
                return [...prev, newRecord];
            }
        });
        
        const updatedUser = { ...currentUser, checkInStatus: nextEventType === 'CheckIn' ? 'CheckedIn' : 'CheckedOut' } as EmployeeProfile;
        updateProfile(updatedUser);
    };

    const handleRegisterExternalCourse = (courseData: { title: string; provider: string; url: string; venue?: any; locationDetails?: string; }) => {
        const newCourse: Course = {
           id: `c-ext-${Date.now()}`,
           type: 'External',
           title: courseData.title,
           provider: courseData.provider,
           url: courseData.url,
           venue: courseData.venue,
           locationDetails: courseData.locationDetails,
           category: 'Technical', // Default value
           durationHours: 0, // Default value
           description: `دورة خارجية مقدمة من ${courseData.provider}`, // Default value
           isMandatory: false, // Default value
        };
        setCourses(prev => [...prev, newCourse]);

        const newEmployeeCourse: EmployeeCourse = {
            employeeId: currentUserId,
            courseId: newCourse.id,
            status: 'Not Started',
            progress: 0,
            managerApprovalStatus: 'Pending',
            submittedNotes: 'تم التسجيل بواسطة الموظف',
        };
        setEmployeeCourses(prev => [...prev, newEmployeeCourse]);
    };

    const handleSubmitCourseUpdate = (courseId: string, updateData: { status: CourseStatus; notes: string; certificate?: File | null; result?: string; performanceRating?: number; }) => {
        setEmployeeCourses(prev => prev.map(ec => 
            ec.courseId === courseId && ec.employeeId === currentUserId
            ? { ...ec, ...updateData, certificateUrl: updateData.certificate?.name }
            : ec
        ));
    };

    const handleSaveCourse = (newCourse: Course) => {
        const isNew = !courses.some(c => c.id === newCourse.id);
        if (isNew) {
            setCourses(prev => [...prev, newCourse]);
        } else {
            setCourses(prev => prev.map(c => c.id === newCourse.id ? newCourse : c));
        }
    };

    const handleAddBranch = (name: string, managerId: string) => {
        const newBranch = addBranch(name);
        if (managerId) {
            updateBranchManager(newBranch.id, managerId);
        }
    };

    const handleUpdateBranch = (id: string, name: string, managerId: string) => {
        updateBranch(id, name);
        updateBranchManager(id, managerId);
    };

    const handleUpdatePolicyStatus = (policyId: string, type: 'attendance' | 'leave' | 'overtime', newStatus: 'Active' | 'Rejected') => {
        if (type === 'attendance') {
            updateAttendancePolicyStatus(policyId, newStatus);
        } else if (type === 'overtime') {
            updateOvertimePolicyStatus(policyId, newStatus);
        } else if (type === 'leave') {
            updateLeavePolicyStatus(policyId, newStatus);
        }
    };
    
    const renderPage = () => {
        const teamMemberIds = teamMembers.map(m => m.id);
        
        switch (activePage) {
            case 'sidebar.personalDashboard':
                return <Dashboard currentUser={currentUser} dashboardData={employeeDashboardData} onClockIn={handleAttendancePunch} setActivePage={setActivePage} activeModules={activeModules} />;
            case 'sidebar.myAttendance':
            case 'sidebar.attendanceLog':
                 return <AttendancePage 
                    records={attendanceRecords.filter(r => teamMemberIds.includes(r.employeeId) || r.employeeId === currentUserId)}
                    attendanceEvents={attendanceEvents.filter(e => teamMemberIds.includes(e.employeeId) || e.employeeId === currentUserId)}
                    infractions={MOCK_EMPLOYEE_INFRACTIONS.filter(i => i.employeeId === currentUserId)}
                    currentUser={currentUser}
                    externalTasks={externalTasks.filter(t => t.employeeId === currentUserId)}
                 />;
            case 'sidebar.payslip':
                return <PayslipPage payslips={generatedPayslips} />;
            case 'sidebar.leave':
                return <LeavePage currentUser={currentUser} />;
            case 'sidebar.profile':
                return <ProfilePage 
                    currentUser={currentUser} 
                    branches={branches}
                    attendancePolicies={attendancePolicies}
                    overtimePolicies={overtimePolicies}
                    leavePolicies={leavePolicies}
                    jobTitles={jobTitles}
                    onUpdateProfile={updateProfile}
                />;
            case 'sidebar.teamDashboard':
                return <TeamDashboard currentUser={currentUser} teamMembers={teamMembers} dashboardData={teamDashboardData} setActivePage={setActivePage} />;
            case 'sidebar.reports':
                return <ManagerReportsPage 
                    reportsData={teamReportsData} 
                    teamMembers={teamMembers} 
                    teamGoals={teamGoals} 
                    attendanceRecords={attendanceRecords}
                    requests={requests}
                    externalTasks={externalTasks}
                />;
            case 'sidebar.performanceManagement':
                return <ManagerPerformancePage data={managerPerformanceData} />;
            case 'sidebar.turnoverAnalysis':
                 return <TurnoverReportPage teamMembers={teamMembers} />;
            case 'sidebar.teamAnalytics':
                return <TeamAnalyticsPage 
                    teamDetails={teamDetails} 
                    currentUser={currentUser} 
                    onCourseApprovalAction={handleCourseApprovalAction} 
                    onSaveMonthlyCheckIn={handleSaveMonthlyCheckIn} 
                    performanceReviews={performanceReviews} 
                    onSavePerformanceReview={handleSavePerformanceReview} 
                    activeModules={activeModules} 
                    salaryComponents={salaryComponents} 
                    compensationPackages={compensationPackages} 
                    onSaveDocument={handleSaveDocument}
                    onUpdateProfile={updateUser}
                    branches={branches}
                    attendancePolicies={attendancePolicies}
                    overtimePolicies={overtimePolicies}
                    leavePolicies={leavePolicies}
                    jobTitles={jobTitles}
                />;
            case 'sidebar.performance':
                return <PerformancePage reviews={performanceReviews.filter(r => r.employeeId === currentUserId)} monthlyCheckIns={monthlyCheckIns.filter(mci => mci.employeeId === currentUserId)} />;
            case 'sidebar.myDocuments':
                return <MyDocumentsPage documents={employeeDocuments.filter(d => d.employeeId === currentUserId)} onSaveDocument={handleSaveDocument} />;
            case 'sidebar.myAssets':
                return <MyAssetsPage currentUserId={currentUserId} />;
            case 'sidebar.settings':
                return <SettingsPage theme={theme} setTheme={setTheme} currentUser={currentUser} setActivePage={setActivePage} />;
            case 'sidebar.employeeManagement':
                return <SystemAdminPage 
                    allUsers={employees}
                    branches={branches}
                    attendancePolicies={attendancePolicies}
                    overtimePolicies={overtimePolicies}
                    leavePolicies={leavePolicies}
                    jobTitles={jobTitles}
                    compensationPackages={compensationPackages}
                    onUpdateUserRole={updateUserRole}
                    onDeactivateUser={deactivateUser}
                    onReactivateUser={reactivateUser}
                    onAddNewUser={addNewUser}
                    onUpdateUser={updateUser}
                    onBulkDeactivateUsers={bulkDeactivateUsers}
                    onBulkAssignAttendancePolicy={bulkAssignAttendancePolicy}
                    onBulkAssignOvertimePolicy={bulkAssignOvertimePolicy}
                    onBulkAssignLeavePolicy={bulkAssignLeavePolicy}
                />;
            case 'sidebar.orgChart':
                return <OrgChartPage />;
            case 'sidebar.branchManagement':
                return <BranchManagementPage 
                    branches={branches}
                    employees={employees}
                    onAddBranch={handleAddBranch}
                    onUpdateBranch={handleUpdateBranch}
                    onArchiveBranch={archiveBranch}
                />;
            case 'sidebar.learning':
                return <LearningPage currentUser={currentUser} allCourses={courses} employeeCourses={employeeCourses.filter(ec => ec.employeeId === currentUserId)} onRegisterExternalCourse={handleRegisterExternalCourse} onSubmitCourseUpdate={handleSubmitCourseUpdate} />;
            case 'sidebar.learningManagement':
                return <LearningManagementPage allCourses={courses} onSaveCourse={handleSaveCourse} />;
            case 'sidebar.assetsManagement':
                return <AssetsManagementPage employees={employees} />;
            case 'sidebar.attendancePolicies':
                return <AttendancePolicyPage 
                    attendancePolicies={attendancePolicies}
                    employees={employees}
                    onSaveAttendancePolicy={saveAttendancePolicy}
                    onArchivePolicy={archiveAttendancePolicy}
                    onBulkAssignPolicy={bulkAssignAttendancePolicy}
                    onBulkArchivePolicies={bulkArchiveAttendancePolicies}
                    currentUser={currentUser}
                    branches={branches}
                    workLocations={workLocations} 
                    onAddWorkLocation={handleAddWorkLocation} 
                    onUpdateWorkLocation={handleUpdateWorkLocation}
                    onUpdatePolicyStatus={handleUpdatePolicyStatus}
                />;
            case 'sidebar.overtimePolicies':
                return <OvertimePolicyPage 
                    overtimePolicies={overtimePolicies}
                    employees={employees}
                    onSaveOvertimePolicy={saveOvertimePolicy}
                    onArchivePolicy={archiveOvertimePolicy}
                    onBulkAssignPolicy={bulkAssignOvertimePolicy}
                    onBulkArchivePolicies={bulkArchiveOvertimePolicies}
                    currentUser={currentUser} 
                    branches={branches}
                    onUpdatePolicyStatus={handleUpdatePolicyStatus}
                />;
            case 'sidebar.leavePolicies':
                return <LeavePolicyPage 
                    leavePolicies={leavePolicies}
                    employees={employees}
                    onSaveLeavePolicy={saveLeavePolicy}
                    onArchivePolicy={archiveLeavePolicy}
                    onBulkAssignPolicy={bulkAssignLeavePolicy}
                    onBulkArchivePolicies={bulkArchiveLeavePolicies}
                    currentUser={currentUser} 
                    branches={branches}
                    onUpdatePolicyStatus={handleUpdatePolicyStatus}
                />;
            case 'sidebar.jobTitles':
                return <JobTitlesPage jobTitles={jobTitles} employees={employees} onSaveJobTitle={saveJobTitle} onDeleteJobTitle={deleteJobTitle} />;
            case 'sidebar.compensation':
                 return <CompensationPage 
                    salaryComponents={salaryComponents} 
                    compensationPackages={compensationPackages} 
                    onSaveSalaryComponent={handleSaveSalaryComponent}
                    onSaveCompensationPackage={handleSaveCompensationPackage}
                 />;
            case 'sidebar.contracts':
                return <ContractsPage />;
            case 'sidebar.support':
                return <SupportTicketsPage 
                    currentUser={currentUser} 
                    allUsers={employees} 
                    allTickets={supportTickets} 
                    onCreateTicket={handleCreateTicket} 
                    onAddMessage={handleAddMessage} 
                    onUpdateTicketStatus={handleUpdateTicketStatus} 
                />;
            case 'sidebar.recruitment':
                return <RecruitmentPage jobOpenings={jobOpenings} candidates={candidates} onUpdateCandidateStage={handleUpdateCandidateStage} />;
            case 'sidebar.onboarding':
                return <OnboardingPage 
                    onboardingProcesses={onboardingProcesses}
                    onboardingTemplates={onboardingTemplates}
                    employees={employees}
                    onStartOnboarding={handleStartOnboarding}
                    onUpdateTask={handleUpdateOnboardingTask}
                />;
            case 'sidebar.offboarding':
                 return <OffboardingPage 
                    offboardingProcesses={offboardingProcesses}
                    offboardingTemplates={offboardingTemplates}
                    employees={employees}
                    onStartOffboarding={handleStartOffboarding}
                    onUpdateTask={handleUpdateOffboardingTask}
                />;
             case 'sidebar.documentManagement':
                return <DocumentManagementPage 
                    allDocuments={employeeDocuments} 
                    employees={employees} 
                    onSaveDocument={handleSaveDocument}
                    onBulkDeleteDocuments={handleBulkDeleteDocuments}
                />;
            case 'sidebar.onboardingTemplates':
                return <OnboardingTemplatesPage 
                    onboardingTemplates={onboardingTemplates}
                    onboardingProcesses={onboardingProcesses}
                    onSaveTemplate={handleSaveOnboardingTemplate}
                    onDeleteTemplate={handleDeleteOnboardingTemplate}
                />;
             case 'sidebar.offboardingTemplates':
                return <OffboardingTemplatesPage 
                    offboardingTemplates={offboardingTemplates}
                    offboardingProcesses={offboardingProcesses}
                    onSaveTemplate={handleSaveOffboardingTemplate}
                    onDeleteTemplate={handleDeleteOffboardingTemplate}
                />;
            case 'sidebar.myOnboarding':
                return currentUserOnboardingProcess ? <MyOnboardingPage process={currentUserOnboardingProcess} onUpdateTask={handleUpdateOnboardingTask} /> : <div>{t('app.myOnboardingFallback')}</div>;
            case 'sidebar.myOffboarding':
                return currentUserOffboardingProcess ? <MyOffboardingPage process={currentUserOffboardingProcess} onUpdateTask={handleUpdateOffboardingTask} /> : <div>{t('app.myOffboardingFallback')}</div>;
             case 'sidebar.moduleManagement':
                 return <ModuleManagementPage activeModules={activeModules} onToggleModule={handleToggleModule} />;
            case 'sidebar.myTasks':
                 const myExternalTasks = externalTasks.filter(t => t.employeeId === currentUserId);
                 return <MyTasksPage externalTasks={myExternalTasks} onNewRequest={() => {}} />;
            case 'sidebar.externalTasksManagement':
                 const teamExternalTasks = externalTasks.filter(t => teamMemberIds.includes(t.employeeId));
                 return <ExternalTasksPage teamMembers={teamMembers} externalTasks={teamExternalTasks} onSaveTask={() => {}} onRequestAction={() => {}} />;
            case 'sidebar.myRequests':
                 const myRequests = requests.filter(r => r.employeeId === currentUserId);
                 return <MyRequestsPage requests={myRequests} currentUser={currentUser} />;
            default:
                return <div className="p-8 text-center text-slate-500">{t('general.notFound')}</div>;
        }
    };

    const navItem = [...allNavItems, ...BOTTOM_NAV_ITEMS].find(item => item.nameKey === activePage);
    const pageTitle = navItem ? t(navItem.pageTitleKey || navItem.nameKey) : 'Bokra HR';


    return (
      <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 font-sans ${theme === 'dark' ? 'dark' : ''}`}>
          <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            companyName={companyName} 
            onCompanyNameChange={setCompanyName} 
            currentUser={currentUser}
            hasOnboardingProcess={!!currentUserOnboardingProcess}
            hasOffboardingProcess={!!currentUserOffboardingProcess}
            activeModules={activeModules}
            isSidebarCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
             <Header 
                pageTitle={pageTitle}
                currentUser={currentUser}
                allEmployees={employees}
                currentUserId={currentUserId}
                setCurrentUserId={setCurrentUserId}
                notifications={notifications.filter(n => n.recipientId === currentUserId)}
                unreadCount={notifications.filter(n => n.recipientId === currentUserId && !n.isRead).length}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearAll={handleClearAllNotifications}
                theme={theme}
                setTheme={setTheme}
                language={language}
                setLanguage={setLanguage}
             />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-6">
                  {renderPage()}
              </main>
          </div>
          {/* FIX: Pass the currentUser prop to the Chatbot component to resolve the type error. */}
          <Chatbot currentUser={currentUser}/>
      </div>
    );
};

export default App;