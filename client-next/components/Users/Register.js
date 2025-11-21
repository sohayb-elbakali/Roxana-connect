'use client';

import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showAlertMessage } from "../../lib/redux/modules/alerts";
import { register } from "../../lib/redux/modules/users";

const Register = ({ isAuthenticated, register, showAlertMessage }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10">
          {/* Logo/Brand */}
          <Link href="/" className="block text-center mb-10 group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
              <i className="fas fa-briefcase text-white text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Roxana <span className="text-blue-600">Connect</span>
            </h1>
            <p className="text-gray-600 text-base">Create your account</p>
          </Link>

          {/* Form */}
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base text-gray-900 bg-white placeholder-gray-400"
                type="text"
                name="name"
                placeholder="John Doe"
                value={name}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base text-gray-900 bg-white placeholder-gray-400"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base text-gray-900 bg-white placeholder-gray-400"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={onChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base text-gray-900 bg-white placeholder-gray-400"
                type="password"
                name="password2"
                placeholder="Re-enter password"
                value={password2}
                onChange={onChange}
                required
                minLength={6}
              />
            </div>

            <button
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 text-base mt-8 transform hover:-translate-y-0.5"
              type="submit"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600 text-base">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-bold"
              >
                Sign in
              </Link>
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
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
