import { useState } from "react";
import { connect } from "react-redux";
import { setFilters, fetchInternships } from "../../redux/modules/internships";

const DeadlineFilter = ({
  deadlineFrom,
  deadlineTo,
  setFilters,
  fetchInternships,
  filters,
}) => {
  const [fromDate, setFromDate] = useState(deadlineFrom || "");
  const [toDate, setToDate] = useState(deadlineTo || "");

  const handleFromDateChange = (e) => {
    const value = e.target.value;
    setFromDate(value);
    setFilters({ deadlineFrom: value });
    fetchInternships({ ...filters, deadlineFrom: value, deadlineTo: toDate });
  };

  const handleToDateChange = (e) => {
    const value = e.target.value;
    setToDate(value);
    setFilters({ deadlineTo: value });
    fetchInternships({ ...filters, deadlineFrom: fromDate, deadlineTo: value });
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setFilters({ deadlineFrom: "", deadlineTo: "" });
    fetchInternships({ ...filters, deadlineFrom: "", deadlineTo: "" });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Application Deadline
      </label>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
          />
        </div>
      </div>

      {(fromDate || toDate) && (
        <button
          onClick={handleClear}
          className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear dates
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  deadlineFrom: state.internships.filters.deadlineFrom,
  deadlineTo: state.internships.filters.deadlineTo,
  filters: state.internships.filters,
});

export default connect(mapStateToProps, { setFilters, fetchInternships })(
  DeadlineFilter
);
