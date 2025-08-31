import React, { useState, useMemo } from 'react';
import type { EmployeeProfile, SupportTicket, TicketStatus, TicketPriority } from '../types';
import CreateTicketModal from './CreateTicketModal';
import TicketDetailView from './TicketDetailView';
import { PlusCircleIcon } from './icons/Icons';
import { timeSince } from '../constants';

const STATUS_BADGE_CLASSES: Record<TicketStatus, string> = {
    New: 'bg-sky-100 text-sky-800',
    'In Progress': 'bg-amber-100 text-amber-800',
    Resolved: 'bg-emerald-100 text-emerald-800',
    Closed: 'bg-slate-100 text-slate-700',
};

const STATUS_TRANSLATION: Record<TicketStatus, string> = {
    New: 'جديدة',
    'In Progress': 'قيد المعالجة',
    Resolved: 'تم حلها',
    Closed: 'مغلقة',
};

const PRIORITY_STYLES: Record<TicketPriority, { bg: string }> = {
    Urgent: { bg: 'bg-red-500' },
    High: { bg: 'bg-orange-500' },
    Medium: { bg: 'bg-amber-500' },
    Low: { bg: 'bg-sky-500' },
};


interface SupportTicketsPageProps {
    currentUser: EmployeeProfile;
    allUsers: EmployeeProfile[];
    allTickets: SupportTicket[];
    onCreateTicket: (ticketData: Omit<SupportTicket, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt' | 'messages'>) => void;
    onAddMessage: (ticketId: string, messageContent: string) => void;
    onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
}

const SupportTicketsPage: React.FC<SupportTicketsPageProps> = ({ currentUser, allUsers, allTickets, onCreateTicket, onAddMessage, onUpdateTicketStatus }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [activeFilter, setActiveFilter] = useState<TicketStatus | 'All'>('All');

    const isAdminView = useMemo(() => ['Super Admin', 'Admin', 'HR Manager'].includes(currentUser.role), [currentUser.role]);

    const ticketsToDisplay = useMemo(() => {
        let tickets = isAdminView ? allTickets : allTickets.filter(t => t.employeeId === currentUser.id);
        if (activeFilter !== 'All') {
            tickets = tickets.filter(t => t.status === activeFilter);
        }
        return tickets;
    }, [allTickets, currentUser, isAdminView, activeFilter]);

    const ticketStats = useMemo(() => {
        if (!isAdminView) return null;
        return {
            new: allTickets.filter(t => t.status === 'New').length,
            inProgress: allTickets.filter(t => t.status === 'In Progress').length,
            resolved: allTickets.filter(t => t.status === 'Resolved').length,
        }
    }, [allTickets, isAdminView]);

    const userMap = useMemo(() => new Map(allUsers.map(u => [u.id, u])), [allUsers]);

    if (selectedTicket) {
        return <TicketDetailView 
                    ticket={selectedTicket} 
                    currentUser={currentUser}
                    userMap={userMap}
                    onBack={() => setSelectedTicket(null)} 
                    onAddMessage={onAddMessage}
                    onUpdateTicketStatus={onUpdateTicketStatus}
                />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">تذاكر الدعم</h1>
                    <p className="text-slate-500 mt-1">{isAdminView ? "إدارة جميع تذاكر الدعم المقدمة من الموظفين." : "إنشاء وتتبع تذاكر الدعم الخاصة بك."}</p>
                </div>
                {!isAdminView && (
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md">
                        <PlusCircleIcon className="w-6 h-6"/>
                        <span>فتح تذكرة جديدة</span>
                    </button>
                )}
            </div>

            {isAdminView && ticketStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-center p-2 rounded-lg bg-sky-50">
                        <p className="text-sm text-sky-700 font-semibold">تذاكر جديدة</p>
                        <p className="text-3xl font-bold text-sky-800">{ticketStats.new}</p>
                    </div>
                     <div className="text-center p-2 rounded-lg bg-amber-50">
                        <p className="text-sm text-amber-700 font-semibold">قيد المعالجة</p>
                        <p className="text-3xl font-bold text-amber-800">{ticketStats.inProgress}</p>
                    </div>
                     <div className="text-center p-2 rounded-lg bg-emerald-50">
                        <p className="text-sm text-emerald-700 font-semibold">تم حلها</p>
                        <p className="text-3xl font-bold text-emerald-800">{ticketStats.resolved}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-4">
                {isAdminView && (
                    <div className="pb-4 border-b flex items-center gap-2">
                        {(['All', 'New', 'In Progress', 'Resolved', 'Closed'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setActiveFilter(status)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full ${activeFilter === status ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                {status === 'All' ? 'الكل' : STATUS_TRANSLATION[status]}
                            </button>
                        ))}
                    </div>
                )}
                <div className="space-y-3 pt-4">
                    {ticketsToDisplay.length > 0 ? ticketsToDisplay.map(ticket => {
                        const employee = userMap.get(ticket.employeeId);
                        const assignedTo = userMap.get(ticket.assignedToId || '');
                        const lastMessage = ticket.messages[ticket.messages.length - 1];
                        return (
                            <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-sky-500 cursor-pointer transition-all flex gap-3">
                                <div className={`w-1.5 rounded-full ${PRIORITY_STYLES[ticket.priority].bg}`}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {isAdminView && employee && (
                                                <div className="flex items-center gap-2 mb-1">
                                                    <img src={employee.avatarUrl} alt={employee.name} className="w-5 h-5 rounded-full" />
                                                    <span className="text-xs font-semibold text-slate-600">{employee.name}</span>
                                                </div>
                                            )}
                                            <h3 className="font-bold text-slate-800">{ticket.title}</h3>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_BADGE_CLASSES[ticket.status]}`}>
                                            {STATUS_TRANSLATION[ticket.status]}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 my-2 truncate" title={lastMessage?.content}>
                                        {lastMessage ? `${userMap.get(lastMessage.authorId)?.name.split(' ')[0]}: ${lastMessage.content}` : ticket.description}
                                    </p>
                                    <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-2 mt-2">
                                        <span>
                                            المسؤول: <span className="font-semibold text-slate-700">{assignedTo?.name || 'لم يحدد'}</span>
                                        </span>
                                        <span>
                                            آخر تحديث: {timeSince(ticket.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="text-center py-12 text-slate-500">
                            <p>لا توجد تذاكر دعم لعرضها.</p>
                        </div>
                    )}
                </div>
            </div>

            <CreateTicketModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={onCreateTicket}
            />
        </div>
    );
};

export default SupportTicketsPage;