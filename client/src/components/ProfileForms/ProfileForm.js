import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  createProfile,
  getCurrentProfile,
  uploadProfileImage,
} from "../../redux/modules/profiles";
import { getProfileImage } from "../../utils";
import ProfileImage from "../ProfileImage";

const initialState = {
  company: "",
  website: "",
  location: "",
  country: "",
  status: "",
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [displaySocialInputs, toggleSocialInputs] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!profile) {
      getCurrentProfile();
    }
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

      // Set current profile image
      if (profile.user && profile.user._id) {
        setImagePreview(getProfileImage(profile.user._id));
      }
    }
  }, [loading, getCurrentProfile, profile]);

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
    createProfile(formData, navigate, profile ? true : false);
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
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
        data.append("file", file);
        await uploadProfileImage(data);

        // After successful upload, update preview to use server image
        if (profile?.user?._id) {
          // Add timestamp to force refresh
          setImagePreview(
            `${getProfileImage(profile.user._id)}?t=${Date.now()}`
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-edit text-white text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {profile ? "Edit Profile" : "Create Profile"}
            </h2>
            <p className="text-gray-600">
              Complete your profile to showcase your professional journey
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
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

              {/* Image Preview */}
              <div className="mb-4 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full mx-auto border-4 border-purple-200 shadow-lg object-cover"
                    onError={() => setImagePreview("")}
                  />
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-purple-200 shadow-lg overflow-hidden">
                    <ProfileImage
                      userId={profile?.user?._id}
                      userName={profile?.user?.name || "User"}
                      size="w-full h-full"
                      textSize="text-xl"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {uploadingImage ? "Uploading..." : "Current profile image"}
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload a new image to replace your current profile picture
              </p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-left text-gray-700 font-medium mb-2">
                Skills *
              </label>
              <input
                type="text"
                placeholder="* Skills (e.g. HTML, CSS, JavaScript, Python)"
                name="skills"
                value={skills}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>

            {/* Social Networks Toggle */}
            <div className="text-center">
              <button
                type="button"
                className="px-6 py-3 bg-gray-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-200 border border-gray-300"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 py-3 px-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all text-lg"
              >
                {profile ? "Update Profile" : "Create Profile"}
              </button>
              <Link
                to="/home"
                className="flex-1 py-3 px-8 rounded-lg bg-gray-100 text-purple-700 font-semibold shadow hover:bg-purple-50 transition-all text-lg text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
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
