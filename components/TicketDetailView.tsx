

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { EmployeeProfile, SupportTicket, TicketStatus } from '../types';
import { ArrowRightIcon, PaperAirplaneIcon } from './icons/Icons';
import { timeSince } from '../constants';
// FIX: Imported useTranslation hook to pass the 't' function to timeSince.
import { useTranslation } from './contexts/LanguageContext';

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

const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

interface TicketDetailViewProps {
    ticket: SupportTicket;
    currentUser: EmployeeProfile;
    userMap: Map<string, EmployeeProfile>;
    onBack: () => void;
    onAddMessage: (ticketId: string, messageContent: string) => void;
    onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
}

const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticket, currentUser, userMap, onBack, onAddMessage, onUpdateTicketStatus }) => {
    const [newMessage, setNewMessage] = useState('');
    const isAdmin = useMemo(() => ['Super Admin', 'Admin', 'HR Manager'].includes(currentUser.role), [currentUser.role]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    // FIX: Get the translation function 't' to pass to timeSince.
    const { t } = useTranslation();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onAddMessage(ticket.id, newMessage);
        setNewMessage('');
    };
    
    return (
        <div className="bg-white rounded-xl shadow-md h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
                        <ArrowRightIcon className="w-6 h-6 text-slate-600"/>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{ticket.title}</h2>
                        <p className="text-sm text-slate-500">مقدمة من: {userMap.get(ticket.employeeId)?.name}</p>
                    </div>
                </div>
                <div>
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${STATUS_BADGE_CLASSES[ticket.status]}`}>
                        {STATUS_TRANSLATION[ticket.status]}
                    </span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-0">
                {/* Chat Area */}
                <div className="lg:col-span-3 flex flex-col border-l">
                     <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                        {ticket.messages.map(msg => {
                            const author = userMap.get(msg.authorId);
                            const isCurrentUser = msg.authorId === currentUser.id;
                            return (
                                <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                    <img src={author?.avatarUrl} alt={author?.name} className="w-10 h-10 rounded-full"/>
                                    <div className={`p-3 rounded-lg max-w-lg ${isCurrentUser ? 'bg-sky-500 text-white' : 'bg-white border'}`}>
                                        <p className="font-bold">{author?.name}</p>
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        <p className={`text-xs mt-2 opacity-75 ${isCurrentUser ? 'text-right' : 'text-left'}`}>{formatTimestamp(msg.timestamp)}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2 bg-white">
                        <textarea 
                            rows={2} 
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="اكتب ردك هنا..."
                            className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                            spellCheck="true"
                        />
                        <button type="submit" className="bg-sky-600 text-white p-3 rounded-lg hover:bg-sky-700 self-stretch">
                            <PaperAirplaneIcon className="w-6 h-6" />
                        </button>
                    </form>
                </div>

                {/* Details Sidebar */}
                <div className="p-4 space-y-4 border-t lg:border-t-0">
                    <h3 className="font-bold text-slate-700">تفاصيل التذكرة</h3>
                    <div className="text-sm space-y-2">
                        <p><strong>الأولوية:</strong> {ticket.priority}</p>
                        <p><strong>الفئة:</strong> {ticket.category}</p>
                        <p><strong>تاريخ الإنشاء:</strong> {formatTimestamp(ticket.createdAt)}</p>
                        {/* FIX: Passed the 't' function as the second argument to timeSince. */}
                        <p><strong>آخر تحديث:</strong> {timeSince(ticket.updatedAt, t)}</p>
                        <p><strong>المسؤول:</strong> {userMap.get(ticket.assignedToId || '')?.name || 'لم يتم التعيين'}</p>
                    </div>

                    {isAdmin && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">تغيير الحالة</label>
                            <select
                                value={ticket.status}
                                onChange={e => onUpdateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                            >
                                <option value="New">جديدة</option>
                                <option value="In Progress">قيد المعالجة</option>
                                <option value="Resolved">تم حلها</option>
                                <option value="Closed">مغلقة</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetailView;