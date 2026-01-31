'use client';

import React, { useState } from "react";
import { formatDate } from "../../lib/utils";
import EducationModal from "../ProfileForms/EducationModal";

const Education = ({ profile, deleteEducation, isOwnProfile }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  if (!profile.education || profile.education.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <i className="fas fa-graduation-cap text-3xl text-blue-500"></i>
          </div>
          <h4 className="text-lg font-bold text-gray-700 mb-2">
            No Education Added
          </h4>
          <p className="text-gray-500 text-sm mb-6">
            Add your educational background to showcase your qualifications
          </p>
          {isOwnProfile && (
            <button
              onClick={() => {
                setEditingEducation(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 transform hover:cursor-pointer"
            >
              <i className="fas fa-plus"></i>
              Add Education
            </button>
          )}
        </div>

        {/* Education Modal */}
        {isOwnProfile && (
          <EducationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingEducation(null);
            }}
            education={editingEducation}
            userId={profile.user?._id}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-4">
      {isOwnProfile && (
        <div className="flex justify-end mb-3">
          <button
            onClick={() => {
              setEditingEducation(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 transform hover:cursor-pointer"
            title="Add More Education"
          >
            <i className="fas fa-plus"></i>
            Add More
          </button>
        </div>
      )}
      {profile.education.map((education, index) => (
        <div
          key={education._id}
          className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200/50 hover:border-blue-300 transition-all duration-200 hover:shadow-md ${
            hoveredId === education._id ? "ring-2 ring-blue-300" : ""
          }`}
          onMouseEnter={() => setHoveredId(education._id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Action Buttons */}
          {deleteEducation && (
            <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-200 ${
              hoveredId === education._id ? "opacity-100" : "opacity-0"
            }`}>
              <button
                onClick={() => {
                  setEditingEducation(education);
                  setIsModalOpen(true);
                }}
                className="p-2.5 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow hover:cursor-pointer"
                title="Edit education"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => deleteEducation(education._id)}
                className="p-2.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow hover:cursor-pointer"
                title="Delete education"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          )}

          {/* Education Icon */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-sm">
              <i className="fas fa-graduation-cap text-blue-500 text-xl"></i>
            </div>

            <div className="flex-1 min-w-0">
              {/* Degree and Field */}
              <div className="mb-3">
                <h4 className="text-base font-bold text-gray-900 leading-tight">
                  {education.degree}
                </h4>
                <p className="text-gray-600 font-semibold text-sm">
                  {education.fieldofstudy}
                </p>
              </div>

              {/* School */}
              <div className="mb-3">
                <div className="flex items-center text-gray-700 text-sm">
                  <i className="fas fa-university mr-2 text-blue-500"></i>
                  <span className="font-medium">{education.school}</span>
                </div>
              </div>

              {/* Date Range */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-600 font-semibold">
                  <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                  <span>
                    {formatDate(education.from)} -{" "}
                    {education.current ? (
                      <span className="text-green-600 font-bold">
                        Current
                      </span>
                    ) : (
                      formatDate(education.to)
                    )}
                  </span>
                </div>

                {/* Status Badge */}
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                    education.current
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {education.current ? "Current" : "Completed"}
                </div>
              </div>

              {/* Description if available */}
              {education.description && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200/50 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {education.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Education Modal */}
      <EducationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEducation(null);
        }}
        education={editingEducation}
        userId={profile.user?._id}
      />
    </div>
  );
};

export default Education;
