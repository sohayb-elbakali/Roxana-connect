import { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { fetchInternships } from "../../redux/modules/internships";
import { fetchTrackedInternships } from "../../redux/modules/tracking";
import InternshipCard from "./InternshipCard";
import InternshipCardSkeleton from "./InternshipCardSkeleton";
import { InternshipFilters } from "../Filters";
import { getDaysUntilDeadline } from "./DeadlineBadge";

const InternshipFeed = ({
  fetchInternships,
  fetchTrackedInternships,
  internships,
  filters,
  loading,
  error,
}) => {
  useEffect(() => {
    fetchInternships(filters);
    fetchTrackedInternships();
  }, [fetchInternships, fetchTrackedInternships, filters]);

  // Sort internships with additional client-side sorting for deadline urgency
  const sortedInternships = useMemo(() => {
    if (!internships || internships.length === 0) return [];
    
    // If sorting by deadline, ensure urgent opportunities are prioritized
    if (filters.sort === "deadline") {
      return [...internships].sort((a, b) => {
        const daysA = getDaysUntilDeadline(a.applicationDeadline);
        const daysB = getDaysUntilDeadline(b.applicationDeadline);
        
        // Handle null deadlines (put them at the end)
        if (daysA === null && daysB === null) return 0;
        if (daysA === null) return 1;
        if (daysB === null) return -1;
        
        // Expired items go to the end
        if (daysA < 0 && daysB < 0) return 0;
        if (daysA < 0) return 1;
        if (daysB < 0) return -1;
        
        // Sort by days remaining (ascending - urgent first)
        return daysA - daysB;
      });
    }
    
    return internships;
  }, [internships, filters.sort]);

  // Loading state with skeletons
  if (loading) {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-8 bg-gray-300 rounded w-64 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
              <div className="h-10 w-40 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Skeleton */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-20 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Cards Skeleton */}
            <main className="flex-1 max-w-4xl">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <InternshipCardSkeleton key={i} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && error.msg) {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white border border-red-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-circle text-3xl text-red-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Unable to Load Internships
            </h3>
            <p className="text-gray-600 mb-8">{error.msg}</p>
            <button
              onClick={() => fetchInternships(filters)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm"
            >
              <i className="fas fa-redo mr-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!internships || internships.length === 0) {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-briefcase text-4xl text-blue-300"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Internships Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filters.search ||
              filters.company ||
              filters.location ||
              filters.tags
                ? "No internships match your current filters. Try adjusting your search criteria."
                : "No internship opportunities have been posted yet. Be the first to share one!"}
            </p>
            {(filters.search ||
              filters.company ||
              filters.location ||
              filters.tags) ? (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                <i className="fas fa-times mr-2"></i>
                Clear All Filters
              </button>
            ) : (
              <a
                href="/internship/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                <i className="fas fa-plus mr-2"></i>
                Post First Internship
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main feed with internships
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Internship Opportunities
              </h1>
              <p className="text-gray-600 text-sm">
                Discover {internships.length}{" "}
                {internships.length === 1 ? "opportunity" : "opportunities"} • Find your perfect internship
              </p>
            </div>
            <a
              href="/internship/create"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200"
            >
              <i className="fas fa-plus mr-2"></i>
              Post Internship
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Container - Centered */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Compact */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <InternshipFilters />
            </div>
          </aside>

          {/* Internship Cards - Centered and Maximum Width */}
          <main className="flex-1 max-w-4xl">
            <div className="space-y-4">
              {sortedInternships.map((internship) => (
                <InternshipCard key={internship._id} internship={internship} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  internships: state.internships.items,
  filters: state.internships.filters,
  loading: state.internships.loading,
  error: state.internships.error,
});

export default connect(mapStateToProps, {
  fetchInternships,
  fetchTrackedInternships,
})(InternshipFeed);
