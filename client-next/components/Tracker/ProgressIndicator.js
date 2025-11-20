import { useMemo } from "react";

const ProgressIndicator = ({ stats }) => {
  const { total, applied, interviewing, offer_received, accepted } = stats;

  const progressSteps = useMemo(() => {
    if (total === 0) return [];
    
    return [
      {
        label: "Applied",
        count: applied,
        percentage: (applied / total) * 100,
        color: "bg-blue-500",
        icon: "fa-paper-plane",
      },
      {
        label: "Interviewing",
        count: interviewing,
        percentage: (interviewing / total) * 100,
        color: "bg-sky-500",
        icon: "fa-comments",
      },
      {
        label: "Offers",
        count: offer_received + accepted,
        percentage: ((offer_received + accepted) / total) * 100,
        color: "bg-emerald-500",
        icon: "fa-trophy",
      },
    ];
  }, [total, applied, interviewing, offer_received, accepted]);

  if (total === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 mb-8 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="text-lg">🎯</span>
          Your Progress
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {total} tracked
        </span>
      </div>

      <div className="space-y-3">
        {progressSteps.map((step, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <i className={`fas ${step.icon} text-slate-400`}></i>
                {step.label}
              </span>
              <span className="text-slate-600 font-bold">
                {step.count} <span className="text-slate-400 font-normal">({step.percentage.toFixed(0)}%)</span>
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className={`${step.color} h-full rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${step.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Success Message */}
      {(offer_received + accepted) > 0 && (
        <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <p className="text-xs text-emerald-700 font-medium flex items-center gap-2">
            <span className="text-base">🎉</span>
            Nice! You've got {offer_received + accepted} offer{(offer_received + accepted) > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
