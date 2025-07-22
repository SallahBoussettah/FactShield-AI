import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-neutral-50)]">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-[var(--color-danger)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--color-danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
            Access Denied
          </h1>
          <p className="text-[var(--color-neutral-600)]">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[color-mix(in_srgb,var(--color-primary),black_10%)] transition-colors"
          >
            Sign In
          </Link>
          
          <Link
            to="/"
            className="block w-full px-4 py-2 border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] rounded-md hover:bg-[var(--color-neutral-100)] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;