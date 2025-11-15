import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Link, useParams } from "react-router-dom";
import { getPost } from "../../redux/modules/posts";
import CommentForm from "./CommentForm"
import CommentItem from "./CommentItem"
import PostItem from "./PostItem";

function Post({getPost, posts: {post, loading}}){
    let { id } = useParams()

    useEffect(() => {
        getPost(id)
    }, [getPost, id])

    if (loading) {
      return (
        <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600"></div>
            </div>
          </div>
        </div>
      );
    }

    if (post === null) {
      return (
        <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-exclamation-circle text-3xl text-red-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Post Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Link
                to="/posts"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Posts
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
              <Link
                to="/posts"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Posts
              </Link>
            </div>

            {/* Post */}
            <PostItem post={post} showActions={false} />

            {/* Comment Form */}
            <CommentForm postId={post._id} />

            {/* Comments */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Comments ({post.comments.length})
              </h3>
              {post.comments.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-comments text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                post.comments.map((comment) => (
                  <CommentItem
                    comment={comment}
                    postId={post._id}
                    key={comment._id}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

const mapStateToProps = (state) => ({
    posts: state.posts
})

export default connect(mapStateToProps, { getPost })(Post)
