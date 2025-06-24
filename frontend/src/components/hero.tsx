
import { ArrowRight, Users, Shield, Zap, TrendingUp, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-pulse">
            <TrendingUp className="w-4 h-4 mr-2" />
            Join 50,000+ skill traders worldwide
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Trade Skills,{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Not Money
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with talented individuals worldwide to exchange skills, learn new things, and build meaningful relationships. No money required, just passion and expertise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center group shadow-lg">
              Start Trading Skills
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center group">
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/70 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-3xl text-gray-900 mb-1">50K+</div>
              <div className="text-gray-600 font-medium">Active Traders</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/70 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-3xl text-gray-900 mb-1">98%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/70 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-3xl text-gray-900 mb-1">24hr</div>
              <div className="text-gray-600 font-medium">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}