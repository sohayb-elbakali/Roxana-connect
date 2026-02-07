'use client';

import React, { useEffect } from "react"
import { connect } from "react-redux"
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPost } from "../../lib/redux/modules/posts";
import CommentForm from "./CommentForm"
import CommentItem from "./CommentItem"
import PostItem from "./PostItem";

function Post({getPost, posts: {post, loading}}){
    let { id } = useParams()

    useEffect(() => {
        getPost(id)
    }, [getPost, id])

    if (loading || !post) {
      return (
        <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600"></div>
            </div>
          </div>
        </div>
      );
    }

    if (!loading && post === null) {
      return (
        <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-exclamation-triangle text-3xl text-yellow-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unable to Load Post
              </h2>
              <p className="text-gray-600 mb-6">
                This post may not exist, or there might be a connection issue. Please try again.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => getPost(id)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Try Again
                </button>
                <Link href="/feed"
                  className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Feed
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Back Button */}
          <div className="mb-4">
            <Link href="/posts"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <i className="fas fa-arrow-left text-xs"></i>
              <span>Back to Posts</span>
            </Link>
          </div>

          {/* Main Content - Reddit Style */}
          <div className="grid grid-cols-1 gap-4">
            {/* Post Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <PostItem post={post} showActions={true} />
            </div>

            {/* Discussion Section - Reddit Style */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Discussion Header */}
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="far fa-comment-dots text-gray-600"></i>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      Discussion
                    </h3>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Form */}
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-white">
                <CommentForm postId={post._id} />
              </div>

              {/* Comments List */}
              <div className="divide-y divide-gray-100">
                {post.comments.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="far fa-comment-dots text-2xl text-gray-400"></i>
                    </div>
                    <p className="text-gray-500 font-medium mb-1">No comments yet</p>
                    <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  post.comments.map((comment) => (
                    <div key={comment._id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                      <CommentItem
                        comment={comment}
                        postId={post._id}
                      />
                    </div>
                  ))
                )}
              </div>
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
