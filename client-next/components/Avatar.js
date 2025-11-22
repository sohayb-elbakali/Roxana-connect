'use client';

import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useMemo, useState } from 'react';

const defaultAvatar = '/assets/default.png';

/**
 * Avatar component that displays user profile images
 * Supports both current user and other users via userId prop
 * Reads from Redux state for instant loading
 */
export default function Avatar({
  userId = null,           // Optional: specific user ID to show
  userName = 'User',       // Fallback name for alt text
  avatar = null,           // Optional: direct avatar URL
  profile = null,          // Optional: profile object
  size = 40,               // Size in pixels
  className = '',          // Additional CSS classes
  showOnlineStatus = false // Show online indicator
}) {
  const currentUser = useSelector((state) => state.users.user);
  const currentProfile = useSelector((state) => state.profiles.profile);
  const allProfiles = useSelector((state) => state.profiles.profiles);
  const [imageError, setImageError] = useState(false);

  // Determine which avatar to show
  const avatarUrl = useMemo(() => {
    // If image failed to load, use default
    if (imageError) return defaultAvatar;

    // If userId is provided and it's not the current user, try to find in profiles list
    if (userId && userId !== currentUser?._id) {
      const userProfile = allProfiles.find(p => p.user?._id === userId || p.user === userId);
      if (userProfile?.avatar) return userProfile.avatar;
    }

    // Priority: direct avatar prop > profile.avatar > currentProfile.avatar > default
    if (avatar) return avatar;
    if (profile?.avatar) return profile.avatar;
    if (!userId || userId === currentUser?._id) {
      // For current user, use their profile
      if (currentProfile?.avatar) return currentProfile.avatar;
    }

    return defaultAvatar;
  }, [userId, currentUser, currentProfile, allProfiles, avatar, profile, imageError]);

  const displayName = userName || currentUser?.name || 'User';
  const isExternal = avatarUrl.startsWith('http');

  const handleImageError = () => {
    // Silently handle image load failures
    setImageError(true);
  };

  return (
    <div
      className={`relative inline-block flex-shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {isExternal ? (
        <Image
          src={avatarUrl}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          alt={`${displayName}'s avatar`}
          priority
          unoptimized
          style={{ objectFit: 'cover' }}
          onError={handleImageError}
        />
      ) : (
        <img
          src={avatarUrl}
          className="w-full h-full object-cover"
          alt={`${displayName}'s avatar`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={handleImageError}
        />
      )}

      {showOnlineStatus && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
}
