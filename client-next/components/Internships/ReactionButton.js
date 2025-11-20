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
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  const iconSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={hasLiked ? "Remove interest" : "Mark as interested"}
      className={`relative flex items-center space-x-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transform hover:scale-105 ${sizeClasses[size]} ${
        hasLiked
          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md hover:shadow-lg"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {/* Heart Icon */}
      <div className="relative">
        <i 
          className={`fas fa-heart ${iconSizeClasses[size]} ${
            hasLiked ? "animate-pulse" : "far"
          }`}
        ></i>
        
        {/* Floating hearts animation */}
        {isAnimating && (
          <>
            <i className="fas fa-heart absolute -top-2 left-0 text-pink-400 animate-float-up-1 opacity-0"></i>
            <i className="fas fa-heart absolute -top-2 left-1 text-red-400 animate-float-up-2 opacity-0"></i>
            <i className="fas fa-heart absolute -top-2 -left-1 text-pink-500 animate-float-up-3 opacity-0"></i>
          </>
        )}
      </div>

      {/* Count */}
      <span className="font-semibold">{likesCount || 0}</span>

      {/* Label */}
      {showLabel && (
        <span className={`font-medium ${size === "sm" ? "hidden sm:inline" : ""}`}>
          {hasLiked ? "Interested!" : "Interested?"}
        </span>
      )}

      {/* Sparkle effect */}
      {hasLiked && (
        <span className="absolute -top-1 -right-1 text-yellow-300 animate-pulse">
          ✨
        </span>
      )}
    </button>
  );
};

export default ReactionButton;
