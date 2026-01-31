'use client';

import { useState } from "react";
import { connect } from "react-redux";
import { trackInternship, updateTrackingStatus } from "../../lib/redux/modules/tracking";

const ApplyNowButton = ({
  internship,
  tracking,
  trackInternship,
  updateTrackingStatus,
  className = "",
  size = "md",
}) => {
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const { _id, applicationLink, company, name } = internship;

  // Check if user is tracking this internship
  const trackingRecord = tracking.items.find(
    (item) => item.internship?._id === _id || item.internship === _id
  );
  const isTracking = !!trackingRecord;

  // Determine button size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const handleApplyClick = (e) => {
    // If no application link, show contact info modal
    if (!applicationLink) {
      e.preventDefault();
      setShowContactInfo(true);
      return;
    }

    // If link exists, prompt to update status after a short delay
    setTimeout(() => {
      setShowStatusPrompt(true);
    }, 500);
  };

  const handleStatusUpdate = (status) => {
    if (isTracking) {
      // Update existing tracking record
      const applicationDate = status === "applied" ? new Date().toISOString() : null;
      updateTrackingStatus(trackingRecord._id, status, applicationDate);
    } else {
      // Create new tracking record with status
      const applicationDate = status === "applied" ? new Date().toISOString() : null;
      trackInternship(_id, status, applicationDate);
    }
    setShowStatusPrompt(false);
  };

  const handleSkipStatusUpdate = () => {
    setShowStatusPrompt(false);
  };

  const handleCloseContactInfo = () => {
    setShowContactInfo(false);
  };

  // Application link availability indicator
  const hasApplicationLink = !!applicationLink;

  return (
    <>
      <a
        href={applicationLink || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 hover:cursor-pointer ${
          hasApplicationLink
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            : "bg-gray-300 text-gray-600 hover:bg-gray-400"
        } ${sizeClasses[size]} ${className}`}
        onClick={handleApplyClick}
      >
        <i className={`fas ${hasApplicationLink ? "fa-external-link-alt" : "fa-info-circle"} mr-2`}></i>
        {hasApplicationLink ? "Apply Now" : "Contact Info"}
      </a>

      {/* Status Update Prompt Modal */}
      {showStatusPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <i className="fas fa-clipboard-check text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Update Application Status
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Did you submit your application to <span className="font-semibold">{company}</span>?
              Update your tracking status to keep your progress organized.
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleStatusUpdate("applied")}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-colors hover:cursor-pointer"
              >
                <div className="flex items-center">
                  <i className="fas fa-paper-plane text-blue-600 mr-3"></i>
                  <div>
                    <div className="font-semibold text-gray-900">Applied</div>
                    <div className="text-xs text-gray-600">I submitted my application</div>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-blue-600"></i>
              </button>

              <button
                onClick={() => handleStatusUpdate("not_applied")}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-lg transition-colors hover:cursor-pointer"
              >
                <div className="flex items-center">
                  <i className="fas fa-bookmark text-gray-600 mr-3"></i>
                  <div>
                    <div className="font-semibold text-gray-900">Track Only</div>
                    <div className="text-xs text-gray-600">I'll apply later</div>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-600"></i>
              </button>
            </div>

            <button
              onClick={handleSkipStatusUpdate}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors hover:cursor-pointer"
            >
              Skip for Now
            </button>
          </div>
        </div>
      )}

      {/* Contact Info Modal (when no application link) */}
      {showContactInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <i className="fas fa-info-circle text-yellow-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No Application Link Available
              </h3>
            </div>

            <p className="text-gray-600 mb-4">
              This internship opportunity doesn't have a direct application link.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Company Information</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <i className="fas fa-building text-blue-600 mr-2 w-5"></i>
                  <span className="font-medium">{company}</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-user text-blue-600 mr-2 w-5 mt-0.5"></i>
                  <div>
                    <div className="text-xs text-gray-500">Posted by</div>
                    <div className="font-medium">{name}</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Try searching for "{company} careers" or contact the person who posted this opportunity for more information.
            </p>

            <button
              onClick={handleCloseContactInfo}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  tracking: state.tracking,
});

export default connect(mapStateToProps, { trackInternship, updateTrackingStatus })(
  ApplyNowButton
);
