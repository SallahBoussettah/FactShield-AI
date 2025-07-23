import React, { useState } from 'react';

// Mock data for demonstration
const mockUserActivity = [
  { id: '1', user: 'Alex Johnson', action: 'Content Analysis', resource: 'Climate Change Report', timestamp: '2025-07-23T14:32:45', ip: '192.168.1.105' },
  { id: '2', user: 'Maria Garcia', action: 'Login', resource: 'Dashboard', timestamp: '2025-07-23T14:28:12', ip: '192.168.1.106' },
  { id: '3', user: 'Sam Wilson', action: 'URL Analysis', resource: 'https://example.com/news', timestamp: '2025-07-23T14:25:33', ip: '192.168.1.107' },
  { id: '4', user: 'Taylor Swift', action: 'Document Upload', resource: 'Research Paper.pdf', timestamp: '2025-07-23T14:20:18', ip: '192.168.1.108' },
  { id: '5', user: 'Jordan Lee', action: 'User Management', resource: 'User #1042', timestamp: '2025-07-23T14:15:52', ip: '192.168.1.109' },
  { id: '6', user: 'Alex Johnson', action: 'Settings Update', resource: 'Notification Preferences', timestamp: '2025-07-23T14:10:05', ip: '192.168.1.105' },
  { id: '7', user: 'Maria Garcia', action: 'Content Analysis', resource: 'Political Statement', timestamp: '2025-07-23T14:05:22', ip: '192.168.1.106' },
  { id: '8', user: 'Admin User', action: 'System Settings', resource: 'AI Model Configuration', timestamp: '2025-07-23T14:00:11', ip: '192.168.1.110' },
  { id: '9', user: 'Sam Wilson', action: 'Logout', resource: 'Session', timestamp: '2025-07-23T13:55:48', ip: '192.168.1.107' },
  { id: '10', user: 'Taylor Swift', action: 'Content Analysis', resource: 'News Article', timestamp: '2025-07-23T13:50:33', ip: '192.168.1.108' }
];

const UserActivityTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data based on search term and action filter
  const filteredData = mockUserActivity.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ip.includes(searchTerm);
    
    const matchesAction = actionFilter === '' || item.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  // Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get unique actions for filter dropdown
  const uniqueActions = Array.from(new Set(mockUserActivity.map(item => item.action)));

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-[var(--color-neutral-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm w-full sm:w-64"
            placeholder="Search users, resources, IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Filter */}
        <div className="flex items-center">
          <label className="mr-2 text-sm text-[var(--color-neutral-600)]">Filter by action:</label>
          <select
            className="px-3 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All Actions</option>
            {uniqueActions.map((action, index) => (
              <option key={index} value={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
          <thead className="bg-[var(--color-neutral-50)]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                Action
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                Resource
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                Timestamp
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--color-neutral-50)]">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-neutral-900)]">
                  {item.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.action === 'Login' || item.action === 'Logout' 
                      ? 'bg-[var(--color-info-100)] text-[var(--color-info-800)]' 
                      : item.action.includes('Analysis')
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-800)]'
                        : item.action.includes('Settings') || item.action.includes('Management')
                          ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
                          : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)]'
                    }`}
                  >
                    {item.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-600)]">
                  {item.resource}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-600)]">
                  {formatTimestamp(item.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-600)]">
                  {item.ip}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--color-neutral-200)] px-4 py-3 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-[var(--color-neutral-300)] text-sm font-medium rounded-md 
                ${currentPage === 1 
                  ? 'text-[var(--color-neutral-400)] bg-[var(--color-neutral-50)]' 
                  : 'text-[var(--color-neutral-700)] bg-white hover:bg-[var(--color-neutral-50)]'
                }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-[var(--color-neutral-300)] text-sm font-medium rounded-md 
                ${currentPage === totalPages 
                  ? 'text-[var(--color-neutral-400)] bg-[var(--color-neutral-50)]' 
                  : 'text-[var(--color-neutral-700)] bg-white hover:bg-[var(--color-neutral-50)]'
                }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--color-neutral-700)]">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> of{' '}
                <span className="font-medium">{filteredData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--color-neutral-300)] bg-white text-sm font-medium 
                    ${currentPage === 1 
                      ? 'text-[var(--color-neutral-400)]' 
                      : 'text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)]'
                    }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                      ${currentPage === index + 1
                        ? 'z-10 bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                        : 'bg-white border-[var(--color-neutral-300)] text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)]'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--color-neutral-300)] bg-white text-sm font-medium 
                    ${currentPage === totalPages 
                      ? 'text-[var(--color-neutral-400)]' 
                      : 'text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)]'
                    }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivityTable;