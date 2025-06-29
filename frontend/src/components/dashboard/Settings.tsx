import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  MessageCircle, 
  CreditCard,
  Palette,
  Accessibility,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  MapPin,
  Clock,
  Zap,
  Monitor,
  Sun,
  Moon,
  Check
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const settingsSections = [
  { id: 'account', name: 'Account', icon: User },
  { id: 'privacy', name: 'Privacy & Security', icon: Shield },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'trading', name: 'Trading Preferences', icon: Globe },
  { id: 'communication', name: 'Communication', icon: MessageCircle },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'accessibility', name: 'Accessibility', icon: Accessibility }
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Account
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@example.com',
    username: 'sarahchen',
    bio: 'Full-stack developer with 5+ years of experience...',
    
    // Privacy & Security
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    twoFactorEnabled: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationFrequency: 'immediate',
    applicationNotifications: true,
    messageNotifications: true,
    reviewNotifications: true,
    
    // Trading Preferences
    availabilityStatus: 'available',
    tradingMethods: ['remote', 'in-person'],
    locationRadius: 25,
    autoMatching: true,
    maxApplications: 10,
    
    // Communication
    messagePreferences: 'verified-only',
    responseTime: '24-hours',
    language: 'en',
    timezone: 'America/Los_Angeles',
    
    // Appearance
    dashboardLayout: 'comfortable',
    reduceAnimations: false,
    
    // Accessibility
    highContrast: false,
    screenReader: false,
    fontSize: 'medium'
  });

  const { theme, setTheme } = useTheme();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayToggle = (key: string, value: any) => {
  setSettings(prev => {
    const currentArray = prev[key as keyof typeof prev] as string[];
    
    return {
      ...prev,
      [key]: currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value]
    };
  });
};

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
            <input
              type="text"
              value={settings.firstName}
              onChange={(e) => handleSettingChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
            <input
              type="text"
              value={settings.lastName}
              onChange={(e) => handleSettingChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
        <input
          type="email"
          value={settings.email}
          onChange={(e) => handleSettingChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
        <input
          type="text"
          value={settings.username}
          onChange={(e) => handleSettingChange('username', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
        <textarea
          value={settings.bio}
          onChange={(e) => handleSettingChange('bio', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Change Password</h4>
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Current password"
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="password"
            placeholder="New password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
        <div className="space-y-3">
          {[
            { value: 'public', label: 'Public', desc: 'Anyone can view your profile' },
            { value: 'members', label: 'Members Only', desc: 'Only registered users can view' },
            { value: 'private', label: 'Private', desc: 'Only you can view your profile' }
          ].map((option) => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={settings.profileVisibility === option.value}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                className="mt-1 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Contact Information</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Show email address</span>
            <input
              type="checkbox"
              checked={settings.showEmail}
              onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Show phone number</span>
            <input
              type="checkbox"
              checked={settings.showPhone}
              onChange={(e) => handleSettingChange('showPhone', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Security</h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.twoFactorEnabled}
            onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Real-time browser notifications</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">SMS Notifications</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Critical updates only</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Notification Types</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">New applications</span>
            <input
              type="checkbox"
              checked={settings.applicationNotifications}
              onChange={(e) => handleSettingChange('applicationNotifications', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">New messages</span>
            <input
              type="checkbox"
              checked={settings.messageNotifications}
              onChange={(e) => handleSettingChange('messageNotifications', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Reviews and ratings</span>
            <input
              type="checkbox"
              checked={settings.reviewNotifications}
              onChange={(e) => handleSettingChange('reviewNotifications', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notification Frequency</label>
        <select
          value={settings.notificationFrequency}
          onChange={(e) => handleSettingChange('notificationFrequency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="immediate">Immediate</option>
          <option value="daily">Daily Digest</option>
          <option value="weekly">Weekly Summary</option>
        </select>
      </div>
    </div>
  );

  const renderTradingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Availability</h3>
        <select
          value={settings.availabilityStatus}
          onChange={(e) => handleSettingChange('availabilityStatus', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="away">Away</option>
        </select>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Trading Methods</h4>
        <div className="space-y-2">
          {[
            { value: 'remote', label: 'Remote/Online' },
            { value: 'in-person', label: 'In-Person' },
            { value: 'hybrid', label: 'Hybrid' }
          ].map((method) => (
            <label key={method.value} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.tradingMethods.includes(method.value)}
                onChange={() => handleArrayToggle('tradingMethods', method.value)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Location Radius (miles): {settings.locationRadius}
        </label>
        <input
          type="range"
          min="5"
          max="100"
          value={settings.locationRadius}
          onChange={(e) => handleSettingChange('locationRadius', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span>5 miles</span>
          <span>100 miles</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Max Applications per Month: {settings.maxApplications}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={settings.maxApplications}
          onChange={(e) => handleSettingChange('maxApplications', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-yellow-600" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Smart Matching</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Get AI-powered skill recommendations</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={settings.autoMatching}
          onChange={(e) => handleSettingChange('autoMatching', e.target.checked)}
          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', icon: Sun, desc: 'Light theme' },
            { value: 'dark', label: 'Dark', icon: Moon, desc: 'Dark theme' },
            { value: 'auto', label: 'Auto', icon: Monitor, desc: 'Follow system' }
          ].map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value as any)}
              className={`p-4 border-2 rounded-lg transition-all ${
                theme === themeOption.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <themeOption.icon className={`w-8 h-8 ${
                  theme === themeOption.value ? 'text-emerald-600' : 'text-gray-400'
                }`} />
                <div className={`font-medium ${
                  theme === themeOption.value ? 'text-emerald-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {themeOption.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{themeOption.desc}</div>
                {theme === themeOption.value && (
                  <Check className="w-5 h-5 text-emerald-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Dashboard Layout</h4>
        <select
          value={settings.dashboardLayout}
          onChange={(e) => handleSettingChange('dashboardLayout', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="compact">Compact</option>
          <option value="comfortable">Comfortable</option>
          <option value="spacious">Spacious</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <div className="font-medium text-gray-900 dark:text-white">Reduce Animations</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Minimize motion for better performance</div>
        </div>
        <input
          type="checkbox"
          checked={settings.reduceAnimations}
          onChange={(e) => handleSettingChange('reduceAnimations', e.target.checked)}
          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
      </div>
    </div>
  );

  const renderCommunicationSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Message Preferences</h3>
        <select
          value={settings.messagePreferences}
          onChange={(e) => handleSettingChange('messagePreferences', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="anyone">Anyone can message me</option>
          <option value="verified-only">Verified users only</option>
          <option value="connections-only">My connections only</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Response Time</label>
        <select
          value={settings.responseTime}
          onChange={(e) => handleSettingChange('responseTime', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="immediate">Within 1 hour</option>
          <option value="24-hours">Within 24 hours</option>
          <option value="48-hours">Within 48 hours</option>
          <option value="weekly">Within a week</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/New_York">Eastern Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Current Plan: Free</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You're currently on the free plan. Upgrade to unlock premium features.
        </p>
        <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300">
          Upgrade to Premium
        </button>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Premium Features</h4>
        <div className="space-y-3">
          {[
            'Unlimited skill requests',
            'Priority matching algorithm',
            'Advanced analytics',
            'Custom profile themes',
            'Priority customer support'
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <div className="font-medium text-gray-900 dark:text-white">High Contrast Mode</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Increase contrast for better visibility</div>
        </div>
        <input
          type="checkbox"
          checked={settings.highContrast}
          onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <div className="font-medium text-gray-900 dark:text-white">Screen Reader Support</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Optimize for screen readers</div>
        </div>
        <input
          type="checkbox"
          checked={settings.screenReader}
          onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
        <select
          value={settings.fontSize}
          onChange={(e) => handleSettingChange('fontSize', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra Large</option>
        </select>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'account': return renderAccountSection();
      case 'privacy': return renderPrivacySection();
      case 'notifications': return renderNotificationsSection();
      case 'trading': return renderTradingSection();
      case 'communication': return renderCommunicationSection();
      case 'billing': return renderBillingSection();
      case 'appearance': return renderAppearanceSection();
      case 'accessibility': return renderAccessibilitySection();
      default: return renderAccountSection();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences and platform settings</p>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-r-2 border-emerald-500'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <section.icon className="w-5 h-5 mr-3" />
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}