import { useState } from "react";
import { connect } from "react-redux";
import defaultAvatar from "../../assets/default.png";
import { deleteComment } from "../../redux/modules/posts";
import { formatDate, getProfileImage } from "../../utils";

const CommentItem = ({
  postId,
  comment: { _id, text, name, user, date },
  users,
  deleteComment,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-sm"
            alt={name}
            src={imageError ? defaultAvatar : getProfileImage(user)}
            onError={handleImageError}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
            {!users.loading && user === users.user._id && (
              <button
                onClick={() => deleteComment(postId, _id)}
                type="button"
                className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                title="Delete comment"
              >
                <i className="fas fa-trash text-sm" />
              </button>
            )}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-2">{text}</p>
          <p className="text-xs text-gray-500">
            <i className="fas fa-clock mr-1"></i>
            {formatDate(date)}
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
