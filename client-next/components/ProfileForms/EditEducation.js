'use client';

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { updateEducation } from "../../lib/redux/modules/profiles";

const EditEducation = ({ updateEducation, profile }) => {
  const router = useRouter();
  const { id } = useParams();
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

  useEffect(() => {
    if (profile && profile.education) {
      const education = profile.education.find(edu => edu._id === id);
      if (education) {
        setFormData({
          school: education.school || "",
          degree: education.degree || "",
          fieldofstudy: education.fieldofstudy || "",
          from: education.from ? new Date(education.from).toISOString().split('T')[0] : "",
          to: education.to ? new Date(education.to).toISOString().split('T')[0] : "",
          current: education.current || false,
          description: education.description || "",
        });
      }
    }
  }, [profile, id]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    updateEducation(id, formData, router.push);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 lg:pl-16">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm p-8 mt-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-graduation-cap text-blue-600 text-xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Education
          </h2>
          <p className="text-gray-600 text-sm">* = required field</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              placeholder="* School or University"
              name="school"
              value={school}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="* Degree or Certificate"
              name="degree"
              value={degree}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="* Field of Study (e.g., Computer Science)"
              name="fieldofstudy"
              value={fieldofstudy}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                name="from"
                value={from}
                onChange={onChange}
                className="text-gray-900 bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                name="to"
                value={to}
                onChange={onChange}
                disabled={current}
                className="text-gray-900 bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="current" className="ml-2 text-sm text-gray-700">
              I currently study here
            </label>
          </div>

          <div>
            <textarea
              placeholder="Description (optional)"
              name="description"
              value={description}
              onChange={onChange}
              rows="4"
              className="text-gray-900 bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200"
            >
              <i className="fas fa-save mr-2"></i>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditEducation.propTypes = {
  updateEducation: PropTypes.func.isRequired,
  profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.profiles.profile,
});

export default connect(mapStateToProps, { updateEducation })(EditEducation);
