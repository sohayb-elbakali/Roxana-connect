import { useEffect, useState } from "react";
import { getProfileImage } from "../utils";
import DefaultAvatar from "./DefaultAvatar";

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

  // Get the image URL - prioritize avatar prop, then profile.avatar, then fall back to userId
  const imageUrl = avatar || profile?.avatar || (userId ? getProfileImage(userId) : null);

  // Reset error state when imageUrl changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // If no image URL or image failed to load, show default avatar
  if (!imageUrl || imageError) {
    return (
      <DefaultAvatar
        name={userName}
        size={size}
        className={className}
        textSize={textSize}
      />
    );
  }

  return (
    <div className={`${size} ${className} relative`} style={{ aspectRatio: '1/1' }}>
      <img
        src={imageUrl}
        alt={`${userName}'s profile`}
        className={`${size} ${roundedClass} object-cover ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
        style={{ aspectRatio: '1/1' }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      
      {/* Show loading state while image is loading */}
      {!imageLoaded && !imageError && (
        <div
          className={`${size} ${roundedClass} bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse absolute top-0 left-0 flex items-center justify-center`}
          style={{ aspectRatio: '1/1' }}
        >
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
  