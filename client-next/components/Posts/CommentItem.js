'use client';

import { connect } from "react-redux";
import { deleteComment } from "../../lib/redux/modules/posts";
import { formatRelativeTime } from "../../lib/utils";
import Avatar from "../Avatar";

const CommentItem = ({
  postId,
  comment: { _id, text, name, user, date, userProfile },
  users,
  deleteComment,
}) => {
  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar
          userId={user}
          userName={name}
          avatar={userProfile?.avatar}
          profile={userProfile}
          size={36}
          className="sm:w-10 sm:h-10"
        />
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-gray-900">{name}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{formatRelativeTime(date)}</span>
          {!users.loading && users.user && user === users.user._id && (
            <>
              <span className="text-xs text-gray-500">•</span>
              <button
                onClick={() => deleteComment(postId, _id)}
                type="button"
                className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
                title="Delete comment"
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* Comment Text */}
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
