import React, { useState, useEffect } from 'react';
import { CheckInStatus } from '../types';
import { ClockIcon } from './icons/Icons'; 

const LiveClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <p className="text-5xl font-bold text-slate-800 tracking-wider">
            {time.toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
    );
};


interface ClockInWidgetProps {
    status: CheckInStatus;
    onPunch: (coords: { latitude: number; longitude: number; }) => void;
}

const ClockInWidget: React.FC<ClockInWidgetProps> = ({ status, onPunch }) => {
    const [isPunching, setIsPunching] = useState(false);
    const isCheckedIn = status === 'CheckedIn';

    const buttonStyles = isCheckedIn
        ? 'bg-red-500 hover:bg-red-600'
        : 'bg-emerald-500 hover:bg-emerald-600';
    
    const buttonText = isCheckedIn ? 'تسجيل انصراف' : 'تسجيل حضور';

    const handlePunch = () => {
        setIsPunching(true);
        if (!navigator.geolocation) {
            alert("الموقع الجغرافي غير مدعوم في هذا المتصفح.");
            setIsPunching(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onPunch({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setIsPunching(false);
            },
            (error) => {
                alert(`خطأ في تحديد الموقع: ${error.message}`);
                setIsPunching(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg text-center flex flex-col items-center justify-center">
            <ClockIcon className="w-12 h-12 text-sky-500 mb-2"/>
            <h2 className="text-xl font-bold mb-2 text-slate-700">تسجيل الدوام</h2>
            <LiveClock />
            <p className="text-sm text-slate-500 mb-6">
                {new Date().toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <button
                onClick={handlePunch}
                disabled={isPunching}
                className={`w-full max-w-xs text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${buttonStyles} disabled:bg-slate-400 disabled:scale-100 disabled:cursor-wait`}
            >
                {isPunching ? 'جاري تحديد الموقع...' : buttonText}
            </button>
        </div>
    );
};

export default ClockInWidget;