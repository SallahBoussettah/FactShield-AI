import React from 'react';

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  audience: 'all' | 'admin' | 'users';
  active: boolean;
  startDate: string;
  endDate: string;
}

interface NotificationCardProps {
  notification: SystemNotification;
  onToggleStatus: (notificationId: string) => void;
  onEdit: (notificationId: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onToggleStatus, onEdit }) => {
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get background color based on notification type
  const getBgColor = () => {
    switch (notification.type) {
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-white border-[var(--color-neutral-200)]';
    }
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'info':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden border ${getBgColor()}`}>
      <div className="p-5">
        <div className="flex items-start">
          {getIcon()}
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">
                {notification.title}
              </h3>
              <span className={`
                px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                ${notification.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }
              `}>
                {notification.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-neutral-600)]">
              {notification.message}
            </p>
            <div className="mt-2 flex flex-wrap items-center text-xs text-[var(--color-neutral-500)]">
              <div className="mr-4">
                <span className="font-medium">Audience:</span> 
                <span className="ml-1 capitalize">{notification.audience}</span>
              </div>
              <div>
                <span className="font-medium">Display period:</span> 
                <span className="ml-1">{formatDate(notification.startDate)} - {formatDate(notification.endDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-[var(--color-neutral-200)] bg-white flex justify-end space-x-2">
        <button
          onClick={() => onEdit(notification.id)}
          className="inline-flex items-center px-3 py-1 border border-[var(--color-neutral-300)] rounded-md shadow-sm text-xs font-medium text-[var(--color-neutral-700)] bg-white hover:bg-[var(--color-neutral-100)]"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onToggleStatus(notification.id)}
          className={`
            inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white
            ${notification.active
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
            }
          `}
        >
          {notification.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;