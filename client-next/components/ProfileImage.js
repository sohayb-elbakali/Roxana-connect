'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:5000";

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

  // Get the image URL - prioritize avatar prop, then profile.avatar, then fall back to default
  const imageUrl = avatar || profile?.avatar || "/assets/default.png";
  
  // Check if it's an external URL or local
  const isExternal = imageUrl.startsWith('http');
  const displayUrl = imageError ? "/assets/default.png" : imageUrl;

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

  // Get numeric size for Next.js Image
  const sizeMatch = size.match(/w-(\d+)/);
  const pixelSize = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 96; // Convert Tailwind to pixels

  return (
    <div className={`${size} ${className} relative overflow-hidden ${roundedClass}`}>
      {isExternal ? (
        <Image
          src={displayUrl}
          alt={`${userName}'s profile`}
          width={pixelSize}
          height={pixelSize}
          className={`${size} object-cover ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          unoptimized // For external images
          priority={pixelSize > 100} // Priority for larger images
        />
      ) : (
        <img
          src={displayUrl}
          alt={`${userName}'s profile`}
          className={`${size} object-cover ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      )}
      
      {/* Show loading state while image is loading */}
      {!imageLoaded && (
        <div
          className={`${size} bg-gradient-to-br from-blue-100 to-blue-200 absolute top-0 left-0 flex items-center justify-center`}
        >
          <i className={`fas fa-user text-blue-400 ${textSize}`}></i>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
  