import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { UserSettings } from '../services/settingsService';
import { 
  defaultSettings, 
  getUserSettings, 
  updateUserSettings 
} from '../services/settingsService';

// Settings context state
interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SettingsState = {
  settings: defaultSettings,
  loading: true,
  error: null
};

// Action types
type SettingsAction = 
  | { type: 'FETCH_SETTINGS_SUCCESS'; payload: UserSettings }
  | { type: 'FETCH_SETTINGS_FAILURE'; payload: string }
  | { type: 'UPDATE_SETTINGS_SUCCESS'; payload: UserSettings }
  | { type: 'UPDATE_SETTINGS_FAILURE'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_NOTIFICATION_PREFERENCE'; payload: { key: keyof UserSettings['notifications']; value: boolean } }
  | { type: 'SET_DATA_RETENTION'; payload: { key: keyof UserSettings['dataRetention']; value: number | boolean } }
  | { type: 'SET_PRIVACY_SETTING'; payload: { key: keyof UserSettings['privacySettings']; value: boolean } }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer function
const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'FETCH_SETTINGS_SUCCESS':
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_SETTINGS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_SETTINGS_SUCCESS':
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null
      };
    case 'UPDATE_SETTINGS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_THEME':
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: action.payload
        }
      };
    case 'SET_NOTIFICATION_PREFERENCE':
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: {
            ...state.settings.notifications,
            [action.payload.key]: action.payload.value
          }
        }
      };
    case 'SET_DATA_RETENTION':
      return {
        ...state,
        settings: {
          ...state.settings,
          dataRetention: {
            ...state.settings.dataRetention,
            [action.payload.key]: action.payload.value
          }
        }
      };
    case 'SET_PRIVACY_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          privacySettings: {
            ...state.settings.privacySettings,
            [action.payload.key]: action.payload.value
          }
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Context type
interface SettingsContextType {
  settingsState: SettingsState;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotificationPreference: (key: keyof UserSettings['notifications'], value: boolean) => void;
  setDataRetention: (key: keyof UserSettings['dataRetention'], value: number | boolean) => void;
  setPrivacySetting: (key: keyof UserSettings['privacySettings'], value: boolean) => void;
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const { authState } = useAuth();

  // Apply theme effect
  useEffect(() => {
    if (!state.loading) {
      applyTheme(state.settings.theme);
    }
  }, [state.settings.theme, state.loading]);

  // Load settings when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      loadSettings();
    } else {
      // Reset to default settings when not authenticated
      dispatch({ type: 'FETCH_SETTINGS_SUCCESS', payload: defaultSettings });
    }
  }, [authState.isAuthenticated, authState.user?.id]);

  // Function to apply theme
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      // Use explicit theme
      root.classList.add(theme);
    }
  };

  // Load user settings
  const loadSettings = async () => {
    if (!authState.user?.id) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const settings = await getUserSettings(authState.user.id);
      dispatch({ type: 'FETCH_SETTINGS_SUCCESS', payload: settings });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_SETTINGS_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to load settings' 
      });
    }
  };

  // Save user settings
  const saveSettings = async (): Promise<void> => {
    if (!authState.user?.id) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedSettings = await updateUserSettings(authState.user.id, state.settings);
      dispatch({ type: 'UPDATE_SETTINGS_SUCCESS', payload: updatedSettings });
      // Don't return the settings, just return void
    } catch (error) {
      dispatch({ 
        type: 'UPDATE_SETTINGS_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to update settings' 
      });
      throw error;
    }
  };

  // Set theme
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  // Set notification preference
  const setNotificationPreference = (key: keyof UserSettings['notifications'], value: boolean) => {
    dispatch({ type: 'SET_NOTIFICATION_PREFERENCE', payload: { key, value } });
  };

  // Set data retention setting
  const setDataRetention = (key: keyof UserSettings['dataRetention'], value: number | boolean) => {
    dispatch({ type: 'SET_DATA_RETENTION', payload: { key, value } });
  };

  // Set privacy setting
  const setPrivacySetting = (key: keyof UserSettings['privacySettings'], value: boolean) => {
    dispatch({ type: 'SET_PRIVACY_SETTING', payload: { key, value } });
  };

  return (
    <SettingsContext.Provider
      value={{
        settingsState: state,
        loadSettings,
        saveSettings,
        setTheme,
        setNotificationPreference,
        setDataRetention,
        setPrivacySetting
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};