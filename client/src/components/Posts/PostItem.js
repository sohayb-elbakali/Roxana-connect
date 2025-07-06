import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addLike, deletePost, removeLike } from "../../redux/modules/posts";
import { formatDate, getProfileImage } from "../../utils";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  users,
  post: { _id, text, name, user, likes, unlikes, comments, date },
  showActions,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-200 shadow-md"
            alt=""
            src={getProfileImage(user)}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{text}</p>
            <p className="text-sm text-gray-500 mb-4">
              Posted at {formatDate(date)}
            </p>

            {showActions && (
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => addLike(_id)}
                >
                  <i className="fas fa-thumbs-up mr-2 text-purple-600" />
                  <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
                </button>

                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => removeLike(_id)}
                >
                  <i className="fas fa-thumbs-down mr-2 text-red-600" />
                  <span>
                    {unlikes && unlikes.length > 0 && (
                      <span>{unlikes.length}</span>
                    )}
                  </span>
                </button>

                <Link
                  to={`/posts/${_id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Discussion
                  {comments.length > 0 && (
                    <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                      {comments.length}
                    </span>
                  )}
                </Link>

                {!users.loading && user === users.user._id && (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
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

PostItem.defaultProps = {
  showActions: true,
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
