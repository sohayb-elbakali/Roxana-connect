import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/default.png";
import { trackInternship } from "../../redux/modules/tracking";
import { likeInternship } from "../../redux/modules/internships";
import { api, formatRelativeTime, getProfileImage } from "../../utils";
import DeadlineBadge from "./DeadlineBadge";
import ApplyNowButton from "./ApplyNowButton";
import ReactionButton from "./ReactionButton";

const InternshipCard = ({
  internship,
  trackInternship,
  likeInternship,
  users,
  tracking,
  auth,
  insights: reduxInsights,
  dispatch,
}) => {
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
  } = internship;

  const [imageError, setImageError] = useState(false);
  const insights = reduxInsights[_id] || { totalTracking: 0, saved: 0, applied: 0, interestLevel: "Low", recentActivity: 0 };

  const handleImageError = () => {
    setImageError(true);
  };

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

  // Status badge configuration
  const getStatusConfig = (status) => {
    const configs = {
      saved: { label: "Saved", color: "bg-gray-100 text-gray-700", icon: "fa-bookmark" },
      applied: { label: "Applied", color: "bg-blue-100 text-blue-700", icon: "fa-paper-plane" },
      interviewing: { label: "Interviewing", color: "bg-yellow-100 text-yellow-700", icon: "fa-comments" },
      offer_received: { label: "Offer", color: "bg-green-100 text-green-700", icon: "fa-check-circle" },
      accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-700", icon: "fa-handshake" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: "fa-times-circle" },
    };
    return configs[status] || configs.saved;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
      <div className="p-6">
        {/* Header with Company, Position, and Deadline Badge */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {positionTitle}
            </h3>
            <p className="text-base text-gray-600 font-medium">
              {company}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <DeadlineBadge deadline={applicationDeadline} />
            {applicationStatus && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusConfig(applicationStatus).color}`}>
                <i className={`fas ${getStatusConfig(applicationStatus).icon} mr-1.5 text-xs`}></i>
                {getStatusConfig(applicationStatus).label}
              </span>
            )}
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-sm text-gray-600">
          <div className="flex items-center">
            <i className="fas fa-map-marker-alt mr-1.5 text-blue-600 text-xs"></i>
            <span>{location}</span>
          </div>
          {locationType && (
            <div className="flex items-center">
              <i className="fas fa-laptop-house mr-1.5 text-blue-600 text-xs"></i>
              <span className="capitalize">{locationType}</span>
            </div>
          )}
          {salaryRange && salaryRange.min && salaryRange.max && (
            <div className="flex items-center">
              <i className="fas fa-dollar-sign mr-1.5 text-green-600 text-xs"></i>
              <span className="font-medium text-green-700">
                {salaryRange.currency || "USD"} {salaryRange.min.toLocaleString()}-{salaryRange.max.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200"
              >
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                +{tags.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Posted By and Metadata Footer */}
        <div className="flex items-center justify-between py-4 mb-4 border-t border-b border-gray-200">
          <div className="flex items-center space-x-2.5">
            <img
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200"
              alt=""
              src={imageError ? defaultAvatar : getProfileImage(typeof user === 'string' ? user : user?._id)}
              onError={handleImageError}
            />
            <div>
              <p className="text-xs text-gray-500">Posted by</p>
              <p className="text-sm font-medium text-gray-900">{name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1" title="Students who saved this">
              <i className="fas fa-bookmark text-blue-500"></i>
              <span className="font-semibold text-gray-700">{insights?.saved || 0}</span>
            </div>
            <ReactionButton
              hasLiked={hasLiked}
              likesCount={likes?.length || 0}
              onLike={handleLike}
              size="sm"
              showLabel={false}
            />
            <span className="ml-auto">{formatRelativeTime(date)}</span>
          </div>
        </div>

        {/* Action Buttons - Clean CTAs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isTracking
                ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600 shadow-sm"
            }`}
            onClick={handleTrack}
            disabled={isTracking}
            aria-label={isTracking ? "Already tracking this internship" : "Track this internship"}
          >
            <i
              className={`fas ${
                isTracking ? "fa-check" : "fa-bookmark"
              } mr-2 text-xs`}
            ></i>
            {isTracking ? "Tracking" : "Track"}
          </button>

          <ApplyNowButton
            internship={internship}
            className="flex-1"
            size="md"
          />

          <Link
            to={`/internship/${_id}`}
            className="px-4 py-2.5 text-sm font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            aria-label={`View details for ${positionTitle} at ${company}`}
          >
            <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>
    </div>
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
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(InternshipCard);
