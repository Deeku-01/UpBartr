import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors">
      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className="text-xl font-bold">UpBartr</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 mb-6 max-w-md leading-relaxed">
                The world's first skill bartering platform where knowledge meets opportunity, and everyone wins. Trade skills, not money.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">ig</span>
                </div>
              </div>
            </div>
            
            {/* Platform Links */}
            <div>
              <h4 className="font-semibold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Browse Skills</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Safety & Trust</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Mobile App</a></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="border-t border-gray-800 dark:border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              Get the latest skill trading opportunities and platform updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800 rounded-full text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 dark:border-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">© 2025 UpBartr. All rights reserved.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-4 md:mt-0">Made with ❤️ for the skill trading community</p>
          </div>
        </div>
      </div>
    </footer>
  );
}