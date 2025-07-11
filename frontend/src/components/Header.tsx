"use client"

import  { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import myImage from '../assets/UpBartr.jpg'
import SignupModal from './SignUp';
import SigninModal from './SignIn';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isSigninOpen, setIsSigninOpen] = useState(false)
  const [isloggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img src={myImage} alt='Upbartr' className="logo" height={20} width={63}/>
            {/* <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              
            </div> */}
            {/* <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              UpBartr
            </span> */}
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">How it Works</a>
            <a href="#browse-skills" className="text-gray-600 hover:text-emerald-600 transition-colors">Browse Skills</a>
            <a href="#success-stories" className="text-gray-600 hover:text-emerald-600 transition-colors">Success Stories</a>
            {!isloggedIn ? (
            <div className='flex items-center space-x-4'>
            <button className="text-gray-600 hover:text-emerald-600 transition-colors" onClick={()=> setIsSigninOpen(true)}>Sign In</button>
            <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center group" onClick={() => setIsSignupOpen(true)}>
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            </div>
            ) : (
              <span>
              <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center group" onClick={() => window.location.href = '/dashboard'}>
                Dashboard
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              </span>
            )}
            <ThemeToggle size="md" />
            
          </div>


          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle size="sm" />
            <button 
              className="text-gray-600 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
         
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-2 space-y-2">
            <a href="#how-it-works" className="block py-2 text-gray-600">How it Works</a>
            <a href="#browse-skills" className="block py-2 text-gray-600">Browse Skills</a>
            <a href="#success-stories" className="block py-2 text-gray-600">Success Stories</a>
            <button className="block py-2 text-gray-600" onClick={()=> setIsSigninOpen(true)}>Sign In</button>
            <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-2 rounded-full mt-4"  onClick={() => setIsSignupOpen(true)}>
              Get Started
            </button>
          </div>
        </div>
      )}
      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToSignin={() => setIsSigninOpen(true)}
      />

      {/* Signin Modal */}
      <SigninModal
        isOpen={isSigninOpen}
        onClose={() => setIsSigninOpen(false)}
        onSwitchToSignup={() => setIsSignupOpen(true)}
      />
    </nav>
  );
}