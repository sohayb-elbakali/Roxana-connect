import React from "react";
import { Link } from "react-router-dom";
import LandingTitle from "./LandingTitle";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-roxanaPurple-light to-roxanaPink-light pt-16">
      <div className="w-full max-w-2xl mx-auto text-center p-8 bg-white bg-opacity-90 rounded-xl shadow-lg mt-12">
        <div className="flex flex-col items-center mb-4">
          <span className="text-6xl mb-2">💡</span>
          <h1 className="text-5xl font-extrabold text-roxanaPurple-dark mb-2 tracking-tight">
            Roxana
          </h1>
        </div>
        <p className="text-xl text-roxanaGray font-semibold mb-4">
          Innovate. Inspire. Impact.
        </p>
        <p className="text-lg text-gray-500 mb-6">
          The first platform for engineers and developers in the Arab World to
          showcase their talents, connect with peers, and unlock new
          opportunities.
        </p>
        <LandingTitle />
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-roxanaPurple to-roxanaPink text-white font-semibold shadow hover:from-roxanaPurple-dark hover:to-roxanaPink-dark transition-all text-lg flex items-center justify-center gap-2"
          >
            <i className="fas fa-user-plus"></i> Sign Up
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-white border border-roxanaPurple text-roxanaPurple font-semibold shadow hover:bg-roxanaPurple-light/20 transition-all text-lg flex items-center justify-center gap-2"
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
