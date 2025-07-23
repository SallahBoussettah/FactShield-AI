import React, { useState, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  valueDisplay?: (value: number) => string;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  valueDisplay,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState<number>(value);
  
  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Calculate percentage for styling
  const percentage = ((localValue - min) / (max - min)) * 100;
  
  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
  };
  
  // Handle blur/change end
  const handleFinalChange = () => {
    onChange(localValue);
  };
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-neutral-700)]">
            {label}
          </label>
        )}
        <span className="text-sm font-medium text-[var(--color-neutral-700)]">
          {valueDisplay ? valueDisplay(localValue) : localValue}
        </span>
      </div>
      <div className="relative">
        <div
          className="absolute h-2 bg-[var(--color-primary)] rounded-full"
          style={{
            width: `${percentage}%`,
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 0,
          }}
        />
        <div
          className="absolute h-2 bg-[var(--color-neutral-200)] rounded-full"
          style={{
            width: `${100 - percentage}%`,
            left: `${percentage}%`,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 0,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onMouseUp={handleFinalChange}
          onTouchEnd={handleFinalChange}
          onBlur={handleFinalChange}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer relative z-10"
          style={{
            // Custom styling for the thumb
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-[var(--color-neutral-500)] mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default RangeSlider;