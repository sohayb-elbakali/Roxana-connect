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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 bg-gray-200 rounded-xl w-48 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded-lg w-64"></div>
              </div>
              <div className="h-11 bg-blue-200 rounded-2xl w-40"></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Skeleton */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded-xl w-20 mb-5"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-100 rounded-lg w-16 mb-2"></div>
                      <div className="h-10 bg-gray-100 rounded-xl"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white border border-red-200/50 rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="fas fa-exclamation-circle text-3xl text-red-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load</h3>
            <p className="text-gray-600 mb-8">{error.msg}</p>
            <button
              onClick={() => fetchInternships(filters)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg hover:scale-105 transform hover:cursor-pointer"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="fas fa-briefcase text-4xl text-blue-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Internships Found</h3>
            <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg">
              {filters.search || filters.company || filters.location || filters.tags
                ? "No internships match your filters. Try adjusting your search."
                : "No opportunities posted yet. Be the first to share one!"}
            </p>
            {(filters.search || filters.company || filters.location || filters.tags) ? (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg hover:scale-105 transform hover:cursor-pointer"
              >
                <i className="fas fa-times mr-2"></i>
                Clear Filters
              </button>
            ) : (
              <Link
                href="/internship/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg hover:scale-105 transform hover:cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <i className="fas fa-briefcase text-blue-500 text-lg"></i>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Internships</h1>
              </div>
              <p className="text-sm text-gray-600 ml-15 font-medium">
                {internships.length} {internships.length === 1 ? "opportunity" : "opportunities"} available
              </p>
            </div>
            <Link
              href="/internship/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg hover:scale-105 transform hover:cursor-pointer"
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
            <div className="space-y-5">
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
