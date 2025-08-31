import React from 'react';
import type { Notification, EmployeeProfile } from '../types';
import { TrashIcon, CheckCircleIcon } from './icons/Icons';
import { timeSince } from '../constants';


interface NotificationPanelProps {
    notifications: Notification[];
    allUsers: EmployeeProfile[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, allUsers, onMarkAsRead, onMarkAllAsRead, onClearAll, onClose }) => {
    const userMap = new Map(allUsers.map(u => [u.id, u]));

    return (
        <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border z-50 flex flex-col">
            {/* Panel Header */}
            <div className="p-3 border-b flex justify-between items-center">
                <h3 className="font-bold text-slate-800">الإشعارات</h3>
                <div className="flex items-center gap-2">
                    <button onClick={onMarkAllAsRead} className="p-1 text-slate-500 hover:text-sky-600" title="تحديد الكل كمقروء">
                        <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button onClick={onClearAll} className="p-1 text-slate-500 hover:text-red-600" title="مسح الكل">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notif => {
                        const sender = userMap.get(notif.senderId);
                        return (
                            <div
                                key={notif.id}
                                onClick={() => onMarkAsRead(notif.id)}
                                className={`flex items-start gap-3 p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${!notif.isRead ? 'bg-sky-50' : 'bg-white'}`}
                            >
                                {sender && <img src={sender.avatarUrl} alt={sender.name} className="w-10 h-10 rounded-full flex-shrink-0" />}
                                <div className="flex-1">
                                    <p className="text-sm text-slate-700 leading-tight" dangerouslySetInnerHTML={{ __html: notif.message.replace(sender?.name || 'النظام', `<strong>${sender?.name || 'النظام'}</strong>`) }}></p>
                                    <p className="text-xs text-slate-400 mt-1">{timeSince(notif.timestamp)}</p>
                                </div>
                                {!notif.isRead && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full mt-1.5 flex-shrink-0"></div>}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center p-8 text-slate-500">
                        <p>لا توجد إشعارات جديدة.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;