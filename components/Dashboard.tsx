
import React from 'react';
import RecentActivity from './RecentActivity';
import { EmployeeProfile, EmployeeDashboardData, AppModule } from '../types';
import ClockInWidget from './ClockInWidget';
import LearningProgressWidget from './LearningProgressWidget';
import SupportTicketWidget from './SupportTicketWidget';
import StatCard from './StatCard';
import { BriefcaseIcon, DocumentTextIcon, ClockIcon } from './icons/Icons';
import { useTranslation } from './contexts/LanguageContext';


interface DashboardProps {
  currentUser: EmployeeProfile;
  dashboardData: EmployeeDashboardData;
  onClockIn: (coords: { latitude: number; longitude: number; }) => void;
  setActivePage: (page: string) => void;
  activeModules: Set<AppModule>;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, dashboardData, onClockIn, setActivePage, activeModules }) => {
  const { t } = useTranslation();
  const { stats } = dashboardData;

  const statCards = stats ? [
    { title: t('dashboard.remainingAnnualLeave'), value: `${stats.remainingAnnualLeave} ${t('general.day')}`, icon: BriefcaseIcon, color: "bg-sky-500" },
    { title: t('dashboard.pendingRequests'), value: `${stats.pendingRequestsCount}`, icon: DocumentTextIcon, color: "bg-amber-500" },
    { title: t('dashboard.overtimeThisMonth'), value: `${stats.overtimeHoursThisMonth} ${t('general.hour')}`, icon: ClockIcon, color: "bg-emerald-500", chartData: stats.overtimeTrend, chartColor: '#10b981' },
  ] : [];


  return (
    <div className="space-y-6">
       {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map(stat => <StatCard key={stat.title} {...stat} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeModules.has('learning') && <LearningProgressWidget activeCourse={dashboardData.activeCourse} setActivePage={setActivePage} />}
            {activeModules.has('support') && <SupportTicketWidget latestTicket={dashboardData.latestTicket} setActivePage={setActivePage} />}
          </div>
           <RecentActivity activities={dashboardData.recentActivities} setActivePage={setActivePage} />
        </div>

        {/* Right Sidebar content */}
        <div className="lg:col-span-1 space-y-6">
           <ClockInWidget 
            status={currentUser.checkInStatus} 
            onPunch={onClockIn}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;