'use client';

import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
import { addEducation } from "../../lib/redux/modules/profiles";

const AddEducation = ({ addEducation }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const { school, degree, fieldofstudy, from, to, current, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addEducation(formData, router.push);
    } catch (error) {
      console.error("Error adding education:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 pt-20 lg:pl-16">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8 mt-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <i className="fas fa-graduation-cap text-blue-500 text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Add Education
          </h2>
          <p className="text-gray-600 text-sm">Add your educational background</p>
        </div>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              School or University <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Harvard University"
              name="school"
              value={school}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Degree or Certificate <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Bachelor's Degree"
              name="degree"
              value={degree}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Field of Study <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Computer Science"
              name="fieldofstudy"
              value={fieldofstudy}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="from"
                value={from}
                onChange={onChange}
                className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="to"
                value={to}
                onChange={onChange}
                disabled={current}
                className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="flex items-center py-3 px-4 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              name="current"
              id="current"
              value={current}
              checked={current}
              onChange={() => setFormData({ ...formData, current: !current })}
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500 hover:cursor-pointer"
            />
            <label htmlFor="current" className="ml-3 text-sm font-medium text-gray-700 hover:cursor-pointer">
              I currently study here
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              placeholder="Tell us about your studies, achievements, or relevant coursework..."
              name="description"
              value={description}
              onChange={onChange}
              rows="4"
              className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-sm hover:border-gray-400"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transform hover:cursor-pointer"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Adding...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Add Education
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
