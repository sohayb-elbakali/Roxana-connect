const StatsWidget = ({ stats }) => {
  const {
    total = 0,
    applied = 0,
    interviewing = 0,
    offer_received = 0,
    rejected = 0,
    accepted = 0,
    declined = 0,
  } = stats;

  // Calculate success rate (offers / total applications)
  const successRate =
    applied + interviewing + offer_received + rejected + accepted + declined > 0
      ? (
          ((offer_received + accepted) /
            (applied + interviewing + offer_received + rejected + accepted + declined)) *
          100
        ).toFixed(1)
      : 0;

  const statCards = [
    {
      label: "Saved",
      value: total,
      icon: "fa-bookmark",
      textColor: "text-gray-700",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
    },
    {
      label: "Applied",
      value: applied,
      icon: "fa-check",
      textColor: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      label: "Interview",
      value: interviewing,
      icon: "fa-user-tie",
      textColor: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
    {
      label: "Offers",
      value: offer_received + accepted,
      icon: "fa-star",
      textColor: "text-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: "fa-times",
      textColor: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Overview
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
          <span className="text-xs text-slate-600 font-medium">Success Rate</span>
          <span className="text-base font-bold text-emerald-600">
            {successRate}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} rounded-xl p-5 hover:scale-105 transition-all duration-300 cursor-default border-2 border-white shadow-sm hover:shadow-md`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <i className={`fas ${stat.icon} ${stat.textColor} text-xl`}></i>
              </div>
              <p className={`text-3xl font-bold ${stat.textColor} tabular-nums leading-none`}>
                {stat.value}
              </p>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsWidget;
