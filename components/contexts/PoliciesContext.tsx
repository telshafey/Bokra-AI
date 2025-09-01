

import React, { createContext, useContext, useState } from 'react';
import { 
    AttendancePolicy, 
    OvertimePolicy, 
    LeavePolicy, 
    PoliciesContextType, 
    PoliciesProviderProps 
} from '../../types';
import { 
    MOCK_ATTENDANCE_POLICY, 
    MOCK_OVERTIME_POLICY, 
    MOCK_LEAVE_POLICY 
} from '../../constants';

const PoliciesContext = createContext<PoliciesContextType | undefined>(undefined);

export const usePoliciesContext = () => {
    const context = useContext(PoliciesContext);
    if (!context) {
        throw new Error('usePoliciesContext must be used within a PoliciesProvider');
    }
    return context;
};

export const PoliciesProvider: React.FC<PoliciesProviderProps> = ({ children }) => {
    const [attendancePolicies, setAttendancePolicies] = useState<AttendancePolicy[]>(MOCK_ATTENDANCE_POLICY);
    const [overtimePolicies, setOvertimePolicies] = useState<OvertimePolicy[]>(MOCK_OVERTIME_POLICY);
    const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>(MOCK_LEAVE_POLICY);

    // --- Attendance Policy Handlers ---
    const saveAttendancePolicy = (policy: AttendancePolicy) => {
        setAttendancePolicies(prev => {
            const isNew = !prev.some(p => p.id === policy.id);
            if (isNew) return [...prev, policy];
            return prev.map(p => p.id === policy.id ? policy : p);
        });
    };
    const archiveAttendancePolicy = (policyId: string) => {
        setAttendancePolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: 'Archived' } : p));
    };
    const bulkArchiveAttendancePolicies = (policyIds: string[]) => {
        setAttendancePolicies(prev => prev.map(p => policyIds.includes(p.id) ? { ...p, status: 'Archived' } : p));
    };
    const updateAttendancePolicyStatus = (policyId: string, newStatus: 'Active' | 'Rejected') => {
// FIX: Use newStatus parameter instead of undefined status variable.
         setAttendancePolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: newStatus } : p));
    };

    // --- Overtime Policy Handlers ---
    const saveOvertimePolicy = (policy: OvertimePolicy) => {
        setOvertimePolicies(prev => {
            const isNew = !prev.some(p => p.id === policy.id);
            if (isNew) return [...prev, policy];
            return prev.map(p => p.id === policy.id ? policy : p);
        });
    };
    const archiveOvertimePolicy = (policyId: string) => {
        setOvertimePolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: 'Archived' } : p));
    };
    const bulkArchiveOvertimePolicies = (policyIds: string[]) => {
        setOvertimePolicies(prev => prev.map(p => policyIds.includes(p.id) ? { ...p, status: 'Archived' } : p));
    };
     const updateOvertimePolicyStatus = (policyId: string, newStatus: 'Active' | 'Rejected') => {
// FIX: Use newStatus parameter instead of undefined status variable.
         setOvertimePolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: newStatus } : p));
    };

    // --- Leave Policy Handlers ---
    const saveLeavePolicy = (policy: LeavePolicy) => {
        setLeavePolicies(prev => {
            const isNew = !prev.some(p => p.id === policy.id);
            if (isNew) return [...prev, policy];
            return prev.map(p => p.id === policy.id ? policy : p);
        });
    };
    const archiveLeavePolicy = (policyId: string) => {
        setLeavePolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: 'Archived' } : p));
    };
    const bulkArchiveLeavePolicies = (policyIds: string[]) => {
        setLeavePolicies(prev => prev.map(p => policyIds.includes(p.id) ? { ...p, status: 'Archived' } : p));
    };
     const updateLeavePolicyStatus = (policyId: string, newStatus: 'Active' | 'Rejected') => {
// FIX: Use newStatus parameter instead of undefined status variable.
         setLeavePolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: newStatus } : p));
    };


    const value = {
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
    };

    return <PoliciesContext.Provider value={value}>{children}</PoliciesContext.Provider>;
};