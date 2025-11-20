/**
 * DeadlineBadge Component
 * 
 * Displays a color-coded badge showing the deadline status and days remaining
 * for an internship opportunity.
 * 
 * Color coding:
 * - Red: < 3 days remaining or expired
 * - Yellow: < 7 days remaining
 * - Green: >= 7 days remaining
 * 
 * @param {Date|string} deadline - The application deadline
 * @param {string} size - Size variant: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} showIcon - Whether to show clock icon (default: true)
 */
const DeadlineBadge = ({ deadline, size = "md", showIcon = true }) => {
  // Calculate days until deadline
  const getDaysUntilDeadline = () => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get badge styling based on days remaining
  const getBadgeStyle = () => {
    const days = getDaysUntilDeadline();
    
    if (days === null) {
      return {
        bgColor: "bg-gray-500",
        textColor: "text-white",
        text: "No deadline",
      };
    }
    
    if (days < 0) {
      return {
        bgColor: "bg-gray-500",
        textColor: "text-white",
        text: "Expired",
      };
    }
    
    if (days === 0) {
      return {
        bgColor: "bg-red-600",
        textColor: "text-white",
        text: "Today!",
      };
    }
    
    if (days === 1) {
      return {
        bgColor: "bg-red-500",
        textColor: "text-white",
        text: "1 day left",
      };
    }
    
    if (days < 3) {
      return {
        bgColor: "bg-red-500",
        textColor: "text-white",
        text: `${days} days left`,
      };
    }
    
    if (days < 7) {
      return {
        bgColor: "bg-yellow-500",
        textColor: "text-white",
        text: `${days} days left`,
      };
    }
    
    return {
      bgColor: "bg-green-500",
      textColor: "text-white",
      text: `${days} days left`,
    };
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      case "md":
      default:
        return "px-3 py-1 text-sm";
    }
  };

  const style = getBadgeStyle();
  const sizeClasses = getSizeClasses();

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} rounded-full font-semibold ${style.bgColor} ${style.textColor}`}
    >
      {showIcon && <i className="fas fa-clock mr-1.5"></i>}
      {style.text}
    </span>
  );
};

export default DeadlineBadge;

// Utility function to get days until deadline (can be used elsewhere)
export const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Utility function to check if deadline is urgent (< 7 days)
export const isDeadlineUrgent = (deadline) => {
  const days = getDaysUntilDeadline(deadline);
  return days !== null && days >= 0 && days < 7;
};

// Utility function to check if deadline has passed
export const isDeadlineExpired = (deadline) => {
  const days = getDaysUntilDeadline(deadline);
  return days !== null && days < 0;
};
