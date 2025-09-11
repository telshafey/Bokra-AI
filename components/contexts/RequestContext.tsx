import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    RequestContextType,
    RequestProviderProps,
    LeaveRequest,
    AttendanceAdjustmentRequest,
    LeavePermitRequest,
    PettyCashRequest,
    RequestStatus,
    HRRequest,
    ApprovalHistoryEntry
} from '../../types';

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequestContext = () => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error('useRequestContext must be used within a RequestProvider');
    }
    return context;
};

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [attendanceAdjustmentRequests, setAttendanceAdjustmentRequests] = useState<AttendanceAdjustmentRequest[]>([]);
    const [leavePermitRequests, setLeavePermitRequests] = useState<LeavePermitRequest[]>([]);
    const [pettyCashRequests, setPettyCashRequests] = useState<PettyCashRequest[]>([]);

    const handleNewLeaveRequest = (newRequestData: Omit<LeaveRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'approvalHistory'>) => {
        const newRequest: LeaveRequest = {
            ...newRequestData,
            id: `lr-${Date.now()}`,
            type: 'Leave',
            status: 'Pending',
            submissionDate: new Date().toISOString(),
            approvalHistory: [],
        };
        setLeaveRequests(prev => [...prev, newRequest]);
    };
    
    const handleNewAttendanceAdjustmentRequest = (newRequestData: Omit<AttendanceAdjustmentRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'approvalHistory'>) => {
        const newRequest: AttendanceAdjustmentRequest = {
            ...newRequestData,
            id: `aar-${Date.now()}`,
            type: 'AttendanceAdjustment',
            status: 'Pending',
            submissionDate: new Date().toISOString(),
            approvalHistory: [],
        };
        setAttendanceAdjustmentRequests(prev => [...prev, newRequest]);
    };
    
    const handleNewLeavePermitRequest = (newRequestData: Omit<LeavePermitRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'durationHours' | 'approvalHistory'>) => {
        const start = new Date(`${newRequestData.date}T${newRequestData.startTime}`);
        const end = new Date(`${newRequestData.date}T${newRequestData.endTime}`);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        const newRequest: LeavePermitRequest = {
            ...newRequestData,
            id: `lpr-${Date.now()}`,
            type: 'LeavePermit',
            status: 'Pending',
            submissionDate: new Date().toISOString(),
            durationHours: durationHours,
            approvalHistory: [],
        };
        setLeavePermitRequests(prev => [...prev, newRequest]);
    };

    const handleNewPettyCashRequest = (newRequestData: Omit<PettyCashRequest, 'id' | 'status' | 'type' | 'submissionDate' | 'approvalHistory'>) => {
         const newRequest: PettyCashRequest = {
            ...newRequestData,
            id: `pcr-${Date.now()}`,
            type: 'PettyCash',
            status: 'Pending',
            submissionDate: new Date().toISOString(),
            approvalHistory: [],
        };
        setPettyCashRequests(prev => [...prev, newRequest]);
    };

    // FIX: Changed newStatus type from RequestStatus to be more specific, as an action can only result in approval or rejection.
    const handleRequestAction = (requestId: string, newStatus: 'Approved' | 'Rejected', notes: string, approverId: string, approverName: string) => {
        
        const approvalEntry: ApprovalHistoryEntry = {
            approverId,
            approverName,
            status: newStatus,
            notes,
            timestamp: new Date().toISOString(),
        };

        const update = (requests: HRRequest[]) => 
            requests.map(r => r.id === requestId ? { ...r, status: newStatus, approvalHistory: [...r.approvalHistory, approvalEntry] } : r);

        setLeaveRequests(prev => update(prev) as LeaveRequest[]);
        setAttendanceAdjustmentRequests(prev => update(prev) as AttendanceAdjustmentRequest[]);
        setLeavePermitRequests(prev => update(prev) as LeavePermitRequest[]);
        setPettyCashRequests(prev => update(prev) as PettyCashRequest[]);
    };


    const value = {
        leaveRequests,
        attendanceAdjustmentRequests,
        leavePermitRequests,
        pettyCashRequests,
        handleNewLeaveRequest,
        handleNewAttendanceAdjustmentRequest,
        handleNewLeavePermitRequest,
        handleNewPettyCashRequest,
        handleRequestAction
    };

    return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};