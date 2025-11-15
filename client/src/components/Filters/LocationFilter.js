import { useState } from "react";
import { connect } from "react-redux";
import { setFilters, fetchInternships } from "../../redux/modules/internships";

const LocationFilter = ({ location, setFilters, fetchInternships, filters, internships }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState(
    location ? location.split(",").filter(Boolean) : []
  );

  // Extract unique locations from internships
  const availableLocations = [
    ...new Set(internships.map((i) => i.location).filter(Boolean)),
  ].sort();

  const handleToggleLocation = (locationName) => {
    let updated;
    if (selectedLocations.includes(locationName)) {
      updated = selectedLocations.filter((l) => l !== locationName);
    } else {
      updated = [...selectedLocations, locationName];
    }
    setSelectedLocations(updated);
    const locationString = updated.join(",");
    setFilters({ location: locationString });
    fetchInternships({ ...filters, location: locationString });
  };

  const handleClear = () => {
    setSelectedLocations([]);
    setFilters({ location: "" });
    fetchInternships({ ...filters, location: "" });
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Location filter"
        >
          <span className="text-gray-700">
            {selectedLocations.length > 0
              ? `${selectedLocations.length} selected`
              : "All locations"}
          </span>
          <i className={`fas fa-chevron-${isOpen ? "up" : "down"} text-gray-400 text-xs`}></i>
        </button>

        {isOpen && (
          <div 
            className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            role="listbox"
            aria-label="Location options"
          >
            {availableLocations.length > 0 ? (
              availableLocations.map((locationName) => (
                <label
                  key={locationName}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer focus-within:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(locationName)}
                    onChange={() => handleToggleLocation(locationName)}
                    className="mr-2.5 h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                    aria-label={`Filter by ${locationName}`}
                  />
                  <span className="text-sm text-gray-700">{locationName}</span>
                </label>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-gray-500 text-center">
                No locations available
              </div>
            )}
          </div>
        )}
      </div>

      {selectedLocations.length > 0 && (
        <button
          onClick={handleClear}
          className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
          aria-label="Clear location filter"
        >
          Clear selection
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  location: state.internships.filters.location,
  filters: state.internships.filters,
  internships: state.internships.items,
});

export default connect(mapStateToProps, { setFilters, fetchInternships })(
  LocationFilter
);
