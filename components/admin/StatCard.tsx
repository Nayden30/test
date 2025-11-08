import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.FC<any>;
    helpText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, helpText }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-start space-x-4">
        <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            {helpText && <p className="text-xs text-gray-400 dark:text-gray-500">{helpText}</p>}
        </div>
    </div>
);

export default StatCard;
