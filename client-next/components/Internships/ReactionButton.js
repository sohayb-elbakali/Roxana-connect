'use client';

import { useState } from "react";

const ReactionButton = ({
  hasLiked,
  likesCount,
  onLike,
  size = "md",
  showLabel = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    onLike();
    if (!hasLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={hasLiked ? "Remove interest" : "Mark as interested"}
      className={`flex items-center gap-1.5 rounded-lg transition-colors hover:cursor-pointer ${sizeClasses[size]} ${hasLiked
          ? "bg-pink-100 text-pink-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
    >
      <i className={`${hasLiked ? "fas" : "far"} fa-heart`}></i>
      <span className="font-medium">{likesCount || 0}</span>
      {showLabel && (
        <span className={`font-medium ${size === "sm" ? "hidden sm:inline" : ""}`}>
          {hasLiked ? "Liked" : "Like"}
        </span>
      )}
    </button>
  );
};

export default ReactionButton;
