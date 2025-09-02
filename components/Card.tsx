
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    paddingClass?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className = '', paddingClass = 'p-6' }) => {
    const hasHeader = !!title;

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-md ${className}`}>
            {hasHeader && (
                <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                    {title && <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">{title}</h2>}
                </div>
            )}
            <div className={paddingClass}>
                {children}
            </div>
        </div>
    );
};

export default Card;
