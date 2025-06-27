import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  'Technology',
  'Creative',
  'Business',
  'Language',
  'Health',
  'Music',
  'Crafts',
  'Sports',
  'Cooking',
  'Education'
];

const durations = [
  '1 week',
  '2 weeks',
  '3 weeks',
  '1 month',
  '2 months',
  '3 months',
  '6 months',
  'Ongoing'
];

export default function CreateRequest() {
  const [formData, setFormData] = useState<{
  title: string;
  description: string;
  skillNeeded: string;
  skillOffered: string;
  category: string;
  estimatedDuration: string;
  deadline: string;
  location: string;
  isRemote: boolean;
  requirements: string[];
  deliverables: string[];
  tags: string[]; // This ensures tags is typed as string[]
}>({
    title: '',
    description: '',
    skillNeeded: '',
    skillOffered: '',
    category: '',
    estimatedDuration: '',
    deadline: '',
    location: '',
    isRemote: false,
    requirements: [''],
    deliverables: [''],
    tags: []
  });

  const [currentTag, setCurrentTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const removeDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const updateDeliverable = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((del, i) => i === index ? value : del)
    }));
  };

  const addTag = () => {
  const newTag = currentTag.trim().toLowerCase();
  if (newTag && !formData.tags.includes(newTag)) {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag]
    }));
    setCurrentTag('');
  }
};

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.skillNeeded.trim()) newErrors.skillNeeded = 'Skill needed is required';
    if (!formData.skillOffered.trim()) newErrors.skillOffered = 'Skill offered is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.estimatedDuration) newErrors.estimatedDuration = 'Duration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to dashboard
      console.log('Skill request created:', formData);
      
    } catch (error) {
      console.error('Error creating skill request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Skill Request</h1>
          <p className="text-gray-600 mt-1">Post a request to find someone to trade skills with</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Need React Developer for Portfolio Website"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what you're looking for in detail..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill I Need *
                </label>
                <input
                  type="text"
                  value={formData.skillNeeded}
                  onChange={(e) => handleInputChange('skillNeeded', e.target.value)}
                  placeholder="e.g., React Development"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.skillNeeded ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.skillNeeded && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.skillNeeded}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill I Offer *
                </label>
                <input
                  type="text"
                  value={formData.skillOffered}
                  onChange={(e) => handleInputChange('skillOffered', e.target.value)}
                  placeholder="e.g., Professional Photography"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.skillOffered ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.skillOffered && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.skillOffered}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration *
                </label>
                <select
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.estimatedDuration ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select duration</option>
                  {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
                {errors.estimatedDuration && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.estimatedDuration}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Location & Timeline</h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRemote}
                  onChange={(e) => handleInputChange('isRemote', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">This can be done remotely</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  disabled={formData.isRemote}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
            <button
              type="button"
              onClick={addRequirement}
              className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Requirement
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  placeholder="e.g., 3+ years of React experience"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Expected Deliverables</h2>
            <button
              type="button"
              onClick={addDeliverable}
              className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Deliverable
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={deliverable}
                  onChange={(e) => updateDeliverable(index, e.target.value)}
                  placeholder="e.g., Fully functional portfolio website"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {formData.deliverables.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Tags</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags to help people find your request"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-emerald-500 text-white px-4 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Add Tag
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-emerald-600 hover:text-emerald-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Request...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Create Skill Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}