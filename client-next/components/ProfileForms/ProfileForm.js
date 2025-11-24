'use client';

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createProfile,
  getCurrentProfile,
  uploadProfileImage,
} from "../../lib/redux/modules/profiles";
import Avatar from "../Avatar";
import CustomAlert from "../CustomAlert";

const initialState = {
  company: "",
  website: "",
  location: "",
  country: "",
  status: "Student", // default to satisfy server validation
  skills: "",
  bio: "",
  twitter: "",
  facebook: "",
  linkedin: "",
  youtube: "",
  instagram: "",
  github: "",
};

const ProfileForm = ({
  profiles: { profile, loading },
  createProfile,
  getCurrentProfile,
  uploadProfileImage,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialState);
  const [displaySocialInputs, toggleSocialInputs] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "error",
    title: "",
    message: ""
  });

  useEffect(() => {
    // Only populate form if we have a profile (editing mode)
    if (profile && !loading) {
      const profileData = { ...initialState };

      // Populate form with existing profile data
      for (const key in profile) {
        if (key in profileData) {
          profileData[key] = profile[key];
        }
      }

      // Handle social links
      if (profile.social) {
        profileData.twitter = profile.social.twitter || "";
        profileData.facebook = profile.social.facebook || "";
        profileData.linkedin = profile.social.linkedin || "";
        profileData.youtube = profile.social.youtube || "";
        profileData.instagram = profile.social.instagram || "";
        profileData.github = profile.social.github || "";
      }

      // Handle skills array - convert to string
      if (profile.skills && Array.isArray(profile.skills)) {
        profileData.skills = profile.skills.join(", ");
      }

      setFormData(profileData);

      // Set current profile image from Cloudinary or fallback
      if (profile.avatar) {
        setImagePreview(profile.avatar);
      } else if (profile.user && profile.user._id) {
        setImagePreview('/assets/default.png');
      }
    }
  }, [loading, profile]);

  const {
    company,
    website,
    location,
    country,
    status,
    skills,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
    github,
  } = formData;

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, router.push, profile ? true : false);
  };

  const onFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setAlertConfig({
          isOpen: true,
          type: "error",
          title: "Invalid File Type",
          message: "Please select an image file (PNG, JPG, GIF, etc.)"
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setAlertConfig({
          isOpen: true,
          type: "error",
          title: "File Too Large",
          message: "File size must be less than 5MB. Please choose a smaller image."
        });
        return;
      }

      setUploadingImage(true);

      // Create preview of selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      try {
        // Upload the image
        const data = new FormData();
        data.append("image", file);
        const response = await uploadProfileImage(data);

        // Update preview with Cloudinary URL immediately (no page refresh)
        if (response && response.url) {
          setImagePreview(response.url);
          // Show simple success message
          setAlertConfig({
            isOpen: true,
            type: "success",
            title: "Image Uploaded",
            message: "Your profile image has been updated successfully."
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        // Revert to previous image on error
        if (profile?.avatar) {
          setImagePreview(profile.avatar);
        } else {
          setImagePreview("");
        }
        setAlertConfig({
          isOpen: true,
          type: "error",
          title: "Upload Failed",
          message: "Failed to upload image. Please check your connection and try again."
        });
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-briefcase text-white text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {profile ? "Edit Profile" : "Create Your Profile"}
            </h2>
            <p className="text-gray-600">
              {profile
                ? "Update your profile to showcase your professional journey"
                : "Welcome to Roxana Connect! Let's set up your profile"}
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            {/* Professional Status */}
            <div>
              <label className="block text-left text-gray-700 font-medium mb-2">
                Professional Status *
              </label>
              <select
                name="status"
                value={status}
                onChange={onChange}
                required
                className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="">* Select Professional Status</option>
                <option value="Developer">Developer</option>
                <option value="Junior Developer">Junior Developer</option>
                <option value="Senior Developer">Senior Developer</option>
                <option value="Manager">Manager</option>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Intern">Intern</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-left text-gray-700 font-medium mb-2">
                Profile Image
              </label>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="text-gray-900 bg-white hidden"
                id="profile-image-upload"
              />

              {/* Clickable Image Preview */}
              <div className="text-center">
                <label
                  htmlFor="profile-image-upload"
                  className="inline-block cursor-pointer group relative"
                >
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full mx-auto border-4 border-blue-200 shadow-lg object-cover group-hover:border-blue-400 transition-all duration-200"
                        onError={() => setImagePreview("")}
                      />
                    ) : (
                      <Avatar
                        userId={profile?.user?._id}
                        userName={profile?.user?.name || "User"}
                        avatar={profile?.avatar}
                        profile={profile}
                        size={128}
                        className="border-4 border-blue-200 shadow-lg group-hover:border-blue-400 transition-all duration-200"
                      />
                    )}

                    {/* Upload Overlay */}
                    {!uploadingImage && (
                      <div className="absolute inset-0 rounded-full group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <i className="fas fa-camera text-white text-2xl"></i>
                          <p className="text-white text-xs mt-1 font-semibold">Change Photo</p>
                        </div>
                      </div>
                    )}

                    {/* Loading Spinner */}
                    {uploadingImage && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <i className="fas fa-spinner fa-spin text-white text-2xl"></i>
                      </div>
                    )}
                  </div>
                </label>
                <p className="text-sm text-gray-500 mt-3">
                  {uploadingImage ? (
                    <span className="text-blue-600 font-semibold">
                      <i className="fas fa-spinner fa-spin mr-1"></i>
                      Uploading image...
                    </span>
                  ) : (
                    <span>
                      <i className="fas fa-info-circle mr-1"></i>
                      Click on the image to upload a new profile picture
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </div>

            {/* Company and Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-left text-gray-700 font-medium mb-2">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Your company"
                  name="company"
                  value={company}
                  onChange={onChange}
                  className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-left text-gray-700 font-medium mb-2">
                  Website
                </label>
                <input
                  type="text"
                  placeholder="Your website"
                  name="website"
                  value={website}
                  onChange={onChange}
                  className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Location and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-left text-gray-700 font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Your location"
                  name="location"
                  value={location}
                  onChange={onChange}
                  className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-left text-gray-700 font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Your country"
                  name="country"
                  value={country}
                  onChange={onChange}
                  className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-left text-gray-700 font-medium mb-2">
                Skills
              </label>
              <input
                type="text"
                placeholder="Skills (e.g. HTML, CSS, JavaScript, Python)"
                name="skills"
                value={skills}
                onChange={onChange}
                className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-sm text-gray-500 mt-1">
                Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-left text-gray-700 font-medium mb-2">
                Bio
              </label>
              <textarea
                placeholder="Tell us a little about yourself"
                name="bio"
                value={bio}
                onChange={onChange}
                rows="4"
                className="text-gray-900 bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            {/* Social Networks Toggle */}
            <div className="text-center">
              <button
                type="button"
                className="px-6 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200"
                onClick={() => toggleSocialInputs(!displaySocialInputs)}
              >
                {displaySocialInputs ? "Hide" : "Add"} Social Networks
              </button>
            </div>

            {/* Social Network Inputs */}
            {displaySocialInputs && (
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Social Network Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <i className="fab fa-twitter fa-lg text-blue-400 w-6" />
                    <input
                      type="text"
                      placeholder="Twitter URL"
                      name="twitter"
                      value={twitter}
                      onChange={onChange}
                      className="text-gray-900 bg-white flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <i className="fab fa-facebook fa-lg text-blue-600 w-6" />
                    <input
                      type="text"
                      placeholder="Facebook URL"
                      name="facebook"
                      value={facebook}
                      onChange={onChange}
                      className="text-gray-900 bg-white flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <i className="fab fa-youtube fa-lg text-red-600 w-6" />
                    <input
                      type="text"
                      placeholder="YouTube URL"
                      name="youtube"
                      value={youtube}
                      onChange={onChange}
                      className="text-gray-900 bg-white flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <i className="fab fa-linkedin fa-lg text-blue-700 w-6" />
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      name="linkedin"
                      value={linkedin}
                      onChange={onChange}
                      className="text-gray-900 bg-white flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <i className="fab fa-instagram fa-lg text-pink-600 w-6" />
                    <input
                      type="text"
                      placeholder="Instagram URL"
                      name="instagram"
                      value={instagram}
                      onChange={onChange}
                      className="text-gray-900 bg-white flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <i className="fab fa-github fa-lg text-gray-800 w-6" />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      name="github"
                      value={github}
                      onChange={onChange}
                      className="text-gray-900 bg-white flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 py-3 px-8 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-all text-lg"
              >
                {profile ? "Update Profile" : "Create Profile"}
              </button>
              <Link href="/home"
                className="flex-1 py-3 px-8 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow-sm hover:bg-gray-200 transition-all text-lg text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="OK"
      />
    </div>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  uploadProfileImage: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
});

export default connect(mapStateToProps, {
  createProfile,
  getCurrentProfile,
  uploadProfileImage,
})(ProfileForm);
