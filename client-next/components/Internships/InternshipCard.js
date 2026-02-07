'use client';

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackInternship } from "../../lib/redux/modules/tracking";
import { likeInternship, deleteInternship, updateInternship } from "../../lib/redux/modules/internships";
import { api, formatRelativeTime } from "../../lib/utils";
import DeadlineBadge from "./DeadlineBadge";
import ApplyNowButton from "./ApplyNowButton";
import ReactionButton from "./ReactionButton";
import Avatar from "../Avatar";
import DropdownMenu from "../DropdownMenu";
import InternshipEditModal from "./InternshipEditModal";

const InternshipCard = ({
  internship,
  trackInternship,
  likeInternship,
  deleteInternship,
  updateInternship,
  users,
  tracking,
  auth,
  insights: reduxInsights,
  dispatch,
}) => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    _id,
    company,
    positionTitle,
    location,
    locationType,
    applicationDeadline,
    salaryRange,
    tags,
    likes,
    user,
    name,
    date,
    edited,
    editedAt,
  } = internship;

  const insights = reduxInsights[_id] || { totalTracking: 0, saved: 0, applied: 0, interestLevel: "Low", recentActivity: 0 };

  // Fetch insights for this internship on mount
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get(`/tracking/insights/${_id}`);
        // Store the full fetched data
        dispatch({
          type: "internships/SET_INSIGHTS",
          payload: { internshipId: _id, insights: res.data }
        });
      } catch (err) {
        console.error('Error fetching insights:', err);
      }
    };
    // Only fetch if we don't have insights yet
    if (!reduxInsights[_id]) {
      fetchInsights();
    }
  }, [_id, dispatch, reduxInsights]);

  // Check if user is already tracking this internship and get the status
  const trackingItem = tracking.items.find(
    (item) => item.internship?._id === _id || item.internship === _id
  );
  const isTracking = !!trackingItem;
  const applicationStatus = trackingItem?.status;

  const handleTrack = () => {
    if (!isTracking) {
      trackInternship(_id);
    }
  };

  // Check if user has liked this internship
  const hasLiked = likes?.some(
    (like) => like.user === auth.user?._id
  );

  const handleLike = () => {
    likeInternship(_id);
  };

  const handleDelete = async () => {
    try {
      await deleteInternship(_id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting internship:', error);
    }
  };

  const handleSaveEdit = async (formData) => {
    setIsSaving(true);
    try {
      await updateInternship(_id, formData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating internship:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Check if current user is the owner
  const isOwner = !auth.loading && auth.user &&
    (typeof user === 'string' ? user : user?._id) === auth.user._id;

  const menuItems = [
    {
      label: 'Edit Internship',
      icon: 'fas fa-edit',
      onClick: () => setShowEditModal(true),
    },
    {
      label: 'Delete Internship',
      icon: 'fas fa-trash',
      onClick: () => setShowDeleteModal(true),
      danger: true,
    },
  ];

  // Status badge configuration
  const getStatusConfig = (status) => {
    const configs = {
      not_applied: { label: "Saved", color: "bg-gray-100 text-gray-700", icon: "fa-bookmark" },
      applied: { label: "Applied", color: "bg-blue-100 text-blue-700", icon: "fa-paper-plane" },
      interviewing: { label: "Interviewing", color: "bg-yellow-100 text-yellow-700", icon: "fa-comments" },
      offer_received: { label: "Offer", color: "bg-green-100 text-green-700", icon: "fa-check-circle" },
      accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-700", icon: "fa-handshake" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: "fa-times-circle" },
      declined: { label: "Declined", color: "bg-gray-100 text-gray-700", icon: "fa-ban" },
    };
    return configs[status] || configs.not_applied;
  };

  return (
    <>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/50">
        <div className="p-4 sm:p-6">
          {/* Header with Company, Position, and Deadline Badge */}
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">
                {positionTitle || "Position Not Specified"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-semibold flex items-center gap-1.5 sm:gap-2">
                <i className="fas fa-building text-blue-600 text-xs sm:text-sm"></i>
                <span className="truncate">{company}</span>
              </p>
            </div>
            <div className="flex items-start gap-2 flex-shrink-0">
              <div className="flex flex-col items-end gap-1.5 sm:gap-2">
                <DeadlineBadge deadline={applicationDeadline} />
                {applicationStatus && (
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-sm ${getStatusConfig(applicationStatus).color}`}>
                    <i className={`fas ${getStatusConfig(applicationStatus).icon} mr-1 sm:mr-1.5 text-[9px] sm:text-xs`}></i>
                    <span className="hidden sm:inline">{getStatusConfig(applicationStatus).label}</span>
                    <span className="sm:hidden">{getStatusConfig(applicationStatus).label.slice(0, 3)}</span>
                  </span>
                )}
              </div>
              {isOwner && <DropdownMenu items={menuItems} />}
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-1.5 sm:gap-y-2 mb-4 sm:mb-5 text-xs sm:text-sm">
            {location && (
              <div className="flex items-center text-gray-600 font-medium">
                <i className="fas fa-map-marker-alt mr-1.5 sm:mr-2 text-blue-600 text-xs"></i>
                <span className="truncate max-w-[120px] sm:max-w-none">{location}</span>
              </div>
            )}
            {locationType && (
              <div className="flex items-center text-gray-600 font-medium">
                <i className="fas fa-laptop-house mr-1.5 sm:mr-2 text-blue-600 text-xs"></i>
                <span className="capitalize">{locationType}</span>
              </div>
            )}
            {salaryRange && salaryRange.min && salaryRange.max && (
              <div className="flex items-center">
                <i className="fas fa-dollar-sign mr-1.5 sm:mr-2 text-green-600 text-xs"></i>
                <span className="font-bold text-green-700 text-xs sm:text-sm">
                  {salaryRange.currency || "USD"} {salaryRange.min.toLocaleString()}-{salaryRange.max.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold border border-blue-200/50 shadow-sm"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 5 && (
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-600 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold">
                  +{tags.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Posted By and Metadata Footer */}
          <div className="flex items-center justify-between py-3 sm:py-4 mb-4 sm:mb-5 border-t border-b border-gray-100">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Avatar
                userId={internship.postedBy?._id || (typeof user === 'string' ? user : user?._id)}
                userName={internship.postedBy?.name || name}
                avatar={internship.postedBy?.avatar || internship.userProfile?.avatar}
                profile={internship.postedBy || internship.userProfile}
                size={32}
                className="flex-shrink-0 sm:w-10 sm:h-10"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[9px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Posted by</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5" title="Students who saved this">
                <i className="fas fa-bookmark text-blue-500 text-xs"></i>
                <span className="font-bold text-gray-700">{insights?.saved || 0}</span>
              </div>
              <ReactionButton
                hasLiked={hasLiked}
                likesCount={likes?.length || 0}
                onLike={handleLike}
                size="sm"
                showLabel={false}
              />
              <span className="hidden sm:flex items-center gap-1.5">
                <i className="far fa-clock"></i>
                {formatRelativeTime(date)}
                {edited && (
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                    Edited
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons - Clean CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className={`flex-1 inline-flex items-center justify-center px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isTracking
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-600 shadow-md hover:shadow-lg hover:scale-105 transform"
                }`}
              onClick={handleTrack}
              disabled={isTracking}
              aria-label={isTracking ? "Already tracking this internship" : "Track this internship"}
            >
              <i
                className={`fas ${isTracking ? "fa-check" : "fa-bookmark"
                  } mr-1.5 sm:mr-2 text-xs`}
              ></i>
              {isTracking ? "Tracking" : "Track"}
            </button>

            <ApplyNowButton
              internship={internship}
              className="flex-1"
              size="md"
            />

            <Link href={`/internship/${_id}`}
              className="px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 hover:scale-105 transform shadow-sm hover:shadow-md flex items-center justify-center"
              aria-label={`View details for ${positionTitle} at ${company}`}
            >
              <i className="fas fa-arrow-right text-xs sm:text-sm"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Internship?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              This action cannot be undone. All comments and tracking data will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <InternshipEditModal
          internship={internship}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
          isSaving={isSaving}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
  tracking: state.tracking,
  auth: state.users,
  insights: state.internships.insights,
});

const mapDispatchToProps = (dispatch) => ({
  trackInternship: (internshipId, status) => dispatch(trackInternship(internshipId, status)),
  likeInternship: (internshipId) => dispatch(likeInternship(internshipId)),
  deleteInternship: (id) => dispatch(deleteInternship(id)),
  updateInternship: (id, data) => dispatch(updateInternship(id, data)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(InternshipCard);
