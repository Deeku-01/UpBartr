import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  ChevronRight,
  Heart,
  Bookmark,
  Eye
} from 'lucide-react';
import axios from 'axios';
import SkeletonCard from '../lib/skeleton';

const initialSkillRequests = [
  {
    id: 1,
    title: 'Need React Developer for Portfolio Website',
    category: 'Technology',
    author: 'Marcus Johnson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4.8,
    location: 'Austin, TX',
    skillNeeded: 'React Development',
    skillOffered: 'Professional Photography',
    duration: '2 weeks',
    applications: 12,
    views: 89,
    isRemote: true,
    tags: ['react', 'typescript', 'frontend'],
    description: 'Looking for an experienced React developer to help me build a modern portfolio website. I have the designs ready and need someone to bring them to life with clean, responsive code.',
    postedAt: '2024-01-20',
    deadline: '2024-02-15',
    isBookmarked: false,
    isLiked: true
  },
  {
    id: 2,
    title: 'Learn Digital Marketing Strategies',
    category: 'Business',
    author: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4.9,
    location: 'San Francisco, CA',
    skillNeeded: 'Digital Marketing',
    skillOffered: 'Full Stack Development',
    duration: '1 month',
    applications: 8,
    views: 156,
    isRemote: true,
    tags: ['marketing', 'seo', 'strategy'],
    description: 'I want to learn modern digital marketing techniques including SEO, social media marketing, and content strategy. Looking for hands-on guidance and practical tips.',
    postedAt: '2024-01-18',
    deadline: '2024-03-01',
    isBookmarked: true,
    isLiked: false
  },
  {
    id: 3,
    title: 'Spanish Conversation Practice Partner',
    category: 'Language',
    author: 'David Park',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4.7,
    location: 'Seattle, WA',
    skillNeeded: 'Spanish Tutoring',
    skillOffered: 'Guitar Lessons',
    duration: '3 months',
    applications: 15,
    views: 203,
    isRemote: true,
    tags: ['spanish', 'language', 'conversation'],
    description: 'Seeking a native Spanish speaker for regular conversation practice. I\'m intermediate level and want to improve my fluency and confidence in speaking.',
    postedAt: '2024-01-15',
    deadline: '2024-04-15',
    isBookmarked: false,
    isLiked: false
  },
  {
    id: 4,
    title: 'Brand Identity Design for Startup',
    category: 'Creative',
    author: 'Elena Rodriguez',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5.0,
    location: 'Miami, FL',
    skillNeeded: 'Graphic Design',
    skillOffered: 'Business Strategy',
    duration: '3 weeks',
    applications: 6,
    views: 78,
    isRemote: true,
    tags: ['branding', 'design', 'startup'],
    description: 'Need a talented graphic designer to create a complete brand identity for my tech startup. This includes logo, color palette, typography, and brand guidelines.',
    postedAt: '2024-01-22',
    deadline: '2024-02-20',
    isBookmarked: true,
    isLiked: true
  },
  {
    id: 5,
    title: 'Personal Fitness Training Program',
    category: 'Health',
    author: 'Maya Thompson',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4.9,
    location: 'Denver, CO',
    skillNeeded: 'Personal Training',
    skillOffered: 'Photography Lessons',
    duration: '2 months',
    applications: 9,
    views: 134,
    isRemote: false,
    tags: ['fitness', 'health', 'training'],
    description: 'Looking for a certified personal trainer to help me create a custom workout routine and provide ongoing coaching. Want to focus on strength training and overall fitness.',
    postedAt: '2024-01-19',
    deadline: '2024-03-19',
    isBookmarked: false,
    isLiked: false
  },
  {
    id: 6,
    title: 'Learn Music Production Basics',
    category: 'Music',
    author: 'Alex Kumar',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4.8,
    location: 'Nashville, TN',
    skillNeeded: 'Music Production',
    skillOffered: 'Italian Cooking',
    duration: '6 weeks',
    applications: 11,
    views: 167,
    isRemote: true,
    tags: ['music', 'production', 'audio'],
    description: 'Interested in learning music production and audio engineering. Want to understand DAWs, mixing, and mastering techniques for electronic music.',
    postedAt: '2024-01-17',
    deadline: '2024-03-10',
    isBookmarked: false,
    isLiked: true
  }
];

