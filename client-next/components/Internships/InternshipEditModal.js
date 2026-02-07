'use client';

import { useState, useEffect } from 'react';

const InternshipEditModal = ({ internship, onSave, onClose, isSaving }) => {
  const [formData, setFormData] = useState({
    company: '',
    positionTitle: '',
    location: '',
    locationType: '',
    description: '',
    requirements: [],
    tags: [],
    salaryRange: { min: '', max: '', currency: 'USD' },
    applicationDeadline: '',
  });

  useEffect(() => {
    if (internship) {
      setFormData({
        company: internship.company || '',
        positionTitle: internship.positionTitle || '',
        location: internship.location || '',
        locationType: internship.locationType || '',
        description: internship.description || '',
        requirements: internship.requirements || [],
        tags: internship.tags || [],
        salaryRange: internship.salaryRange || { min: '', max: '', currency: 'USD' },
        applicationDeadline: internship.applicationDeadline 
          ? new Date(internship.applicationDeadline).toISOString().split('T')[0]
          : '',
      });
    }
  }, [internship]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      salaryRange: { ...prev.salaryRange, [field]: value }
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <i className="fas fa-briefcase text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Internship</h3>
                <p className="text-xs text-gray-500 mt-0.5">Update internship details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <i className="fas fa-times text-gray-500"></i>
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="internship-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Company & Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-building text-blue-500 mr-2"></i>
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Google"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-briefcase text-blue-500 mr-2"></i>
                  Position Title *
                </label>
                <input
                  type="text"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Software Engineer Intern"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Location & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-laptop-house text-blue-500 mr-2"></i>
                  Work Type
                </label>
                <select
                  name="locationType"
                  value={formData.locationType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all bg-white"
                >
                  <option value="">Select type</option>
                  <option value="remote">🏠 Remote</option>
                  <option value="onsite">🏢 On-site</option>
                  <option value="hybrid">🔄 Hybrid</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-align-left text-blue-500 mr-2"></i>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y transition-all"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                Requirements
              </label>
              <textarea
                value={formData.requirements.join(', ')}
                onChange={(e) => handleArrayChange('requirements', e.target.value)}
                rows={3}
                placeholder="Bachelor's degree, 2+ years experience, JavaScript, React..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y transition-all"
              />
              <p className="text-xs text-gray-500 mt-1.5">Separate each requirement with a comma</p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-tags text-blue-500 mr-2"></i>
                Skills & Tags
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleArrayChange('tags', e.target.value)}
                placeholder="JavaScript, React, Node.js, TypeScript..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
              <p className="text-xs text-gray-500 mt-1.5">Separate each tag with a comma</p>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-dollar-sign text-blue-500 mr-2"></i>
                Salary Range (Optional)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  value={formData.salaryRange.min}
                  onChange={(e) => handleSalaryChange('min', e.target.value)}
                  placeholder="Min"
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
                <input
                  type="number"
                  value={formData.salaryRange.max}
                  onChange={(e) => handleSalaryChange('max', e.target.value)}
                  placeholder="Max"
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
                <select
                  value={formData.salaryRange.currency}
                  onChange={(e) => handleSalaryChange('currency', e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all bg-white"
                >
                  <option value="USD">💵 USD</option>
                  <option value="EUR">💶 EUR</option>
                  <option value="GBP">💷 GBP</option>
                </select>
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-calendar-alt text-blue-500 mr-2"></i>
                Application Deadline *
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="internship-form"
            disabled={isSaving}
            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-check mr-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipEditModal;
