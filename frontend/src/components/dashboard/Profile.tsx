import  { useState } from 'react';
import { 
  Camera, 
  Edit, 
  Star, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle,
  Plus,
  X,
  Save
} from 'lucide-react';

const userProfile = {
  id: 1,
  firstName: 'Sarah',
  lastName: 'Chen',
  username: 'sarahchen',
  email: 'sarah.chen@example.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and TypeScript. Passionate about clean code and user experience. Love sharing knowledge and learning new skills through collaboration.',
  location: 'San Francisco, CA',
  rating: 4.9,
  totalRatings: 23,
  completedTrades: 23,
  isVerified: true,
  joinedAt: '2023-06-15',
  skills: [
    { name: 'React Development', level: 'Expert', category: 'Technology' },
    { name: 'Node.js', level: 'Expert', category: 'Technology' },
    { name: 'TypeScript', level: 'Advanced', category: 'Technology' },
    { name: 'UI/UX Design', level: 'Intermediate', category: 'Creative' },
    { name: 'Project Management', level: 'Advanced', category: 'Business' }
  ],
  interests: [
    { name: 'Photography', category: 'Creative' },
    { name: 'Spanish Language', category: 'Language' },
    { name: 'Digital Marketing', category: 'Business' },
    { name: 'Fitness Training', category: 'Health' }
  ],
  achievements: [
    { name: 'Top Trader', description: 'Completed 20+ successful skill exchanges', icon: Award },
    { name: 'Verified Expert', description: 'Skills verified by the community', icon: CheckCircle },
    { name: 'Mentor', description: 'Helped 50+ people learn new skills', icon: Star }
  ]
};

const recentReviews = [
  {
    id: 1,
    reviewer: {
      name: 'Marcus Johnson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    rating: 5,
    comment: 'Sarah is an excellent teacher! Her React expertise helped me build my portfolio website perfectly.',
    skillExchanged: 'React Development',
    date: '2024-01-20'
  },
  {
    id: 2,
    reviewer: {
      name: 'Elena Rodriguez',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    rating: 5,
    comment: 'Amazing collaboration! Sarah\'s technical skills and communication made the project smooth.',
    skillExchanged: 'Full Stack Development',
    date: '2024-01-15'
  },
  {
    id: 3,
    reviewer: {
      name: 'David Park',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    rating: 4,
    comment: 'Great experience learning TypeScript. Sarah explains complex concepts in simple terms.',
    skillExchanged: 'TypeScript',
    date: '2024-01-10'
  }
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', category: 'Technology' });
  const [showAddSkill, setShowAddSkill] = useState(false);

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, newSkill]
      });
      setNewSkill({ name: '', level: 'Beginner', category: 'Technology' });
      setShowAddSkill(false);
    }
  };

  const removeSkill = (index: number) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your profile and showcase your skills</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 flex items-center"
        >
          {isEditing ? <Save className="w-5 h-5 mr-2" /> : <Edit className="w-5 h-5 mr-2" />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <img
                  src={editedProfile.avatar}
                  alt={`${editedProfile.firstName} ${editedProfile.lastName}`}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-100"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editedProfile.firstName} {editedProfile.lastName}
                    </h2>
                  )}
                  {editedProfile.isVerified && (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  )}
                </div>
                
                <p className="text-gray-600 mb-2">@{editedProfile.username}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {editedProfile.rating} ({editedProfile.totalRatings} reviews)
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-purple-500 mr-1" />
                    {editedProfile.completedTrades} trades completed
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      editedProfile.location
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{editedProfile.bio}</p>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(editedProfile.joinedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Skills I Offer</h3>
              {isEditing && (
                <button
                  onClick={() => setShowAddSkill(true)}
                  className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skill
                </button>
              )}
            </div>
            
            {showAddSkill && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Creative">Creative</option>
                    <option value="Business">Business</option>
                    <option value="Language">Language</option>
                    <option value="Health">Health</option>
                    <option value="Music">Music</option>
                  </select>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleAddSkill}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                  >
                    Add Skill
                  </button>
                  <button
                    onClick={() => setShowAddSkill(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editedProfile.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">{skill.level}</span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Reviews</h3>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <img
                      src={review.reviewer.avatar}
                      alt={review.reviewer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{review.reviewer.name}</h4>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">"{review.comment}"</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Skill: {review.skillExchanged}</span>
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-4">
              {editedProfile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <achievement.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
            <div className="space-y-2">
              {editedProfile.interests.map((interest, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-900">{interest.name}</span>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                    {interest.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Profile Views</span>
                <span className="font-semibold text-gray-900">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-semibold text-gray-900">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response Time</span>
                <span className="font-semibold text-gray-900">2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold text-gray-900">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}