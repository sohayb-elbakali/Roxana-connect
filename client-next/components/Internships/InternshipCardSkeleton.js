/**
 * InternshipCardSkeleton Component
 * 
 * Loading skeleton for InternshipCard to improve perceived performance
 */
const InternshipCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="p-6">
        {/* Header with Company and Deadline */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
        </div>

        {/* Location and Type */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Salary Range */}
        <div className="mb-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>

        {/* Tracking Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Posted By */}
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default InternshipCardSkeleton;
