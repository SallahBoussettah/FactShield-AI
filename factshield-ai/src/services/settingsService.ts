// Settings service for FactShield AI
// Handles API calls related to user settings

// User settings interface
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    browser: boolean;
    weeklyReport: boolean;
  };
  dataRetention: {
    historyDays: number;
    autoDeleteEnabled: boolean;
  };
  privacySettings: {
    shareAnalytics: boolean;
    enhanceAI: boolean;
  };
}

// Default settings
export const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: {
    email: true,
    browser: true,
    weeklyReport: true,
  },
  dataRetention: {
    historyDays: 30,
    autoDeleteEnabled: true,
  },
  privacySettings: {
    shareAnalytics: true,
    enhanceAI: true,
  },
};

/**
 * Get user settings
 */
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // return await get<UserSettings>(`/users/${userId}/settings`);

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Try to get settings from localStorage for demo purposes
    const storedSettings = localStorage.getItem(`user_settings_${userId}`);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }

    // Return default settings if none found
    return defaultSettings;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    // Return default settings on error
    return defaultSettings;
  }
};

/**
 * Update user settings
 */
export const updateUserSettings = async (userId: string, settings: UserSettings): Promise<UserSettings> => {
  try {
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // return await put<UserSettings>(`/users/${userId}/settings`, settings);

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 700));

    // Store settings in localStorage for demo purposes
    localStorage.setItem(`user_settings_${userId}`, JSON.stringify(settings));

    return settings;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Delete user data
 */
export const deleteUserData = async (userId: string, dataType: 'history' | 'all'): Promise<void> => {
  try {
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // return await delete<void>(`/users/${userId}/data/${dataType}`);

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, clear localStorage data
    if (dataType === 'history') {
      localStorage.removeItem(`user_history_${userId}`);
    } else if (dataType === 'all') {
      // Clear all user-related data except settings
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes(`user_${userId}`) && !key.includes('settings')) {
          localStorage.removeItem(key);
        }
      });
    }

    console.log(`User data (${dataType}) deleted for user ${userId}`);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};

/**
 * Export user data
 */
export const exportUserData = async (userId: string): Promise<Blob> => {
  try {
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // return await get<Blob>(`/users/${userId}/export`, { responseType: 'blob' });

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // For demo purposes, create a JSON blob with mock data
    const mockData = {
      userId,
      settings: await getUserSettings(userId),
      history: [
        { id: 'hist1', date: new Date().toISOString(), url: 'https://example.com/article1', score: 0.85 },
        { id: 'hist2', date: new Date(Date.now() - 86400000).toISOString(), url: 'https://example.com/article2', score: 0.42 },
      ],
      profile: {
        name: 'Demo User',
        email: 'user@example.com',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      }
    };

    return new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
};