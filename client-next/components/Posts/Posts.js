'use client';

import React, { useEffect } from "react"
import { connect } from "react-redux"
import { getPosts } from "../../lib/redux/modules/posts"
import PostForm from "./PostForm"
import PostItem from "./PostItem"

function Posts({ getPosts, posts }) {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-comments text-blue-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Community Posts</h1>
              </div>
              <p className="text-sm text-gray-600">
                Share and discuss with the community • {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <PostForm />
          <div className="space-y-6">
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  posts: state.posts.posts,
});

export default connect(mapStateToProps, { getPosts })(Posts);
