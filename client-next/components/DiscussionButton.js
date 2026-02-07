'use client';

import Link from "next/link";

/**
 * Reddit-style discussion button component
 * @param {string} href - Link to discussion page
 * @param {number} commentCount - Number of comments
 * @param {string} size - Button size: 'sm', 'md', 'lg'
 * @param {string} variant - Button variant: 'default', 'compact'
 */
const DiscussionButton = ({ 
  href, 
  commentCount = 0, 
  size = 'md',
  variant = 'default',
  className = '' 
}) => {
  // Size configurations
  const sizeClasses = {
    sm: {
      button: 'px-2.5 py-1.5 text-xs',
      icon: 'text-xs',
      badge: 'px-1.5 py-0.5 text-[10px] ml-1.5',
    },
    md: {
      button: 'px-3 sm:px-4 py-2 text-xs sm:text-sm',
      icon: 'text-xs sm:text-sm',
      badge: 'px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs ml-1.5 sm:ml-2',
    },
    lg: {
      button: 'px-5 py-2.5 text-sm',
      icon: 'text-sm',
      badge: 'px-2 py-0.5 text-xs ml-2',
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Variant styles
  const variantClasses = {
    default: `inline-flex items-center ${currentSize.button} font-semibold text-gray-700 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 border border-gray-200/50 hover:border-gray-300 hover:shadow-sm`,
    compact: `inline-flex items-center ${currentSize.button} font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200`,
  };

  return (
    <Link
      href={href}
      className={`${variantClasses[variant]} ${className}`}
      aria-label={`View discussion with ${commentCount} comment${commentCount !== 1 ? 's' : ''}`}
    >
      {/* Message Square Icon (Reddit-style) */}
      <i className={`far fa-comment-dots ${currentSize.icon} mr-1.5 sm:mr-2`}></i>
      
      {/* Text */}
      <span className="hidden sm:inline">Discussion</span>
      <span className="sm:hidden">Discuss</span>
      
      {/* Comment Count Badge */}
      {commentCount > 0 && (
        <span className={`${currentSize.badge} bg-gray-200 text-gray-700 rounded-lg font-bold`}>
          {commentCount > 99 ? '99+' : commentCount}
        </span>
      )}
    </Link>
  );
};

export default DiscussionButton;
