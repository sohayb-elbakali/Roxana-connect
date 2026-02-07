'use client';

import { useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { addLike, deletePost, removeLike, updatePost } from "../../lib/redux/modules/posts";
import { formatRelativeTime } from "../../lib/utils";
import Avatar from "../Avatar";
import DropdownMenu from "../DropdownMenu";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  updatePost,
  users,
  post: { _id, text, name, user, likes, unlikes, comments, date, userProfile, edited, editedAt },
  post,
  showActions = true,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isSaving, setIsSaving] = useState(false);
  const isOwner = !users.loading && users.user && user === users.user._id;

  const handleDelete = () => {
    deletePost(_id);
    setShowDeleteModal(false);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() === text.trim()) {
      setIsEditing(false);
      return;
    }

    if (!editText.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await updatePost(_id, { text: editText });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const menuItems = [
    {
      label: 'Edit Post',
      icon: 'fas fa-edit',
      onClick: () => setIsEditing(true),
    },
    {
      label: 'Delete Post',
      icon: 'fas fa-trash',
      onClick: () => setShowDeleteModal(true),
      danger: true,
    },
  ];

  return (
    <>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/50">
        <div className="p-4 sm:p-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Avatar
              userId={user}
              userName={name}
              avatar={userProfile?.avatar}
              profile={userProfile}
              size={40}
              className="sm:w-12 sm:h-12"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">Posted by</p>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">{name}</h3>
                </div>
                {isOwner && !isEditing && <DropdownMenu items={menuItems} />}
              </div>

              {/* Edit Mode */}
              {isEditing ? (
                <div className="mb-3 sm:mb-4">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-700 min-h-[100px] resize-y"
                    placeholder="What's on your mind?"
                    disabled={isSaving}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving || !editText.trim()}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-1.5"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check mr-1.5"></i>
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 whitespace-pre-wrap">{text}</p>
              )}

              <p className="text-xs text-gray-500 mb-4 sm:mb-5 flex items-center gap-1.5">
                <i className="far fa-clock"></i>
                {formatRelativeTime(date)}
                {post.edited && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                    Edited
                  </span>
                )}
              </p>

              {showActions && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:cursor-pointer border border-gray-200/50 hover:border-blue-200 hover:shadow-sm"
                    onClick={() => addLike(_id)}
                  >
                    <i className="fas fa-thumbs-up mr-1.5 sm:mr-2 text-blue-600 text-xs" />
                    <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:cursor-pointer border border-gray-200/50 hover:border-red-200 hover:shadow-sm"
                    onClick={() => removeLike(_id)}
                  >
                    <i className="fas fa-thumbs-down mr-1.5 sm:mr-2 text-red-600 text-xs" />
                    <span>
                      {unlikes && unlikes.length > 0 && (
                        <span>{unlikes.length}</span>
                      )}
                    </span>
                  </button>

                  <Link href={`/posts/${_id}`}
                    className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:cursor-pointer shadow-sm hover:shadow-md hover:scale-105 transform"
                  >
                    <span className="hidden sm:inline">Discussion</span>
                    <span className="sm:hidden">View</span>
                    {comments.length > 0 && (
                      <span className="ml-1.5 sm:ml-2 bg-white/20 text-white px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold">
                        {comments.length}
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Post?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              This action cannot be undone. All comments and likes will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost, updatePost })(
  PostItem
);
