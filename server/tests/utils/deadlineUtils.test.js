/**
 * Tests for deadline management utilities
 * These tests verify deadline calculation, proximity detection, and expiration checking
 * Requirements: 4.1, 4.2, 4.4, 4.5
 */

const {
  DEADLINE_PROXIMITY,
  calculateDaysRemaining,
  getDeadlineProximity,
  isDeadlineExpired,
  getDeadlineStatus,
} = require("../../utils/deadlineUtils");

describe("Deadline Management Utilities", () => {
  describe("calculateDaysRemaining", () => {
    test("should return positive days for future deadline", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      
      const days = calculateDaysRemaining(futureDate);
      
      expect(days).toBe(10);
    });

    test("should return 0 for today's deadline", () => {
      const today = new Date();
      
      const days = calculateDaysRemaining(today);
      
      expect(days).toBe(0);
    });

    test("should return negative days for past deadline", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      const days = calculateDaysRemaining(pastDate);
      
      expect(days).toBe(-5);
    });
  });

  describe("getDeadlineProximity - Requirement 4.1, 4.2", () => {
    test("should return 'critical' level for deadline within 3 days", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 2);
      
      const result = getDeadlineProximity(deadline);
      
      expect(result.level).toBe("critical");
      expect(result.daysRemaining).toBe(2);
      expect(result.isExpired).toBe(false);
    });

    test("should return 'warning' level for deadline within 7 days", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 5);
      
      const result = getDeadlineProximity(deadline);
      
      expect(result.level).toBe("warning");
      expect(result.daysRemaining).toBe(5);
      expect(result.isExpired).toBe(false);
    });

    test("should return 'normal' level for deadline beyond 7 days", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 10);
      
      const result = getDeadlineProximity(deadline);
      
      expect(result.level).toBe("normal");
      expect(result.daysRemaining).toBe(10);
      expect(result.isExpired).toBe(false);
    });

    test("should return 'expired' level for past deadline", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() - 3);
      
      const result = getDeadlineProximity(deadline);
      
      expect(result.level).toBe("expired");
      expect(result.daysRemaining).toBe(-3);
      expect(result.isExpired).toBe(true);
    });

    test("should return 'critical' for deadline exactly 2 days away", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 2);
      
      const result = getDeadlineProximity(deadline);
      
      expect(result.level).toBe("critical");
      expect(result.daysRemaining).toBe(2);
    });

    test("should return 'warning' for deadline exactly 6 days away", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 6);
      
      const result = getDeadlineProximity(deadline);
      
      expect(result.level).toBe("warning");
      expect(result.daysRemaining).toBe(6);
    });
  });

  describe("isDeadlineExpired - Requirement 4.4", () => {
    test("should return false for future deadline", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      
      const expired = isDeadlineExpired(futureDate);
      
      expect(expired).toBe(false);
    });

    test("should return false for today's deadline (not yet end of day)", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const expired = isDeadlineExpired(today);
      
      expect(expired).toBe(false);
    });

    test("should return true for past deadline", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const expired = isDeadlineExpired(pastDate);
      
      expect(expired).toBe(true);
    });
  });

  describe("getDeadlineStatus - Requirements 4.1, 4.2, 4.5", () => {
    test("should return complete status for active internship with future deadline", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 5);
      
      const status = getDeadlineStatus(deadline, true);
      
      expect(status.level).toBe("warning");
      expect(status.daysRemaining).toBe(5);
      expect(status.isExpired).toBe(false);
      expect(status.isActive).toBe(true);
      expect(status.displayText).toBe("5 days remaining");
      expect(status.deadline).toEqual(deadline);
    });

    test("should return expired status with proper display text", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() - 2);
      
      const status = getDeadlineStatus(deadline, false);
      
      expect(status.level).toBe("expired");
      expect(status.isExpired).toBe(true);
      expect(status.isActive).toBe(false);
      expect(status.displayText).toBe("Expired");
    });

    test("should handle singular day correctly in display text", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 1);
      
      const status = getDeadlineStatus(deadline, true);
      
      expect(status.displayText).toBe("1 day remaining");
    });

    test("should handle plural days correctly in display text", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 3);
      
      const status = getDeadlineStatus(deadline, true);
      
      expect(status.displayText).toBe("3 days remaining");
    });

    test("should default isActive to true when not provided", () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 5);
      
      const status = getDeadlineStatus(deadline);
      
      expect(status.isActive).toBe(true);
    });
  });

  describe("DEADLINE_PROXIMITY constants", () => {
    test("should have correct proximity thresholds", () => {
      expect(DEADLINE_PROXIMITY.CRITICAL).toBe(3);
      expect(DEADLINE_PROXIMITY.WARNING).toBe(7);
      expect(DEADLINE_PROXIMITY.NORMAL).toBe(Infinity);
    });
  });
});
