/**
 * Middleware for parsing and building MongoDB queries from request query parameters
 * Supports filtering by company, location, deadline range, tags, search, and sorting
 */

/**
 * Parse internship filter query parameters and build MongoDB query
 * @middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Query Parameters:
 * - company: Filter by company name (case-insensitive partial match)
 * - location: Filter by location (case-insensitive partial match)
 * - deadlineFrom: Filter deadlines after this date (ISO format)
 * - deadlineTo: Filter deadlines before this date (ISO format)
 * - tags: Comma-separated list of tags to filter by
 * - search: Full-text search in company, position title, and description
 * - sort: Sort order (deadline, date, tracking)
 * - active: Show only active internships (true/false)
 */
const parseInternshipFilters = (req, res, next) => {
  try {
    const {
      company,
      location,
      deadlineFrom,
      deadlineTo,
      tags,
      search,
      sort,
      active,
    } = req.query;

    // Initialize filter and sort objects
    const filter = {};
    let sortOption = { date: -1 }; // Default: newest first

    // Filter by active status
    if (active === "true") {
      filter.isActive = true;
    } else if (active === "false") {
      filter.isActive = false;
    }

    // Filter by company (case-insensitive partial match)
    if (company) {
      filter.company = { $regex: company, $options: "i" };
    }

    // Filter by location (case-insensitive partial match)
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Filter by deadline range
    if (deadlineFrom || deadlineTo) {
      filter.applicationDeadline = {};
      
      if (deadlineFrom) {
        const fromDate = new Date(deadlineFrom);
        if (isNaN(fromDate.getTime())) {
          return res.status(400).json({ 
            errors: [{ msg: "Invalid deadlineFrom date format" }] 
          });
        }
        filter.applicationDeadline.$gte = fromDate;
      }
      
      if (deadlineTo) {
        const toDate = new Date(deadlineTo);
        if (isNaN(toDate.getTime())) {
          return res.status(400).json({ 
            errors: [{ msg: "Invalid deadlineTo date format" }] 
          });
        }
        filter.applicationDeadline.$lte = toDate;
      }
    }

    // Filter by tags (match any of the provided tags)
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim()).filter(tag => tag);
      if (tagArray.length > 0) {
        filter.tags = { $in: tagArray };
      }
    }

    // Full-text search in company, position title, and description
    if (search) {
      const searchTerm = search.trim();
      if (searchTerm) {
        filter.$or = [
          { company: { $regex: searchTerm, $options: "i" } },
          { positionTitle: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ];
      }
    }

    // Determine sort order
    if (sort === "deadline") {
      sortOption = { applicationDeadline: 1 }; // Earliest deadline first
    } else if (sort === "tracking") {
      sortOption = { trackingCount: -1 }; // Most tracked first
    } else if (sort === "date") {
      sortOption = { date: -1 }; // Newest first (explicit)
    }

    // Attach filter and sort to request object for use in route handler
    req.filters = filter;
    req.sortOption = sortOption;

    next();
  } catch (err) {
    console.error("Error in parseInternshipFilters middleware:", err.message);
    return res.status(500).json({ 
      errors: [{ msg: "Error processing filter parameters" }] 
    });
  }
};

module.exports = {
  parseInternshipFilters,
};
