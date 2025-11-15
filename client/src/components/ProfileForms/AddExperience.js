import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addExperience } from "../../redux/modules/profiles";

const AddExperience = ({ addExperience }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    location: "",
    from: "",
    to: "",
    current: false,
  });

  const { company, title, location, from, to, current } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    addExperience(formData, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 lg:pl-16">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm p-8 mt-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-briefcase text-blue-600 text-xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Add Experience
          </h2>
          <p className="text-gray-600 text-sm">* = required field</p>
        </div>
        <form className="space-y-5" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="* Job Title"
            name="title"
            value={title}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="* Company"
            name="company"
            value={company}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div>
            <label className="block text-left text-gray-700 font-medium mb-1">
              From Date
            </label>
            <input
              type="date"
              name="from"
              value={from}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={() => setFormData({ ...formData, current: !current })}
              className="mr-2 text-blue-600 focus:ring-blue-600"
            />
            <span className="text-gray-700">Current Job</span>
          </div>
          <div>
            <label className="block text-left text-gray-700 font-medium mb-1">
              To Date
            </label>
            <input
              type="date"
              name="to"
              value={to}
              onChange={onChange}
              disabled={current}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto py-3 px-8 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-all text-lg"
            >
              Add Experience
            </button>
            <Link
              className="w-full sm:w-auto py-3 px-8 rounded-lg bg-gray-100 text-purple-700 font-semibold shadow hover:bg-purple-50 transition-all text-lg text-center"
              to="/home"
            >
              Go Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
};

export default connect(null, { addExperience })(AddExperience);
