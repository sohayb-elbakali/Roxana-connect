import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addLike, deletePost, removeLike } from "../../redux/modules/posts";
import { formatRelativeTime } from "../../utils";
import ProfileImage from "../ProfileImage";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  users,
  post: { _id, text, name, user, likes, unlikes, comments, date, userProfile },
  showActions = true,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <ProfileImage
            userId={user}
            userName={name}
            avatar={userProfile?.avatar}
            profile={userProfile}
            size="w-12 h-12"
            textSize="text-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <p className="text-xs text-gray-500">Posted by</p>
              <h3 className="text-base font-semibold text-gray-900">{name}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">{text}</p>
            <p className="text-xs text-gray-500 mb-4">
              {formatRelativeTime(date)}
            </p>

            {showActions && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => addLike(_id)}
                >
                  <i className="fas fa-thumbs-up mr-1.5 text-blue-600" />
                  <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
                </button>

                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  onClick={() => removeLike(_id)}
                >
                  <i className="fas fa-thumbs-down mr-1.5 text-red-600" />
                  <span>
                    {unlikes && unlikes.length > 0 && (
                      <span>{unlikes.length}</span>
                    )}
                  </span>
                </button>

                <Link
                  to={`/posts/${_id}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Discussion
                  {comments.length > 0 && (
                    <span className="ml-1.5 bg-white/20 text-white px-1.5 py-0.5 rounded text-xs">
                      {comments.length}
                    </span>
                  )}
                </Link>

                {!users.loading && users.user && user === users.user._id && (
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    onClick={() => deletePost(_id)}
                  >
                    <i className="fas fa-trash mr-1.5" />
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
