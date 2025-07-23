import React from 'react';
import Toggle from '../ui/Toggle';
import { useSettings } from '../../contexts/SettingsContext';

const NotificationSettings: React.FC = () => {
  const { settingsState, setNotificationPreference, saveSettings } = useSettings();
  const { settings, loading } = settingsState;
  
  const handleToggleChange = async (key: keyof typeof settings.notifications, value: boolean) => {
    setNotificationPreference(key, value);
    try {
      await saveSettings();
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      // Could add error handling UI here
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Notification Preferences</h3>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Manage how and when you receive notifications from FactShield AI
        </p>
      </div>
      
      <div className="space-y-4">
        <Toggle
          enabled={settings.notifications.email}
          onChange={(value) => handleToggleChange('email', value)}
          label="Email Notifications"
          description="Receive important updates and alerts via email"
          disabled={loading}
        />
        
        <Toggle
          enabled={settings.notifications.browser}
          onChange={(value) => handleToggleChange('browser', value)}
          label="Browser Notifications"
          description="Get real-time alerts in your browser when using FactShield AI"
          disabled={loading}
        />
        
        <Toggle
          enabled={settings.notifications.weeklyReport}
          onChange={(value) => handleToggleChange('weeklyReport', value)}
          label="Weekly Summary Report"
          description="Receive a weekly report of your fact-checking activity and insights"
          disabled={loading}
        />
      </div>
      
      <div className="border-t border-[var(--color-neutral-200)] pt-6">
        <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Notification Categories</h3>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Choose which types of notifications you want to receive
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="security-notifications"
            name="notification-categories"
            type="checkbox"
            defaultChecked
            className="h-5 w-5 rounded border-[var(--color-neutral-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          <label htmlFor="security-notifications" className="ml-3">
            <span className="block text-sm font-medium text-[var(--color-neutral-800)]">Security Alerts</span>
            <span className="block text-sm text-[var(--color-neutral-500)]">
              Important security notifications about your account
            </span>
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="feature-notifications"
            name="notification-categories"
            type="checkbox"
            defaultChecked
            className="h-5 w-5 rounded border-[var(--color-neutral-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          <label htmlFor="feature-notifications" className="ml-3">
            <span className="block text-sm font-medium text-[var(--color-neutral-800)]">New Features</span>
            <span className="block text-sm text-[var(--color-neutral-500)]">
              Updates about new features and improvements
            </span>
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="tips-notifications"
            name="notification-categories"
            type="checkbox"
            defaultChecked
            className="h-5 w-5 rounded border-[var(--color-neutral-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          <label htmlFor="tips-notifications" className="ml-3">
            <span className="block text-sm font-medium text-[var(--color-neutral-800)]">Tips & Tutorials</span>
            <span className="block text-sm text-[var(--color-neutral-500)]">
              Helpful tips to get the most out of FactShield AI
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;