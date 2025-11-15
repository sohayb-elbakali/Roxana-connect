/**
 * Demonstration script for deadline utilities
 * This shows how to use the deadline management functions
 */

const {
  calculateDaysRemaining,
  getDeadlineProximity,
  isDeadlineExpired,
  getDeadlineStatus,
} = require("./deadlineUtils");

console.log("=== Deadline Management Utilities Demo ===\n");

// Example 1: Critical deadline (2 days away)
const criticalDeadline = new Date();
criticalDeadline.setDate(criticalDeadline.getDate() + 2);
console.log("Example 1: Critical Deadline (2 days away)");
console.log("Deadline:", criticalDeadline.toDateString());
console.log("Days Remaining:", calculateDaysRemaining(criticalDeadline));
console.log("Proximity:", getDeadlineProximity(criticalDeadline));
console.log("Status:", getDeadlineStatus(criticalDeadline, true));
console.log();

// Example 2: Warning deadline (5 days away)
const warningDeadline = new Date();
warningDeadline.setDate(warningDeadline.getDate() + 5);
console.log("Example 2: Warning Deadline (5 days away)");
console.log("Deadline:", warningDeadline.toDateString());
console.log("Days Remaining:", calculateDaysRemaining(warningDeadline));
console.log("Proximity:", getDeadlineProximity(warningDeadline));
console.log("Status:", getDeadlineStatus(warningDeadline, true));
console.log();

// Example 3: Normal deadline (10 days away)
const normalDeadline = new Date();
normalDeadline.setDate(normalDeadline.getDate() + 10);
console.log("Example 3: Normal Deadline (10 days away)");
console.log("Deadline:", normalDeadline.toDateString());
console.log("Days Remaining:", calculateDaysRemaining(normalDeadline));
console.log("Proximity:", getDeadlineProximity(normalDeadline));
console.log("Status:", getDeadlineStatus(normalDeadline, true));
console.log();

// Example 4: Expired deadline (3 days ago)
const expiredDeadline = new Date();
expiredDeadline.setDate(expiredDeadline.getDate() - 3);
console.log("Example 4: Expired Deadline (3 days ago)");
console.log("Deadline:", expiredDeadline.toDateString());
console.log("Days Remaining:", calculateDaysRemaining(expiredDeadline));
console.log("Is Expired:", isDeadlineExpired(expiredDeadline));
console.log("Proximity:", getDeadlineProximity(expiredDeadline));
console.log("Status:", getDeadlineStatus(expiredDeadline, false));
console.log();

console.log("=== Demo Complete ===");
