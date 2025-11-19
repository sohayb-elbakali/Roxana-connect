import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAccount } from "../redux/modules/profiles";
import { resendVerification, loadUser } from "../redux/modules/users";
import { api } from "../utils";

function Settings({ deleteAccount, resendVerification, loadUser, user }) {
  const [isResending, setIsResending] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // Reload user data when component mounts to get updated verification status
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleResendVerification = async () => {
    setIsResending(true);
    await resendVerification();
    setIsResending(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordMessage({ type: "", text: "" });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await api.put("/users/update-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordMessage({ type: "success", text: res.data.msg || "Password updated successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Auto-hide modal after success
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMessage({ type: "", text: "" });
      }, 2000);
    } catch (err) {
      setPasswordMessage({ 
        type: "error", 
        text: err.response?.data?.msg || 
              err.response?.data?.errors?.[0]?.msg || 
              "Failed to update password"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-cog text-blue-600 text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 mb-4">
            Manage your account and profile settings
          </p>
        </div>

        <div className="space-y-4">
          {/* Account Information Card */}
          {user && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user text-blue-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Account Information
                </h3>
              </div>
              
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-user-circle text-gray-400 w-5"></i>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-envelope text-gray-400 w-5"></i>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  {user.verified ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <i className="fas fa-check-circle mr-1"></i>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <i className="fas fa-clock mr-1"></i>
                      Pending
                    </span>
                  )}
                </div>

                {/* Account Created */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-calendar-alt text-gray-400 w-5"></i>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(user.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password & Security Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-purple-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-key text-purple-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Password & Security
                  </h3>
                  <p className="text-sm text-gray-600">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-sm"
              >
                <i className="fas fa-edit mr-2"></i>
                Change Password
              </button>
            </div>
          </div>

          {/* Email Verification Card - Only show if not verified */}
          {user && !user.verified && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-300 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-yellow-600 text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Email Verification
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your email address is not verified. Check your inbox or resend the verification email.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <i className="fas fa-envelope mr-1"></i>
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200 shadow-sm ${
                    isResending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Resend Email
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Add Education Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-blue-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Education
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add or manage your educational background
                  </p>
                </div>
              </div>
              <Link
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
                to="/add-education"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Education
              </Link>
            </div>
          </div>

          {/* Add Experience Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-briefcase text-blue-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Experience
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add or manage your work experience
                  </p>
                </div>
              </div>
              <Link
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
                to="/add-experience"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Experience
              </Link>
            </div>
          </div>

          {/* Delete Account Card */}
          <div className="bg-white rounded-xl border border-red-300 shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    )
                  ) {
                    deleteAccount();
                  }
                }}
              >
                <i className="fas fa-trash mr-2"></i>
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Background overlay */}
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
                aria-hidden="true"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setPasswordMessage({ type: "", text: "" });
                }}
              ></div>

              {/* Center modal */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-key text-white text-lg"></i>
                      </div>
                      <h3 className="text-xl font-bold text-white" id="modal-title">
                        Change Password
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setPasswordMessage({ type: "", text: "" });
                      }}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={handlePasswordSubmit} className="px-6 py-6">
                  {/* Success/Error Messages */}
                  {passwordMessage.text && (
                    <div className={`mb-4 rounded-lg p-4 ${
                      passwordMessage.type === "success" 
                        ? "bg-green-50 border border-green-200" 
                        : "bg-red-50 border border-red-200"
                    }`}>
                      <div className="flex items-start">
                        <i className={`fas ${
                          passwordMessage.type === "success" 
                            ? "fa-check-circle text-green-600" 
                            : "fa-exclamation-circle text-red-600"
                        } mt-0.5 mr-3`}></i>
                        <p className={`text-sm ${
                          passwordMessage.type === "success" 
                            ? "text-green-800" 
                            : "text-red-800"
                        }`}>
                          {passwordMessage.text}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-lock mr-2 text-gray-400"></i>
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter your current password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-key mr-2 text-gray-400"></i>
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        placeholder="Enter new password (min 6 characters)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i>
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-check-circle mr-2 text-gray-400"></i>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Confirm your new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setPasswordMessage({ type: "", text: "" });
                      }}
                      className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-sm ${
                        passwordLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {passwordLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check mr-2"></i>
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.users.user,
});

export default connect(mapStateToProps, { deleteAccount, resendVerification, loadUser })(Settings);
