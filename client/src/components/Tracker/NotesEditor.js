import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { updateNotes } from "../../redux/modules/tracking";

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
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
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
        <div className="relative bg-[#BFDBFE] p-6 rounded-t-2xl border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                <i className="fas fa-sticky-note text-blue-600 text-lg"></i>
              </div>
              <h3 id="notes-editor-title" className="text-xl font-bold text-gray-900">My Private Notes</h3>
            </div>
            <button
              onClick={handleCancel}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close notes editor"
            >
              <i className="fas fa-times text-gray-600 text-lg"></i>
            </button>
          </div>
          <p className="text-gray-700 text-sm mt-2">
             Keep track of important details - only you can see these notes
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="relative">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={maxLength}
              placeholder="💭 Jot down anything helpful...&#10;&#10;• Interview preparation tips&#10;• Questions to ask&#10;• Contact information&#10;• Application deadlines&#10;• Company research notes"
              className="w-full h-80 px-4 py-4 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none font-normal leading-relaxed"
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
                className={`text-xs font-medium ${
                  remainingChars < 50
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
        <div className="flex items-center justify-between px-6 pb-6">
          <div className="text-xs text-gray-500">
            <i className="fas fa-lock mr-1"></i>
            Private & secure
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Save Notes
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
