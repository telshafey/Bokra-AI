
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
import ContractsPage from './components/ContractsPage';
import TurnoverReportPage from './components/TurnoverReportPage';
import ManagerPerformancePage from './components/ManagerPerformancePage';


import { ALL_EMPLOYEES, INITIAL_USER_ID, MOCK_ALL_REQUESTS, MOCK_LEAVE_REQUESTS_INITIAL, getDerivedData, MOCK_ATTENDANCE_RECORDS as INITIAL_ATTENDANCE, COMPANY_BRANCHES, NAV_GROUPS, BOTTOM_NAV_ITEMS, MOCK_PERFORMANCE_REVIEWS as INITIAL_PERFORMANCE_REVIEWS, MOCK_EMPLOYEE_DOCUMENTS, MOCK_ATTENDANCE_POLICY, MOCK_LEAVE_POLICY, MOCK_EMPLOYEE_INFRACTIONS, generatePayslips, MOCK_JOB_TITLES, MOCK_COURSES, MOCK_EMPLOYEE_COURSES, MOCK_NOTIFICATIONS, MOCK_MONTHLY_CHECK_INS, MOCK_SALARY_COMPONENTS, MOCK_COMPENSATION_PACKAGES, MOCK_SUPPORT_TICKETS, MOCK_OVERTIME_POLICY, MOCK_ADJUSTMENT_REQUESTS_INITIAL, MOCK_LEAVE_PERMIT_REQUESTS_INITIAL, MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_ONBOARDING_TEMPLATES, MOCK_ONBOARDING_PROCESSES, MOCK_OFFBOARDING_TEMPLATES, MOCK_OFFBOARDING_PROCESSES, MOCK_WORK_LOCATIONS, MOCK_ATTENDANCE_EVENTS, MOCK_EXTERNAL_TASKS, MOCK_GOALS } from './constants';
import { EmployeeProfile, HRRequest, LeaveRequest, RequestStatus, Goal, PerformanceReview, EmployeeDocument, AttendanceRecord, UserRole, Branch, NewUserPayload, AttendancePolicy, EmployeeInfraction, LeavePolicy, JobTitle, Course, EmployeeCourse, Notification, MonthlyCheckIn, SalaryComponent, CompensationPackage, SupportTicket, TicketStatus, OvertimePolicy, AttendanceAdjustmentRequest, LeavePermitRequest, JobOpening, Candidate, CandidateStage, OnboardingProcess, OnboardingTemplate, OffboardingProcess, OffboardingTemplate, AppModule, WorkLocation, AttendanceEvent, ExternalTask, CourseStatus } from './types';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState('لوحة التحكم الشخصية');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Module Management
  const ALL_MODULES: AppModule[] = ['performance', 'learning', 'recruitment', 'onboarding', 'offboarding', 'support', 'compensation', 'job_titles', 'documents'];
  const [activeModules, setActiveModules] = useState<Set<AppModule>>(new Set(ALL_MODULES));

  // State Management
  const [employees, setEmployees] = useState<EmployeeProfile[]>(ALL_EMPLOYEES);
  const [requests, setRequests] = useState<HRRequest[]>(MOCK_ALL_REQUESTS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS_INITIAL);
  const [attendanceAdjustmentRequests, setAttendanceAdjustmentRequests] = useState<AttendanceAdjustmentRequest[]>(MOCK_ADJUSTMENT_REQUESTS_INITIAL);
  const [leavePermitRequests, setLeavePermitRequests] = useState<LeavePermitRequest[]>(MOCK_LEAVE_PERMIT_REQUESTS_INITIAL);
  const [currentUserId, setCurrentUserId] = useState(INITIAL_USER_ID);
  const [companyName, setCompanyName] = useState('Bokra HR');
  const [employeeDocuments, setEmployeeDocuments] = useState<EmployeeDocument[]>(MOCK_EMPLOYEE_DOCUMENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [branches, setBranches] = useState<Branch[]>(COMPANY_BRANCHES);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(INITIAL_PERFORMANCE_REVIEWS);
  const [attendancePolicies, setAttendancePolicies] = useState<AttendancePolicy[]>(MOCK_ATTENDANCE_POLICY);
  const [overtimePolicies, setOvertimePolicies] = useState<OvertimePolicy[]>(MOCK_OVERTIME_POLICY);
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>(MOCK_LEAVE_POLICY);
  const [employeeInfractions, setEmployeeInfractions] = useState<EmployeeInfraction[]>(MOCK_EMPLOYEE_INFRACTIONS);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>(MOCK_JOB_TITLES);
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

  const allNavItems = useMemo(() => NAV_GROUPS.flatMap(group => group.items), []);


  // Derived Data based on currentUserId
  const { 
    currentUserProfile: currentUser, 
    teamMembersProfiles: teamMembers,
    mockTeamMemberDetails: teamDetails,
    employeeDashboardData,
    teamDashboardData,
    teamReportsData,
    teamGoals,
    managerPerformanceData,
  } = useMemo(() => getDerivedData(
      currentUserId, employees, branches, employeeInfractions, attendancePolicies, 
      overtimePolicies, leavePolicies, jobTitles, courses, employeeCourses, monthlyCheckIns, 
      supportTickets, notifications, requests, attendanceRecords, 
      employeeDocuments, performanceReviews, externalTasks, MOCK_GOALS, attendanceEvents
  ), [
      currentUserId, employees, branches, employeeInfractions, attendancePolicies, 
      overtimePolicies, leavePolicies, jobTitles, courses, employeeCourses, monthlyCheckIns, 
      supportTickets, notifications, requests, attendanceRecords, 
      employeeDocuments, performanceReviews, externalTasks, attendanceEvents
  ]);
  
  const currentUserOnboardingProcess = useMemo(() => onboardingProcesses.find(p => p.employeeId === currentUserId), [onboardingProcesses, currentUserId]);
  const currentUserOffboardingProcess = useMemo(() => offboardingProcesses.find(p => p.employeeId === currentUserId), [offboardingProcesses, currentUserId]);


  const generatedPayslips = useMemo(() => generatePayslips(
    currentUserId, employees, attendanceRecords, attendancePolicies, 
    overtimePolicies, salaryComponents, compensationPackages, 
    attendanceAdjustmentRequests, leavePermitRequests, externalTasks
  ), [
    currentUserId, employees, attendanceRecords, attendancePolicies, 
    overtimePolicies, salaryComponents, compensationPackages, 
    attendanceAdjustmentRequests, leavePermitRequests, externalTasks
  ]);
  
  // Set default page on user change
  useEffect(() => {
    let homePage = 'لوحة التحكم الشخصية'; // Default for Employee role
    
    if (currentUserOnboardingProcess && activeModules.has('onboarding')) {
        homePage = 'خطتي للتعيين';
    } else if (currentUserOffboardingProcess && activeModules.has('offboarding')) {
        homePage = 'خطتي لإنهاء الخدمة';
    } else if (['Super Admin', 'Admin', 'Branch Admin'].includes(currentUser.role)) {
        homePage = 'إدارة الموظفين';
    } else if (['General Manager', 'HR Manager', 'Team Lead'].includes(currentUser.role)) {
        homePage = 'لوحة تحكم الفريق';
    }

    const allNavItemsAndBottom = [...allNavItems, ...BOTTOM_NAV_ITEMS];
    const currentNavItem = allNavItemsAndBottom.find(item => item.name === activePage);
    
    let canSeeCurrentPage = true;

    if (!currentNavItem) {
        canSeeCurrentPage = false;
    } else {
        const roleCheck = !currentNavItem.roles || currentNavItem.roles.includes(currentUser.role);
        const employeeCheck = !currentNavItem.requiresEmployee || currentUser.isEmployee;
        const moduleCheck = !currentNavItem.module || activeModules.has(currentNavItem.module);
        
        canSeeCurrentPage = roleCheck && employeeCheck && moduleCheck;

        if (currentNavItem?.name === 'خطتي للتعيين') {
            canSeeCurrentPage = !!currentUserOnboardingProcess && activeModules.has('onboarding');
        }
        if (currentNavItem?.name === 'خطتي لإنهاء الخدمة') {
            canSeeCurrentPage = !!currentUserOffboardingProcess && activeModules.has('offboarding');
        }
    }

    if (!canSeeCurrentPage) {
        setActivePage(homePage);
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

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setEmployees(prev => prev.map(emp => 
        emp.id === userId ? { ...emp, role: newRole } : emp
    ));
  };

  const handleDeactivateUser = (userId: string) => {
      setEmployees(prev => prev.map(emp => 
          emp.id === userId ? { ...emp, employmentStatus: 'Inactive' } : emp
      ));
  };
    
  const handleBulkDeactivateUsers = (userIds: string[]) => {
      setEmployees(prev => prev.map(emp => 
          userIds.includes(emp.id) ? { ...emp, employmentStatus: 'Inactive' } : emp
      ));
  };
  
  const handleReactivateUser = (userId: string) => {
      setEmployees(prev => prev.map(emp => 
          emp.id === userId ? { ...emp, employmentStatus: 'دوام كامل' } : emp
      ));
  };

  // Workflow Handlers
  const handleRequestAction = (requestId: number, newStatus: RequestStatus) => {
    // Update the main request list
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);

    // If it's a Leave request and it's approved, update leave balances
    const leaveReq = leaveRequests.find(lr => lr.id === requestId);
    if (leaveReq) {
        const updatedLeaveRequests = leaveRequests.map(lr => lr.id === requestId ? { ...lr, status: newStatus } : lr);
        setLeaveRequests(updatedLeaveRequests);

        if (newStatus === 'Approved') {
            const employeeToUpdate = employees.find(e => e.id === leaveReq.employeeId);
            if (employeeToUpdate) {
                const updatedBalances = employeeToUpdate.leaveBalances.map(balance => {
                    if (balance.type === leaveReq.leaveType) {
                        return { ...balance, used: balance.used + leaveReq.duration };
                    }
                    return balance;
                });

                const updatedEmployees = employees.map(emp => 
                    emp.id === employeeToUpdate.id ? { ...emp, leaveBalances: updatedBalances } : emp
                );
                setEmployees(updatedEmployees);
            }
        }
    }

    const adjReq = attendanceAdjustmentRequests.find(ar => ar.id === requestId);
    if(adjReq) {
        const updatedAdjRequests = attendanceAdjustmentRequests.map(ar => ar.id === requestId ? { ...ar, status: newStatus } : ar);
        setAttendanceAdjustmentRequests(updatedAdjRequests);
    }

    const permitReq = leavePermitRequests.find(pr => pr.id === requestId);
      if(permitReq) {
          const updatedPermitRequests = leavePermitRequests.map(pr => pr.id === requestId ? { ...pr, status: newStatus } : pr);
          setLeavePermitRequests(updatedPermitRequests);
    }
  };
  
  const handleNewLeaveRequest = (newRequestData: Omit<LeaveRequest, 'id' | 'status' | 'type' | 'submissionDate'>) => {
      const newId = Math.max(...requests.map(r => r.id), 0) + 1;
      const newLeaveRequest: LeaveRequest = {
          id: newId,
          status: 'Pending',
          type: 'Leave',
          submissionDate: newRequestData.startDate,
          ...newRequestData
      };
      setLeaveRequests(prev => [...prev, newLeaveRequest]);
      setRequests(prev => [...prev, newLeaveRequest]);
  };

   const handleNewAttendanceAdjustmentRequest = (newRequestData: Omit<AttendanceAdjustmentRequest, 'id' | 'status' | 'type' | 'submissionDate'>) => {
    const newId = Math.max(...requests.map(r => r.id), 0) + 1;
    const newAdjRequest: AttendanceAdjustmentRequest = {
        id: newId,
        status: 'Pending',
        type: 'AttendanceAdjustment',
        submissionDate: newRequestData.date,
        ...newRequestData
    };
    setAttendanceAdjustmentRequests(prev => [...prev, newAdjRequest]);
    setRequests(prev => [...prev, newAdjRequest]);
  };

  const handleNewLeavePermitRequest = (newRequestData: Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'employeeId' | 'durationHours'>) => {
        const userAttendancePolicy = attendancePolicies.find(p => p.id === currentUser.attendancePolicyId);

        const start = new Date(`${newRequestData.date}T${newRequestData.startTime}`);
        const end = new Date(`${newRequestData.date}T${newRequestData.endTime}`);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const durationMinutes = durationHours * 60;

        if (userAttendancePolicy) {
            if (durationMinutes < userAttendancePolicy.minPermitDurationMinutes) {
                alert(`مدة الإذن يجب أن لا تقل عن ${userAttendancePolicy.minPermitDurationMinutes} دقيقة.`);
                return;
            }
            if (durationHours > userAttendancePolicy.maxPermitDurationHours) {
                alert(`مدة الإذن يجب أن لا تزيد عن ${userAttendancePolicy.maxPermitDurationHours} ساعات.`);
                return;
            }

            const currentMonth = new Date(newRequestData.date).getMonth();
            const currentYear = new Date(newRequestData.date).getFullYear();
            const permitsThisMonth = leavePermitRequests.filter(p =>
                p.employeeId === currentUser.id &&
                p.status !== 'Rejected' &&
                new Date(p.date).getMonth() === currentMonth &&
                new Date(p.date).getFullYear() === currentYear
            ).length;

            if (permitsThisMonth >= userAttendancePolicy.maxPermitsPerMonth) {
                alert(`لقد تجاوزت الحد الأقصى للأذونات هذا الشهر (${userAttendancePolicy.maxPermitsPerMonth}).`);
                return;
            }
        }

        const newId = Math.max(...requests.map(r => r.id), 0) + 1;
        const newPermitRequest: LeavePermitRequest = {
            id: newId,
            status: 'Pending',
            type: 'LeavePermit',
            submissionDate: newRequestData.date,
            employeeId: currentUser.id,
            durationHours,
            ...newRequestData
        };
        setLeavePermitRequests(prev => [...prev, newPermitRequest]);
        setRequests(prev => [...prev, newPermitRequest]);
  };

  const handleUpdateProfile = (updatedProfile: EmployeeProfile) => {
      setEmployees(prev => prev.map(emp => emp.id === updatedProfile.id ? updatedProfile : emp));
  };
  
  const handleAddNewUser = (newUserPayload: NewUserPayload) => {
      const newEmployeeId = `BOK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newId = `emp-${Math.floor(1000 + Math.random() * 9000)}`;

      const newUserProfile: EmployeeProfile = {
          id: newId,
          employeeId: newEmployeeId,
          name: newUserPayload.name,
          jobTitleId: newUserPayload.jobTitleId,
          title: jobTitles.find(jt => jt.id === newUserPayload.jobTitleId)?.name || '',
          role: newUserPayload.role,
          isEmployee: true,
          avatarUrl: `https://i.pravatar.cc/100?u=${newId}`,
          department: newUserPayload.department,
          hireDate: newUserPayload.hireDate,
          employmentStatus: 'دوام كامل',
          managerId: newUserPayload.managerId,
          branchId: newUserPayload.branchId,
          checkInStatus: 'CheckedOut',
          leaveBalances: [],
          baseSalary: newUserPayload.baseSalary,
          attendancePolicyId: newUserPayload.attendancePolicyId,
          overtimePolicyId: newUserPayload.overtimePolicyId,
          leavePolicyId: newUserPayload.leavePolicyId,
          compensationPackageId: newUserPayload.compensationPackageId,
          contact: {
              phone: newUserPayload.phone,
              workEmail: newUserPayload.workEmail,
              personalEmail: newUserPayload.personalEmail,
          },
          personal: {
              dateOfBirth: newUserPayload.dateOfBirth,
              nationality: newUserPayload.nationality,
              nationalId: newUserPayload.nationalId,
              maritalStatus: newUserPayload.maritalStatus,
              gender: newUserPayload.gender,
              religion: newUserPayload.religion,
          },
          address: newUserPayload.address,
          performanceScore: 4.0, 
          satisfactionSurveyScore: 4.0,
          lastPromotionDate: null,
          salaryComparedToMarket: 'Average',
      };
      setEmployees(prev => [...prev, newUserProfile]);
  };
  
   const handleUpdateUser = (userId: string, updatedData: NewUserPayload) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === userId) {
                return {
                    ...emp,
                    name: updatedData.name,
                    jobTitleId: updatedData.jobTitleId,
                    title: jobTitles.find(jt => jt.id === updatedData.jobTitleId)?.name || emp.title,
                    department: updatedData.department,
                    hireDate: updatedData.hireDate,
                    branchId: updatedData.branchId,
                    role: updatedData.role,
                    managerId: updatedData.managerId,
                    baseSalary: updatedData.baseSalary,
                    attendancePolicyId: updatedData.attendancePolicyId,
                    overtimePolicyId: updatedData.overtimePolicyId,
                    leavePolicyId: updatedData.leavePolicyId,
                    compensationPackageId: updatedData.compensationPackageId,
                    contact: {
                        phone: updatedData.phone,
                        workEmail: updatedData.workEmail,
                        personalEmail: updatedData.personalEmail,
                    },
                    personal: {
                        ...emp.personal,
                        dateOfBirth: updatedData.dateOfBirth,
                        nationality: updatedData.nationality,
                        nationalId: updatedData.nationalId,
                        maritalStatus: updatedData.maritalStatus,
                        gender: updatedData.gender,
                        religion: updatedData.religion,
                    },
                    address: updatedData.address,
                };
            }
            return emp;
        }));
    };
  
    const handleAddBranch = (name: string, managerId: string) => {
        const newBranchId = `branch-${name.toLowerCase().replace(/\s/g, '-')}`;
        const newBranch: Branch = { id: newBranchId, name, status: 'Active' };
        setBranches(prev => [...prev, newBranch]);
        
        if (managerId) {
            setEmployees(prev => prev.map(emp => {
                if (emp.id === managerId) {
                    return { ...emp, branchId: newBranchId, role: 'Branch Admin' };
                }
                return emp;
            }));
        }
    };
    
    const handleUpdateBranch = (id: string, name: string, managerId: string) => {
        setBranches(prev => prev.map(b => b.id === id ? { ...b, name } : b));

        setEmployees(prev => prev.map(emp => {
            if (emp.branchId === id && emp.role === 'Branch Admin' && emp.id !== managerId) {
                 return { ...emp, role: 'Employee' }; // Demote old manager
            }
            if (emp.id === managerId) {
                return { ...emp, branchId: id, role: 'Branch Admin' }; // Assign new manager
            }
            return emp;
        }));
    };

    const handleArchiveBranch = (id: string) => {
        setBranches(prev => prev.map(b => b.id === id ? { ...b, status: 'Archived' } : b));
    };

    const handleSaveAttendancePolicy = (policy: AttendancePolicy) => {
      const isNew = !attendancePolicies.some(p => p.id === policy.id);
      if (isNew) {
        const newPolicy = {...policy, status: (currentUser.role === 'Super Admin' ? 'Active' : 'PendingApproval') as 'Active' | 'PendingApproval'};
        setAttendancePolicies(prev => [...prev, newPolicy]);
      } else {
        setAttendancePolicies(prev => prev.map(p => p.id === policy.id ? policy : p));
      }
    };
    const handleDeleteAttendancePolicy = (policyId: string) => {
        setAttendancePolicies(prev => prev.filter(p => p.id !== policyId));
        setEmployees(prev => prev.map(e => e.attendancePolicyId === policyId ? {...e, attendancePolicyId: undefined} : e));
    };
    const handleBulkAssignAttendancePolicy = (policyId: string, employeeIds: string[]) => {
      setEmployees(prev => prev.map(emp => {
          if (employeeIds.includes(emp.id)) {
              return { ...emp, attendancePolicyId: policyId };
          }
          if (emp.attendancePolicyId === policyId && !employeeIds.includes(emp.id)) {
              return { ...emp, attendancePolicyId: undefined };
          }
          return emp;
      }));
    };

    const handleSaveOvertimePolicy = (policy: OvertimePolicy) => {
        const isNew = !overtimePolicies.some(p => p.id === policy.id);
        if (isNew) {
          const newPolicy = {...policy, status: (currentUser.role === 'Super Admin' ? 'Active' : 'PendingApproval') as 'Active' | 'PendingApproval'};
          setOvertimePolicies(prev => [...prev, newPolicy]);
        } else {
          setOvertimePolicies(prev => prev.map(p => p.id === policy.id ? policy : p));
        }
      };
      const handleDeleteOvertimePolicy = (policyId: string) => {
          setOvertimePolicies(prev => prev.filter(p => p.id !== policyId));
          setEmployees(prev => prev.map(e => e.overtimePolicyId === policyId ? {...e, overtimePolicyId: undefined} : e));
      };
      const handleBulkAssignOvertimePolicy = (policyId: string, employeeIds: string[]) => {
        setEmployees(prev => prev.map(emp => {
            if (employeeIds.includes(emp.id)) {
                return { ...emp, overtimePolicyId: policyId };
            }
            if (emp.overtimePolicyId === policyId && !employeeIds.includes(emp.id)) {
                return { ...emp, overtimePolicyId: undefined };
            }
            return emp;
        }));
      };

    const handleSaveLeavePolicy = (policy: LeavePolicy) => {
        const isNew = !leavePolicies.some(p => p.id === policy.id);
        if (isNew) {
            const newPolicy = {...policy, status: (currentUser.role === 'Super Admin' ? 'Active' : 'PendingApproval') as 'Active' | 'PendingApproval'};
            setLeavePolicies(prev => [...prev, newPolicy]);
        } else {
            setLeavePolicies(prev => prev.map(p => p.id === policy.id ? policy : p));
        }
    };
    const handleDeleteLeavePolicy = (policyId: string) => {
        setLeavePolicies(prev => prev.filter(p => p.id !== policyId));
        setEmployees(prev => prev.map(e => e.leavePolicyId === policyId ? {...e, leavePolicyId: undefined} : e));
    };
    const handleBulkAssignLeavePolicy = (policyId: string, employeeIds: string[]) => {
        setEmployees(prev => prev.map(emp => {
            if (employeeIds.includes(emp.id)) {
                return { ...emp, leavePolicyId: policyId };
            }
            // Also unassign if they were previously assigned but are not in the new list
            if (emp.leavePolicyId === policyId && !employeeIds.includes(emp.id)) {
                 return { ...emp, leavePolicyId: undefined };
            }
            return emp;
        }));
    };
    
    const handleSaveJobTitle = (jobTitle: JobTitle) => {
        const isNew = !jobTitles.some(jt => jt.id === jobTitle.id);
        if(isNew) {
            setJobTitles(prev => [...prev, jobTitle]);
        } else {
            setJobTitles(prev => prev.map(jt => jt.id === jobTitle.id ? jobTitle : jt));
        }
    };
    const handleDeleteJobTitle = (jobTitleId: string) => {
        setJobTitles(prev => prev.filter(jt => jt.id !== jobTitleId));
    };

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
    
    const handleUpdatePolicyStatus = (policyId: string, type: 'attendance' | 'leave' | 'overtime', newStatus: 'Active' | 'Rejected') => {
        if(type === 'attendance') {
            setAttendancePolicies(prev => prev.map(p => p.id === policyId ? {...p, status: newStatus === 'Active' ? 'Active' : 'PendingApproval'} : p));
        } else if (type === 'leave') {
            setLeavePolicies(prev => prev.map(p => p.id === policyId ? {...p, status: newStatus === 'Active' ? 'Active' : 'PendingApproval'} : p));
        } else if (type === 'overtime') {
            setOvertimePolicies(prev => prev.map(p => p.id === policyId ? {...p, status: newStatus === 'Active' ? 'Active' : 'PendingApproval'} : p));
        }
    };

    const handleUpdateCandidateStage = (candidateId: string, newStage: CandidateStage) => {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
    };

    const handleSaveDocument = (document: EmployeeDocument) => {
        const isNew = !employeeDocuments.some(d => d.id === document.id);
        if (isNew) {
            // If it's a manager saving it for someone else, the employeeId is already set.
            // If it's an employee saving it for themself, we set it here.
            const docToSave = document.employeeId ? document : {...document, employeeId: currentUserId};
            setEmployeeDocuments(prev => [...prev, docToSave]);
        } else {
            setEmployeeDocuments(prev => prev.map(d => d.id === document.id ? document : d));
        }
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
            alert("لا يمكن حذف هذا القالب لأنه قيد الاستخدام حاليًا من قبل موظف واحد على الأقل.");
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
            alert("لا يمكن حذف هذا القالب لأنه قيد الاستخدام حاليًا من قبل موظف واحد على الأقل.");
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
            alert("لم يتم تعيين سياسة حضور لك. لا يمكنك تسجيل الحضور.");
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
                alert("لا يمكنك تسجيل الحضور من خارج مواقع العمل المحددة بدون وجود مهمة خارجية مسندة لك لهذا اليوم.");
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

        // Update user's checkInStatus
        setEmployees(prev => prev.map(emp => 
            emp.id === currentUser.id ? { ...emp, checkInStatus: nextEventType === 'CheckIn' ? 'CheckedIn' : 'CheckedOut' } : emp
        ));
    };

    const handleRegisterExternalCourse = (courseData: { title: string; provider: string; url: string; }) => {
        const newCourse: Course = {
            id: `c-ext-${Date.now()}`,
            type: 'External',
            title: courseData.title,
            provider: courseData.provider,
            url: courseData.url,
            category: 'Technical', // default
            durationHours: 0, // default
            description: 'دورة خارجية تم تسجيلها بواسطة الموظف.',
            isMandatory: false,
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

    const handleSubmitCourseUpdate = (courseId: string, updateData: { status: CourseStatus; notes: string; certificate?: File | null }) => {
        setEmployeeCourses(prev => prev.map(ec => 
            ec.courseId === courseId && ec.employeeId === currentUserId
            ? { ...ec, status: updateData.status, submittedNotes: updateData.notes, certificateUrl: updateData.certificate?.name }
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

    const renderPage = () => {
        const teamMemberIds = teamMembers.map(m => m.id);
        
        switch (activePage) {
            case 'لوحة التحكم الشخصية':
                return <Dashboard currentUser={currentUser} dashboardData={employeeDashboardData} onClockIn={handleAttendancePunch} setActivePage={setActivePage} activeModules={activeModules} />;
            case 'حضوري وانصرافي':
            case 'سجل الحضور':
                 return <AttendancePage 
                    records={attendanceRecords.filter(r => teamMemberIds.includes(r.employeeId) || r.employeeId === currentUserId)}
                    attendanceEvents={attendanceEvents.filter(e => teamMemberIds.includes(e.employeeId) || e.employeeId === currentUserId)}
                    infractions={employeeInfractions.filter(i => teamMemberIds.includes(i.employeeId) || i.employeeId === currentUserId)}
                    currentUser={currentUser}
                    attendancePolicies={attendancePolicies}
                    adjustmentRequests={attendanceAdjustmentRequests}
                    onNewAdjustmentRequest={handleNewAttendanceAdjustmentRequest}
                    permitRequests={leavePermitRequests}
                    onNewPermitRequest={handleNewLeavePermitRequest}
                    externalTasks={externalTasks}
                 />;
            case 'كشف الراتب':
                return <PayslipPage payslips={generatedPayslips} />;
            case 'الإجازات':
                return <LeavePage currentUser={currentUser} userLeaveRequests={leaveRequests.filter(r => r.employeeId === currentUserId)} onSubmitRequest={handleNewLeaveRequest} />;
            case 'ملفي الشخصي':
                return <ProfilePage currentUser={currentUser} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} onUpdateProfile={handleUpdateProfile} />;
            case 'لوحة تحكم الفريق':
                return <TeamDashboard currentUser={currentUser} teamMembers={teamMembers} dashboardData={teamDashboardData} setActivePage={setActivePage} onAction={handleRequestAction} />;
            case 'التقارير':
                return <ManagerReportsPage 
                    reportsData={teamReportsData} 
                    teamMembers={teamMembers} 
                    teamGoals={teamGoals} 
                    attendanceRecords={attendanceRecords}
                    requests={requests}
                    externalTasks={externalTasks}
                />;
            case 'إدارة الأداء':
                return <ManagerPerformancePage data={managerPerformanceData} />;
            case 'تحليل مخاطر التسرب':
                 return <TurnoverReportPage teamMembers={teamMembers} />;
            case 'تحليلات الفريق':
                return <TeamAnalyticsPage teamDetails={teamDetails} currentUser={currentUser} onUpdateProfile={handleUpdateUser} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} onCourseApprovalAction={handleCourseApprovalAction} onSaveMonthlyCheckIn={handleSaveMonthlyCheckIn} performanceReviews={performanceReviews} onSavePerformanceReview={handleSavePerformanceReview} activeModules={activeModules} salaryComponents={salaryComponents} compensationPackages={compensationPackages} onSaveDocument={handleSaveDocument} />;
            case 'الأداء':
                return <PerformancePage reviews={performanceReviews.filter(r => r.employeeId === currentUserId)} monthlyCheckIns={monthlyCheckIns.filter(mci => mci.employeeId === currentUserId)} />;
            case 'أوراقي':
                return <MyDocumentsPage documents={employeeDocuments.filter(d => d.employeeId === currentUserId)} onSaveDocument={handleSaveDocument} />;
            case 'الإعدادات':
                return <SettingsPage theme={theme} setTheme={setTheme} currentUser={currentUser} setActivePage={setActivePage} />;
            case 'إدارة الموظفين':
                return <SystemAdminPage allUsers={employees} branches={branches} attendancePolicies={attendancePolicies} overtimePolicies={overtimePolicies} leavePolicies={leavePolicies} jobTitles={jobTitles} compensationPackages={compensationPackages} onUpdateUserRole={handleUpdateUserRole} onDeactivateUser={handleDeactivateUser} onReactivateUser={handleReactivateUser} onAddNewUser={handleAddNewUser} onUpdateUser={handleUpdateUser} onBulkDeactivateUsers={handleBulkDeactivateUsers} onBulkAssignAttendancePolicy={handleBulkAssignAttendancePolicy} onBulkAssignLeavePolicy={handleBulkAssignLeavePolicy} onBulkAssignOvertimePolicy={handleBulkAssignOvertimePolicy} />;
            case 'إدارة الفروع':
                return <BranchManagementPage branches={branches} employees={employees} onAddBranch={handleAddBranch} onUpdateBranch={handleUpdateBranch} onArchiveBranch={handleArchiveBranch} />;
            case 'التطوير والتدريب':
                return <LearningPage currentUser={currentUser} allCourses={courses} employeeCourses={employeeCourses.filter(ec => ec.employeeId === currentUserId)} onRegisterExternalCourse={handleRegisterExternalCourse} onSubmitCourseUpdate={handleSubmitCourseUpdate} />;
            case 'إدارة التدريب':
                return <LearningManagementPage allCourses={courses} onSaveCourse={handleSaveCourse} />;
            case 'سياسات الحضور':
                return <AttendancePolicyPage attendancePolicies={attendancePolicies} employees={employees} onSaveAttendancePolicy={handleSaveAttendancePolicy} onDeleteAttendancePolicy={handleDeleteAttendancePolicy} onBulkAssignAttendancePolicy={handleBulkAssignAttendancePolicy} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={handleUpdatePolicyStatus} workLocations={workLocations} onAddWorkLocation={handleAddWorkLocation} onUpdateWorkLocation={handleUpdateWorkLocation} />;
            case 'سياسات الوقت الإضافي':
                return <OvertimePolicyPage overtimePolicies={overtimePolicies} employees={employees} onSaveOvertimePolicy={handleSaveOvertimePolicy} onDeleteOvertimePolicy={handleDeleteOvertimePolicy} onBulkAssignOvertimePolicy={handleBulkAssignOvertimePolicy} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={handleUpdatePolicyStatus} />;
            case 'سياسات الإجازات':
                return <LeavePolicyPage leavePolicies={leavePolicies} employees={employees} onSaveLeavePolicy={handleSaveLeavePolicy} onDeleteLeavePolicy={handleDeleteLeavePolicy} onBulkAssignLeavePolicy={handleBulkAssignLeavePolicy} currentUser={currentUser} branches={branches} onUpdatePolicyStatus={handleUpdatePolicyStatus} />;
            case 'الهيكل الوظيفي':
                return <JobTitlesPage jobTitles={jobTitles} employees={employees} onSaveJobTitle={handleSaveJobTitle} onDeleteJobTitle={handleDeleteJobTitle} />;
            case 'التعويضات والمزايا':
                return <CompensationPage salaryComponents={salaryComponents} compensationPackages={compensationPackages} onSaveSalaryComponent={handleSaveSalaryComponent} onSaveCompensationPackage={handleSaveCompensationPackage} />;
            case 'تذاكر الدعم':
                return <SupportTicketsPage currentUser={currentUser} allUsers={employees} allTickets={supportTickets} onCreateTicket={handleCreateTicket} onAddMessage={handleAddMessage} onUpdateTicketStatus={handleUpdateTicketStatus} />;
            case 'التوظيف':
                return <RecruitmentPage jobOpenings={jobOpenings} candidates={candidates} onUpdateCandidateStage={handleUpdateCandidateStage} />;
            case 'التعيينات الجديدة':
                return <OnboardingPage onboardingProcesses={onboardingProcesses} onboardingTemplates={onboardingTemplates} employees={employees} onStartOnboarding={handleStartOnboarding} onUpdateTask={handleUpdateOnboardingTask} />;
            case 'إنهاء الخدمة':
                return <OffboardingPage offboardingProcesses={offboardingProcesses} offboardingTemplates={offboardingTemplates} employees={employees} onStartOffboarding={handleStartOffboarding} onUpdateTask={handleUpdateOffboardingTask} />;
            case 'إدارة المستندات':
                return <DocumentManagementPage allDocuments={employeeDocuments} employees={employees} onSaveDocument={handleSaveDocument} />;
            case 'قوالب التعيين':
                return <OnboardingTemplatesPage onboardingTemplates={onboardingTemplates} onboardingProcesses={onboardingProcesses} onSaveTemplate={handleSaveOnboardingTemplate} onDeleteTemplate={handleDeleteOnboardingTemplate} />;
            case 'قوالب إنهاء الخدمة':
                return <OffboardingTemplatesPage offboardingTemplates={offboardingTemplates} offboardingProcesses={offboardingProcesses} onSaveTemplate={handleSaveOffboardingTemplate} onDeleteTemplate={handleDeleteOffboardingTemplate} />;
            case 'خطتي للتعيين':
                return currentUserOnboardingProcess ? <MyOnboardingPage process={currentUserOnboardingProcess} onUpdateTask={handleUpdateOnboardingTask} /> : <div>لا توجد خطة تعيين لك.</div>;
            case 'خطتي لإنهاء الخدمة':
                return currentUserOffboardingProcess ? <MyOffboardingPage process={currentUserOffboardingProcess} onUpdateTask={handleUpdateOffboardingTask} /> : <div>لا توجد خطة إنهاء خدمة لك.</div>;
            case 'إدارة الوحدات':
                return <ModuleManagementPage activeModules={activeModules} onToggleModule={handleToggleModule} />;
            case 'طلباتي':
                return <MyRequestsPage requests={requests.filter(r => r.employeeId === currentUserId)} />;
            case 'إدارة العقود':
                return <ContractsPage />;
            case 'مهامي الخارجية':
                return <MyTasksPage externalTasks={externalTasks.filter(t => t.employeeId === currentUserId)} onNewRequest={() => {}} />;
            case 'إدارة المهام الخارجية':
                return <ExternalTasksPage teamMembers={teamMembers} externalTasks={externalTasks.filter(t => teamMemberIds.includes(t.employeeId))} onSaveTask={() => {}} onRequestAction={() => {}} />;
            default:
                return <div>الصفحة المطلوبة غير موجودة.</div>;
        }
    };

    const navItem = allNavItems.find(item => item.name === activePage) || BOTTOM_NAV_ITEMS.find(item => item.name === activePage);
    const pageTitle = navItem?.pageTitle || activePage;

    return (
        <div dir="rtl" className={`flex h-screen bg-slate-100 font-cairo ${theme === 'dark' ? 'dark' : ''}`}>
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
                    // FIX: Pass missing props for handling all notifications.
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onClearAll={handleClearAllNotifications}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-6">
                    {renderPage()}
                </main>
                <Chatbot />
            </div>
        </div>
    );
};

// FIX: Export the App component to be used in index.tsx.
export default App;
