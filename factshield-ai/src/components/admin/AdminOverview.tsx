import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RolePermissionDisplay from './RolePermissionDisplay';

// Mock data for demonstration
const mockStats = {
  totalUsers: 1248,
  activeUsers: 876,
  totalAnalyses: 15782,
  flaggedContent: 342,
  averageAccuracy: 92.7,
  systemHealth: 98.5,
  usersByRole: {
    admin: 12,
    editor: 48,
    analyst: 124,
    user: 1064
  },
  contentReviewQueue: 87,
  apiRequests: 45628,
  dailyActiveUsers: 342
};

const mockRecentUsers = [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com', role: 'user', joinDate: '2023-06-15', status: 'active' },
  { id: '2', name: 'Maria Garcia', email: 'maria@example.com', role: 'editor', joinDate: '2023-06-14', status: 'active' },
  { id: '3', name: 'Sam Wilson', email: 'sam@example.com', role: 'user', joinDate: '2023-06-12', status: 'inactive' },
  { id: '4', name: 'Taylor Swift', email: 'taylor@example.com', role: 'user', joinDate: '2023-06-10', status: 'active' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@example.com', role: 'admin', joinDate: '2023-06-08', status: 'active' }
];

const mockRecentAnalyses = [
  { id: '1', title: 'Climate Change Report', user: 'Alex Johnson', date: '2023-06-15', status: 'completed', accuracy: 94.2 },
  { id: '2', title: 'Vaccine Efficacy Study', user: 'Maria Garcia', date: '2023-06-14', status: 'completed', accuracy: 96.8 },
  { id: '3', title: 'Political Statement Analysis', user: 'Sam Wilson', date: '2023-06-12', status: 'flagged', accuracy: 78.5 },
  { id: '4', title: 'Economic Forecast Review', user: 'Taylor Swift', date: '2023-06-10', status: 'completed', accuracy: 91.3 },
  { id: '5', title: 'Social Media Post Analysis', user: 'Jordan Lee', date: '2023-06-08', status: 'flagged', accuracy: 72.1 }
];

const AdminOverview: React.FC = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] rounded-xl shadow-sm p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Administrator'}</h1>
            <p className="mt-1 text-[var(--color-primary-100)]">
              Here's what's happening with FactShield AI today
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>July 23, 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--color-primary-50)]">
              <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)]">Total Users</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-[var(--color-neutral-900)]">{mockStats.totalUsers}</p>
                <p className="ml-2 text-xs font-medium text-[var(--color-success)]">
                  +5.2%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-neutral-500)]">Active Users</span>
              <span className="font-medium text-[var(--color-neutral-900)]">{mockStats.activeUsers}</span>
            </div>
            <div className="mt-1 w-full bg-[var(--color-neutral-100)] rounded-full h-2">
              <div 
                className="bg-[var(--color-primary)] h-2 rounded-full" 
                style={{ width: `${(mockStats.activeUsers / mockStats.totalUsers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Analyses */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--color-info-50)]">
              <svg className="w-6 h-6 text-[var(--color-info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)]">Total Analyses</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-[var(--color-neutral-900)]">{mockStats.totalAnalyses}</p>
                <p className="ml-2 text-xs font-medium text-[var(--color-success)]">
                  +12.4%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-neutral-500)]">Flagged Content</span>
              <span className="font-medium text-[var(--color-neutral-900)]">{mockStats.flaggedContent}</span>
            </div>
            <div className="mt-1 w-full bg-[var(--color-neutral-100)] rounded-full h-2">
              <div 
                className="bg-[var(--color-warning)] h-2 rounded-full" 
                style={{ width: `${(mockStats.flaggedContent / mockStats.totalAnalyses) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--color-success-50)]">
              <svg className="w-6 h-6 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)]">System Performance</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-[var(--color-neutral-900)]">{mockStats.systemHealth}%</p>
                <p className="ml-2 text-xs font-medium text-[var(--color-success)]">
                  +0.8%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-neutral-500)]">Average Accuracy</span>
              <span className="font-medium text-[var(--color-neutral-900)]">{mockStats.averageAccuracy}%</span>
            </div>
            <div className="mt-1 w-full bg-[var(--color-neutral-100)] rounded-full h-2">
              <div 
                className="bg-[var(--color-success)] h-2 rounded-full" 
                style={{ width: `${mockStats.averageAccuracy}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--color-warning-50)]">
              <svg className="w-6 h-6 text-[var(--color-warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)]">Content Review Queue</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-[var(--color-neutral-900)]">{mockStats.contentReviewQueue}</p>
                <p className="ml-2 text-xs font-medium text-[var(--color-warning)]">
                  +8.7%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/content" 
              className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-600)] flex items-center"
            >
              Review content
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* API Requests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--color-neutral-100)]">
              <svg className="w-6 h-6 text-[var(--color-neutral-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)]">API Requests (24h)</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-[var(--color-neutral-900)]">{mockStats.apiRequests}</p>
                <p className="ml-2 text-xs font-medium text-[var(--color-success)]">
                  +3.2%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/analytics" 
              className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-600)] flex items-center"
            >
              View analytics
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Daily Active Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--color-info-50)]">
              <svg className="w-6 h-6 text-[var(--color-info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-[var(--color-neutral-500)]">Daily Active Users</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-[var(--color-neutral-900)]">{mockStats.dailyActiveUsers}</p>
                <p className="ml-2 text-xs font-medium text-[var(--color-success)]">
                  +2.5%
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/users" 
              className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-600)] flex items-center"
            >
              Manage users
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-neutral-200)]">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Role-Based Access Control</h2>
          <p className="text-sm text-[var(--color-neutral-500)] mt-1">
            User roles and permissions in the system
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-medium text-[var(--color-neutral-900)] mb-3">Your Current Roles</h3>
              <RolePermissionDisplay showAllRoles={false} />
            </div>
            <div>
              <h3 className="text-base font-medium text-[var(--color-neutral-900)] mb-3">User Distribution by Role</h3>
              <div className="bg-[var(--color-neutral-50)] rounded-lg p-4">
                {Object.entries(mockStats.usersByRole).map(([role, count]) => (
                  <div key={role} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[var(--color-neutral-700)] capitalize">{role}</span>
                      <span className="font-medium text-[var(--color-neutral-900)]">{count}</span>
                    </div>
                    <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          role === 'admin' ? 'bg-[var(--color-danger)]' : 
                          role === 'editor' ? 'bg-[var(--color-warning)]' : 
                          role === 'analyst' ? 'bg-[var(--color-info)]' : 
                          'bg-[var(--color-primary)]'
                        }`}
                        style={{ width: `${(count / mockStats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Recent Users</h2>
              <Link 
                to="/admin/users" 
                className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-600)]"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
              <thead className="bg-[var(--color-neutral-50)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
                {mockRecentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--color-neutral-50)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[var(--color-neutral-900)]">{user.name}</div>
                          <div className="text-xs text-[var(--color-neutral-500)]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-neutral-900)]">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' 
                          ? 'bg-[var(--color-success-100)] text-[var(--color-success-800)]' 
                          : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)]'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-500)]">
                      {user.joinDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Recent Analyses</h2>
              <Link 
                to="/admin/content" 
                className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-600)]"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
              <thead className="bg-[var(--color-neutral-50)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Accuracy
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
                {mockRecentAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-[var(--color-neutral-50)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--color-neutral-900)]">{analysis.title}</div>
                      <div className="text-xs text-[var(--color-neutral-500)]">{analysis.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-900)]">
                      {analysis.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${analysis.status === 'completed' 
                          ? 'bg-[var(--color-success-100)] text-[var(--color-success-800)]' 
                          : 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
                        }`}
                      >
                        {analysis.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium 
                          ${analysis.accuracy > 90 
                            ? 'text-[var(--color-success)]' 
                            : analysis.accuracy > 80 
                              ? 'text-[var(--color-warning)]' 
                              : 'text-[var(--color-danger)]'
                          }`}
                        >
                          {analysis.accuracy}%
                        </span>
                        <div className="ml-2 w-16 bg-[var(--color-neutral-100)] rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full 
                              ${analysis.accuracy > 90 
                                ? 'bg-[var(--color-success)]' 
                                : analysis.accuracy > 80 
                                  ? 'bg-[var(--color-warning)]' 
                                  : 'bg-[var(--color-danger)]'
                              }`} 
                            style={{ width: `${analysis.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/users/new" 
            className="flex flex-col items-center p-4 border border-[var(--color-neutral-200)] rounded-lg hover:bg-[var(--color-neutral-50)] transition-colors"
          >
            <div className="p-3 rounded-full bg-[var(--color-primary-50)] mb-3">
              <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[var(--color-neutral-900)]">Add User</span>
          </Link>
          
          <Link 
            to="/admin/content/flagged" 
            className="flex flex-col items-center p-4 border border-[var(--color-neutral-200)] rounded-lg hover:bg-[var(--color-neutral-50)] transition-colors"
          >
            <div className="p-3 rounded-full bg-[var(--color-warning-50)] mb-3">
              <svg className="w-6 h-6 text-[var(--color-warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[var(--color-neutral-900)]">Review Flagged</span>
          </Link>
          
          <Link 
            to="/admin/analytics" 
            className="flex flex-col items-center p-4 border border-[var(--color-neutral-200)] rounded-lg hover:bg-[var(--color-neutral-50)] transition-colors"
          >
            <div className="p-3 rounded-full bg-[var(--color-info-50)] mb-3">
              <svg className="w-6 h-6 text-[var(--color-info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[var(--color-neutral-900)]">View Analytics</span>
          </Link>
          
          <Link 
            to="/admin/settings" 
            className="flex flex-col items-center p-4 border border-[var(--color-neutral-200)] rounded-lg hover:bg-[var(--color-neutral-50)] transition-colors"
          >
            <div className="p-3 rounded-full bg-[var(--color-neutral-100)] mb-3">
              <svg className="w-6 h-6 text-[var(--color-neutral-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[var(--color-neutral-900)]">System Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;