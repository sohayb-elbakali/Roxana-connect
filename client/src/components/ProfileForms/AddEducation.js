import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addEducation } from "../../redux/modules/profiles";

const AddEducation = ({ addEducation }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
  });

  const { school, degree, fieldofstudy, from, to, current } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    addEducation(formData, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 pt-16">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Add Education
        </h2>
        <p className="text-center text-gray-500 mb-6">* = required field</p>
        <form className="space-y-5" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="* School"
            name="school"
            value={school}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            value={degree}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="text"
            placeholder="Field of Study"
            name="fieldofstudy"
            value={fieldofstudy}
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
              value={current}
              checked={current}
              onChange={() => setFormData({ ...formData, current: !current })}
              className="mr-2"
            />
            <span className="text-gray-700">Current School</span>
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
              Add Education
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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
