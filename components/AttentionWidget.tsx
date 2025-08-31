
import React from 'react';
import type { AttentionItem } from '../types';
import { timeSince } from '../constants';

interface AttentionWidgetProps {
  items: AttentionItem[];
  onItemClick: (item: AttentionItem) => void;
}

const AttentionWidget: React.FC<AttentionWidgetProps> = ({ items, onItemClick }) => {

    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-slate-700">تحت انتباهك ({items.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.length > 0 ? items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onItemClick(item)}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-right"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-full border">
                                <item.icon className="w-6 h-6 text-slate-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{item.text}</p>
                                <p className="text-sm text-slate-500">
                                    للموظف: <span className="font-medium">{item.employeeName}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-xs text-slate-400">{timeSince(item.timestamp)}</span>
                             <img src={item.employeeAvatarUrl} alt={item.employeeName} className="w-10 h-10 rounded-full object-cover"/>
                        </div>
                    </button>
                )) : (
                    <div className="text-center py-12 text-slate-500">
                        <p className="font-semibold text-lg">لا توجد إجراءات مطلوبة.</p>
                        <p className="text-sm">كل شيء على ما يرام.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttentionWidget;
