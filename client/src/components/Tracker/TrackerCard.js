import { useState } from "react";
import { Link } from "react-router-dom";
import StatusSelector from "./StatusSelector";
import NotesEditor from "./NotesEditor";
import QuickActionsMenu from "./QuickActionsMenu";
import DeadlineBadge from "../Internships/DeadlineBadge";

const TrackerCard = ({ tracking }) => {
  const [showNotesEditor, setShowNotesEditor] = useState(false);

  const { _id, internship, status, privateNotes } = tracking;

  // Handle case where internship might be populated or just an ID
  const internshipData =
    typeof internship === "object" ? internship : { _id: internship };

  const {
    company = "Unknown Company",
    positionTitle = "Unknown Position",
    applicationDeadline,
  } = internshipData;

  // Truncate notes for preview
  const getNotesPreview = () => {
    if (!privateNotes) return "No notes added";
    if (privateNotes.length <= 80) return privateNotes;
    return privateNotes.substring(0, 80) + "...";
  };

  return (
    <>
      <div className="bg-white rounded-xl hover:shadow-lg transition-all duration-300 p-4 group border-2 border-gray-100 hover:border-blue-400 cursor-pointer">
        {/* Header with Quick Actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{company}</h3>
            <p className="text-xs font-medium text-gray-600 line-clamp-1">
              {positionTitle}
            </p>
          </div>
          <QuickActionsMenu trackingId={_id} />
        </div>

        {/* Deadline Badge */}
        {applicationDeadline && (
          <div className="mb-3">
            <DeadlineBadge deadline={applicationDeadline} size="sm" />
          </div>
        )}

        {/* Quick Info Pills */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {privateNotes && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-200">
              <i className="fas fa-sticky-note"></i>
              <span>Notes</span>
            </span>
          )}
        </div>

        {/* Status Selector */}
        <div className="mb-3">
          <StatusSelector trackingId={_id} currentStatus={status} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/internship/${internshipData._id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
          >
            <i className="fas fa-arrow-right"></i>
            <span>View</span>
          </Link>
          <button
            onClick={() => setShowNotesEditor(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 relative"
          >
            <i className="fas fa-edit"></i>
            <span>Notes</span>
            {privateNotes && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Notes Editor Modal */}
      {showNotesEditor && (
        <NotesEditor
          trackingId={_id}
          initialNotes={privateNotes || ""}
          onClose={() => setShowNotesEditor(false)}
        />
      )}
    </>
  );
};

export default TrackerCard;
