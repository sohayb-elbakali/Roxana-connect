/**
 * Tests for internship filter middleware
 * These tests verify the query parameter parsing and MongoDB query building
 */

const { parseInternshipFilters } = require("../../middleware/filterMiddleware");

describe("parseInternshipFilters middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should set default sort to newest first when no sort parameter", () => {
    parseInternshipFilters(req, res, next);

    expect(req.sortOption).toEqual({ date: -1 });
    expect(next).toHaveBeenCalled();
  });

  test("should filter by company with case-insensitive regex", () => {
    req.query.company = "Google";

    parseInternshipFilters(req, res, next);

    expect(req.filters.company).toEqual({ $regex: "Google", $options: "i" });
    expect(next).toHaveBeenCalled();
  });

  test("should filter by location with case-insensitive regex", () => {
    req.query.location = "New York";

    parseInternshipFilters(req, res, next);

    expect(req.filters.location).toEqual({ $regex: "New York", $options: "i" });
    expect(next).toHaveBeenCalled();
  });

  test("should filter by active status when true", () => {
    req.query.active = "true";

    parseInternshipFilters(req, res, next);

    expect(req.filters.isActive).toBe(true);
    expect(next).toHaveBeenCalled();
  });

  test("should filter by active status when false", () => {
    req.query.active = "false";

    parseInternshipFilters(req, res, next);

    expect(req.filters.isActive).toBe(false);
    expect(next).toHaveBeenCalled();
  });

  test("should filter by deadline range with both from and to dates", () => {
    req.query.deadlineFrom = "2025-01-01";
    req.query.deadlineTo = "2025-12-31";

    parseInternshipFilters(req, res, next);

    expect(req.filters.applicationDeadline).toBeDefined();
    expect(req.filters.applicationDeadline.$gte).toBeInstanceOf(Date);
    expect(req.filters.applicationDeadline.$lte).toBeInstanceOf(Date);
    expect(next).toHaveBeenCalled();
  });

  test("should filter by deadline from date only", () => {
    req.query.deadlineFrom = "2025-01-01";

    parseInternshipFilters(req, res, next);

    expect(req.filters.applicationDeadline).toBeDefined();
    expect(req.filters.applicationDeadline.$gte).toBeInstanceOf(Date);
    expect(req.filters.applicationDeadline.$lte).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  test("should filter by deadline to date only", () => {
    req.query.deadlineTo = "2025-12-31";

    parseInternshipFilters(req, res, next);

    expect(req.filters.applicationDeadline).toBeDefined();
    expect(req.filters.applicationDeadline.$lte).toBeInstanceOf(Date);
    expect(req.filters.applicationDeadline.$gte).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  test("should return error for invalid deadlineFrom date", () => {
    req.query.deadlineFrom = "invalid-date";

    parseInternshipFilters(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid deadlineFrom date format" }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return error for invalid deadlineTo date", () => {
    req.query.deadlineTo = "invalid-date";

    parseInternshipFilters(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid deadlineTo date format" }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should filter by tags array", () => {
    req.query.tags = "software,backend,paid";

    parseInternshipFilters(req, res, next);

    expect(req.filters.tags).toEqual({ $in: ["software", "backend", "paid"] });
    expect(next).toHaveBeenCalled();
  });

  test("should handle tags with extra spaces", () => {
    req.query.tags = " software , backend , paid ";

    parseInternshipFilters(req, res, next);

    expect(req.filters.tags).toEqual({ $in: ["software", "backend", "paid"] });
    expect(next).toHaveBeenCalled();
  });

  test("should handle empty tags string", () => {
    req.query.tags = "";

    parseInternshipFilters(req, res, next);

    expect(req.filters.tags).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  test("should create full-text search query with $or operator", () => {
    req.query.search = "engineer";

    parseInternshipFilters(req, res, next);

    expect(req.filters.$or).toEqual([
      { company: { $regex: "engineer", $options: "i" } },
      { positionTitle: { $regex: "engineer", $options: "i" } },
      { description: { $regex: "engineer", $options: "i" } },
    ]);
    expect(next).toHaveBeenCalled();
  });

  test("should handle empty search string", () => {
    req.query.search = "   ";

    parseInternshipFilters(req, res, next);

    expect(req.filters.$or).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  test("should sort by deadline when sort=deadline", () => {
    req.query.sort = "deadline";

    parseInternshipFilters(req, res, next);

    expect(req.sortOption).toEqual({ applicationDeadline: 1 });
    expect(next).toHaveBeenCalled();
  });

  test("should sort by tracking count when sort=tracking", () => {
    req.query.sort = "tracking";

    parseInternshipFilters(req, res, next);

    expect(req.sortOption).toEqual({ trackingCount: -1 });
    expect(next).toHaveBeenCalled();
  });

  test("should sort by date when sort=date", () => {
    req.query.sort = "date";

    parseInternshipFilters(req, res, next);

    expect(req.sortOption).toEqual({ date: -1 });
    expect(next).toHaveBeenCalled();
  });

  test("should handle multiple filters combined", () => {
    req.query.company = "Google";
    req.query.location = "Remote";
    req.query.active = "true";
    req.query.tags = "software,paid";
    req.query.deadlineFrom = "2025-01-01";
    req.query.sort = "deadline";

    parseInternshipFilters(req, res, next);

    expect(req.filters.company).toEqual({ $regex: "Google", $options: "i" });
    expect(req.filters.location).toEqual({ $regex: "Remote", $options: "i" });
    expect(req.filters.isActive).toBe(true);
    expect(req.filters.tags).toEqual({ $in: ["software", "paid"] });
    expect(req.filters.applicationDeadline.$gte).toBeInstanceOf(Date);
    expect(req.sortOption).toEqual({ applicationDeadline: 1 });
    expect(next).toHaveBeenCalled();
  });

  test("should handle search with other filters", () => {
    req.query.search = "engineer";
    req.query.company = "Google";
    req.query.active = "true";

    parseInternshipFilters(req, res, next);

    expect(req.filters.company).toEqual({ $regex: "Google", $options: "i" });
    expect(req.filters.isActive).toBe(true);
    expect(req.filters.$or).toEqual([
      { company: { $regex: "engineer", $options: "i" } },
      { positionTitle: { $regex: "engineer", $options: "i" } },
      { description: { $regex: "engineer", $options: "i" } },
    ]);
    expect(next).toHaveBeenCalled();
  });

  test("should handle no query parameters", () => {
    parseInternshipFilters(req, res, next);

    expect(req.filters).toEqual({});
    expect(req.sortOption).toEqual({ date: -1 });
    expect(next).toHaveBeenCalled();
  });
});
