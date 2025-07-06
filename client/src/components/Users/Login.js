import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { login } from "../../redux/modules/users";

const Login = ({ isAuthenticated, login }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    return setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 pt-16">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Sign In
        </h2>
        <form className="space-y-5" onSubmit={onSubmit}>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
          />
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all text-lg"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-700">
          New to Roxana?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
  };
};

export default connect(mapStateToProps, { login })(Login);
