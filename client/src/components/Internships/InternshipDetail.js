import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/default.png";
import {
  fetchInternship,
  likeInternship,
  deleteInternship,
} from "../../redux/modules/internships";
import { trackInternship, untrackInternship } from "../../redux/modules/tracking";
import { formatRelativeTime, getProfileImage } from "../../utils";
import CommentSection from "./CommentSection";
import CommentForm from "./CommentForm";
import DeadlineBadge from "./DeadlineBadge";
import ApplyNowButton from "./ApplyNowButton";
import ReactionButton from "./ReactionButton";

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
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchInternship(id);
  }, [fetchInternship, id]);

  const handleImageError = () => {
    setImageError(true);
  };

  // Check if user is tracking
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

  // Check if user has liked this internship
  const hasLiked = internship?.likes?.some(
    (like) => like.user === users.user?._id
  );

  const handleLike = () => {
    likeInternship(id);
  };

  const handleDelete = async () => {
    try {
      await deleteInternship(id);
      navigate('/feed');
    } catch (error) {
      console.error('Error deleting internship:', error);
    }
  };

  // Fetch anonymous insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`/api/tracking/insights/${id}`);
        const data = await response.json();
        // Store the fetched insights in Redux
        dispatch({
          type: "internships/SET_INSIGHTS",
          payload: { internshipId: id, insights: data }
        });
      } catch (err) {
        console.error('Failed to fetch insights:', err);
      }
    };

    if (id && !reduxInsights[id]) {
      fetchInsights();
    }
  }, [id, dispatch, reduxInsights]);

  // Loading state
  if (loading || !internship) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link
              to="/feed"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              <i className="fas fa-home mr-1"></i>
              Feed
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {internship.company} - {internship.positionTitle || "Position Not Specified"}
            </span>
          </nav>

          {/* Back Button */}
          <div className="flex items-center">
            <Link
              to="/feed"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Feed
            </Link>
          </div>

          {/* Main Internship Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {internship.company}
                  </h1>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    {internship.positionTitle || "Position Not Specified"}
                  </h2>
                </div>
                <DeadlineBadge deadline={internship.applicationDeadline} size="lg" />
              </div>

              {/* Location and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {internship.location && (
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-map-marker-alt mr-3 text-blue-600 w-5"></i>
                    <span>{internship.location}</span>
                  </div>
                )}
                {internship.locationType && (
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-laptop-house mr-3 text-blue-600 w-5"></i>
                    <span className="capitalize">{internship.locationType}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <i className="fas fa-calendar-alt mr-3 text-blue-600 w-5"></i>
                  <span>
                    Deadline:{" "}
                    {new Date(
                      internship.applicationDeadline
                    ).toLocaleDateString()}
                  </span>
                </div>
                {internship.salaryRange &&
                  internship.salaryRange.min &&
                  internship.salaryRange.max && (
                    <div className="flex items-center text-gray-700">
                      <i className="fas fa-dollar-sign mr-3 text-blue-600 w-5"></i>
                      <span>
                        {internship.salaryRange.currency || "USD"}{" "}
                        {internship.salaryRange.min.toLocaleString()} -{" "}
                        {internship.salaryRange.max.toLocaleString()}
                      </span>
                    </div>
                  )}
              </div>

              {/* Tags */}
              {internship.tags && internship.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {internship.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {internship.description}
                </p>
              </div>

              {/* Requirements */}
              {internship.requirements && internship.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {internship.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Anonymous Insights */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-chart-line mr-2 text-blue-600"></i>
                    <span className="font-semibold text-gray-900">
                      Community Insights
                    </span>
                  </div>
                  <ReactionButton
                    hasLiked={hasLiked}
                    likesCount={internship.likes?.length || 0}
                    onLike={handleLike}
                    size="lg"
                    showLabel={true}
                  />
                </div>

                {/* Tracking Status */}
                <div className="flex items-center gap-2 text-sm">
                  <i className={`fas fa-bookmark ${isTracking ? 'text-blue-600' : 'text-gray-400'}`}></i>
                  <span className="text-gray-700">
                    {isTracking ? 'You are tracking this internship' : 'Track this to save it'}
                  </span>
                </div>
              </div>

              {/* Posted By */}
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                <img
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                  alt=""
                  src={
                    imageError
                      ? defaultAvatar
                      : getProfileImage(typeof internship.user === 'string' ? internship.user : internship.user?._id)
                  }
                  onError={handleImageError}
                />
                <div>
                  <p className="text-sm text-gray-600">Posted by</p>
                  <p className="text-base font-semibold text-gray-900">
                    {internship.name}
                  </p>
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  {formatRelativeTime(internship.date)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Edit and Delete Buttons - Only show for owner */}
                {!users.loading && users.user && (typeof internship.user === 'string' ? internship.user : internship.user?._id) === users.user._id && (
                  <>
                    <Link
                      to={`/internship/edit/${internship._id}`}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      aria-label="Edit this internship"
                    >
                      <i className="fas fa-edit mr-2" aria-hidden="true"></i>
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                      aria-label="Delete this internship"
                    >
                      <i className="fas fa-trash mr-2" aria-hidden="true"></i>
                      Delete
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className={`flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    isTracking
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={handleTrack}
                  aria-label={isTracking ? "Stop tracking this internship" : "Track this internship"}
                >
                  <i
                    className={`fas ${
                      isTracking ? "fa-bookmark-slash" : "fa-bookmark"
                    } mr-2`}
                    aria-hidden="true"
                  ></i>
                  {isTracking ? "Untrack" : "Track This Opportunity"}
                </button>

                <ApplyNowButton
                  internship={internship}
                  className="flex-1"
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <CommentForm internshipId={id} />

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Comments ({internship.comments?.length || 0})
            </h3>
            <CommentSection 
              comments={internship.comments} 
              internshipId={id}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Internship?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this internship? This action cannot be undone and all associated comments and tracking data will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
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
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(InternshipDetail);
