/**
 * Status Color Scheme
 * 
 * Consistent color scheme for application status indicators across the application
 * This ensures visual consistency and accessibility compliance
 */

export const statusColors = {
  not_applied: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
    hover: "hover:bg-gray-200",
    icon: "fa-circle",
    label: "Not Applied",
  },
  applied: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
    hover: "hover:bg-blue-200",
    icon: "fa-paper-plane",
    label: "Applied",
  },
  interviewing: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
    hover: "hover:bg-yellow-200",
    icon: "fa-comments",
    label: "Interviewing",
  },
  offer_received: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
    hover: "hover:bg-green-200",
    icon: "fa-trophy",
    label: "Offer Received",
  },
  accepted: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
    hover: "hover:bg-emerald-200",
    icon: "fa-check-circle",
    label: "Accepted",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
    hover: "hover:bg-red-200",
    icon: "fa-times-circle",
    label: "Rejected",
  },
  declined: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
    hover: "hover:bg-orange-200",
    icon: "fa-ban",
    label: "Declined",
  },
};

/**
 * Deadline urgency colors
 */
export const deadlineColors = {
  expired: {
    bg: "bg-gray-500",
    text: "text-white",
    label: "Expired",
  },
  urgent: {
    // < 3 days
    bg: "bg-red-500",
    text: "text-white",
    label: "Urgent",
  },
  soon: {
    // < 7 days
    bg: "bg-yellow-500",
    text: "text-white",
    label: "Soon",
  },
  normal: {
    // >= 7 days
    bg: "bg-green-500",
    text: "text-white",
    label: "Normal",
  },
};

/**
 * Get status color configuration
 */
export const getStatusColor = (status) => {
  return statusColors[status] || statusColors.not_applied;
};

/**
 * Get deadline urgency color based on days remaining
 */
export const getDeadlineColor = (daysRemaining) => {
  if (daysRemaining === null || daysRemaining < 0) {
    return deadlineColors.expired;
  }
  if (daysRemaining < 3) {
    return deadlineColors.urgent;
  }
  if (daysRemaining < 7) {
    return deadlineColors.soon;
  }
  return deadlineColors.normal;
};

export default {
  statusColors,
  deadlineColors,
  getStatusColor,
  getDeadlineColor,
};
