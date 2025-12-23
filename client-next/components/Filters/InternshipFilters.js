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
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-sliders-h text-blue-600 text-sm"></i>
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <SearchBar />

        {/* Sort */}
        <SortDropdown />

        {/* Company */}
        <CompanyFilter />

        {/* Location */}
        <LocationFilter />

        {/* Deadline */}
        <DeadlineFilter />

        {/* Tags */}
        <TagFilter />
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
