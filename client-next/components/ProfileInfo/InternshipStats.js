'use client';

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { api } from "../../lib/utils";
import Link from "next/link";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InternshipStats = ({ userId, isOwnProfile }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/profiles/user/${userId}/internship-stats`);
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching internship stats:", err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { postedInternships, trackingStats, trackedInternships, offersAndAcceptances } = stats;

  // Prepare data for Doughnut Chart (Application Status Distribution)
  const doughnutData = {
    labels: ['Applied', 'Interviewing', 'Offers', 'Rejected'],
    datasets: [
      {
        data: [
          trackingStats.applied,
          trackingStats.interviewing,
          trackingStats.offer_received + trackingStats.accepted,
          trackingStats.rejected,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(168, 85, 247, 0.8)',   // Purple
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(239, 68, 68, 0.8)',    // Red
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 'bold',
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
      },
    },
  };

  // Prepare data for Bar Chart (Application Funnel)
  const barData = {
    labels: ['Saved', 'Applied', 'Interviewing', 'Offers'],
    datasets: [
      {
        label: 'Applications',
        data: [
          trackingStats.total,
          trackingStats.applied,
          trackingStats.interviewing,
          trackingStats.offer_received + trackingStats.accepted,
        ],
        backgroundColor: [
          'rgba(148, 163, 184, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(148, 163, 184, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Application Statistics with Charts */}
      {trackingStats.total > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i className="fas fa-chart-pie text-blue-600"></i>
            Application Statistics
          </h4>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold text-gray-700 mb-1">
                {trackingStats.total}
              </div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Tracked</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold text-blue-700 mb-1">
                {trackingStats.applied}
              </div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Applied</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold text-purple-700 mb-1">
                {trackingStats.interviewing}
              </div>
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">Interviewing</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold text-emerald-700 mb-1">
                {trackingStats.offer_received + trackingStats.accepted}
              </div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Offers</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Doughnut Chart - Status Distribution */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-chart-pie text-blue-600"></i>
                Status Distribution
              </h5>
              <div className="h-64">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>

            {/* Bar Chart - Application Funnel */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-chart-bar text-blue-600"></i>
                Application Funnel
              </h5>
              <div className="h-64">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>

          {/* Success Rate */}
          {trackingStats.applied > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-trophy text-yellow-500"></i>
                  Success Rate
                </span>
                <span className="text-2xl font-bold text-blue-700">
                  {Math.round(
                    ((trackingStats.offer_received + trackingStats.accepted) /
                      trackingStats.applied) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${Math.round(
                      ((trackingStats.offer_received + trackingStats.accepted) /
                        trackingStats.applied) *
                        100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offers and Acceptances */}
      {offersAndAcceptances.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-trophy text-yellow-500"></i>
            Offers & Acceptances
          </h4>
          <div className="space-y-3">
            {offersAndAcceptances.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="font-bold text-gray-900">
                    {item.company}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{item.position}</div>
                </div>
                <span
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                    item.status === "accepted"
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300"
                      : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300"
                  }`}
                >
                  {item.status === "accepted" ? "Accepted" : "Offer Received"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Tracked Internships */}
      {trackedInternships.length > 0 && isOwnProfile && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-clock text-blue-600"></i>
              Recently Tracked
            </h4>
            <Link href="/tracker"
              className="text-sm text-blue-600 hover:text-blue-700 font-bold hover:cursor-pointer flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className="space-y-3">
            {trackedInternships.slice(0, 3).map((tracking) => (
              <div
                key={tracking._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/50 hover:border-blue-300 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="font-bold text-gray-900">
                    {tracking.internship?.company}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {tracking.internship?.positionTitle}
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                    tracking.status === "offer_received" ||
                    tracking.status === "accepted"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : tracking.status === "interviewing"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      : tracking.status === "applied"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {tracking.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posted Internships */}
      {postedInternships.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-briefcase text-blue-600"></i>
              Posted Opportunities
            </h4>
            <span className="text-sm text-gray-600 font-semibold">
              {postedInternships.length} total
            </span>
          </div>
          <div className="space-y-3">
            {postedInternships.slice(0, 5).map((internship) => (
              <Link
                key={internship._id}
                href={`/internship/${internship._id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/50 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:shadow-sm hover:cursor-pointer group"
              >
                <div className="flex-1">
                  <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {internship.company}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {internship.positionTitle}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {internship.isActive ? (
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-xs font-bold border border-green-200 shadow-sm">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold border border-gray-200">
                      Expired
                    </span>
                  )}
                  <i className="fas fa-arrow-right text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {trackingStats.total === 0 && postedInternships.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <i className="fas fa-briefcase text-blue-600 text-3xl"></i>
          </div>
          <p className="text-gray-500 text-base mb-8">
            {isOwnProfile
              ? "Start tracking internships or post opportunities to see statistics here"
              : "No internship activity yet"}
          </p>
          {isOwnProfile && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/feed"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transform hover:cursor-pointer"
              >
                <i className="fas fa-search"></i>
                Browse Opportunities
              </Link>
              <Link href="/internship/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-2xl hover:bg-blue-50 transition-all text-sm font-bold hover:scale-105 transform hover:cursor-pointer"
              >
                <i className="fas fa-plus"></i>
                Post Opportunity
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(InternshipStats);
