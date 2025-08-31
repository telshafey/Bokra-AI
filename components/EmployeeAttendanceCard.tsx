import React from 'react';
import { EmployeeProfile, AttendanceRecord, AttendanceEvent, AttendancePolicy, AttendanceStatus } from '../types';
import { ClockIcon, MapPinIcon, CheckCircleIcon, PencilIcon, InformationCircleIcon, PlusCircleIcon } from './icons/Icons';

interface EmployeeAttendanceCardProps {
    employee: EmployeeProfile;
    recordsForDay: AttendanceRecord[];
    eventsForDay: AttendanceEvent[];
    policy?: AttendancePolicy | null;
}

const STATUS_TRANSLATION: Record<AttendanceStatus, string> = {
    Present: 'حاضر',
    Absent: 'غائب',
    Leave: 'إجازة',
    Holiday: 'عطلة رسمية',
    Weekend: 'عطلة أسبوعية',
};

const EmployeeAttendanceCard: React.FC<EmployeeAttendanceCardProps> = ({ employee, recordsForDay, eventsForDay, policy }) => {
    
    const attendanceEventsPairs = eventsForDay.reduce((acc, event, index, array) => {
        if (event.type === 'CheckIn') {
            const checkOutEvent = array.find((e, i) => i > index && e.type === 'CheckOut' && !acc.flat().includes(e));
            acc.push([event, checkOutEvent]);
        }
        return acc;
    }, [] as [AttendanceEvent, AttendanceEvent | undefined][]);

    const record = recordsForDay[0];

    let latenessStatus = { text: 'On time', color: 'text-emerald-600' };

    if (record && record.firstCheckIn && policy) {
        const [h, m] = record.firstCheckIn.split(':').map(Number);
        const checkInMinutes = h * 60 + m;
        const gracePeriodEnd = 9 * 60 + policy.gracePeriodInMinutes;
        if (checkInMinutes > gracePeriodEnd) {
            const latenessMinutes = checkInMinutes - (9 * 60);
            const tier = policy.latenessTiers.find(t => latenessMinutes >= t.fromMinutes && latenessMinutes <= t.toMinutes);
            if (tier) {
                latenessStatus = { text: `Late Tier, +${tier.penaltyHours}h`, color: 'text-red-600' };
            } else {
                 latenessStatus = { text: `Late`, color: 'text-red-600' };
            }
        }
    }


    return (
        <div className="bg-white rounded-xl shadow-md p-4 space-y-3 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={employee.avatarUrl} alt={employee.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-bold text-slate-800">{employee.name}</p>
                        <p className="text-sm text-slate-500">{new Date(recordsForDay[0]?.date || Date.now()).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-1">
                    <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full" title="تعديل السجل"><PencilIcon className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full" title="معلومات إضافية"><InformationCircleIcon className="w-5 h-5" /></button>
                    <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full" title="إضافة"><PlusCircleIcon className="w-5 h-5" /></button>
                </div>
            </div>

            {attendanceEventsPairs.length > 0 ? (
                attendanceEventsPairs.map(([checkIn, checkOut], index) => {
                    const checkInTime = new Date(checkIn.timestamp);
                    const checkOutTime = checkOut ? new Date(checkOut.timestamp) : null;
                    const durationMs = checkOutTime ? checkOutTime.getTime() - checkInTime.getTime() : null;
                    const durationHours = durationMs ? (durationMs / (1000 * 60 * 60)).toFixed(2) : null;
                    
                    return (
                        <div key={index} className="bg-slate-50 p-3 rounded-lg border">
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <p>Sign-in #{index + 1}</p>
                                {durationHours && <p className="text-slate-500">{durationHours} Hours</p>}
                                <p className={latenessStatus.color}>{index === 0 ? latenessStatus.text : 'On time'}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4 text-emerald-500" />
                                    <span className="font-mono">{checkInTime.toLocaleTimeString('en-GB')}</span>
                                    <MapPinIcon className={`w-4 h-4 ${checkIn.isWithinGeofence ? 'text-emerald-500' : 'text-red-500'}`} />
                                </div>
                                 <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4 text-red-500" />
                                    <span className="font-mono">{checkOutTime ? checkOutTime.toLocaleTimeString('en-GB') : '--:--'}</span>
                                    {checkOut && <MapPinIcon className={`w-4 h-4 ${checkOut.isWithinGeofence ? 'text-emerald-500' : 'text-red-500'}`} />}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center p-4 bg-slate-100 rounded-lg">
                     <p className="text-slate-500 font-semibold">{STATUS_TRANSLATION[record?.status || 'Absent']}</p>
                </div>
            )}
            
            <div className="flex justify-end gap-2 text-sm pt-2 border-t">
                <button className="flex items-center gap-1 text-sky-600 hover:underline">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Check-ins</span>
                </button>
            </div>
        </div>
    );
};

export default EmployeeAttendanceCard;