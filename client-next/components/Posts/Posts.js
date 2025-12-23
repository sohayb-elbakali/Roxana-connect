'use client';

import React, { useEffect } from "react"
import { connect } from "react-redux"
import Link from "next/link"
import { getPosts } from "../../lib/redux/modules/posts"
import PostForm from "./PostForm"
import PostItem from "./PostItem"

function Posts({ getPosts, posts, loading }) {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-comments text-blue-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Community Posts</h1>
              </div>
              <p className="text-sm text-gray-500 ml-13">
                Share and discuss • {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
        </div>

        {/* Post Form */}
        <div className="mb-6">
          <PostForm />
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-10 h-10 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading posts...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-comments text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share something with the community!</p>
          </div>
        )}

        {/* Posts List */}
        {!loading && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  posts: state.posts.posts,
  loading: state.posts.loading,
});

export default connect(mapStateToProps, { getPosts })(Posts);
