import { useState } from "react";
import { connect } from "react-redux";
import { addInternshipComment } from "../../redux/modules/internships";

const CommentForm = ({ internshipId, addInternshipComment }) => {
  const [commentText, setCommentText] = useState("");
  const [commentType, setCommentType] = useState("general");
  const CHARACTER_LIMIT = 1000;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (commentText.trim() && commentText.length <= CHARACTER_LIMIT) {
      addInternshipComment(internshipId, { 
        text: commentText.trim(), 
        commentType 
      });
      setCommentText("");
      setCommentType("general");
    }
  };

  const remainingChars = CHARACTER_LIMIT - commentText.length;
  const isOverLimit = commentText.length > CHARACTER_LIMIT;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <i className="fas fa-comment text-white text-sm"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-800 ml-3">
          Share Your Insights
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="commentType" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Comment Type
          </label>
          <select
            id="commentType"
            value={commentType}
            onChange={(e) => setCommentType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
          >
            <option value="general">General Comment</option>
            <option value="tip">Interview Tip</option>
            <option value="advice">Application Advice</option>
            <option value="culture">Company Culture Insight</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {commentType === "tip" && "Share tips about the interview process"}
            {commentType === "advice" && "Offer advice on how to apply successfully"}
            {commentType === "culture" && "Share insights about company culture"}
            {commentType === "general" && "Share any thoughts or experiences"}
          </p>
        </div>

        <div>
          <label 
            htmlFor="commentText" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Comment
          </label>
          <textarea
            id="commentText"
            placeholder="Share your experience, tips, or advice..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none placeholder-gray-400 transition-all duration-200 ${
              isOverLimit 
                ? "border-red-500 focus:ring-red-400" 
                : "border-gray-300 focus:ring-blue-600"
            }`}
            aria-describedby="comment-char-count"
            aria-invalid={isOverLimit}
          />
          <div className="flex justify-between items-center mt-1" id="comment-char-count">
            <p className="text-xs text-gray-500">
              Be respectful and constructive in your feedback
            </p>
            <p 
              className={`text-xs font-medium ${
                isOverLimit 
                  ? "text-red-600" 
                  : remainingChars < 100 
                    ? "text-yellow-600" 
                    : "text-gray-500"
              }`}
              aria-live="polite"
            >
              {remainingChars} characters remaining
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2 font-semibold rounded-lg shadow transition-all duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              !commentText.trim() || isOverLimit
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
            }`}
            disabled={!commentText.trim() || isOverLimit}
            aria-label="Post comment"
          >
            <i className="fas fa-paper-plane mr-2" aria-hidden="true"></i>
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, {
  addInternshipComment,
})(CommentForm);
