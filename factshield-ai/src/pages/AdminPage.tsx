import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';

// This is a placeholder component for other admin sections
// In a real implementation, these would be separate components
const AdminSectionPlaceholder: React.FC<{ section: string }> = ({ section }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-4">
      {section.charAt(0).toUpperCase() + section.slice(1)} Section
    </h2>
    <p className="text-[var(--color-neutral-600)]">
      This is the {section} section of the admin dashboard. Implementation in progress.
    </p>
  </div>
);

const AdminPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Define which roles are required for each section
  const sectionRoles = {
    overview: ['admin', 'editor', 'analyst'],
    users: ['admin'],
    content: ['admin', 'editor'],
    analytics: ['admin', 'analyst'],
    settings: ['admin']
  };

  // Get required roles for current section
  const getRequiredRoles = (): string[] => {
    return sectionRoles[activeSection as keyof typeof sectionRoles] || ['admin'];
  };

  // Render the appropriate component based on active section
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'content':
        return <AdminSectionPlaceholder section="content moderation" />;
      case 'analytics':
        return <AdminSectionPlaceholder section="analytics" />;
      case 'settings':
        return <AdminSectionPlaceholder section="system settings" />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <AdminLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
      requiredRoles={getRequiredRoles()}
    >
      {renderSection()}
    </AdminLayout>
  );
};

export default AdminPage;