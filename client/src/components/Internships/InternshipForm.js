import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createInternship,
  updateInternship,
  fetchInternship,
} from "../../redux/modules/internships";

const InternshipForm = ({
  createInternship,
  updateInternship,
  fetchInternship,
  internships,
  auth,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Check if user has permission to post internships
  const canPostInternship = auth.user?.role === 'admin' || (auth.user?.level && auth.user.level >= 2);

  const [formData, setFormData] = useState({
    company: "",
    positionTitle: "",
    location: "",
    locationType: "onsite",
    applicationDeadline: "",
    description: "",
    applicationLink: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Set default deadline to January 1st of next year for new internships
  useEffect(() => {
    if (!isEditMode && !formData.applicationDeadline) {
      const today = new Date();
      const nextYear = today.getFullYear() + 1;
      const defaultDeadline = `${nextYear}-01-01`;
      setFormData(prev => ({ ...prev, applicationDeadline: defaultDeadline }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  // Load internship data for editing
  useEffect(() => {
    if (isEditMode) {
      if (!internships.current || internships.current._id !== id) {
        fetchInternship(id);
      } else {
        const internship = internships.current;
        
        // Check authorization - only owner can edit
        const userId = typeof internship.user === 'string' ? internship.user : internship.user?._id;
        if (userId !== auth.user?._id) {
          navigate("/feed");
          return;
        }

        // Pre-populate form
        setFormData({
          company: internship.company || "",
          positionTitle: internship.positionTitle || "",
          location: internship.location || "",
          locationType: internship.locationType || "onsite",
          applicationDeadline: internship.applicationDeadline
            ? new Date(internship.applicationDeadline).toISOString().split("T")[0]
            : "",
          description: internship.description || "",
          applicationLink: internship.applicationLink || "",
          tags: internship.tags?.join(", ") || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, id, internships.current, fetchInternship, auth.user, navigate]);

  const {
    company,
    positionTitle,
    location,
    locationType,
    applicationDeadline,
    description,
    applicationLink,
    tags,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!positionTitle.trim()) {
      newErrors.positionTitle = "Position title is required";
    }

    // location is now optional

    if (!applicationDeadline) {
      newErrors.applicationDeadline = "Application deadline is required";
    } else {
      // Validate deadline is in the future (only for new internships or if deadline was changed)
      const deadline = new Date(applicationDeadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadline.setHours(0, 0, 0, 0);
      
      // For edit mode, only validate if the deadline is being changed to a past date
      if (!isEditMode && deadline < today) {
        newErrors.applicationDeadline = "Deadline must be in the future";
      }
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    // URL validation
    if (applicationLink && applicationLink.trim()) {
      const urlPattern = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(applicationLink)) {
        newErrors.applicationLink = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Prepare data for submission
    const submitData = {
      company: company.trim(),
      positionTitle: positionTitle.trim() || undefined,
      location: location.trim() || undefined,
      locationType,
      applicationDeadline,
      description: description.trim(),
      applicationLink: applicationLink.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };

    // Remove undefined values
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === undefined) {
        delete submitData[key];
      }
    });

    try {
      if (id) {
        await updateInternship(id, submitData);
      } else {
        await createInternship(submitData);
      }
      navigate("/feed");
    } catch (err) {
      console.error("Error submitting form:", err);
      console.error("Error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Show access denied if user doesn't have permission
  if (!canPostInternship && !isEditMode) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 lg:pl-16 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-red-600 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
              <p className="text-gray-600 mb-2">
                Only users with <span className="font-semibold text-blue-600">Level 2</span> or{' '}
                <span className="font-semibold text-blue-600">Level 3</span> can post internships.
              </p>
              {auth.user?.level === 1 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <i className="fas fa-info-circle mr-2"></i>
                    You are currently at <span className="font-semibold">Level 1</span> (View-Only). Please contact an administrator if you need posting privileges.
                  </p>
                </div>
              )}
              <button
                onClick={() => navigate('/feed')}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:pl-16 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-briefcase text-blue-600 text-xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 ml-4">
              {isEditMode ? "Edit Internship" : "Post New Internship"}
            </h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={company}
                onChange={onChange}
                placeholder="e.g., Google, Microsoft, Amazon"
                className={`w-full px-4 py-3 border ${
                  errors.company ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company}</p>
              )}
            </div>

            {/* Position Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Position Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="positionTitle"
                value={positionTitle}
                onChange={onChange}
                placeholder="e.g., Software Engineering Intern"
                className={`w-full px-4 py-3 border ${
                  errors.positionTitle ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.positionTitle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.positionTitle}
                </p>
              )}
            </div>

            {/* Location and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={onChange}
                  placeholder="e.g., San Francisco, CA"
                  className={`w-full px-4 py-3 border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location Type
                </label>
                <select
                  name="locationType"
                  value={locationType}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={applicationDeadline}
                onChange={onChange}
                className={`w-full px-4 py-3 border ${
                  errors.applicationDeadline
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.applicationDeadline && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.applicationDeadline}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Describe the internship opportunity, responsibilities, and what the intern will learn..."
                rows="5"
                className={`w-full px-4 py-3 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Application Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Application Link
              </label>
              <input
                type="text"
                name="applicationLink"
                value={applicationLink}
                onChange={onChange}
                placeholder="https://company.com/careers/apply"
                className={`w-full px-4 py-3 border ${
                  errors.applicationLink ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.applicationLink && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.applicationLink}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={tags}
                onChange={onChange}
                placeholder="e.g., software, frontend, paid, summer-2026 (comma-separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label={isEditMode ? "Update internship" : "Post internship"}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2" aria-hidden="true"></i>
                    {isEditMode ? "Update Internship" : "Post Internship"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/feed")}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Cancel and return to feed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  internships: state.internships,
  auth: state.users,
});

export default connect(mapStateToProps, {
  createInternship,
  updateInternship,
  fetchInternship,
})(InternshipForm);
