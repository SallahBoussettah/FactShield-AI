import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

/**
 * Page shown when a user tries to access a page they don't have permission for
 */
const UnauthorizedPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[color-mix(in_srgb,var(--color-primary),black_10%)]"
            >
              Go Home
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-md hover:bg-[color-mix(in_srgb,var(--color-primary),white_90%)]"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UnauthorizedPage;