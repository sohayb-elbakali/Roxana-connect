'use client';

import { useState } from "react";
import { connect } from "react-redux";
import { addEducation, updateEducation } from "../../lib/redux/modules/profiles";

const EducationModal = ({ isOpen, onClose, addEducation, updateEducation, education = null, userId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    school: education?.school || "",
    degree: education?.degree || "",
    fieldofstudy: education?.fieldofstudy || "",
    from: education?.from ? new Date(education.from).toISOString().split('T')[0] : "",
    to: education?.to ? new Date(education.to).toISOString().split('T')[0] : "",
    current: education?.current || false,
    description: education?.description || "",
  });

  const { school, degree, fieldofstudy, from, to, current, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (education) {
        // Update existing education
        await updateEducation(education._id, formData, (path) => {
          // Don't navigate, just close modal
          onClose();
        });
      } else {
        // Add new education
        await addEducation(formData, (path) => {
          // Don't navigate, just close modal
          onClose();
        });
      }
    } catch (error) {
      console.error("Error saving education:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {education ? "Edit Education" : "Add Education"}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:cursor-pointer"
            >
              <i className="fas fa-times text-white text-lg"></i>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="p-8 space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              School or University *
            </label>
            <input
              type="text"
              placeholder="e.g., Harvard University"
              name="school"
              value={school}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Degree or Certificate *
            </label>
            <input
              type="text"
              placeholder="e.g., Bachelor's Degree"
              name="degree"
              value={degree}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Field of Study *
            </label>
            <input
              type="text"
              placeholder="e.g., Computer Science"
              name="fieldofstudy"
              value={fieldofstudy}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="from"
                value={from}
                onChange={onChange}
                className="text-gray-900 bg-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="to"
                value={to}
                onChange={onChange}
                disabled={current}
                className="text-gray-900 bg-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="flex items-center py-2">
            <input
              type="checkbox"
              name="current"
              id="current"
              value={current}
              checked={current}
              onChange={() => setFormData({ ...formData, current: !current })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="current" className="ml-3 text-sm font-semibold text-gray-700">
              I currently study here
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your studies and achievements..."
              name="description"
              value={description}
              onChange={onChange}
              rows="4"
              className="text-gray-900 bg-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform hover:cursor-pointer"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  {education ? "Update Education" : "Add Education"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default connect(null, { addEducation, updateEducation })(EducationModal);
