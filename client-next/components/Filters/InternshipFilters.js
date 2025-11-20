'use client';

import { connect } from "react-redux";
import { clearFilters, fetchInternships } from "../../lib/redux/modules/internships";
import SearchBar from "./SearchBar";
import CompanyFilter from "./CompanyFilter";
import LocationFilter from "./LocationFilter";
import DeadlineFilter from "./DeadlineFilter";
import TagFilter from "./TagFilter";
import SortDropdown from "./SortDropdown";

const InternshipFilters = ({ filters, clearFilters, fetchInternships }) => {
  // Count active filters (excluding sort and active toggle which are defaults)
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.company) count++;
    if (filters.location) count++;
    if (filters.deadlineFrom || filters.deadlineTo) count++;
    if (filters.tags) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const handleClearAll = () => {
    clearFilters();
    fetchInternships({
      company: "",
      location: "",
      deadlineFrom: "",
      deadlineTo: "",
      tags: "",
      search: "",
      sort: "deadline",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <i className="fas fa-filter text-blue-600 mr-2 text-sm"></i>
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div>
        <SearchBar />
      </div>

      <div className="border-t border-gray-200 pt-4">
        {/* Sort Dropdown */}
        <div className="mb-4">
          <SortDropdown />
        </div>

        {/* Company Filter */}
        <div className="mb-4">
          <CompanyFilter />
        </div>

        {/* Location Filter */}
        <div className="mb-4">
          <LocationFilter />
        </div>

        {/* Deadline Filter */}
        <div className="mb-4">
          <DeadlineFilter />
        </div>

        {/* Tag Filter */}
        <div>
          <TagFilter />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  filters: state.internships.filters,
});

export default connect(mapStateToProps, { clearFilters, fetchInternships })(
  InternshipFilters
);
