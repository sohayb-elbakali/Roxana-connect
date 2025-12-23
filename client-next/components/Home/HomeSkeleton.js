import React from 'react';

const HomeSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Skeleton */}
                <div className="mb-6 animate-pulse">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-48"></div>
                        </div>
                        <div className="h-11 bg-blue-200 rounded-xl w-40"></div>
                    </div>
                </div>

                {/* Quick Stats Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-100 rounded w-20 mb-2"></div>
                                    <div className="h-7 bg-gray-200 rounded w-16 mb-2"></div>
                                    <div className="h-3 bg-blue-100 rounded w-24"></div>
                                </div>
                                <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Feed Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Feed Header */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                            <div className="p-5 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="h-6 bg-gray-200 rounded w-28 mb-2"></div>
                                        <div className="h-4 bg-gray-100 rounded w-40"></div>
                                    </div>
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl"></div>
                                </div>
                            </div>
                            <div className="flex gap-2 px-5 pb-4 pt-3 bg-gray-50/50 border-t border-gray-50">
                                <div className="h-9 bg-blue-200 rounded-lg w-20"></div>
                                <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
                                <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
                            </div>
                        </div>

                        {/* Post Skeletons */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                                </div>
                                <div className="h-48 bg-gray-100 rounded-xl mb-4"></div>
                                <div className="flex gap-4 pt-3 border-t border-gray-50">
                                    <div className="w-16 h-8 bg-gray-100 rounded-lg"></div>
                                    <div className="w-16 h-8 bg-gray-100 rounded-lg"></div>
                                    <div className="w-16 h-8 bg-gray-100 rounded-lg"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Quick Actions Skeleton */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                            <div className="h-3 bg-gray-100 rounded w-32"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips Card Skeleton */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 animate-pulse">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-blue-200 rounded w-16 mb-2"></div>
                                    <div className="h-3 bg-blue-100 rounded w-full mb-1"></div>
                                    <div className="h-3 bg-blue-100 rounded w-4/5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSkeleton;
