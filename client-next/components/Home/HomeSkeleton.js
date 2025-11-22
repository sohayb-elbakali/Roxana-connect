import React from 'react';

const HomeSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar Skeleton */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
                            <div className="h-24 bg-gray-200"></div>
                            <div className="px-4 pb-4">
                                <div className="relative -mt-12 mb-3 flex justify-center">
                                    <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white"></div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Feed Skeleton */}
                    <div className="col-span-1 lg:col-span-6 space-y-6">
                        {/* Create Post Skeleton */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                <div className="flex-1 h-12 bg-gray-100 rounded-full border border-gray-200"></div>
                            </div>
                            <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                                <div className="w-20 h-8 bg-gray-200 rounded"></div>
                                <div className="w-20 h-8 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        {/* Posts Skeletons */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                </div>
                                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="flex justify-between pt-2 border-t border-gray-100">
                                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Sidebar Skeleton */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                            <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSkeleton;
