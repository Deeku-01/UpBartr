import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({ variant = 'icon', size = 'md' }: ThemeToggleProps) {
  const { theme, actualTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'auto':
        return Monitor;
      default:
        return actualTheme === 'dark' ? Moon : Sun;
    }
  };

  const Icon = getIcon();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  if (variant === 'button') {
    return (
      <button
        onClick={cycleTheme}
        className={`${buttonSizeClasses[size]} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group`}
        title={`Current theme: ${theme} (click to cycle)`}
      >
        <Icon className={`${sizeClasses[size]} transition-transform group-hover:scale-110`} />
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className={`${buttonSizeClasses[size]} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group relative`}
      title={`Current theme: ${theme} (click to cycle)`}
    >
      <Icon className={`${sizeClasses[size]} transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`} />
      
      {/* Theme indicator dot */}
      <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-colors ${
        theme === 'light' ? 'bg-yellow-400' :
        theme === 'dark' ? 'bg-blue-400' :
        'bg-green-400'
      }`} />
    </button>
  );
}