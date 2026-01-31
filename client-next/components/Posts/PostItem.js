'use client';

import { connect } from "react-redux";
import Link from "next/link";
import { addLike, deletePost, removeLike } from "../../lib/redux/modules/posts";
import { formatRelativeTime } from "../../lib/utils";
import Avatar from "../Avatar";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  users,
  post: { _id, text, name, user, likes, unlikes, comments, date, userProfile },
  showActions = true,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/50">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar
            userId={user}
            userName={name}
            avatar={userProfile?.avatar}
            profile={userProfile}
            size={48}
          />
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Posted by</p>
              <h3 className="text-base font-bold text-gray-900">{name}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">{text}</p>
            <p className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
              <i className="far fa-clock"></i>
              {formatRelativeTime(date)}
            </p>

            {showActions && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:cursor-pointer border border-gray-200/50 hover:border-blue-200 hover:shadow-sm"
                  onClick={() => addLike(_id)}
                >
                  <i className="fas fa-thumbs-up mr-2 text-blue-600" />
                  <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
                </button>

                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:cursor-pointer border border-gray-200/50 hover:border-red-200 hover:shadow-sm"
                  onClick={() => removeLike(_id)}
                >
                  <i className="fas fa-thumbs-down mr-2 text-red-600" />
                  <span>
                    {unlikes && unlikes.length > 0 && (
                      <span>{unlikes.length}</span>
                    )}
                  </span>
                </button>

                <Link href={`/posts/${_id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:cursor-pointer shadow-sm hover:shadow-md hover:scale-105 transform"
                >
                  Discussion
                  {comments.length > 0 && (
                    <span className="ml-2 bg-white/20 text-white px-2 py-0.5 rounded-lg text-xs font-bold">
                      {comments.length}
                    </span>
                  )}
                </Link>

                {!users.loading && users.user && user === users.user._id && (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 hover:cursor-pointer border border-red-200/50 hover:shadow-sm"
                    onClick={() => deletePost(_id)}
                  >
                    <i className="fas fa-trash mr-2" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
