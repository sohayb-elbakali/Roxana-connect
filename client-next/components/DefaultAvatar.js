
const DefaultAvatar = ({ 
  name = "User", 
  size = "w-24 h-24", 
  className = "",
  textSize = "text-xl"
}) => {
  // Generate initials from name
  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "") return "U";
    
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate a consistent color based on the name
  const getAvatarColor = (fullName) => {
    if (!fullName) return "from-blue-400 to-blue-600";
    
    const colors = [
      "from-blue-400 to-blue-600",
      "from-teal-400 to-teal-600",
      "from-green-400 to-green-600",
      "from-yellow-400 to-yellow-600",
      "from-red-400 to-red-600",
      "from-indigo-400 to-indigo-600",
      "from-cyan-400 to-cyan-600",
      "from-emerald-400 to-emerald-600",
    ];
    
    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center ${className}`}
      style={{ aspectRatio: '1/1' }}
    >
      <span className={`${textSize} font-bold text-white select-none`}>
        {initials}
      </span>
    </div>
  );
};

export default DefaultAvatar;
