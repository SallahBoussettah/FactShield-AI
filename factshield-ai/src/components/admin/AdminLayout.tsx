import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import RoleBasedAccess from './RoleBasedAccess';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  requiredRoles?: string[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  requiredRoles = ['admin'] // Default to admin role
}) => {
  const { authState, hasRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: 'overview',
      name: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'users',
      name: 'User Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'content',
      name: 'Content Moderation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
      name: 'System Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  // Define which sections require specific roles
  const sectionRoles = {
    overview: ['admin', 'editor', 'analyst'],
    users: ['admin'],
    content: ['admin', 'editor'],
    analytics: ['admin', 'analyst'],
    settings: ['admin']
  };

  // Check if user has access to the current section
  const hasAccessToSection = (section: string): boolean => {
    const roles = sectionRoles[section as keyof typeof sectionRoles] || ['admin'];
    return hasRole(roles);
  };

  return (
    <RoleBasedAccess allowedRoles={requiredRoles}>
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
        fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-neutral-900)] shadow-xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-neutral-700)] flex-shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-linear-to-br from-[var(--color-danger)] to-[var(--color-warning)] rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="ml-3 text-lg font-bold text-white">
                  Admin Panel
                </span>
              </div>

              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg text-[var(--color-neutral-400)] hover:text-white hover:bg-[var(--color-neutral-700)] transition-colors"
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
                  disabled={!hasAccessToSection(item.id)}
                  className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                  ${activeSection === item.id
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : hasAccessToSection(item.id)
                        ? 'text-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-800)] hover:text-white'
                        : 'text-[var(--color-neutral-600)] opacity-50 cursor-not-allowed'
                    }
                `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                  {!hasAccessToSection(item.id) && (
                    <span className="ml-auto">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-[var(--color-neutral-700)] p-4 flex-shrink-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold">
                    {authState.user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {authState.user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-[var(--color-neutral-400)]">
                    Administrator
                  </p>
                </div>
                <Link to="/dashboard" className="ml-auto p-2 rounded-lg text-[var(--color-neutral-400)] hover:text-white hover:bg-[var(--color-neutral-700)] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </Link>
              </div>
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

            {/* Page title */}
            <div className="flex-1 flex items-center">
              <h1 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                {navigationItems.find(item => item.id === activeSection)?.name || 'Admin Dashboard'}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-danger)] rounded-full flex items-center justify-center text-xs text-white">3</span>
              </button>
              <button className="p-2 rounded-lg text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
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
    </RoleBasedAccess>
  );
};

export default AdminLayout;