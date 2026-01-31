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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded-xl w-80 mb-3 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded-lg w-96 animate-pulse"></div>
          </div>

          {/* Stats Widget Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="h-4 bg-gray-100 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Columns Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5].map((col) => (
              <div key={col} className="flex flex-col">
                <div className="bg-white rounded-t-2xl p-4 animate-pulse shadow-sm">
                  <div className="h-5 bg-gray-200 rounded-xl w-24"></div>
                </div>
                <div className="flex-1 bg-white rounded-b-2xl p-4 space-y-4 min-h-[200px] shadow-sm">
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
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      headerColor: "bg-white",
      borderColor: "border-slate-200",
      accentColor: "border-slate-400",
    },
    {
      key: "applied",
      title: "Applied",
      icon: "fa-paper-plane",
      color: "text-blue-600",
      bgColor: "bg-blue-50/30",
      headerColor: "bg-blue-50",
      borderColor: "border-blue-200",
      accentColor: "border-blue-400",
    },
    {
      key: "interviewing",
      title: "Interviewing",
      icon: "fa-user-tie",
      color: "text-purple-600",
      bgColor: "bg-purple-50/30",
      headerColor: "bg-purple-50",
      borderColor: "border-purple-200",
      accentColor: "border-purple-400",
    },
    {
      key: "offer_received",
      title: "Offers",
      icon: "fa-trophy",
      color: "text-amber-600",
      bgColor: "bg-amber-50/30",
      headerColor: "bg-amber-50",
      borderColor: "border-amber-200",
      accentColor: "border-amber-400",
    },
    {
      key: "rejected",
      title: "Rejected",
      icon: "fa-times-circle",
      color: "text-rose-600",
      bgColor: "bg-rose-50/30",
      headerColor: "bg-rose-50",
      borderColor: "border-rose-200",
      accentColor: "border-rose-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <i className="fas fa-columns text-blue-600 text-lg"></i>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Application Tracker
                </h1>
              </div>
              <p className="text-sm text-gray-600 ml-15">
                Track your journey from application to offer • Manage {items.length} {items.length === 1 ? 'application' : 'applications'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-blue-100/50 px-4 py-2.5 rounded-xl border border-blue-200/50 shadow-sm">
              <i className="fas fa-info-circle text-blue-600"></i>
              <span className="font-semibold">Click status to update</span>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice />

        {/* Statistics Widget */}
        <StatsWidget stats={stats} />

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-20 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <i className="fas fa-bookmark text-slate-400 text-4xl"></i>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              No Tracked Internships
            </h2>
            <p className="text-slate-600 mb-10 text-lg">
              Start tracking internships from the feed to see them here
            </p>
            <a
              href="/feed"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 transform"
            >
              <i className="fas fa-search"></i>
              Browse Internships
            </a>
          </div>
        ) : (
          <>
            {/* Status Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {statusColumns.map((column) => (
                <div key={column.key} className="flex flex-col h-full">
                  {/* Column Header */}
                  <div className={`${column.headerColor} rounded-t-2xl px-5 py-4 border-t-4 ${column.accentColor} shadow-sm z-10`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <i className={`fas ${column.icon} ${column.color} text-base`}></i>
                        <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
                          {column.title}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${column.color} bg-white border border-gray-100 shadow-sm`}>
                        {groupedInternships[column.key].length}
                      </span>
                    </div>
                  </div>

                  {/* Column Content */}
                  <div className={`flex-1 ${column.bgColor} border-x border-b ${column.borderColor} rounded-b-2xl p-4 space-y-4 min-h-[500px] transition-colors duration-200 shadow-sm`}>
                    {groupedInternships[column.key].length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 opacity-50">
                        <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center mb-3 shadow-sm">
                          <i className={`fas ${column.icon} text-gray-400 text-2xl`}></i>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold">No items</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
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
