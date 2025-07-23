import React from 'react';

interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps<T extends string> {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name: string;
  label?: string;
  className?: string;
}

function RadioGroup<T extends string>({ 
  options, 
  value, 
  onChange, 
  name, 
  label,
  className = ''
}: RadioGroupProps<T>) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.value}
            className={`
              relative flex cursor-pointer rounded-lg border p-5 focus:outline-none
              ${value === option.value 
                ? 'border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary),white_90%)]' 
                : 'border-[var(--color-neutral-200)] bg-white'}
            `}
            onClick={() => onChange(option.value)}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  className="h-5 w-5 border-[var(--color-neutral-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <div className="ml-3 flex items-center">
                  {option.icon && <div className="mr-2">{option.icon}</div>}
                  <span className="block text-sm font-medium text-[var(--color-neutral-900)]">
                    {option.label}
                  </span>
                </div>
              </div>
              {option.description && (
                <div className="mt-1 ml-7 text-sm text-[var(--color-neutral-500)]">
                  {option.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadioGroup;