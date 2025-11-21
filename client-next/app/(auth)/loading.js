export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8 animate-pulse">
        {/* Icon Skeleton */}
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        
        {/* Title Skeleton */}
        <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>

        {/* Form Skeleton */}
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-11 bg-gray-100 rounded-lg"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-11 bg-gray-100 rounded-lg"></div>
          </div>
          <div className="h-12 bg-gray-300 rounded-lg mt-6"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mt-6"></div>
      </div>
    </div>
  );
}
