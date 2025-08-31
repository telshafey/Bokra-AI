
import React, { useState } from 'react';
import TeamStats from './TeamStats';
import { EmployeeProfile, TeamDashboardData, AttentionItem, RequestStatus } from '../types';
import AttentionWidget from './AttentionWidget';
import TeamLearningOverviewWidget from './TeamLearningOverviewWidget';
import TeamAttendance from './TeamAttendance';
import ApprovalModal from './ApprovalModal';

interface TeamDashboardProps {
  currentUser: EmployeeProfile;
  teamMembers: EmployeeProfile[];
  dashboardData: TeamDashboardData;
  setActivePage: (page: string) => void;
  onAction: (requestId: number, newStatus: RequestStatus) => void;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ currentUser, teamMembers, dashboardData, setActivePage, onAction }) => {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AttentionItem | null>(null);

  const handleItemClick = (item: AttentionItem) => {
    if (item.type === 'leave' && item.context) {
        setSelectedItem(item);
        setIsApprovalModalOpen(true);
    } else {
        // Default navigation for other types
        let page = 'تحليلات الفريق';
        if (item.type === 'ticket') page = 'تذاكر الدعم';
        setActivePage(page);
    }
  };

  const handleCloseModal = () => {
    setIsApprovalModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      <TeamStats 
        teamSize={teamMembers.length} 
        onLeave={dashboardData.teamAttendance.onLeave}
        attentionItemsCount={dashboardData.attentionItems.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <AttentionWidget items={dashboardData.attentionItems} onItemClick={handleItemClick} />
           <TeamLearningOverviewWidget stats={dashboardData.teamLearningStats} />
        </div>

        <div className="space-y-6">
            <TeamAttendance members={dashboardData.teamMembersWithAttendance} />
        </div>
      </div>
      
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        onAction={onAction}
      />
    </div>
  );
};

export default TeamDashboard;
