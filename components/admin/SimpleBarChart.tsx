import React from 'react';

interface ChartData {
    label: string;
    value: number;
}

interface SimpleBarChartProps {
    data: ChartData[];
    title: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, title }) => {
    const maxValue = React.useMemo(() => {
        if (!data || data.length === 0) return 1;
        return Math.max(...data.map(item => item.value));
    }, [data]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
            <div className="flex items-end space-x-2 h-64">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end" title={`${item.label}: ${item.value}`}>
                        <div 
                            className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-md hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300"
                            style={{ height: `${(item.value / (maxValue || 1)) * 100}%` }}
                        >
                           <div className="text-center text-white text-xs font-bold pt-1 opacity-0 hover:opacity-100">{item.value}</div>
                        </div>
                        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-full">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleBarChart;
