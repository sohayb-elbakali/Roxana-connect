import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { updateInternshipPreferences } from "../../redux/modules/profiles";

const InternshipPreferences = ({ profile, updateInternshipPreferences }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [targetCompanies, setTargetCompanies] = useState([]);
  const [targetRoles, setTargetRoles] = useState([]);
  const [companyInput, setCompanyInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  useEffect(() => {
    if (profile) {
      setTargetCompanies(profile.targetCompanies || []);
      setTargetRoles(profile.targetRoles || []);
    }
  }, [profile]);

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (companyInput.trim() && !targetCompanies.includes(companyInput.trim())) {
      setTargetCompanies([...targetCompanies, companyInput.trim()]);
      setCompanyInput("");
    }
  };

  const handleRemoveCompany = (company) => {
    setTargetCompanies(targetCompanies.filter((c) => c !== company));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (roleInput.trim() && !targetRoles.includes(roleInput.trim())) {
      setTargetRoles([...targetRoles, roleInput.trim()]);
      setRoleInput("");
    }
  };

  const handleRemoveRole = (role) => {
    setTargetRoles(targetRoles.filter((r) => r !== role));
  };

  const handleSave = () => {
    updateInternshipPreferences(targetCompanies, targetRoles);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTargetCompanies(profile?.targetCompanies || []);
    setTargetRoles(profile?.targetRoles || []);
    setIsEditing(false);
  };

  if (!isEditing && targetCompanies.length === 0 && targetRoles.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-bullseye text-blue-600"></i>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Set your target companies and roles to help track your goals
        </p>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Preferences
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Target Companies */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-semibold text-gray-900">
            <i className="fas fa-building text-blue-600 mr-2"></i>
            Target Companies
          </h4>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <i className="fas fa-edit mr-1"></i>
              Edit
            </button>
          )}
        </div>

        {isEditing && (
          <form onSubmit={handleAddCompany} className="mb-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                placeholder="Add a company..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {targetCompanies.length > 0 ? (
            targetCompanies.map((company, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 flex items-center"
              >
                {company}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveCompany(company)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No target companies set</p>
          )}
        </div>
      </div>

      {/* Target Roles */}
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-3">
          <i className="fas fa-user-tie text-blue-600 mr-2"></i>
          Target Roles
        </h4>

        {isEditing && (
          <form onSubmit={handleAddRole} className="mb-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="Add a role..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {targetRoles.length > 0 ? (
            targetRoles.map((role, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 flex items-center"
              >
                {role}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveRole(role)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No target roles set</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex space-x-3 pt-4 border-t">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
          >
            <i className="fas fa-save mr-2"></i>
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profiles.profile,
});

export default connect(mapStateToProps, { updateInternshipPreferences })(
  InternshipPreferences
);
