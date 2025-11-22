'use client';

import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { updateNotes } from "../../lib/redux/modules/tracking";

const NotesEditor = ({ trackingId, initialNotes = "", updateNotes, onClose }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const maxLength = 1000;

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateNotes(trackingId, notes);
    setIsSaving(false);
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    setNotes(initialNotes);
    if (onClose) {
      onClose();
    }
  };

  const remainingChars = maxLength - notes.length;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-editor-title"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner border border-white/30">
                <i className="fas fa-pen-fancy text-white text-lg"></i>
              </div>
              <div>
                <h3 id="notes-editor-title" className="text-xl font-bold text-white tracking-tight">Private Notes</h3>
                <p className="text-blue-100 text-xs font-medium">Only visible to you</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close notes editor"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="relative">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={maxLength}
              placeholder="💭 Jot down anything helpful...&#10;&#10;• Interview preparation tips&#10;• Questions to ask&#10;• Contact information&#10;• Application deadlines&#10;• Company research notes"
              className="w-full h-96 px-6 py-5 text-gray-800 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none font-normal leading-relaxed text-base placeholder-gray-400 shadow-inner"
              aria-label="Private notes"
              aria-describedby="notes-char-count"
              autoFocus
            />

            {/* Floating Character Count */}
            <div
              className="absolute bottom-3 right-3 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200"
              id="notes-char-count"
            >
              <span
                className={`text-xs font-medium ${remainingChars < 50
                    ? "text-red-600"
                    : remainingChars < 100
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                aria-live="polite"
              >
                {notes.length} / {maxLength}
              </span>
            </div>
          </div>

          {/* Helper Text */}
          {notes.length === 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700">
                <i className="fas fa-lightbulb mr-2"></i>
                <strong>Tip:</strong> Use notes to track referrals, recruiter contacts, or special requirements for this opportunity!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <i className="fas fa-shield-alt"></i>
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
              disabled={isSaving}
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              {isSaving ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default connect(null, { updateNotes })(NotesEditor);
