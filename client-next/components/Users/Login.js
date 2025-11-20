'use client';

import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../../lib/redux/modules/users";

const Login = ({ isAuthenticated, login }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const onChange = (e) => {
    return setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8 mt-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-lock text-blue-600 text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sign In
          </h2>
          <p className="text-gray-600 text-sm">Welcome back to Roxana</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-gray-900 bg-white"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <input
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-gray-900 bg-white"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-all text-base mt-6"
            type="submit"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          New to Roxana?{" "}
          <Link href="/register"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Create an account
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
