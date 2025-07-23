import React from 'react';

interface PasswordRequirementsProps {
  password: string;
  show?: boolean;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, show = true }) => {
  if (!show) return null;

  const requirements = [
    {
      text: 'At least 8 characters long',
      met: password.length >= 8
    },
    {
      text: 'Contains lowercase letter',
      met: /[a-z]/.test(password)
    },
    {
      text: 'Contains uppercase letter',
      met: /[A-Z]/.test(password)
    },
    {
      text: 'Contains number',
      met: /\d/.test(password)
    },
    {
      text: 'Contains special character (@$!%*?&)',
      met: /[@$!%*?&]/.test(password)
    }
  ];

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md">
      <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center text-sm">
            <span className={`mr-2 ${req.met ? 'text-green-500' : 'text-gray-400'}`}>
              {req.met ? '✓' : '○'}
            </span>
            <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;