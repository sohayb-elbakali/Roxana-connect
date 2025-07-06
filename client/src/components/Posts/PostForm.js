import React, { useState } from "react";
import { connect } from 'react-redux';
import { addPost } from "../../redux/modules/posts";

const PostForm = ({addPost}) => {
    const [text, setText] = useState("")

    const onSubmit = (e) => {
        e.preventDefault()
        addPost({text})
        setText("")
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <i className="fas fa-edit text-white text-lg"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 ml-3">Create Post</h3>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none placeholder-gray-400"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <i className="fas fa-image mr-2 text-purple-500"></i>
                Photo
              </span>
              <span className="flex items-center">
                <i className="fas fa-video mr-2 text-purple-500"></i>
                Video
              </span>
              <span className="flex items-center">
                <i className="fas fa-smile mr-2 text-purple-500"></i>
                Feeling
              </span>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center"
              disabled={!text.trim()}
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Post
            </button>
          </div>
        </form>
      </div>
    );
}

export default connect(null, { addPost })(PostForm)
