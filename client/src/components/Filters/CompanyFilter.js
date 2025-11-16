import { useState } from "react";
import { connect } from "react-redux";
import { setFilters, fetchInternships } from "../../redux/modules/internships";

const CompanyFilter = ({ company, setFilters, fetchInternships, filters, internships }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState(
    company ? company.split(",").filter(Boolean) : []
  );

  // Extract unique companies from internships
  const availableCompanies = [
    ...new Set(internships.map((i) => i.company).filter(Boolean)),
  ].sort();

  const handleToggleCompany = (companyName) => {
    let updated;
    if (selectedCompanies.includes(companyName)) {
      updated = selectedCompanies.filter((c) => c !== companyName);
    } else {
      updated = [...selectedCompanies, companyName];
    }
    setSelectedCompanies(updated);
    const companyString = updated.join(",");
    setFilters({ company: companyString });
    fetchInternships({ ...filters, company: companyString });
  };

  const handleClear = () => {
    setSelectedCompanies([]);
    setFilters({ company: "" });
    fetchInternships({ ...filters, company: "" });
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Company filter"
        >
          <span className="text-gray-700">
            {selectedCompanies.length > 0
              ? `${selectedCompanies.length} selected`
              : "All companies"}
          </span>
          <i className={`fas fa-chevron-${isOpen ? "up" : "down"} text-gray-400 text-xs`}></i>
        </button>

        {isOpen && (
          <div 
            className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            role="listbox"
            aria-label="Company options"
          >
            {availableCompanies.length > 0 ? (
              availableCompanies.map((companyName) => (
                <label
                  key={companyName}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer focus-within:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(companyName)}
                    onChange={() => handleToggleCompany(companyName)}
                    className="mr-2.5 h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                    aria-label={`Filter by ${companyName}`}
                  />
                  <span className="text-sm text-gray-700">{companyName}</span>
                </label>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-gray-500 text-center">
                No companies available
              </div>
            )}
          </div>
        )}
      </div>

      {selectedCompanies.length > 0 && (
        <button
          onClick={handleClear}
          className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
          aria-label="Clear company filter"
        >
          Clear selection
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  company: state.internships.filters.company,
  filters: state.internships.filters,
  internships: state.internships.items,
});

export default connect(mapStateToProps, { setFilters, fetchInternships })(
  CompanyFilter
);
