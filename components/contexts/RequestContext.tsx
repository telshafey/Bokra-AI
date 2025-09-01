

import React, { createContext, useContext, useState } from 'react';
import {
    HRRequest,
    LeaveRequest,
    AttendanceAdjustmentRequest,
    LeavePermitRequest,
    RequestStatus,
    RequestContextType,
    RequestProviderProps
} from '../../types';
import {
    MOCK_ALL_REQUESTS,
    MOCK_LEAVE_REQUESTS_INITIAL,
    MOCK_ADJUSTMENT_REQUESTS_INITIAL,
    MOCK_LEAVE_PERMIT_REQUESTS_INITIAL
} from '../../constants';
import { useUserContext } from './UserContext';
import { usePoliciesContext } from './PoliciesContext';

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequestContext = () => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error('useRequestContext must be used within a RequestProvider');
    }
    return context;
};

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
    const { employees, updateProfile } = useUserContext();
    const { attendancePolicies } = usePoliciesContext();
    
    const [requests, setRequests] = useState<HRRequest[]>(MOCK_ALL_REQUESTS);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS_INITIAL);
    const [attendanceAdjustmentRequests, setAttendanceAdjustmentRequests] = useState<AttendanceAdjustmentRequest[]>(MOCK_ADJUSTMENT_REQUESTS_INITIAL);
    const [leavePermitRequests, setLeavePermitRequests] = useState<LeavePermitRequest[]>(MOCK_LEAVE_PERMIT_REQUESTS_INITIAL);

    const handleRequestAction = (requestId: number, newStatus: RequestStatus) => {
        setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));

        const leaveReq = leaveRequests.find(lr => lr.id === requestId);
        if (leaveReq) {
            setLeaveRequests(prev => prev.map(lr => lr.id === requestId ? { ...lr, status: newStatus } : lr));
            if (newStatus === 'Approved') {
                const employeeToUpdate = employees.find(e => e.id === leaveReq.employeeId);
                if (employeeToUpdate) {
                    const updatedBalances = employeeToUpdate.leaveBalances.map(balance => {
                        if (balance.type === leaveReq.leaveType) {
                            return { ...balance, used: balance.used + leaveReq.duration };
                        }
                        return balance;
                    });
                    updateProfile({ ...employeeToUpdate, leaveBalances: updatedBalances });
                }
            }
        }

        if (attendanceAdjustmentRequests.some(ar => ar.id === requestId)) {
            setAttendanceAdjustmentRequests(prev => prev.map(ar => ar.id === requestId ? { ...ar, status: newStatus } : ar));
        }

        if (leavePermitRequests.some(pr => pr.id === requestId)) {
            setLeavePermitRequests(prev => prev.map(pr => pr.id === requestId ? { ...pr, status: newStatus } : pr));
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

    const handleNewLeavePermitRequest = (newRequestData: Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'durationHours'>) => {
        const currentUser = employees.find(e => e.id === newRequestData.employeeId); // Assuming employeeId is passed
        if (!currentUser) return;
        
        const userAttendancePolicy = attendancePolicies.find(p => p.id === currentUser.attendancePolicyId);
        const start = new Date(`${newRequestData.date}T${newRequestData.startTime}`);
        const end = new Date(`${newRequestData.date}T${newRequestData.endTime}`);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const durationMinutes = durationHours * 60;

        if (userAttendancePolicy) {
            if (durationMinutes < userAttendancePolicy.minPermitDurationMinutes || durationHours > userAttendancePolicy.maxPermitDurationHours) {
                alert(`مدة الإذن غير متوافقة مع السياسة.`);
                return;
            }
            // Check max permits per month logic here
        }

        const newId = Math.max(...requests.map(r => r.id), 0) + 1;
        const newPermitRequest: LeavePermitRequest = {
            id: newId,
            status: 'Pending',
            type: 'LeavePermit',
            submissionDate: newRequestData.date,
            durationHours,
            ...newRequestData
        };
        setLeavePermitRequests(prev => [...prev, newPermitRequest]);
        setRequests(prev => [...prev, newPermitRequest]);
    };

    const value = {
        requests,
        leaveRequests,
        attendanceAdjustmentRequests,
        leavePermitRequests,
        handleRequestAction,
        handleNewLeaveRequest,
        handleNewAttendanceAdjustmentRequest,
        handleNewLeavePermitRequest,
    };

    return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};