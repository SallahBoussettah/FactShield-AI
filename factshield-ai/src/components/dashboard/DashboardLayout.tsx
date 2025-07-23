import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import UserProfileSection from './UserProfileSection';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeSection,
  onSectionChange
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authState } = useAuth();

  const navigationItems = [
    {
      id: 'overview',
      name: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      )
    },
    {
      id: 'analyze',
      name: 'Analyze Content',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'history',
      name: 'History',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="h-screen flex bg-[var(--color-neutral-50)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out border-r border-[var(--color-neutral-200)]
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-neutral-200)] flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-linear-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="ml-3 text-lg font-bold text-[var(--color-neutral-900)]">
                FactShield AI
              </span>
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setSidebarOpen(false); // Close mobile sidebar on selection
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                  ${activeSection === item.id
                    ? 'bg-linear-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white shadow-sm'
                    : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]'
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            ))}
            
            {/* Admin Dashboard Link - Only visible for admin users */}
            {authState.user?.roles?.includes('admin') && (
              <Link
                to="/admin"
                className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mt-2
                  text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-[var(--color-neutral-200)] flex-shrink-0">
            <UserProfileSection />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-[var(--color-neutral-200)] flex-shrink-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search bar placeholder */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search analyses..."
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Notifications and Admin Indicator */}
          <div className="flex items-center space-x-4">
            {/* Admin Badge - Only visible for admin users */}
            {authState.user?.roles?.includes('admin') && (
              <Link 
                to="/admin"
                className="flex items-center px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)] hover:bg-[var(--color-primary-100)] transition-colors"
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin
              </Link>
            )}
            
            <button className="relative p-2 rounded-lg text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84l3.12 3.12M4.03 8.86l3.12 3.12M1.01 11.88l3.12 3.12" />
              </svg>
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-danger)] rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;