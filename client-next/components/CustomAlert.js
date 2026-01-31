'use client';

import React from "react";

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = "info", // info, confirm, delete, error, success
  confirmText = "OK",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "delete":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          icon: "fa-trash-alt",
          buttonBg: "bg-red-600 hover:bg-red-700",
          headerBg: "bg-gradient-to-r from-red-600 to-red-700",
        };
      case "confirm":
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          icon: "fa-check-circle",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          headerBg: "bg-gradient-to-r from-blue-600 to-blue-700",
        };
      case "error":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          icon: "fa-exclamation-circle",
          buttonBg: "bg-red-600 hover:bg-red-700",
          headerBg: "bg-gradient-to-r from-red-600 to-red-700",
        };
      case "success":
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          icon: "fa-check-circle",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          headerBg: "bg-gradient-to-r from-blue-600 to-blue-700",
        };
      default:
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          icon: "fa-info-circle",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          headerBg: "bg-gradient-to-r from-blue-600 to-blue-700",
        };
    }
  };

  const styles = getTypeStyles();
  const hasConfirm = type === "confirm" || type === "delete";

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
        {/* Header with gradient */}
        <div className={`${styles.headerBg} px-6 py-4`}>
          <div className={`w-14 h-14 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto`}>
            <i className={`fas ${styles.icon} ${styles.iconColor} text-2xl`}></i>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
            {title}
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className={`flex gap-3 ${hasConfirm ? 'justify-center' : 'justify-center'}`}>
            {hasConfirm && (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:cursor-pointer"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg text-white ${styles.buttonBg} transition-all duration-200 shadow-sm hover:shadow-md hover:cursor-pointer`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CustomAlert;
