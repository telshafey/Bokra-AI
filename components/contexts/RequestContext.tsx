// FIX: Implemented the RequestContext provider.
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HRRequest, RequestContextType, RequestProviderProps } from '../../types';
import { useToast } from './ToastContext';
import { useTranslation } from './LanguageContext';

// Mock API functions for requests
const MOCK_REQUESTS: HRRequest[] = [
    { 
        id: 'lr-002', 
        employeeId: 'emp-011', 
        type: 'Leave', 
        status: 'Pending', 
        submissionDate: '2025-08-20T11:00:00Z', 
        approvalHistory: [],
        leaveType: 'Casual', 
        startDate: '2025-08-22', 
        endDate: '2025-08-22', 
        reason: 'ظرف شخصي طارئ', 
        duration: 1 
    }
];

const fetchRequests = async (): Promise<HRRequest[]> => {
    await new Promise(res => setTimeout(res, 300));
    return MOCK_REQUESTS;
};

const submitNewRequest = async (request: Omit<HRRequest, 'id' | 'status' | 'submissionDate' | 'approvalHistory'>): Promise<HRRequest> => {
    await new Promise(res => setTimeout(res, 500));
    const newRequest: HRRequest = {
        ...request,
        id: `req-${Date.now()}`,
        status: 'Pending',
        submissionDate: new Date().toISOString(),
        approvalHistory: [],
    } as HRRequest;
    MOCK_REQUESTS.push(newRequest);
    return newRequest;
};

const updateRequestStatus = async ({ requestId, status, notes }: { requestId: string, status: 'Approved' | 'Rejected', notes: string }): Promise<HRRequest> => {
    await new Promise(res => setTimeout(res, 500));
    const request = MOCK_REQUESTS.find(r => r.id === requestId);
    if (request) {
        request.status = status;
        request.approvalHistory.push({
            approverId: 'current-manager-id', // This should come from current user context
            status,
            timestamp: new Date().toISOString(),
            notes,
        });
        return request;
    }
    throw new Error('Request not found');
};

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequestContext = () => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error('useRequestContext must be used within a RequestProvider');
    }
    return context;
};

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const { data: requests = [] } = useQuery<HRRequest[], Error>({
        queryKey: ['requests'],
        queryFn: fetchRequests,
    });

    const submitMutation = useMutation({
        mutationFn: submitNewRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            addToast(t('toasts.requestSubmitted'), 'success');
        },
        onError: (err: Error) => {
            addToast(err.message, 'error');
        },
    });
    
    const approveMutation = useMutation({
        mutationFn: (data: { requestId: string, approverId: string, notes: string }) => updateRequestStatus({ requestId: data.requestId, status: 'Approved', notes: data.notes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            addToast(t('toasts.requestApproved'), 'success');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (data: { requestId: string, approverId: string, notes: string }) => updateRequestStatus({ requestId: data.requestId, status: 'Rejected', notes: data.notes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            addToast(t('toasts.requestRejected'), 'success');
        },
    });

    const value: RequestContextType = {
        requests,
        submitRequest: (request) => submitMutation.mutate(request),
        approveRequest: (requestId, approverId, notes) => approveMutation.mutate({ requestId, approverId, notes }),
        rejectRequest: (requestId, approverId, notes) => rejectMutation.mutate({ requestId, approverId, notes }),
    };

    return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};
