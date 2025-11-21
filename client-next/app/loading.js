export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center">
        {/* Logo Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-16 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>

        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    </div>
  );
}
