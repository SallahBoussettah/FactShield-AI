import React from 'react';

interface MaintenanceSettings {
  enabled: boolean;
  scheduledStart: string;
  scheduledEnd: string;
  message: string;
  allowAdminAccess: boolean;
}

interface MaintenanceModePanelProps {
  settings: MaintenanceSettings;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const MaintenanceModePanel: React.FC<MaintenanceModePanelProps> = ({
  settings,
  onToggle,
  onChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Maintenance Mode</h3>
            <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
              Configure system maintenance mode settings
            </p>
          </div>
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-[var(--color-neutral-900)]">
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              onClick={onToggle}
              type="button"
              className={`
                relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]
                ${settings.enabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-neutral-200)]'}
              `}
              role="switch"
              aria-checked={settings.enabled}
            >
              <span
                aria-hidden="true"
                className={`
                  pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                  ${settings.enabled ? 'translate-x-5' : 'translate-x-0'}
                `}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {settings.enabled && (
        <div className="p-6 bg-[var(--color-neutral-50)] border-b border-[var(--color-neutral-200)]">
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Maintenance Mode Active</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    When maintenance mode is enabled, regular users will not be able to access the application. Make sure to schedule maintenance during low-traffic periods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                Scheduled Maintenance
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--color-neutral-500)] mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledStart"
                    id="scheduledStart"
                    value={settings.scheduledStart}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-neutral-500)] mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledEnd"
                    id="scheduledEnd"
                    value={settings.scheduledEnd}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                Maintenance Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={settings.message}
                onChange={onChange}
                className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm"
                placeholder="Enter the message that will be displayed to users during maintenance"
              />
              <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
                This message will be displayed to users during maintenance.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                Access Options
              </label>
              <div className="p-4 bg-[var(--color-neutral-50)] rounded-lg border border-[var(--color-neutral-200)]">
                <div className="space-y-3">
                  <label className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="allowAdminAccess"
                        name="allowAdminAccess"
                        type="checkbox"
                        checked={settings.allowAdminAccess}
                        onChange={onChange}
                        className="focus:ring-[var(--color-primary)] h-4 w-4 text-[var(--color-primary)] border-[var(--color-neutral-300)] rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-[var(--color-neutral-700)]">
                        Allow Admin Access
                      </span>
                      <p className="text-[var(--color-neutral-500)]">
                        When enabled, administrators can still access the system during maintenance.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-[var(--color-neutral-50)] rounded-lg border border-[var(--color-neutral-200)]">
              <h4 className="text-sm font-medium text-[var(--color-neutral-700)] mb-2">Maintenance Status</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    settings.enabled 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {settings.enabled ? 'Maintenance Scheduled' : 'System Online'}
                  </span>
                </div>
                <button
                  onClick={onToggle}
                  type="button"
                  className={`
                    px-3 py-1 text-xs font-medium rounded-md
                    ${settings.enabled
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                    }
                  `}
                >
                  {settings.enabled ? 'Disable Maintenance' : 'Enable Maintenance'}
                </button>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm font-medium text-[var(--color-neutral-700)] bg-white hover:bg-[var(--color-neutral-50)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModePanel;