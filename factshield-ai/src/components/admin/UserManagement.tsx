import React, { useState } from 'react';
import UserList from './UserList';
import UserDetail from './UserDetail';
import type { User } from '../../types/auth';

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    roles: ['user'],
    status: 'active',
    createdAt: '2023-06-15',
    lastLogin: '2023-07-20'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    roles: ['editor', 'user'],
    status: 'active',
    createdAt: '2023-06-14',
    lastLogin: '2023-07-22'
  },
  {
    id: '3',
    name: 'Sam Wilson',
    email: 'sam@example.com',
    roles: ['user'],
    status: 'inactive',
    createdAt: '2023-06-12',
    lastLogin: '2023-07-10'
  },
  {
    id: '4',
    name: 'Taylor Swift',
    email: 'taylor@example.com',
    roles: ['user'],
    status: 'active',
    createdAt: '2023-06-10',
    lastLogin: '2023-07-21'
  },
  {
    id: '5',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    roles: ['admin', 'user'],
    status: 'active',
    createdAt: '2023-06-08',
    lastLogin: '2023-07-23'
  },
  {
    id: '6',
    name: 'Jamie Smith',
    email: 'jamie@example.com',
    roles: ['analyst', 'user'],
    status: 'active',
    createdAt: '2023-05-20',
    lastLogin: '2023-07-15'
  },
  {
    id: '7',
    name: 'Casey Brown',
    email: 'casey@example.com',
    roles: ['user'],
    status: 'inactive',
    createdAt: '2023-05-15',
    lastLogin: '2023-06-30'
  },
  {
    id: '8',
    name: 'Riley Davis',
    email: 'riley@example.com',
    roles: ['editor', 'user'],
    status: 'active',
    createdAt: '2023-05-10',
    lastLogin: '2023-07-19'
  },
  {
    id: '9',
    name: 'Morgan Wilson',
    email: 'morgan@example.com',
    roles: ['user'],
    status: 'active',
    createdAt: '2023-05-05',
    lastLogin: '2023-07-18'
  },
  {
    id: '10',
    name: 'Avery Martinez',
    email: 'avery@example.com',
    roles: ['analyst', 'user'],
    status: 'active',
    createdAt: '2023-05-01',
    lastLogin: '2023-07-17'
  }
];

// Extended user type with additional fields for admin view
export interface AdminUser extends User {
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers as AdminUser[]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'all' ||
      (user.roles && user.roles.includes(roleFilter));

    const matchesStatus =
      statusFilter === 'all' ||
      user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user selection
  const handleSelectUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsAddingUser(false);
  };

  // Handle user update
  const handleUpdateUser = (updatedUser: AdminUser) => {
    setUsers(users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));
    setSelectedUser(updatedUser);
  };

  // Handle user creation
  const handleCreateUser = (newUser: AdminUser) => {
    // In a real app, this would make an API call
    const userWithId = {
      ...newUser,
      id: `user-${Date.now()}`, // Generate a temporary ID
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: '-'
    };

    setUsers([userWithId, ...users]);
    setSelectedUser(userWithId);
    setIsAddingUser(false);
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    // In a real app, this would make an API call
    setUsers(users.filter(user => user.id !== userId));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
          User Management
        </h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsAddingUser(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-700)] hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User list */}
        <div className="lg:col-span-2">
          <UserList
            users={filteredUsers}
            selectedUserId={selectedUser?.id}
            onSelectUser={handleSelectUser}
            onDeleteUser={handleDeleteUser}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        {/* User detail */}
        <div className="lg:col-span-1">
          <UserDetail
            user={selectedUser}
            isCreating={isAddingUser}
            onUpdate={handleUpdateUser}
            onCreate={handleCreateUser}
            onCancel={() => {
              setIsAddingUser(false);
              setSelectedUser(null);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;