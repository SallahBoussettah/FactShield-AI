import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import ContentModeration from '../components/admin/ContentModeration';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import SystemSettings from '../components/admin/SystemSettings';



const AdminPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const location = useLocation();
  
  // Check if we have a section in the location state (from navigation)
  useEffect(() => {
    if (location.state && location.state.section) {
      setActiveSection(location.state.section);
    }
  }, [location]);

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
        return <ContentModeration />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'settings':
        return <SystemSettings />;
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