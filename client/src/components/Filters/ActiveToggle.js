import { connect } from "react-redux";
import { setFilters, fetchInternships } from "../../redux/modules/internships";

const ActiveToggle = ({ active, setFilters, fetchInternships, filters }) => {
  const handleToggle = () => {
    const newActive = !active;
    setFilters({ active: newActive });
    fetchInternships({ ...filters, active: newActive });
  };

  return (
    <div className="flex items-center justify-between">
      <label 
        htmlFor="active-toggle"
        className="text-sm font-medium text-gray-700 cursor-pointer"
      >
        Active opportunities only
      </label>
      <button
        id="active-toggle"
        type="button"
        role="switch"
        aria-checked={active}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
          active ? "bg-blue-600" : "bg-gray-300"
        }`}
        aria-label={`Show ${active ? "all" : "only active"} opportunities`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            active ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  active: state.internships.filters.active,
  filters: state.internships.filters,
});

export default connect(mapStateToProps, { setFilters, fetchInternships })(
  ActiveToggle
);
