'use client';

import { connect } from "react-redux";
import { setFilters, fetchInternships } from "../../lib/redux/modules/internships";

const SortDropdown = ({ sort, setFilters, fetchInternships, filters }) => {
  const sortOptions = [
    { value: "deadline", label: "Deadline (Soonest)" },
    { value: "date", label: "Newest First" },
    { value: "tracking", label: "Most Tracked" },
  ];

  const handleSortChange = (e) => {
    const value = e.target.value;
    setFilters({ sort: value });
    fetchInternships({ ...filters, sort: value });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sort By
      </label>
      <select
        value={sort}
        onChange={handleSortChange}
        className="text-gray-900 bg-white w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const mapStateToProps = (state) => ({
  sort: state.internships.filters.sort,
  filters: state.internships.filters,
});

export default connect(mapStateToProps, { setFilters, fetchInternships })(
  SortDropdown
);
