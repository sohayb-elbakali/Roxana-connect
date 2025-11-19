import { useEffect, useState } from "react";

const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProfileImage = ({
  userId,
  userName = "User",
  avatar = null,
  profile = null,
  size = "w-24 h-24",
  className = "",
  textSize = "text-xl",
  roundedClass = "rounded-full"
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the image URL - prioritize avatar prop, then profile.avatar, then fall back to server default
  const imageUrl = avatar || profile?.avatar || `${serverUrl}/default.png`;

  // Reset error state when imageUrl changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // If image failed to load, use server default
  const displayUrl = imageError ? `${serverUrl}/default.png` : imageUrl;

  return (
    <div className={`${size} ${className} relative`} style={{ aspectRatio: '1/1' }}>
      <img
        src={displayUrl}
        alt={`${userName}'s profile`}
        className={`${size} ${roundedClass} object-cover ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
        style={{ aspectRatio: '1/1' }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      
      {/* Show loading state while image is loading */}
      {!imageLoaded && (
        <div
          className={`${size} ${roundedClass} bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse absolute top-0 left-0 flex items-center justify-center`}
          style={{ aspectRatio: '1/1' }}
        >
          <i className={`fas fa-user text-gray-400 ${textSize}`}></i>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
  