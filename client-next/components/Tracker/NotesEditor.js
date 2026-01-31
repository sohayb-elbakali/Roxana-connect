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
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-editor-title"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <i className="fas fa-sticky-note text-white text-lg"></i>
              </div>
              <div>
                <h3 id="notes-editor-title" className="text-lg font-bold text-white">Add Notes</h3>
                <p className="text-blue-100 text-xs">Private to you</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:cursor-pointer"
              aria-label="Close notes editor"
            >
              <i className="fas fa-times"></i>
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
              placeholder="Add your notes here...&#10;&#10;• Interview tips&#10;• Contact info&#10;• Important dates&#10;• Research notes"
              className="w-full h-48 px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none text-sm leading-relaxed placeholder-gray-400"
              aria-label="Private notes"
              aria-describedby="notes-char-count"
              autoFocus
            />

            {/* Character Count */}
            <div
              className="absolute bottom-2 right-2 px-2.5 py-1 bg-white rounded-lg shadow-sm border border-gray-200"
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all hover:cursor-pointer"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center shadow-md hover:cursor-pointer"
          >
            {isSaving ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Notes
              </>
            )}
          </button>
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
