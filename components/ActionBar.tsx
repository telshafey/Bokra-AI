
import React from 'react';

interface ActionBarProps {
    children: React.ReactNode;
}

const ActionBar: React.FC<ActionBarProps> = ({ children }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
            {children}
        </div>
    );
};

export default ActionBar;
