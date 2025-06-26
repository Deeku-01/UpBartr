"use client"
import { useEffect, useState } from 'react';
import { MapPin, Star, ChevronRight, Clock, Users, Filter } from 'lucide-react';
import axios from 'axios';



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
    isRemote: true,
    tags: ['react', 'typescript', 'frontend']
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
    isRemote: true,
    tags: ['marketing', 'seo', 'strategy']
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
    isRemote: true,
    tags: ['spanish', 'language', 'conversation']
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
    isRemote: true,
    tags: ['branding', 'design', 'startup']
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
    isRemote: false,
    tags: ['fitness', 'health', 'training']
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
    isRemote: true,
    tags: ['music', 'production', 'audio']
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

export default function SkillShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [skillRequests, setSkillRequests] = useState(initialSkillRequests);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSkillRequests = async () => {
      setLoading(true);

      try {
        const response = await axios.get('http://localhost:3000/api/skillreqs/requests');
        const fetchedSkills = response.data;

        // Make sure fetchedSkills is an array
        if (!Array.isArray(fetchedSkills)) {
          console.warn('Fetched data is not an array:', fetchedSkills);
          return;
        }
        
        // Combine initial data with fetched data
        const allSkills = [...initialSkillRequests, ...fetchedSkills];
        setSkillRequests(allSkills);
        
        // Update categories count based on all skills
        const updatedCategories = initialCategories.map(category => {
          if (category.name === 'All') {
            return { ...category, count: allSkills.length };
          }
          return {
            ...category,
            count: allSkills.filter(skill => skill.category === category.name).length
          };
        });
        
        setCategories(updatedCategories);
        
      } catch (err) {
        console.error("Error fetching skill requests:", err);
        console.log("Failed to fetch skill requests");
      }finally {
        setLoading(false);
      }
    };

    fetchSkillRequests();
  }, []); // Empty dependency array - runs once on mount

 
  const filteredSkills = selectedCategory === 'All' 
    ? skillRequests 
    : skillRequests.filter(skill => skill.category === selectedCategory);

      // Show loading state
  if (loading) {
    return (
      <section id="browse-skills" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading skill requests...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="browse-skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Browse Active Skill Requests</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing opportunities to trade your skills and learn something new
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center ${
                selectedCategory === category.name
                  ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
              <span className="ml-2 text-sm opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
        
        {/* Skill Request Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.slice(0,9).map((skill) => (
            <div key={skill.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group border border-gray-100">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center mb-4">
                  <img
                    src={skill.avatar}
                    alt={skill.author}
                    className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-gray-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{skill.author}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {skill.location}
                      {skill.isRemote && <span className="ml-2 text-emerald-600">• Remote OK</span>}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{skill.rating}</span>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {skill.category}
                </div>
                
                {/* Title */}
                <h4 className="font-bold text-lg text-gray-900 mb-4 line-clamp-2">{skill.title}</h4>
                
                {/* Skills Exchange */}
                <div className="space-y-3 mb-4">
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
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {skill.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {skill.applications} applications
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
                
                {/* Apply Button -> onClick( "Transfer to application page that applies to the following skill trade") */}
                <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                  Apply Now
                  <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* It should be redirected to a Page that can display  all the Skill requests in the backend */}
        
        <div className="text-center mt-12">
          <button className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center mx-auto" onClick={()=> setSelectedCategory('All')}>
            <Filter className="mr-2 w-5 h-5" />
            View All Skill Requests
          </button>
        </div>
      </div>
    </section>
  );
}