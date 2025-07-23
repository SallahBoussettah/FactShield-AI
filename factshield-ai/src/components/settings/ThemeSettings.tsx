import React from 'react';
import RadioGroup from '../ui/RadioGroup';
import { useSettings } from '../../contexts/SettingsContext';

// Icons for theme options
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--color-warning)]">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--color-neutral-700)]">
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
);

const ComputerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--color-primary)]">
        <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z" clipRule="evenodd" />
    </svg>
);

const ThemeSettings: React.FC = () => {
    const { settingsState, setTheme, saveSettings } = useSettings();
    const { settings } = settingsState;

    const themeOptions = [
        {
            value: 'light' as const,
            label: 'Light',
            description: 'Use light mode for the interface',
            icon: <SunIcon />,
        },
        {
            value: 'dark' as const,
            label: 'Dark',
            description: 'Use dark mode for the interface',
            icon: <MoonIcon />,
        },
        {
            value: 'system' as const,
            label: 'System',
            description: 'Follow your system preferences',
            icon: <ComputerIcon />,
        },
    ];

    const handleThemeChange = async (value: 'light' | 'dark' | 'system') => {
        setTheme(value);
        try {
            await saveSettings();
        } catch (error) {
            console.error('Failed to save theme settings:', error);
            // Could add error handling UI here
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Appearance</h3>
                <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
                    Customize how FactShield AI looks for you
                </p>
            </div>

            <RadioGroup
                name="theme"
                label="Theme"
                options={themeOptions}
                value={settings.theme}
                onChange={handleThemeChange}
                className="mt-4"
            />

            <div className="border-t border-[var(--color-neutral-200)] pt-6">
                <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Accessibility</h3>
                <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
                    Adjust settings to improve your experience
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center">
                    <input
                        id="reduce-motion"
                        name="accessibility"
                        type="checkbox"
                        className="h-5 w-5 rounded border-[var(--color-neutral-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <label htmlFor="reduce-motion" className="ml-3">
                        <span className="block text-sm font-medium text-[var(--color-neutral-800)]">Reduce Motion</span>
                        <span className="block text-sm text-[var(--color-neutral-500)]">
                            Minimize animations throughout the interface
                        </span>
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        id="high-contrast"
                        name="accessibility"
                        type="checkbox"
                        className="h-5 w-5 rounded border-[var(--color-neutral-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <label htmlFor="high-contrast" className="ml-3">
                        <span className="block text-sm font-medium text-[var(--color-neutral-800)]">High Contrast</span>
                        <span className="block text-sm text-[var(--color-neutral-500)]">
                            Increase contrast for better readability
                        </span>
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        id="larger-text"
                        name="accessibility"
                        type="checkbox"
                        className="h-5 w-5 rounded border-[var(--color-neutral-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <label htmlFor="larger-text" className="ml-3">
                        <span className="block text-sm font-medium text-[var(--color-neutral-800)]">Larger Text</span>
                        <span className="block text-sm text-[var(--color-neutral-500)]">
                            Increase text size throughout the application
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ThemeSettings;