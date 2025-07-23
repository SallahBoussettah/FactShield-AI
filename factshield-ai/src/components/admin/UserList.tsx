import React, { useState } from 'react';
import type { AdminUser } from './UserManagement';

interface UserListProps {
  users: AdminUser[];
  selectedUserId?: string | null;
  onSelectUser: (user: AdminUser) => void;
  onDeleteUser: (userId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  onDeleteUser,
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange
}) => {
  // Available roles for filtering
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'analyst', label: 'Analyst' },
    { value: 'user', label: 'User' }
  ];

  // Available statuses for filtering
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  
  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Handle page changes
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Search and filters */}
      <div className="p-4 border-b border-[var(--color-neutral-200)]">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name or email..."
                className="block w-full pl-10 pr-3 py-2 border border-[var(--color-neutral-300)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
              />
            </div>
          </div>

          {/* Role filter */}
          <div className="w-full sm:w-40">
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="block w-full py-2 px-3 border border-[var(--color-neutral-300)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
              aria-label="Filter by role"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="w-full sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="block w-full py-2 px-3 border border-[var(--color-neutral-300)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
              aria-label="Filter by status"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Active filters display */}
        {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--color-neutral-100)] text-xs">
                Search: "{searchTerm}"
                <button 
                  onClick={() => onSearchChange('')}
                  className="ml-1 text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {roleFilter !== 'all' && (
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--color-neutral-100)] text-xs">
                Role: {roleFilter}
                <button 
                  onClick={() => onRoleFilterChange('all')}
                  className="ml-1 text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {statusFilter !== 'all' && (
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--color-neutral-100)] text-xs">
                Status: {statusFilter}
                <button 
                  onClick={() => onStatusFilterChange('all')}
                  className="ml-1 text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button 
                onClick={() => {
                  onSearchChange('');
                  onRoleFilterChange('all');
                  onStatusFilterChange('all');
                }}
                className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-600)]"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* User list */}
      <div className="overflow-x-auto">
        {users.length > 0 ? (
          <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Roles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
              {currentUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-[var(--color-neutral-50)] cursor-pointer ${
                    selectedUserId === user.id ? 'bg-[var(--color-primary-50)]' : ''
                  }`}
                  onClick={() => onSelectUser(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[var(--color-neutral-900)]">{user.name}</div>
                        <div className="text-sm text-[var(--color-neutral-500)]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map(role => (
                        <span
                          key={role}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            ${role === 'admin' 
                              ? 'bg-[var(--color-danger-100)] text-[var(--color-danger-800)]' 
                              : role === 'editor'
                                ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
                                : role === 'analyst'
                                  ? 'bg-[var(--color-info-100)] text-[var(--color-info-800)]'
                                  : 'bg-[var(--color-primary-100)] text-[var(--color-primary-800)]'
                            }
                          `}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.status === 'active' 
                        ? 'bg-[var(--color-success-100)] text-[var(--color-success-800)]' 
                        : user.status === 'inactive'
                          ? 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)]'
                          : 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-500)]">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUser(user);
                        }}
                        className="text-[var(--color-primary-600)] hover:text-[var(--color-primary)] transition-colors"
                        aria-label={`Edit ${user.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                            onDeleteUser(user.id);
                          }
                        }}
                        className="text-[var(--color-danger-600)] hover:text-[var(--color-danger)] transition-colors"
                        aria-label={`Delete ${user.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-[var(--color-neutral-900)]">No users found</h3>
            <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
              No users match your current filter criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  onSearchChange('');
                  onRoleFilterChange('all');
                  onStatusFilterChange('all');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-600)]"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-[var(--color-neutral-200)]">
          <div className="text-sm text-[var(--color-neutral-500)]">
            Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastUser, users.length)}
            </span>{" "}
            of <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1
                  ? "border-[var(--color-neutral-200)] text-[var(--color-neutral-400)] cursor-not-allowed"
                  : "border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-[var(--color-neutral-700)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages
                  ? "border-[var(--color-neutral-200)] text-[var(--color-neutral-400)] cursor-not-allowed"
                  : "border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;