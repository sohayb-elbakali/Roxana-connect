import React, { useState } from "react";
import { formatDate } from "../../utils";

const Experience = ({ profile, deleteExperience }) => {
  const [hoveredId, setHoveredId] = useState(null);

  if (!profile.experience || profile.experience.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-briefcase text-2xl text-purple-500"></i>
        </div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          No Experience Added
        </h4>
        <p className="text-gray-500 text-sm">
          Add your work experience to showcase your professional journey
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {profile.experience.map((experience, index) => (
        <div
          key={experience._id}
          className={`relative bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
            hoveredId === experience._id ? "ring-2 ring-purple-200" : ""
          }`}
          onMouseEnter={() => setHoveredId(experience._id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Delete Button */}
          {deleteExperience && (
            <button
              onClick={() => deleteExperience(experience._id)}
              className={`absolute top-3 right-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 ${
                hoveredId === experience._id ? "opacity-100" : "opacity-0"
              }`}
              title="Delete experience"
            >
              <i className="fas fa-trash text-sm"></i>
            </button>
          )}

          {/* Experience Icon */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <i className="fas fa-briefcase text-white text-lg"></i>
            </div>

            <div className="flex-1 min-w-0">
              {/* Job Title */}
              <div className="mb-2">
                <h4 className="text-lg font-bold text-gray-900 leading-tight">
                  {experience.title}
                </h4>
                <p className="text-purple-600 font-medium">
                  {experience.company}
                </p>
              </div>

              {/* Location */}
              {experience.location && (
                <div className="mb-3">
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-map-marker-alt mr-2 text-purple-500"></i>
                    <span className="font-medium">{experience.location}</span>
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-calendar-alt mr-2 text-purple-500"></i>
                  <span>
                    {formatDate(experience.from)} -{" "}
                    {experience.current ? (
                      <span className="text-green-600 font-medium">
                        Current
                      </span>
                    ) : (
                      formatDate(experience.to)
                    )}
                  </span>
                </div>

                {/* Status Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    experience.current
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {experience.current ? "Current" : "Completed"}
                </div>
              </div>

              {/* Description if available */}
              {experience.description && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {experience.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Experience;
