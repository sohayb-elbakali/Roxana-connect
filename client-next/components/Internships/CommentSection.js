'use client';

import { useState } from "react";
import { connect } from "react-redux";
const defaultAvatar = "/assets/default.png";
import { deleteInternshipComment, reactToComment, likeComment, unlikeComment } from "../../lib/redux/modules/internships";
import { formatRelativeTime, getProfileImage } from "../../lib/utils";

const CommentSection = ({ 
  comments = [], 
  internshipId, 
  users, 
  deleteInternshipComment,
  reactToComment,
  likeComment,
  unlikeComment
}) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (userId) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }));
  };

  const handleDeleteComment = (commentId) => {
    deleteInternshipComment(internshipId, commentId);
  };

  const handleLike = (commentId) => {
    likeComment(internshipId, commentId);
  };

  const handleUnlike = (commentId) => {
    unlikeComment(internshipId, commentId);
  };

  const getCommentTypeBadge = (type) => {
    const badges = {
      tip: { 
        color: "bg-blue-100 text-blue-800", 
        icon: "fa-lightbulb", 
        label: "Interview Tip" 
      },
      advice: { 
        color: "bg-green-100 text-green-800", 
        icon: "fa-hands-helping", 
        label: "Application Advice" 
      },
      culture: { 
        color: "bg-purple-100 text-purple-800", 
        icon: "fa-building", 
        label: "Company Culture" 
      },
      general: { 
        color: "bg-gray-100 text-gray-800", 
        icon: "fa-comment", 
        label: "General" 
      },
    };

    const badge = badges[type] || badges.general;

    return (
      <span 
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        <i className={`fas ${badge.icon} mr-1`}></i>
        {badge.label}
      </span>
    );
  };



  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-comments text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-500">
          No comments yet. Be the first to share your insights!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const hasImageError = imageErrors[comment.user];

        return (
          <div 
            key={comment._id} 
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-sm"
                  alt={comment.name}
                  src={
                    hasImageError 
                      ? defaultAvatar 
                      : getProfileImage(comment.user)
                  }
                  onError={() => handleImageError(comment.user)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {comment.name}
                      </h4>
                      {comment.commentType && getCommentTypeBadge(comment.commentType)}
                    </div>
                  </div>
                  {!users.loading && users.user && comment.user === users.user._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      type="button"
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 ml-2"
                      title="Delete comment"
                    >
                      <i className="fas fa-trash text-sm" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                  {comment.text}
                </p>
                
                {/* Like/Unlike Buttons */}
                <div className="flex items-center space-x-3 mb-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => handleLike(comment._id)}
                  >
                    <i className="fas fa-thumbs-up mr-1.5 text-blue-600" />
                    <span>{comment.likes && comment.likes.length > 0 && <span>{comment.likes.length}</span>}</span>
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => handleUnlike(comment._id)}
                  >
                    <i className="fas fa-thumbs-down mr-1.5 text-red-600" />
                    <span>
                      {comment.unlikes && comment.unlikes.length > 0 && (
                        <span>{comment.unlikes.length}</span>
                      )}
                    </span>
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  <i className="fas fa-clock mr-1"></i>
                  {formatRelativeTime(comment.date)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, {
  deleteInternshipComment,
  reactToComment,
  likeComment,
  unlikeComment,
})(CommentSection);
