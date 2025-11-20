import React from "react"

const BasicInfo = ({profile}) => {
    return (
      <div className="space-y-3">
        {/* Bio */}
        {profile.bio && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start space-x-3">
              <i className="fas fa-quote-left text-gray-400 mt-1"></i>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          </div>
        )}

        {/* Location */}
        {profile.location && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-map-marker-alt text-blue-600 text-sm"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">Lives in</p>
              <p className="font-medium text-gray-900">{profile.location}</p>
            </div>
          </div>
        )}

        {/* Country */}
        {profile.country && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-globe text-blue-600 text-sm"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="font-medium text-gray-900">{profile.country}</p>
            </div>
          </div>
        )}

        {/* Company */}
        {profile.company && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-building text-blue-600 text-sm"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">Works at</p>
              <p className="font-medium text-gray-900">{profile.company}</p>
            </div>
          </div>
        )}

        {/* Website */}
        {profile.website && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-link text-blue-600 text-sm"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">Website</p>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                {profile.website}
              </a>
            </div>
          </div>
        )}
      </div>
    );
}

export default BasicInfo
