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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 pt-16">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Add Experience
        </h2>
        <p className="text-center text-gray-500 mb-6">* = required field</p>
        <form className="space-y-5" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="* Job Title"
            name="title"
            value={title}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="text"
            placeholder="* Company"
            name="company"
            value={company}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={() => setFormData({ ...formData, current: !current })}
              className="mr-2"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-100"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto py-3 px-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all text-lg"
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
