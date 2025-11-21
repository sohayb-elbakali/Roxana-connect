'use client';

import { useSelector, useDispatch } from 'react-redux';
import Avatar from '../Avatar';
import { uploadProfileImage } from '@/lib/redux/modules/profiles';
import { useState } from 'react';

/**
 * Example 1: Simple Avatar Display
 */
export function SimpleAvatarExample() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size={40} />
      <span className="font-medium">My Profile</span>
    </div>
  );
}

/**
 * Example 2: Avatar with User Info
 */
export function AvatarWithUserInfo() {
  const user = useSelector((state) => state.users.user);
  const profile = useSelector((state) => state.profiles.profile);

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow">
      <Avatar size={48} />
      <div>
        <p className="font-semibold text-gray-900">{user?.name}</p>
        <p className="text-sm text-gray-600">{profile?.bio || 'No bio yet'}</p>
      </div>
    </div>
  );
}

/**
 * Example 3: Avatar Sizes Showcase
 */
export function AvatarSizesExample() {
  return (
    <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
      <div className="text-center">
        <Avatar size={32} />
        <p className="text-xs mt-2">Small (32px)</p>
      </div>
      <div className="text-center">
        <Avatar size={40} />
        <p className="text-xs mt-2">Medium (40px)</p>
      </div>
      <div className="text-center">
        <Avatar size={64} />
        <p className="text-xs mt-2">Large (64px)</p>
      </div>
      <div className="text-center">
        <Avatar size={96} />
        <p className="text-xs mt-2">XL (96px)</p>
      </div>
    </div>
  );
}

/**
 * Example 4: Avatar Upload Component
 */
export function AvatarUploadExample() {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const profile = useSelector((state) => state.profiles.profile);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      await dispatch(uploadProfileImage(formData));
      console.log('Avatar updated successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow">
      <Avatar size={96} className="border-4 border-blue-500" />
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Current avatar: {profile?.avatar ? 'Cloudinary' : 'Default'}
        </p>
        
        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          {uploading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Uploading...
            </>
          ) : (
            <>
              <i className="fas fa-upload mr-2"></i>
              Upload New Avatar
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}

/**
 * Example 5: Navbar with Avatar
 */
export function NavbarWithAvatar() {
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <nav className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold">My App</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Login
        </button>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-xl font-bold">My App</h1>
      
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
        <Avatar size={36} className="cursor-pointer hover:ring-2 hover:ring-blue-500" />
      </div>
    </nav>
  );
}
