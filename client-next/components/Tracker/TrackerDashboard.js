'use client';

import { useEffect } from "react";
import { connect } from "react-redux";
import { fetchTrackedInternships, fetchTrackingStats } from "../../lib/redux/modules/tracking";
import StatsWidget from "./StatsWidget";
import PrivacyNotice from "./PrivacyNotice";
import TrackerCard from "./TrackerCard";
import TrackerCardSkeleton from "./TrackerCardSkeleton";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { getDaysUntilDeadline } from "../Internships/DeadlineBadge";

const TrackerDashboard = ({
  tracking: { items, loading, stats },
  fetchTrackedInternships,
  fetchTrackingStats,
}) => {
  useEffect(() => {
    fetchTrackedInternships();
    fetchTrackingStats();
  }, [fetchTrackedInternships, fetchTrackingStats]);

  // Group internships by status and sort by deadline (urgent first)
  const groupByStatus = () => {
    const groups = {
      not_applied: [],
      applied: [],
      interviewing: [],
      offer_received: [],
      rejected: [],
    };

    items.forEach((tracking) => {
      // Skip tracking records with null or undefined internship (deleted internships)
      if (!tracking.internship) {
        return;
      }
      
      const status = tracking.status;
      // Group accepted and offer_received together as "Offers"
      if (status === "accepted" || status === "offer_received") {
        groups.offer_received.push(tracking);
      } else if (groups[status]) {
        groups[status].push(tracking);
      }
    });

    // Sort each group by deadline (urgent opportunities first)
    Object.keys(groups).forEach((status) => {
      groups[status].sort((a, b) => {
        const internshipA = (typeof a.internship === "object" && a.internship !== null) ? a.internship : null;
        const internshipB = (typeof b.internship === "object" && b.internship !== null) ? b.internship : null;
        
        // Handle missing internship data (put at the end)
        if (!internshipA && !internshipB) return 0;
        if (!internshipA) return 1;
        if (!internshipB) return -1;
        
        const daysA = getDaysUntilDeadline(internshipA.applicationDeadline);
        const daysB = getDaysUntilDeadline(internshipB.applicationDeadline);
        
        // Handle null deadlines (put them at the end)
        if (daysA === null && daysB === null) return 0;
        if (daysA === null) return 1;
        if (daysB === null) return -1;
        
        // Sort by days remaining (ascending - urgent first)
        // Expired items go to the end
        if (daysA < 0 && daysB < 0) return 0;
        if (daysA < 0) return 1;
        if (daysB < 0) return -1;
        
        return daysA - daysB;
      });
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-9 bg-gray-200 rounded w-80 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-96 animate-pulse"></div>
          </div>

          {/* Stats Widget Skeleton */}
          <div className="bg-white rounded-xl p-6 mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-5">
                  <div className="h-4 bg-gray-100 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Columns Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((col) => (
              <div key={col} className="flex flex-col">
                <div className="bg-white rounded-t-xl p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex-1 bg-white rounded-b-xl p-3 space-y-3 min-h-[200px]">
                  <TrackerCardSkeleton />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const groupedInternships = groupByStatus();

  const statusColumns = [
    {
      key: "not_applied",
      title: "Saved",
      icon: "fa-bookmark",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      key: "applied",
      title: "Applied",
      icon: "fa-check",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      key: "interviewing",
      title: "Interview",
      icon: "fa-user-tie",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      key: "offer_received",
      title: "Offers",
      icon: "fa-star",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      key: "rejected",
      title: "Rejected",
      icon: "fa-times",
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-[#BFDBFE] rounded-2xl p-8 mb-8 shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Application Tracker
                </h1>
              </div>
              <p className="text-gray-700 text-sm">
                Track your journey from application to offer
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-blue-300 shadow-sm">
              <i className="fas fa-info-circle text-blue-600"></i>
              <span className="text-xs text-gray-700 font-medium">Click any status to update</span>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice />

        {/* Statistics Widget */}
        <StatsWidget stats={stats} />

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center">
            <div className="mb-6">
              <i className="fas fa-bookmark text-slate-200 text-7xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Tracked Internships
            </h2>
            <p className="text-slate-600 mb-8">
              Start tracking internships from the feed to see them here
            </p>
            <a
              href="/feed"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200"
            >
              <i className="fas fa-search mr-2"></i>
              Browse Internships
            </a>
          </div>
        ) : (
          <>
            {/* Status Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {statusColumns.map((column) => (
                <div key={column.key} className="flex flex-col">
                  {/* Column Header */}
                  <div className={`${column.bgColor} rounded-t-2xl px-4 py-4 border-b-3 ${column.borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <i className={`fas ${column.icon} ${column.color} text-sm`}></i>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {column.title}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 bg-white text-gray-700 rounded-lg text-xs font-bold shadow-sm">
                        {groupedInternships[column.key].length}
                      </span>
                    </div>
                  </div>

                  {/* Column Content */}
                  <div className="flex-1 bg-white rounded-b-2xl p-3 space-y-3 min-h-[400px]">
                    {groupedInternships[column.key].length === 0 ? (
                      <div className="text-center py-16 px-2">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-3">
                          <i className={`fas ${column.icon} text-gray-300 text-2xl`}></i>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Empty</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {groupedInternships[column.key].map((tracking) => (
                          <TrackerCard key={tracking._id} tracking={tracking} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Keyboard Shortcuts Helper */}
        <KeyboardShortcuts />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  tracking: state.tracking,
});

export default connect(mapStateToProps, {
  fetchTrackedInternships,
  fetchTrackingStats,
})(TrackerDashboard);
