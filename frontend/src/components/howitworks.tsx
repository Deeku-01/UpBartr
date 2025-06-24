
import { Users, Search, MessageCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Users,
      title: 'Create Your Profile',
      description: 'List the skills you can offer and what you\'d like to learn. Add your location, availability, and experience level.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Search,
      title: 'Find Your Match',
      description: 'Browse skill requests, filter by location and category, or let our smart matching algorithm find perfect trading partners.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Start Trading',
      description: 'Apply to skill requests, chat with potential partners, and arrange your skill exchange. Track progress and build your reputation.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How UpBartr Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, secure, and rewarding skill exchanges in three easy steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-purple-200"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg relative z-10`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-gray-100 z-20 md:block hidden"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{index + 1}. {step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-gray-300 mx-auto mt-6 md:hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}