import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    actionButton?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actionButton }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h1>
            <p className="text-sm md:text-base text-slate-500 mt-1">{subtitle}</p>
        </div>
        {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
    </div>
);

export default PageHeader;
