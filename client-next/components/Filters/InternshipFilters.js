'use client';

import { useState } from "react";
import { connect } from "react-redux";
import { clearFilters, fetchInternships } from "../../lib/redux/modules/internships";
import SearchBar from "./SearchBar";
import CompanyFilter from "./CompanyFilter";
import LocationFilter from "./LocationFilter";
import DeadlineFilter from "./DeadlineFilter";
import TagFilter from "./TagFilter";
import SortDropdown from "./SortDropdown";

const InternshipFilters = ({ filters, clearFilters, fetchInternships }) => {
  const [expandedSections, setExpandedSections] = useState({
    company: true,
    location: true,
    deadline: false,
    tags: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const FilterSection = ({ title, icon, isExpanded, onToggle, children, hasActiveFilter }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-1 hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <i className={`${icon} text-gray-600 text-sm w-4`}></i>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {hasActiveFilter && (
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          )}
        </div>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 text-xs transition-transform`}></i>
      </button>
      {isExpanded && (
        <div className="pb-4 px-1 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar - Always Visible */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <SearchBar />
      </div>

      {/* Sort - Compact Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <i className="fas fa-sort text-gray-600 text-sm"></i>
          <h3 className="text-sm font-semibold text-gray-900">Sort by</h3>
        </div>
        <SortDropdown />
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-filter text-blue-600 text-sm"></i>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">All Filters</h2>
                {activeFilterCount > 0 && (
                  <p className="text-xs text-gray-500">{activeFilterCount} active</p>
                )}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Sections */}
        <div className="px-4">
          <FilterSection
            title="Company"
            icon="fas fa-building"
            isExpanded={expandedSections.company}
            onToggle={() => toggleSection('company')}
            hasActiveFilter={!!filters.company}
          >
            <CompanyFilter />
          </FilterSection>

          <FilterSection
            title="Location"
            icon="fas fa-map-marker-alt"
            isExpanded={expandedSections.location}
            onToggle={() => toggleSection('location')}
            hasActiveFilter={!!filters.location}
          >
            <LocationFilter />
          </FilterSection>

          <FilterSection
            title="Deadline"
            icon="fas fa-calendar-alt"
            isExpanded={expandedSections.deadline}
            onToggle={() => toggleSection('deadline')}
            hasActiveFilter={!!(filters.deadlineFrom || filters.deadlineTo)}
          >
            <DeadlineFilter />
          </FilterSection>

          <FilterSection
            title="Skills & Tags"
            icon="fas fa-tags"
            isExpanded={expandedSections.tags}
            onToggle={() => toggleSection('tags')}
            hasActiveFilter={!!filters.tags}
          >
            <TagFilter />
          </FilterSection>
        </div>
      </div>

      {/* Quick Filters - Chips */}
      {activeFilterCount > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-check-circle text-green-600 text-sm"></i>
            <h3 className="text-sm font-semibold text-gray-900">Active Filters</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <span>Search: {filters.search}</span>
                <button
                  onClick={() => fetchInternships({ ...filters, search: "" })}
                  className="hover:bg-blue-100 rounded-full p-0.5"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            )}
            {filters.company && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                <span>Company: {filters.company}</span>
                <button
                  onClick={() => fetchInternships({ ...filters, company: "" })}
                  className="hover:bg-purple-100 rounded-full p-0.5"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            )}
            {filters.location && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <span>Location: {filters.location}</span>
                <button
                  onClick={() => fetchInternships({ ...filters, location: "" })}
                  className="hover:bg-green-100 rounded-full p-0.5"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            )}
            {filters.tags && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                <span>Tags: {filters.tags}</span>
                <button
                  onClick={() => fetchInternships({ ...filters, tags: "" })}
                  className="hover:bg-orange-100 rounded-full p-0.5"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  filters: state.internships.filters,
});

export default connect(mapStateToProps, { clearFilters, fetchInternships })(
  InternshipFilters
);
