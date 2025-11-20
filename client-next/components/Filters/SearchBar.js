'use client';

import { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { setFilters, fetchInternships } from "../../lib/redux/modules/internships";

const SearchBar = ({ search, setFilters, fetchInternships, filters }) => {
  const [searchInput, setSearchInput] = useState(search || "");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setFilters({ search: searchInput });
        fetchInternships({ ...filters, search: searchInput });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, search, setFilters, fetchInternships, filters]);

  const handleClear = useCallback(() => {
    setSearchInput("");
    setFilters({ search: "" });
    fetchInternships({ ...filters, search: "" });
  }, [setFilters, fetchInternships, filters]);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className="fas fa-search text-gray-400"></i>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search internships..."
          className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
        />
        {searchInput && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Clear search"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  search: state.internships.filters.search,
  filters: state.internships.filters,
});

export default connect(mapStateToProps, { setFilters, fetchInternships })(
  SearchBar
);
