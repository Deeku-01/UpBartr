
import { Star, CheckCircle, Clock, Award, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Full Stack Developer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    comment: "I traded my coding skills for professional photography lessons. Not only did I learn a new skill, but I also made a lifelong friend. UpBartr changed my perspective on learning!",
    skillsTraded: "Web Development ↔ Photography",
    timeAgo: "2 weeks ago",
    verified: true,
    gradient: "from-emerald-50 to-white border-emerald-100"
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Professional Photographer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    comment: "Exchanging my photography skills for digital marketing expertise helped me grow my business exponentially. The knowledge I gained was worth thousands of dollars in courses!",
    skillsTraded: "Photography ↔ Digital Marketing",
    timeAgo: "1 month ago",
    verified: true,
    gradient: "from-blue-50 to-white border-blue-100"
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Marketing Specialist',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    comment: "I've completed over 15 skill trades on UpBartr. From learning Spanish to mastering graphic design, each exchange has enriched my life and career in unexpected ways.",
    skillsTraded: "Marketing ↔ Multiple Skills",
    timeAgo: "3 weeks ago",
    topTrader: true,
    gradient: "from-purple-50 to-white border-purple-100"
  }
];

const stats = [
  { label: 'Successful Exchanges', value: '25,000+', icon: CheckCircle, color: 'text-emerald-600' },
  { label: 'Average Rating', value: '4.8/5', icon: Star, color: 'text-yellow-500' },
  { label: 'Skills Categories', value: '50+', icon: Award, color: 'text-blue-600' },
  { label: 'Countries', value: '120+', icon: Clock, color: 'text-purple-600' }
];

export default function SuccessStories() {
  return (
    <section id="success-stories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from our community of skill traders who transformed their lives through knowledge exchange
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={`bg-gradient-to-br ${testimonial.gradient} rounded-2xl p-8 border relative overflow-hidden`}>
              {/* Quote decoration */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-200" />
              
              {/* Header */}
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-white shadow-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
                <div className="flex items-center">
                  {testimonial.verified && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                  )}
                  {testimonial.topTrader && (
                    <Award className="w-5 h-5 text-purple-500 mr-2" />
                  )}
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Comment */}
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                "{testimonial.comment}"
              </p>
              
              {/* Skills Traded */}
              <div className="bg-white/50 rounded-lg p-3 mb-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Skills Traded:</div>
                <div className="text-sm font-semibold text-gray-800">{testimonial.skillsTraded}</div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {testimonial.timeAgo}
                </div>
                {testimonial.verified && (
                  <span className="text-emerald-600 font-medium">Verified</span>
                )}
                {testimonial.topTrader && (
                  <span className="text-purple-600 font-medium">Top Learner</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Join thousands of learners and experts who are transforming their lives through skill exchange.
            </p>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}