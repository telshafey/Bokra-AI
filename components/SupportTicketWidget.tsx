import React from 'react';
import { SupportTicket, TicketStatus } from '../types';
import { QuestionMarkCircleIcon } from './icons/Icons';

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

interface SupportTicketWidgetProps {
    latestTicket: SupportTicket | null;
    setActivePage: (page: string) => void;
}

const SupportTicketWidget: React.FC<SupportTicketWidgetProps> = ({ latestTicket, setActivePage }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg h-full flex flex-col justify-between">
            <div>
                 <div className="flex items-center gap-3 mb-3">
                    <QuestionMarkCircleIcon className="w-8 h-8 text-emerald-500" />
                    <h2 className="text-xl font-bold text-slate-700">تذاكر الدعم</h2>
                </div>
                {latestTicket ? (
                    <div>
                        <p className="text-sm text-slate-500 mb-1">آخر تذكرة مفتوحة:</p>
                        <h3 className="font-bold text-slate-800 truncate mb-3" title={latestTicket.title}>{latestTicket.title}</h3>
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-semibold text-slate-600">الحالة:</span>
                             <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_BADGE_CLASSES[latestTicket.status]}`}>
                                {STATUS_TRANSLATION[latestTicket.status]}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="font-semibold text-slate-700">ليس لديك تذاكر مفتوحة.</p>
                        <p className="text-sm text-slate-500 mt-1">يمكنك فتح تذكرة جديدة من صفحة الدعم.</p>
                    </div>
                )}
            </div>
            <button
                onClick={() => setActivePage('تذاكر الدعم')}
                className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors mt-4"
            >
                {latestTicket ? 'عرض تفاصيل التذكرة' : 'فتح تذكرة جديدة'}
            </button>
        </div>
    );
};

export default SupportTicketWidget;