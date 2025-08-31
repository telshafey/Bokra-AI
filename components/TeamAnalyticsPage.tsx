

import React, { useState, useMemo, useEffect } from 'react';
import TeamMemberList from './TeamMemberList';
import TeamMemberDetailView from './TeamMemberDetailView';
import { EmployeeProfile, TeamMemberDetails, Branch, AttendancePolicy, LeavePolicy, JobTitle, MonthlyCheckIn, OvertimePolicy, PerformanceReview, NewUserPayload, AppModule, SalaryComponent, CompensationPackage, EmployeeDocument } from '../types';

interface TeamAnalyticsPageProps {
  teamDetails: TeamMemberDetails[];
  currentUser: EmployeeProfile;
  onUpdateProfile: (userId: string, updatedData: NewUserPayload) => void;
  branches: Branch[];
  attendancePolicies: AttendancePolicy[];
  overtimePolicies: OvertimePolicy[];
  leavePolicies: LeavePolicy[];
  jobTitles: JobTitle[];
  onCourseApprovalAction: (employeeId: string, courseId: string, action: 'Approve' | 'Reject') => void;
  onSaveMonthlyCheckIn: (checkInData: Omit<MonthlyCheckIn, 'id' | 'reviewerId' | 'date'>) => void;
  performanceReviews: PerformanceReview[];
  onSavePerformanceReview: (review: PerformanceReview) => void;
  activeModules: Set<AppModule>;
  salaryComponents: SalaryComponent[];
  compensationPackages: CompensationPackage[];
  onSaveDocument: (document: EmployeeDocument) => void;
}

const TeamAnalyticsPage: React.FC<TeamAnalyticsPageProps> = ({ 
    teamDetails, currentUser, onUpdateProfile, branches, attendancePolicies, 
    overtimePolicies, leavePolicies, jobTitles, onCourseApprovalAction, 
    onSaveMonthlyCheckIn, performanceReviews, onSavePerformanceReview, activeModules,
    salaryComponents, compensationPackages, onSaveDocument
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(teamDetails[0]?.profile.id || null);
  const [branchFilter, setBranchFilter] = useState<string>('all');

  const canViewAllBranches = currentUser.role === 'Super Admin' || currentUser.role === 'Admin';

  const filteredTeamDetails = useMemo(() => {
    if (branchFilter === 'all' || !canViewAllBranches) {
      return teamDetails;
    }
    return teamDetails.filter(member => member.profile.branchId === branchFilter);
  }, [teamDetails, branchFilter, canViewAllBranches]);

  const selectedMember = filteredTeamDetails.find(
    (member) => member.profile.id === selectedMemberId
  );
  
  // If the selected member is filtered out, reset the selection
  React.useEffect(() => {
    if (!selectedMember && filteredTeamDetails.length > 0) {
      setSelectedMemberId(filteredTeamDetails[0].profile.id);
    } else if (filteredTeamDetails.length === 0) {
        setSelectedMemberId(null);
    }
  }, [filteredTeamDetails, selectedMember]);


  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-120px)]">
      {canViewAllBranches && (
        <div className="bg-white p-3 rounded-xl shadow-md flex items-center gap-4">
          <label htmlFor="branch-filter" className="font-semibold text-slate-700 text-sm">فلترة حسب الفرع:</label>
          <select 
            id="branch-filter"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          >
            <option value="all">كل الفروع</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Team Member List */}
        <div className="w-1/3 xl:w-1/4">
          <TeamMemberList
            members={filteredTeamDetails.map(m => m.profile)}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
          />
        </div>

        {/* Member Details View */}
        <div className="flex-1">
          {selectedMember ? (
            <TeamMemberDetailView 
              memberDetails={selectedMember}
              currentUser={currentUser}
              salaryComponents={salaryComponents}
              compensationPackages={compensationPackages}
              onSaveDocument={onSaveDocument}
            />
          ) : (
            <div className="bg-white h-full rounded-xl shadow-md flex items-center justify-center">
              <p className="text-slate-500 text-center">
                {filteredTeamDetails.length === 0 ? "لا يوجد موظفون في هذا الفرع." : "الرجاء اختيار عضو من القائمة لعرض التفاصيل."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamAnalyticsPage;