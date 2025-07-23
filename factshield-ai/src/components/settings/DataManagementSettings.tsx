import React, { useState } from 'react';
import Toggle from '../ui/Toggle';
import RangeSlider from '../ui/RangeSlider';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { deleteUserData, exportUserData } from '../../services/settingsService';

const DataManagementSettings: React.FC = () => {
  const { settingsState, setDataRetention, setPrivacySetting, saveSettings } = useSettings();
  const { authState } = useAuth();
  const { settings, loading } = settingsState;
  
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'history' | 'all'>('history');
  const [actionMessage, setActionMessage] = useState('');
  
  const handleToggleChange = async (
    settingType: 'dataRetention' | 'privacySettings',
    key: string,
    value: boolean | number
  ) => {
    if (settingType === 'dataRetention') {
      setDataRetention(key as keyof typeof settings.dataRetention, value);
    } else {
      setPrivacySetting(key as keyof typeof settings.privacySettings, value as boolean);
    }
    
    try {
      await saveSettings();
    } catch (error) {
      console.error('Failed to save data management settings:', error);
      // Could add error handling UI here
    }
  };
  
  const handleExportData = async () => {
    if (!authState.user?.id) return;
    
    setIsExporting(true);
    setActionMessage('');
    
    try {
      const blob = await exportUserData(authState.user.id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `factshield-data-${new Date().toISOString().split('T')[0]}.json`;
      
      // Append to body, click and remove
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setActionMessage('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      setActionMessage('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleDeleteRequest = (type: 'history' | 'all') => {
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!authState.user?.id) return;
    
    setIsDeleting(true);
    setActionMessage('');
    
    try {
      await deleteUserData(authState.user.id, deleteType);
      setActionMessage(`${deleteType === 'history' ? 'History' : 'All data'} deleted successfully`);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting data:', error);
      setActionMessage('Failed to delete data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Data Retention</h3>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Control how long your data is stored
        </p>
      </div>
      
      <RangeSlider
        min={7}
        max={90}
        step={1}
        value={settings.dataRetention.historyDays}
        onChange={(value) => handleToggleChange('dataRetention', 'historyDays', value)}
        label="History Retention Period"
        valueDisplay={(value) => `${value} days`}
        className="mt-4"
      />
      
      <Toggle
        enabled={settings.dataRetention.autoDeleteEnabled}
        onChange={(value) => handleToggleChange('dataRetention', 'autoDeleteEnabled', value)}
        label="Auto-delete old history"
        description={`Automatically delete history items older than ${settings.dataRetention.historyDays} days`}
        disabled={loading}
      />
      
      <div className="border-t border-[var(--color-neutral-200)] pt-6">
        <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Privacy Settings</h3>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Manage how your data is used
        </p>
      </div>
      
      <Toggle
        enabled={settings.privacySettings.shareAnalytics}
        onChange={(value) => handleToggleChange('privacySettings', 'shareAnalytics', value)}
        label="Share anonymous usage data"
        description="Help us improve FactShield AI by sharing anonymous usage statistics"
        disabled={loading}
      />
      
      <Toggle
        enabled={settings.privacySettings.enhanceAI}
        onChange={(value) => handleToggleChange('privacySettings', 'enhanceAI', value)}
        label="Contribute to AI improvement"
        description="Allow us to use your fact-checking results to improve our AI models"
        disabled={loading}
      />
      
      <div className="border-t border-[var(--color-neutral-200)] pt-6">
        <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Data Management</h3>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Export or delete your data
        </p>
      </div>
      
      {actionMessage && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${
          actionMessage.includes('Failed') 
            ? 'text-[var(--color-danger)] bg-[color-mix(in_srgb,var(--color-danger),white_90%)]'
            : 'text-[var(--color-secondary)] bg-[color-mix(in_srgb,var(--color-secondary),white_90%)]'
        }`}>
          {actionMessage}
        </div>
      )}
      
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <button
          type="button"
          onClick={handleExportData}
          disabled={isExporting || !authState.isAuthenticated}
          className={`
            px-6 py-3 bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)] rounded-md text-base
            border border-[var(--color-neutral-300)]
            hover:bg-[var(--color-neutral-200)]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]
            ${(isExporting || !authState.isAuthenticated) ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {isExporting ? 'Exporting...' : 'Export Your Data'}
        </button>
        
        <button
          type="button"
          onClick={() => handleDeleteRequest('history')}
          disabled={isDeleting || !authState.isAuthenticated}
          className={`
            px-6 py-3 bg-[var(--color-neutral-100)] text-[var(--color-warning)] rounded-md text-base
            border border-[var(--color-warning)]
            hover:bg-[color-mix(in_srgb,var(--color-warning),white_90%)]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-warning)]
            ${(isDeleting || !authState.isAuthenticated) ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          Delete History
        </button>
        
        <button
          type="button"
          onClick={() => handleDeleteRequest('all')}
          disabled={isDeleting || !authState.isAuthenticated}
          className={`
            px-6 py-3 bg-[var(--color-neutral-100)] text-[var(--color-danger)] rounded-md text-base
            border border-[var(--color-danger)]
            hover:bg-[color-mix(in_srgb,var(--color-danger),white_90%)]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-danger)]
            ${(isDeleting || !authState.isAuthenticated) ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          Delete All Data
        </button>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[var(--color-neutral-900)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-sm text-[var(--color-neutral-600)]">
              {deleteType === 'history'
                ? 'Are you sure you want to delete all your history? This action cannot be undone.'
                : 'Are you sure you want to delete all your data? This includes your history, preferences, and saved items. This action cannot be undone.'}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)] rounded-md text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`
                  px-6 py-3 bg-[var(--color-danger)] text-white rounded-md text-base
                  hover:bg-[color-mix(in_srgb,var(--color-danger),black_10%)]
                  ${isDeleting ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagementSettings;