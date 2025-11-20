'use client';

import { useEffect, useState } from "react";

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Show help with '?'
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(true);
      }
      // Close with Escape
      if (e.key === "Escape") {
        setShowHelp(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 flex items-center justify-center group"
        aria-label="Show keyboard shortcuts"
      >
        <i className="fas fa-keyboard text-lg"></i>
        <span className="absolute right-14 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Keyboard shortcuts
        </span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={() => setShowHelp(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-3xl">⌨️</span>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setShowHelp(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ShortcutItem keys={["?"]} description="Show this help menu" />
            <ShortcutItem keys={["Esc"]} description="Close dialogs" />
            <ShortcutItem keys={["/"]} description="Focus search" />
            <ShortcutItem keys={["Ctrl", "K"]} description="Quick actions" />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Tips & Tricks</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <i className="fas fa-lightbulb text-yellow-500 mt-0.5"></i>
                <span>Click and drag status dropdown to quickly update applications</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-sticky-note text-blue-500 mt-0.5"></i>
                <span>Add private notes to track important details for each application</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-sort text-slate-400 mt-0.5"></i>
                <span>Cards are automatically sorted by deadline urgency</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Press <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-700 font-mono">Esc</kbd> to close
          </p>
        </div>
      </div>

      <style jsx>{`
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
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const ShortcutItem = ({ keys, description }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
    <span className="text-sm text-slate-700">{description}</span>
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-slate-700 shadow-sm"
        >
          {key}
        </kbd>
      ))}
    </div>
  </div>
);

export default KeyboardShortcuts;
