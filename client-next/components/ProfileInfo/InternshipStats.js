'use client';

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { api } from "../../lib/utils";
import Link from "next/link";

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

  return (
    <div className="space-y-6">
      {/* Application Statistics */}
      {trackingStats.total > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Application Statistics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {trackingStats.total}
              </div>
              <div className="text-sm text-blue-600">Total Tracked</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-700">
                {trackingStats.applied}
              </div>
              <div className="text-sm text-green-600">Applied</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">
                {trackingStats.interviewing}
              </div>
              <div className="text-sm text-yellow-600">Interviewing</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-700">
                {trackingStats.offer_received + trackingStats.accepted}
              </div>
              <div className="text-sm text-emerald-600">Offers</div>
            </div>
          </div>

          {/* Success Rate */}
          {trackingStats.applied > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Success Rate
                </span>
                <span className="text-lg font-bold text-blue-700">
                  {Math.round(
                    ((trackingStats.offer_received + trackingStats.accepted) /
                      trackingStats.applied) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            <i className="fas fa-trophy text-yellow-500 mr-2"></i>
            Offers & Acceptances
          </h4>
          <div className="space-y-3">
            {offersAndAcceptances.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {item.company}
                  </div>
                  <div className="text-sm text-gray-600">{item.position}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
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
            <h4 className="text-lg font-semibold text-gray-900">
              Recently Tracked
            </h4>
            <Link href="/tracker"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          <div className="space-y-2">
            {trackedInternships.slice(0, 3).map((tracking) => (
              <div
                key={tracking._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {tracking.internship?.company}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tracking.internship?.positionTitle}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tracking.status === "offer_received" ||
                    tracking.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : tracking.status === "interviewing"
                      ? "bg-yellow-100 text-yellow-700"
                      : tracking.status === "applied"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
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
            <h4 className="text-lg font-semibold text-gray-900">
              Posted Opportunities
            </h4>
            <span className="text-sm text-gray-600">
              {postedInternships.length} total
            </span>
          </div>
          <div className="space-y-2">
            {postedInternships.slice(0, 5).map((internship) => (
              <Link
                key={internship._id}
                href={`/internship/${internship._id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {internship.company}
                  </div>
                  <div className="text-sm text-gray-600">
                    {internship.positionTitle}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {internship.isActive ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      Expired
                    </span>
                  )}
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {trackingStats.total === 0 && postedInternships.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-briefcase text-blue-600 text-2xl"></i>
          </div>
          <p className="text-gray-500 text-sm">
            {isOwnProfile
              ? "Start tracking internships or post opportunities to see statistics here"
              : "No internship activity yet"}
          </p>
          {isOwnProfile && (
            <div className="mt-4 space-x-3">
              <Link href="/feed"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
              >
                Browse Opportunities
              </Link>
              <Link href="/internship/create"
                className="inline-block px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-medium"
              >
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
