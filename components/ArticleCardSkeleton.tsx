import React from 'react';

const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden h-full animate-pulse">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
        
        <div className="flex items-center text-sm mb-4">
            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>

        <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
        </div>
        <div className="flex space-x-2">
             <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
             <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCardSkeleton;
