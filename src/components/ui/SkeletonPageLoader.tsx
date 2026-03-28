import React from 'react';

export const SkeletonPageLoader = () => (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-4 md:p-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
            <div className="flex space-x-3">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
            </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="flex-1 w-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm animate-pulse p-6">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="space-y-4">
                <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded-2xl"></div>
                <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded-2xl"></div>
                <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded-2xl"></div>
            </div>
        </div>
    </div>
);
