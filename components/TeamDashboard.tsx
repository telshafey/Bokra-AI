import React from 'react';
import type { TeamDashboardData, RequestStatus } from '../types';
import TeamStats from './TeamStats';
import PendingRequests from './PendingRequests';
import TeamAttendance from './TeamAttendance';
import AttentionWidget from './AttentionWidget';
import TeamLearningOverviewWidget from './TeamLearningOverviewWidget';

interface TeamDashboardProps {
  teamDashboardData: TeamDashboardData;
  onAction: (requestId: string, newStatus: 'Approved' | 'Rejected', notes: string) => void;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamDashboardData, onAction }) => {
    const { teamSize, onLeaveToday, pendingRequestsCount, pendingRequests, teamAttendance } = teamDashboardData;

    return (
        <div className="space-y-6">
            <TeamStats 
                teamSize={teamSize}
                onLeave={onLeaveToday}
                attentionItemsCount={pendingRequestsCount}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PendingRequests 
                        requests={pendingRequests} 
                        onAction={onAction} 
                    />
                </div>
                <div>
                    <TeamAttendance members={teamAttendance} />
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AttentionWidget items={[]} onItemClick={() => {}}/>
                <TeamLearningOverviewWidget stats={[]}/>
            </div>
        </div>
    );
};

export default TeamDashboard;
