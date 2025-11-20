'use client';

import { useState } from "react";
import { connect } from "react-redux";
import { untrackInternship } from "../../lib/redux/modules/tracking";

const QuickActionsMenu = ({ trackingId, untrackInternship }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRemove = async () => {
    await untrackInternship(trackingId);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group-hover:opacity-100 opacity-0"
        aria-label="Remove from tracker"
        title="Remove from tracker"
      >
        <i className="fas fa-trash text-sm"></i>
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-3 mr-4">
                <i className="fas fa-trash-alt text-red-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Remove Application?
              </h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              This will permanently remove this application from your tracker. This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-sm"
              >
                <i className="fas fa-trash mr-2"></i>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default connect(null, { untrackInternship })(QuickActionsMenu);
