'use client';

import { useState } from "react";
import Link from "next/link";
import StatusSelector from "./StatusSelector";
import NotesEditor from "./NotesEditor";
import QuickActionsMenu from "./QuickActionsMenu";
import DeadlineBadge from "../Internships/DeadlineBadge";

const TrackerCard = ({ tracking }) => {
  const [showNotesEditor, setShowNotesEditor] = useState(false);

  const { _id, internship, status, privateNotes } = tracking;

  // Handle case where internship might be populated, just an ID, or null
  const internshipData =
    typeof internship === "object" && internship !== null
      ? internship
      : internship
        ? { _id: internship }
        : { _id: null };

  const {
    company = "Deleted Internship",
    positionTitle = "This internship has been removed",
    applicationDeadline,
  } = internshipData || {};

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 group border border-gray-100/50 hover:border-blue-300 cursor-pointer relative overflow-hidden">
        {/* Hover Accent */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Header with Quick Actions */}
        <div className="flex items-start justify-between mb-3 pl-2">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">{company}</h3>
            <p className="text-xs font-semibold text-gray-500 line-clamp-1">
              {positionTitle}
            </p>
          </div>
          <QuickActionsMenu trackingId={_id} />
        </div>

        {/* Deadline Badge */}
        {applicationDeadline && (
          <div className="mb-3 pl-2">
            <DeadlineBadge deadline={applicationDeadline} size="sm" />
          </div>
        )}

        {/* Quick Info Pills */}
        <div className="flex items-center gap-2 mb-4 flex-wrap pl-2">
          {privateNotes && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 rounded-xl text-[10px] font-bold border border-yellow-200/50 shadow-sm">
              <i className="fas fa-sticky-note"></i>
              <span>Has Notes</span>
            </span>
          )}
        </div>

        {/* Status Selector */}
        <div className="mb-4 pl-2">
          <StatusSelector trackingId={_id} currentStatus={status} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pl-2">
          {internshipData._id ? (
            <Link href={`/internship/${internshipData._id}`}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow"
            >
              <i className="fas fa-external-link-alt"></i>
              <span>View</span>
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-gray-400 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed"
            >
              <i className="fas fa-trash"></i>
              <span>Deleted</span>
            </button>
          )}
          <button
            onClick={() => setShowNotesEditor(true)}
            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200 transition-all duration-200 relative shadow-sm hover:shadow"
          >
            <i className="fas fa-pen"></i>
            <span>Notes</span>
            {privateNotes && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white shadow-sm"></span>
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
