'use client';

import React, { useState } from "react";
import { connect } from 'react-redux';
import { addPost } from "../../lib/redux/modules/posts";

const PostForm = ({addPost}) => {
    const [text, setText] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsPosting(true)
        try {
            await addPost({text})
            setText("")
        } finally {
            setIsPosting(false)
        }
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="fas fa-edit text-blue-600 text-lg"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 ml-3">Create Post</h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <textarea
              placeholder="What's on your mind? Share your thoughts, ideas, or experiences with the community..."
              name="text"
              value={text}
              required
              onChange={(e) => setText(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!text.trim() || isPosting}
            >
              {isPosting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Posting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
}

export default connect(null, { addPost })(PostForm)
