import React from 'react';
import { useToast, Toast } from './contexts/ToastContext';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from './icons/Icons';

const TOAST_CONFIG = {
    success: { Icon: CheckCircleIcon, style: 'bg-emerald-500 border-emerald-600' },
    error: { Icon: XCircleIcon, style: 'bg-red-500 border-red-600' },
    info: { Icon: InformationCircleIcon, style: 'bg-sky-500 border-sky-600' },
};

const ToastMessage: React.FC<{ toast: Toast, onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
    const { Icon, style } = TOAST_CONFIG[toast.type];

    return (
        <div
            className={`relative flex items-center gap-4 text-white p-4 pr-10 rounded-lg shadow-lg animate-fade-in-right border-b-4 ${style}`}
            role="alert"
        >
            <Icon className="w-6 h-6 flex-shrink-0" />
            <p className="flex-1 text-sm font-semibold">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/20"
                aria-label="Dismiss"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
    );
}

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();
    
    return (
        <div className="fixed top-6 right-6 z-[100] w-full max-w-sm space-y-3">
            {toasts.map(toast => (
                <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;