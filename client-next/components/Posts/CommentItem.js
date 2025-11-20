'use client';

import { connect } from "react-redux";
import { deleteComment } from "../../lib/redux/modules/posts";
import { formatRelativeTime } from "../../lib/utils";
import ProfileImage from "../ProfileImage";

const CommentItem = ({
  postId,
  comment: { _id, text, name, user, date, userProfile },
  users,
  deleteComment,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-blue-300 transition-all duration-200">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <ProfileImage
            userId={user}
            userName={name}
            avatar={userProfile?.avatar}
            profile={userProfile}
            size="w-12 h-12"
            textSize="text-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
            {!users.loading && users.user && user === users.user._id && (
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
            {formatRelativeTime(date)}
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
