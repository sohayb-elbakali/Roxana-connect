const Internship = require("../models/Internship");

/**
 * Deadline proximity levels for visual indicators
 */
const DEADLINE_PROXIMITY = {
  CRITICAL: 3, // Less than 3 days - red indicator
  WARNING: 7,  // Less than 7 days - yellow indicator
  NORMAL: Infinity, // More than 7 days - green/normal indicator
};

/**
 * Calculate days remaining until deadline
 * @param {Date} deadline - The application deadline
 * @returns {number} - Days remaining (negative if expired)
 */
const calculateDaysRemaining = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  // Reset time to midnight for accurate day calculation
  now.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Get deadline proximity level for visual indicators
 * Requirements: 4.1, 4.2
 * @param {Date} deadline - The application deadline
 * @returns {Object} - { level: string, daysRemaining: number, isExpired: boolean }
 */
const getDeadlineProximity = (deadline) => {
  const daysRemaining = calculateDaysRemaining(deadline);
  
  if (daysRemaining < 0) {
    return {
      level: "expired",
      daysRemaining,
      isExpired: true,
    };
  }
  
  if (daysRemaining < DEADLINE_PROXIMITY.CRITICAL) {
    return {
      level: "critical", // Red indicator (< 3 days)
      daysRemaining,
      isExpired: false,
    };
  }
  
  if (daysRemaining < DEADLINE_PROXIMITY.WARNING) {
    return {
      level: "warning", // Yellow indicator (< 7 days)
      daysRemaining,
      isExpired: false,
    };
  }
  
  return {
    level: "normal", // Green/normal indicator (>= 7 days)
    daysRemaining,
    isExpired: false,
  };
};

/**
 * Check if a deadline has passed
 * @param {Date} deadline - The application deadline
 * @returns {boolean} - True if deadline has passed
 */
const isDeadlineExpired = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  // Set to end of day for deadline (23:59:59)
  deadlineDate.setHours(23, 59, 59, 999);
  
  return now > deadlineDate;
};

/**
 * Find all internships with expired deadlines
 * Requirement: 4.4
 * @returns {Promise<Array>} - Array of expired internship IDs
 */
const findExpiredInternships = async () => {
  try {
    const now = new Date();
    
    // Find internships where deadline has passed and isActive is still true
    const expiredInternships = await Internship.find({
      applicationDeadline: { $lt: now },
      isActive: true,
    }).select("_id company positionTitle applicationDeadline");
    
    return expiredInternships;
  } catch (error) {
    throw new Error("Error finding expired internships");
  }
};

/**
 * Update isActive flag for expired internships
 * Requirement: 4.4, 4.5
 * @returns {Promise<Object>} - { count: number, internships: Array }
 */
const updateExpiredInternships = async () => {
  try {
    const now = new Date();
    
    // Update all internships with passed deadlines to inactive
    const result = await Internship.updateMany(
      {
        applicationDeadline: { $lt: now },
        isActive: true,
      },
      {
        $set: { isActive: false },
      }
    );
    
    return {
      count: result.modifiedCount,
      message: `Updated ${result.modifiedCount} expired internship(s) to inactive`,
    };
  } catch (error) {
    throw new Error("Error updating expired internships");
  }
};

/**
 * Check and update all expired internships
 * This function can be called periodically or on-demand
 * Requirement: 4.4, 4.5
 * @returns {Promise<Object>} - Update results
 */
const checkAndUpdateDeadlines = async () => {
  try {
    // First, find expired internships for logging
    const expiredInternships = await findExpiredInternships();
    
    // Update their isActive status
    const updateResult = await updateExpiredInternships();
    
    return {
      ...updateResult,
      expiredInternships: expiredInternships.map((i) => ({
        id: i._id,
        company: i.company,
        position: i.positionTitle,
        deadline: i.applicationDeadline,
      })),
    };
  } catch (error) {
    throw new Error("Error checking and updating deadlines");
  }
};

/**
 * Get deadline status for display
 * Combines proximity and expiration information
 * Requirements: 4.1, 4.2, 4.5
 * @param {Date} deadline - The application deadline
 * @param {boolean} isActive - Current isActive status
 * @returns {Object} - Complete deadline status information
 */
const getDeadlineStatus = (deadline, isActive = true) => {
  const proximity = getDeadlineProximity(deadline);
  
  return {
    ...proximity,
    isActive,
    deadline: deadline,
    displayText: proximity.isExpired
      ? "Expired"
      : `${proximity.daysRemaining} day${proximity.daysRemaining !== 1 ? "s" : ""} remaining`,
  };
};

module.exports = {
  DEADLINE_PROXIMITY,
  calculateDaysRemaining,
  getDeadlineProximity,
  isDeadlineExpired,
  findExpiredInternships,
  updateExpiredInternships,
  checkAndUpdateDeadlines,
  getDeadlineStatus,
};
