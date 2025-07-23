import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ 
  enabled, 
  onChange, 
  label, 
  description, 
  disabled = false 
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        {label && <span className="font-medium text-[var(--color-neutral-800)]">{label}</span>}
        {description && <span className="text-sm text-[var(--color-neutral-500)]">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
          ${enabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-neutral-300)]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && onChange(!enabled)}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default Toggle;