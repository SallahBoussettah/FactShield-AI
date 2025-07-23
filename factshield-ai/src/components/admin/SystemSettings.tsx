import React, { useState } from 'react';
import RoleBasedAccess from './RoleBasedAccess';
import AIModelCard from './settings/AIModelCard';
import NotificationCard from './settings/NotificationCard';
import MaintenanceModePanel from './settings/MaintenanceModePanel';

// Define types for AI models and notification settings
interface AIModel {
  id: string;
  name: string;
  type: 'claim-extraction' | 'credibility-assessment' | 'source-verification' | 'translation';
  version: string;
  status: 'active' | 'disabled';
  confidence: number;
  description: string;
}

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  audience: 'all' | 'admin' | 'users';
  active: boolean;
  startDate: string;
  endDate: string;
}

interface MaintenanceSettings {
  enabled: boolean;
  scheduledStart: string;
  scheduledEnd: string;
  message: string;
  allowAdminAccess: boolean;
}

const SystemSettings: React.FC = () => {
  // Mock data for AI models
  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      id: 'model-1',
      name: 'ClaimBERT',
      type: 'claim-extraction',
      version: '1.2.0',
      status: 'active',
      confidence: 0.85,
      description: 'Extracts factual claims from text using BERT architecture'
    },
    {
      id: 'model-2',
      name: 'CredibilityGPT',
      type: 'credibility-assessment',
      version: '2.1.0',
      status: 'active',
      confidence: 0.78,
      description: 'Assesses claim credibility using GPT architecture'
    },
    {
      id: 'model-3',
      name: 'SourceVerifier',
      type: 'source-verification',
      version: '1.0.5',
      status: 'active',
      confidence: 0.92,
      description: 'Verifies sources against trusted databases'
    },
    {
      id: 'model-4',
      name: 'MultiLingualTranslator',
      type: 'translation',
      version: '1.3.2',
      status: 'disabled',
      confidence: 0.88,
      description: 'Translates content from 50+ languages'
    }
  ]);

  // Mock data for system notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-1',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on July 25, 2025 from 2:00 AM to 4:00 AM UTC',
      type: 'info',
      audience: 'all',
      active: true,
      startDate: '2025-07-24T00:00:00Z',
      endDate: '2025-07-26T00:00:00Z'
    },
    {
      id: 'notif-2',
      title: 'New AI Model Available',
      message: 'Try our new improved credibility assessment model',
      type: 'success',
      audience: 'users',
      active: true,
      startDate: '2025-07-20T00:00:00Z',
      endDate: '2025-08-20T00:00:00Z'
    }
  ]);

  // Maintenance mode settings
  const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings>({
    enabled: false,
    scheduledStart: '2025-07-25T02:00',
    scheduledEnd: '2025-07-25T04:00',
    message: 'FactShield AI is currently undergoing scheduled maintenance. We apologize for the inconvenience.',
    allowAdminAccess: true
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState<'models' | 'notifications' | 'maintenance'>('models');

  // Handle model status toggle
  const toggleModelStatus = (modelId: string) => {
    setAiModels(models => models.map(model => {
      if (model.id === modelId) {
        return {
          ...model,
          status: model.status === 'active' ? 'disabled' : 'active'
        };
      }
      return model;
    }));
  };

  // Handle notification status toggle
  const toggleNotificationStatus = (notificationId: string) => {
    setNotifications(notifs => notifs.map(notif => {
      if (notif.id === notificationId) {
        return {
          ...notif,
          active: !notif.active
        };
      }
      return notif;
    }));
  };

  // Handle maintenance mode toggle
  const toggleMaintenanceMode = () => {
    setMaintenanceSettings(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  // Handle maintenance settings change
  const handleMaintenanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setMaintenanceSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <RoleBasedAccess allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-neutral-900)]">System Settings</h2>
            <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
              Configure AI models, system notifications, and maintenance mode
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            >
              Save All Changes
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--color-neutral-200)]">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('models')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'models'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-300)]'
                }
              `}
            >
              AI Models
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'notifications'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-300)]'
                }
              `}
            >
              System Notifications
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'maintenance'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-300)]'
                }
              `}
            >
              Maintenance Mode
            </button>
          </nav>
        </div>

        {/* AI Models Configuration */}
        {activeTab === 'models' && (
          <div>
            <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">AI Model Configuration</h3>
                  <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
                    Configure and manage AI models used for fact-checking and analysis
                  </p>
                </div>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Model
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiModels.map((model) => (
                  <AIModelCard 
                    key={model.id} 
                    model={model} 
                    onToggleStatus={toggleModelStatus}
                    onConfigure={(id) => console.log(`Configure model ${id}`)}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
                <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Model Performance Metrics</h3>
                <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
                  Monitor the performance of AI models over time
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[var(--color-neutral-50)] rounded-lg p-4 border border-[var(--color-neutral-200)]">
                    <h4 className="text-sm font-medium text-[var(--color-neutral-700)]">Average Confidence</h4>
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl font-bold text-[var(--color-neutral-900)]">86%</span>
                      <span className="ml-2 text-sm text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        2.3%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
                      Compared to last month
                    </p>
                  </div>
                  
                  <div className="bg-[var(--color-neutral-50)] rounded-lg p-4 border border-[var(--color-neutral-200)]">
                    <h4 className="text-sm font-medium text-[var(--color-neutral-700)]">Processing Time</h4>
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl font-bold text-[var(--color-neutral-900)]">1.2s</span>
                      <span className="ml-2 text-sm text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        0.3s
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
                      Average processing time per request
                    </p>
                  </div>
                  
                  <div className="bg-[var(--color-neutral-50)] rounded-lg p-4 border border-[var(--color-neutral-200)]">
                    <h4 className="text-sm font-medium text-[var(--color-neutral-700)]">API Calls</h4>
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl font-bold text-[var(--color-neutral-900)]">24.5K</span>
                      <span className="ml-2 text-sm text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        12%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
                      Total API calls this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">System Notifications</h3>
                <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
                  Manage system-wide notifications for users and administrators
                </p>
              </div>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Notification
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {notifications.map((notification) => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onToggleStatus={toggleNotificationStatus}
                  onEdit={(id) => console.log(`Edit notification ${id}`)}
                />
              ))}
              
              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-[var(--color-neutral-900)]">No notifications</h3>
                  <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
                    Get started by creating a new notification.
                  </p>
                  <div className="mt-6">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Notification
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Maintenance Mode */}
        {activeTab === 'maintenance' && (
          <MaintenanceModePanel
            settings={maintenanceSettings}
            onToggle={toggleMaintenanceMode}
            onChange={handleMaintenanceChange}
            onSave={() => console.log('Save maintenance settings')}
            onCancel={() => console.log('Cancel maintenance settings')}
          />
        )}
      </div>
    </RoleBasedAccess>
  );
};

export default SystemSettings;