const initialCategories = [
  { name: 'All', icon: '🌟', count: 234 },
  { name: 'Technology', icon: '💻', count: 89 },
  { name: 'Creative', icon: '🎨', count: 67 },
  { name: 'Business', icon: '💼', count: 45 },
  { name: 'Language', icon: '🗣️', count: 34 },
  { name: 'Health', icon: '💪', count: 28 },
  { name: 'Music', icon: '🎵', count: 21 }
];

export default function BrowseSkills() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [locationFilter, setLocationFilter] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillRequests, setSkillRequests] = useState(initialSkillRequests);
  const [categories, setCategories] = useState(initialCategories);
  
    useEffect(() => {
      const fetchSkillRequests = async () => {
        setLoading(true);
  
        try {

          const userId= localStorage.getItem('userId');
          const response = await axios.get(`http://localhost:3000/api/skillreqs/requests/user?excludeUser=${userId}`);
          const fetchedSkills = response.data;
  
          // Make sure fetchedSkills is an array
          if (!Array.isArray(fetchedSkills)) {
            console.warn('Fetched data is not an array:', fetchedSkills);
            return;
          }
          
          // Combine initial data with fetched data
          const allSkills = [...initialSkillRequests, ...fetchedSkills];
          setSkillRequests(fetchedSkills);
          
          // Update categories count based on all skills
          const updatedCategories = initialCategories.map(category => {
            if (category.name === 'All') {
              return { ...category, count: fetchedSkills.length };
            }
            return {
              ...category,
              count: fetchedSkills.filter(skill => skill.category === category.name).length
            };
          });
          
          setCategories(updatedCategories);
          
        } catch (err) {
          console.error("Error fetching skill requests:", err);
          console.log("Failed to fetch skill requests");
        }finally {
          const promise = await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, 1000); // Simulate a 1 second delay
          });
          setLoading(false);
        }
      };
  
      fetchSkillRequests();
    }, []); // Empty dependency array - runs once on mount

  const filteredSkills = skillRequests.filter(skill => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.skillNeeded.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.skillOffered.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || skill.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesRemote = !remoteOnly || skill.isRemote;
    
    return matchesCategory && matchesSearch && matchesLocation && matchesRemote;
  });

  

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      case 'oldest':
        return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      case 'most_applications':
        return b.applications - a.applications;
      case 'most_views':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Skill Requests</h1>
        <p className="text-gray-600 mt-1">Discover amazing opportunities to trade your skills</p>
      </div>


      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skills, technologies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_applications">Most Applications</option>
            <option value="most_views">Most Views</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter city or state..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remote Work</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remote only</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                <p className="text-sm text-gray-600 py-2">
                  Showing {sortedSkills.length} of {skillRequests.length} requests
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center ${
              selectedCategory === category.name
                ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm border border-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading &&(
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedSkills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={skill.avatar}
                  alt={skill.author}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{skill.author}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {skill.location}
                    {skill.isRemote && <span className="ml-2 text-emerald-600">• Remote OK</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{skill.rating}</span>
                </div>
                <button className={`p-2 rounded-full transition-colors ${skill.isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded-full transition-colors ${skill.isLiked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Category Badge */}
            <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
              {skill.category}
            </div>
            
            {/* Title */}
            <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
              {skill.title}
            </h4>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>
            
            {/* Skills Exchange */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Needs:</span>
                <span className="text-sm text-gray-700 ml-2">{skill.skillNeeded}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Offers:</span>
                <span className="text-sm text-gray-700 ml-2">{skill.skillOffered}</span>
              </div>
            </div>
            
            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {skill.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {skill.applications} apps
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {skill.views} views
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {skill.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Apply Button */}
            <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
              Apply Now
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      )}

      {/* No Results */}
      {sortedSkills.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No skill requests found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or browse different categories.
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setLocationFilter('');
              setRemoteOnly(false);
            }}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Load More */}
      {sortedSkills.length > 0 && !loading && (
        <div className="text-center">
          <button className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300">
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
}