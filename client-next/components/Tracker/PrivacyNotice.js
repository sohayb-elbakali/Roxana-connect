const PrivacyNotice = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <i className="fas fa-shield-alt text-blue-600 text-lg"></i>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            🔒 Your Progress Stays Private
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your tracking data is completely private—no one else can see which internships you've saved, 
            applied to, or where you're interviewing. We share basic stats (like how many people applied) 
            to help everyone, but your name and details stay hidden.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
