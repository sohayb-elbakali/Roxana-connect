'use client';

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
const defaultAvatar = "/assets/default.png";
import {
  fetchInternship,
  likeInternship,
  deleteInternship,
} from "../../lib/redux/modules/internships";
import { trackInternship, untrackInternship } from "../../lib/redux/modules/tracking";
import { formatRelativeTime, getProfileImage } from "../../lib/utils";
import { showAlertMessage } from "../../lib/redux/modules/alerts";
import Avatar from "../Avatar";
import CommentSection from "./CommentSection";
import CommentForm from "./CommentForm";
import DeadlineBadge from "./DeadlineBadge";
import ApplyNowButton from "./ApplyNowButton";
import ReactionButton from "./ReactionButton";
import DropdownMenu from "../DropdownMenu";
import InternshipEditModal from "./InternshipEditModal";

const InternshipDetail = ({
  fetchInternship,
  trackInternship,
  untrackInternship,
  likeInternship,
  deleteInternship,
  internship,
  loading,
  users,
  tracking,
  insights: reduxInsights,
  dispatch,
  showAlertMessage,
}) => {
  const { id } = useParams();
  const router = useRouter();
  
  // All useState hooks must be at the top, before any conditional logic
  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if description is long (more than 10 lines or 500 chars)
  const isLongDescription = internship?.description &&
    (internship.description.split('\n').length > 10 || internship.description.length > 500);

  // Get truncated description
  const getDisplayDescription = () => {
    if (!internship?.description) return '';
    if (showFullDescription || !isLongDescription) return internship.description;
    const lines = internship.description.split('\n').slice(0, 10).join('\n');
    return lines.length > 500 ? lines.substring(0, 500) + '...' : lines + '...';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: 'internships/CLEAR_CURRENT' });
    fetchInternship(id);
  }, [fetchInternship, id, dispatch]);

  const handleImageError = () => setImageError(true);

  const trackingRecord = tracking.items.find(
    (item) => item.internship?._id === id || item.internship === id
  );
  const isTracking = !!trackingRecord;

  const handleTrack = () => {
    if (isTracking) {
      untrackInternship(trackingRecord._id);
    } else {
      trackInternship(id);
    }
  };

  const hasLiked = internship?.likes?.some(
    (like) => like.user === users.user?._id
  );

  const handleLike = () => likeInternship(id);

  const handleDelete = async () => {
    try {
      await deleteInternship(id);
      router.push('/feed');
    } catch (error) {
      console.error('Error deleting internship:', error);
    }
  };

  const handleSaveEdit = async (formData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/internships/${internship._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const updated = await response.json();
        dispatch({
          type: 'internships/UPDATE_INTERNSHIP',
          payload: updated,
        });
        setShowEditModal(false);
        showAlertMessage('Internship updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating internship:', error);
      showAlertMessage('Error updating internship', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`/api/tracking/insights/${id}`);
        const data = await response.json();
        dispatch({
          type: "internships/SET_INSIGHTS",
          payload: { internshipId: id, insights: data }
        });
      } catch (err) {
        console.error('Failed to fetch insights:', err);
      }
    };
    if (id && !reduxInsights[id]) fetchInsights();
  }, [id, dispatch, reduxInsights]);

  // Loading state - Skeleton
  if (loading || !internship) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
        <div className="max-w-4xl px-4 sm:px-6 py-4">
          {/* Back button skeleton */}
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>

          {/* Main card skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header skeleton */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start gap-4">
                {/* Logo skeleton */}
                <div className="hidden sm:block w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  {/* Company name */}
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  {/* Position title */}
                  <div className="h-7 w-64 bg-gray-200 rounded animate-pulse mb-3"></div>
                  {/* Quick info */}
                  <div className="flex gap-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                {/* Deadline badge */}
                <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Tags skeleton */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-14 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Description skeleton */}
            <div className="p-6">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons skeleton */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = !users.loading && users.user &&
    (typeof internship.user === 'string' ? internship.user : internship.user?._id) === users.user._id;

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

  return (
    <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-4xl px-4 sm:px-6 py-4">

        {/* Compact Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <i className="fas fa-arrow-left text-xs"></i>
            <span>Back to Feed</span>
          </Link>

          {isOwner && <DropdownMenu items={menuItems} />}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header Section - Left Aligned with Company Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              {/* Company Logo Placeholder */}
              <div className="hidden sm:flex w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-bold text-xl">
                  {internship.company?.charAt(0)?.toUpperCase() || 'C'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                {/* Company & Position */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-blue-600">{internship.company}</span>
                  {internship.locationType && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full capitalize">
                      {internship.locationType}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {internship.positionTitle || "Position Not Specified"}
                </h1>

                {/* Quick Info Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {internship.location && (
                    <div className="flex items-center gap-1.5">
                      <i className="fas fa-map-marker-alt text-gray-400 text-xs"></i>
                      <span>{internship.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <i className="fas fa-calendar text-gray-400 text-xs"></i>
                    <span>Due {new Date(internship.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  {internship.salaryRange?.min && internship.salaryRange?.max && (
                    <div className="flex items-center gap-1.5">
                      <i className="fas fa-dollar-sign text-gray-400 text-xs"></i>
                      <span>{internship.salaryRange.currency || "USD"} {internship.salaryRange.min.toLocaleString()} - {internship.salaryRange.max.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deadline Badge */}
              <DeadlineBadge deadline={internship.applicationDeadline} size="md" />
            </div>
          </div>

          {/* Tags - Compact */}
          {internship.tags && internship.tags.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex flex-wrap gap-1.5">
                {internship.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-200 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              About this role
            </h2>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {getDisplayDescription()}
            </div>
            {isLongDescription && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showFullDescription ? (
                  <>
                    <i className="fas fa-chevron-up text-xs"></i>
                    Show Less
                  </>
                ) : (
                  <>
                    <i className="fas fa-chevron-down text-xs"></i>
                    Show More
                  </>
                )}
              </button>
            )}
          </div>

          {/* Requirements Section */}
          {internship.requirements && internship.requirements.length > 0 && (
            <div className="px-6 pb-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Requirements
              </h2>
              <ul className="space-y-2">
                {internship.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <i className="fas fa-check text-green-500 mt-0.5 text-xs"></i>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer: Posted By & Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Posted By - Compact */}
              <div className="flex items-center gap-3">
                <Avatar
                  userId={internship.postedBy?._id || (typeof internship.user === 'string' ? internship.user : internship.user?._id)}
                  userName={internship.postedBy?.name || internship.name}
                  avatar={internship.postedBy?.avatar}
                  profile={internship.postedBy}
                  size={36}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {internship.postedBy?.name || internship.name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    Posted {formatRelativeTime(internship.date)}
                    {internship.edited && (
                      <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                        Edited
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Engagement */}
              <div className="flex items-center gap-3">
                <ReactionButton
                  hasLiked={hasLiked}
                  likesCount={internship.likes?.length || 0}
                  onLike={handleLike}
                  size="sm"
                  showLabel={false}
                />
                <span className="text-xs text-gray-500">
                  {internship.comments?.length || 0} comments
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleTrack}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${isTracking
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              <i className={`fas ${isTracking ? "fa-bookmark" : "fa-bookmark"} mr-2 ${isTracking ? "text-blue-600" : ""}`}></i>
              {isTracking ? "Saved" : "Save"}
            </button>
            <ApplyNowButton
              internship={internship}
              className="flex-1"
              size="md"
            />
          </div>
        </div>

        {/* Comments Section - Compact Card */}
        <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Comments ({internship.comments?.length || 0})
            </h3>
          </div>
          <div className="p-4">
            <CommentForm internshipId={id} />
            <div className="mt-4">
              <CommentSection
                comments={internship.comments}
                internshipId={id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 bg-red-100 rounded-full">
              <i className="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Internship?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-5">
              This action cannot be undone. All comments and tracking data will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  internship: state.internships.current,
  loading: state.internships.loading,
  users: state.users,
  tracking: state.tracking,
  insights: state.internships.insights,
});

const mapDispatchToProps = (dispatch) => ({
  fetchInternship: (id) => dispatch(fetchInternship(id)),
  trackInternship: (internshipId, status) => dispatch(trackInternship(internshipId, status)),
  untrackInternship: (trackingId) => dispatch(untrackInternship(trackingId)),
  likeInternship: (internshipId) => dispatch(likeInternship(internshipId)),
  deleteInternship: (id) => dispatch(deleteInternship(id)),
  showAlertMessage: (msg, type) => dispatch(showAlertMessage(msg, type)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(InternshipDetail);
