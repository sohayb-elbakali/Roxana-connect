'use client';

import { useState } from "react";
import { connect } from "react-redux";
import { setFilters, fetchInternships } from "../../lib/redux/modules/internships";

const TagFilter = ({ tags, setFilters, fetchInternships, filters, internships }) => {
  const [selectedTags, setSelectedTags] = useState(
    tags ? tags.split(",").filter(Boolean) : []
  );

  // Extract unique tags from all internships
  const availableTags = [
    ...new Set(
      internships.flatMap((i) => i.tags || []).filter(Boolean)
    ),
  ].sort();

  const handleToggleTag = (tag) => {
    let updated;
    if (selectedTags.includes(tag)) {
      updated = selectedTags.filter((t) => t !== tag);
    } else {
      updated = [...selectedTags, tag];
    }
    setSelectedTags(updated);
    const tagString = updated.join(",");
    setFilters({ tags: tagString });
    fetchInternships({ ...filters, tags: tagString });
  };

  const handleClear = () => {
    setSelectedTags([]);
    setFilters({ tags: "" });
    fetchInternships({ ...filters, tags: "" });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {availableTags.length > 0 ? (
          availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleToggleTag(tag)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              {tag}
            </button>
          ))
        ) : (
          <p className="text-xs text-gray-500">No tags available</p>
        )}
      </div>

      {selectedTags.length > 0 && (
        <button
          onClick={handleClear}
          className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear tags
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  tags: state.internships.filters.tags,
  filters: state.internships.filters,
  internships: state.internships.items,
});

export default connect(mapStateToProps, { setFilters, fetchInternships })(
  TagFilter
);
