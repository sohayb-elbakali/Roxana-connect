import store from './redux/store';
import { getCurrentProfile } from './redux/modules/profiles';
import { loadUser } from './redux/modules/users';

/**
 * Fetch and store user profile with Cloudinary avatarUrl
 * Call this after login or on app initialization
 */
export async function fetchUserProfile() {
  try {
    // Load user data first
    await store.dispatch(loadUser());

    // Then load profile with avatar
    await store.dispatch(getCurrentProfile());

    const state = store.getState();
    const profile = state.profiles.profile;

    if (profile?.avatar) {

    } else if (profile === null) {

    }

    return profile;
  } catch (error) {
    // Silently handle errors - user might not have a profile yet

    return null;
  }
}

/**
 * Update avatar URL in Redux after Cloudinary upload
 * @param {string} newAvatarUrl - The new Cloudinary URL
 */
export function updateAvatarInRedux(newAvatarUrl) {
  const state = store.getState();
  const currentProfile = state.profiles.profile;

  if (currentProfile) {
    store.dispatch({
      type: 'profile/UPDATE_PROFILE',
      payload: {
        ...currentProfile,
        avatar: newAvatarUrl
      }
    });
  }
}
