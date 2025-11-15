import React, { useState } from "react";
import { connect } from "react-redux";
import { addComment } from "../../redux/modules/posts";

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    addComment(postId, { text });
    setText("");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <i className="fas fa-comment text-blue-600 text-sm"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-900 ml-3">
          Leave a Comment
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <textarea
            placeholder="Share your thoughts on this post..."
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none placeholder-gray-400"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 flex items-center disabled:opacity-50"
            disabled={!text.trim()}
          >
            <i className="fas fa-paper-plane mr-2"></i>
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { addComment })(CommentForm);
