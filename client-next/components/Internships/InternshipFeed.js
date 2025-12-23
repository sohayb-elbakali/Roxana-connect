'use client';

import { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { fetchInternships } from "../../lib/redux/modules/internships";
import { fetchTrackedInternships } from "../../lib/redux/modules/tracking";
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

  const sortedInternships = useMemo(() => {
    if (!internships || internships.length === 0) return [];

    if (filters.sort === "deadline") {
      return [...internships].sort((a, b) => {
        const daysA = getDaysUntilDeadline(a.applicationDeadline);
        const daysB = getDaysUntilDeadline(b.applicationDeadline);

        if (daysA === null && daysB === null) return 0;
        if (daysA === null) return 1;
        if (daysB === null) return -1;
        if (daysA < 0 && daysB < 0) return 0;
        if (daysA < 0) return 1;
        if (daysB < 0) return -1;

        return daysA - daysB;
      });
    }

    return internships;
  }, [internships, filters.sort]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-7 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-64"></div>
              </div>
              <div className="h-10 bg-blue-200 rounded-lg w-36"></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Skeleton */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-20 mb-5"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-100 rounded w-16 mb-2"></div>
                      <div className="h-10 bg-gray-100 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Cards Skeleton */}
            <main className="flex-1">
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white border border-red-200 rounded-xl p-10 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-circle text-2xl text-red-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load</h3>
            <p className="text-gray-600 mb-6">{error.msg}</p>
            <button
              onClick={() => fetchInternships(filters)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-briefcase text-3xl text-blue-300"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Internships Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filters.search || filters.company || filters.location || filters.tags
                ? "No internships match your filters. Try adjusting your search."
                : "No opportunities posted yet. Be the first to share one!"}
            </p>
            {(filters.search || filters.company || filters.location || filters.tags) ? (
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <i className="fas fa-times mr-2"></i>
                Clear Filters
              </button>
            ) : (
              <Link
                href="/internship/create"
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                Post Internship
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main feed
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-briefcase text-blue-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Internships</h1>
              </div>
              <p className="text-sm text-gray-500 ml-13">
                {internships.length} {internships.length === 1 ? "opportunity" : "opportunities"} available
              </p>
            </div>
            <Link
              href="/internship/create"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <i className="fas fa-plus mr-2"></i>
              Post Internship
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <InternshipFilters />
            </div>
          </aside>

          {/* Cards */}
          <main className="flex-1">
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
