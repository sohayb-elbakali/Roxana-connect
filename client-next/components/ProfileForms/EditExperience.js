'use client';

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { updateExperience } from "../../lib/redux/modules/profiles";

const EditExperience = ({ updateExperience, profile }) => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const { company, title, location, from, to, current, description } = formData;

  useEffect(() => {
    if (profile && profile.experience) {
      const experience = profile.experience.find(exp => exp._id === id);
      if (experience) {
        setFormData({
          company: experience.company || "",
          title: experience.title || "",
          location: experience.location || "",
          from: experience.from ? new Date(experience.from).toISOString().split('T')[0] : "",
          to: experience.to ? new Date(experience.to).toISOString().split('T')[0] : "",
          current: experience.current || false,
          description: experience.description || "",
        });
      }
    }
  }, [profile, id]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateExperience(id, formData, router.push);
    } catch (error) {
      console.error("Error updating experience:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-16">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 mt-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fas fa-briefcase text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Edit Experience
          </h2>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              placeholder="* Job Title (e.g., Software Engineer)"
              name="title"
              value={title}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="* Company Name"
              name="company"
              value={company}
              onChange={onChange}
              required
              className="text-gray-900 bg-white w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Location (e.g., New York, NY)"
              name="location"
              value={location}
              onChange={onChange}
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
              checked={current}
              value={current}
              onChange={() => setFormData({ ...formData, current: !current })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="current" className="ml-2 text-sm text-gray-700">
              I currently work here
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
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform hover:cursor-pointer"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save Changes
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

EditExperience.propTypes = {
  updateExperience: PropTypes.func.isRequired,
  profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.profiles.profile,
});

export default connect(mapStateToProps, { updateExperience })(EditExperience);
