import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { showAlertMessage } from "../../redux/modules/alerts";
import { register } from "../../redux/modules/users";

const Register = ({ isAuthenticated, register, showAlertMessage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    return setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      showAlertMessage("Passwords do not match", "error");
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 pt-16">
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-2xl border border-purple-100 p-10 mt-8 flex flex-col items-center relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4 shadow-lg">
          <i className="fas fa-user-plus text-white text-3xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6 mt-8 tracking-tight">
          Sign Up
        </h2>
        <form className="space-y-6 w-full" onSubmit={onSubmit}>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={onChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
            minLength={6}
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={password2}
            onChange={onChange}
            required
            minLength={6}
          />
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all text-lg mt-2"
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="mt-8 text-center text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  showAlertMessage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
  };
};

export default connect(mapStateToProps, { showAlertMessage, register })(
  Register
);
