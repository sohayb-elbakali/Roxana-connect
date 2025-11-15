import { useState } from "react";
import { connect } from "react-redux";
import { updateTrackingStatus } from "../../redux/modules/tracking";

const StatusSelector = ({ trackingId, currentStatus, updateTrackingStatus }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const statusOptions = [
    { value: "not_applied", label: "Saved", color: "text-gray-700", bgColor: "bg-gray-50", icon: "fa-bookmark" },
    { value: "applied", label: "Applied", color: "text-blue-700", bgColor: "bg-blue-50", icon: "fa-check" },
    { value: "interviewing", label: "Interview", color: "text-purple-700", bgColor: "bg-purple-50", icon: "fa-user-tie" },
    { value: "offer_received", label: "Offer Received", color: "text-yellow-700", bgColor: "bg-yellow-50", icon: "fa-star" },
    { value: "rejected", label: "Rejected", color: "text-red-700", bgColor: "bg-red-50", icon: "fa-times" },
    { value: "accepted", label: "Accepted", color: "text-green-700", bgColor: "bg-green-50", icon: "fa-check-circle" },
    { value: "declined", label: "Declined", color: "text-gray-700", bgColor: "bg-gray-100", icon: "fa-ban" },
  ];

  const getCurrentStatusInfo = () => {
    return statusOptions.find((opt) => opt.value === currentStatus) || statusOptions[0];
  };

  const needsConfirmation = (status) => {
    return ["rejected", "accepted", "declined"].includes(status);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    
    if (newStatus === currentStatus) return;

    if (needsConfirmation(newStatus)) {
      setPendingStatus(newStatus);
      setShowConfirmation(true);
    } else {
      updateStatus(newStatus);
    }
  };

  const updateStatus = (status) => {
    const applicationDate = status === "applied" ? new Date().toISOString() : null;
    updateTrackingStatus(trackingId, status, applicationDate);
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  const handleConfirm = () => {
    if (pendingStatus) {
      updateStatus(pendingStatus);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  const currentStatusInfo = getCurrentStatusInfo();

  return (
    <div className="relative">
      <div className="relative">
        <select
          value={currentStatus}
          onChange={handleStatusChange}
          className={`block w-full pl-3 pr-8 py-2.5 text-xs font-bold ${currentStatusInfo.color} ${currentStatusInfo.bgColor} border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:shadow-md transition-all appearance-none`}
          aria-label="Application status"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <i className="fas fa-chevron-down text-xs"></i>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-confirm-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-slideUp">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-3 mr-4" aria-hidden="true">
                <i className="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
              </div>
              <h3 id="status-confirm-title" className="text-lg font-bold text-slate-900">
                Confirm Status Change
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to change the status to{" "}
              <span className="font-semibold">
                {statusOptions.find((opt) => opt.value === pendingStatus)?.label}
              </span>
              ? This action will update your application tracking.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="Cancel status change"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                aria-label="Confirm status change"
              >
                <i className="fas fa-check mr-2"></i>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(null, { updateTrackingStatus })(StatusSelector);
