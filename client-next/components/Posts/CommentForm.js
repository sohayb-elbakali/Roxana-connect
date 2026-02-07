'use client';

import React, { useState } from "react";
import { connect } from "react-redux";
import { addComment } from "../../lib/redux/modules/posts";

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    addComment(postId, { text });
    setText("");
    setIsFocused(false);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className={`border rounded-lg transition-all duration-200 ${
          isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'
        }`}>
          <textarea
            placeholder="What are your thoughts?"
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !text && setIsFocused(false)}
            required
            rows={isFocused ? "4" : "2"}
            className="w-full px-4 py-3 rounded-lg focus:outline-none resize-none placeholder-gray-400 text-sm"
          />
        </div>

        {(isFocused || text) && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setText("");
                setIsFocused(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!text.trim()}
            >
              Comment
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default connect(null, { addComment })(CommentForm);
