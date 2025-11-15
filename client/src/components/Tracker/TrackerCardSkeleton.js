/**
 * TrackerCardSkeleton Component
 * 
 * Loading skeleton for TrackerCard to improve perceived performance
 */
const TrackerCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-300 animate-pulse">
      {/* Company and Position */}
      <div className="mb-3">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Deadline Badge */}
      <div className="mb-3">
        <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
      </div>

      {/* Status Selector */}
      <div className="mb-3">
        <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Notes Preview */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default TrackerCardSkeleton;
