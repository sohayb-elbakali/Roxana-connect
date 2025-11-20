'use client';

import React, { useState } from "react";
import { formatDate } from "../../lib/utils";

const Experience = ({ profile, deleteExperience, isOwnProfile }) => {
  const [hoveredId, setHoveredId] = useState(null);

  if (!profile.experience || profile.experience.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-briefcase text-2xl text-blue-600"></i>
        </div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          No Experience Added
        </h4>
        <p className="text-gray-500 text-sm mb-4">
          Add your work experience to showcase your professional journey
        </p>
        {isOwnProfile && (
          <a
            href="/add-experience"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Experience
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isOwnProfile && (
        <div className="flex justify-end mb-3">
          <a
            href="/add-experience"
            className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            title="Add More Experience"
          >
            <i className="fas fa-plus mr-1.5"></i>
            Add More
          </a>
        </div>
      )}
      {profile.experience.map((experience, index) => (
        <div
          key={experience._id}
          className={`relative bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md ${
            hoveredId === experience._id ? "ring-1 ring-blue-300" : ""
          }`}
          onMouseEnter={() => setHoveredId(experience._id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Delete Button */}
          {deleteExperience && (
            <button
              onClick={() => deleteExperience(experience._id)}
              className={`absolute top-3 right-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 ${
                hoveredId === experience._id ? "opacity-100" : "opacity-0"
              }`}
              title="Delete experience"
            >
              <i className="fas fa-trash text-sm"></i>
            </button>
          )}

          {/* Experience Icon */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-briefcase text-blue-600 text-lg"></i>
            </div>

            <div className="flex-1 min-w-0">
              {/* Job Title */}
              <div className="mb-2">
                <h4 className="text-base font-bold text-gray-900 leading-tight">
                  {experience.title}
                </h4>
                <p className="text-gray-600 font-medium text-sm">
                  {experience.company}
                </p>
              </div>

              {/* Location */}
              {experience.location && (
                <div className="mb-2">
                  <div className="flex items-center text-gray-700 text-sm">
                    <i className="fas fa-map-marker-alt mr-2 text-gray-500"></i>
                    <span className="font-medium">{experience.location}</span>
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-600">
                  <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
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
