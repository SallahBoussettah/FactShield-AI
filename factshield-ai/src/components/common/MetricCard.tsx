import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
  trendPositive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection = 'up',
  trendPositive = false
}) => {
  // Determine trend color based on direction and whether it's positive
  const getTrendColor = () => {
    if (trendDirection === 'up') {
      return trendPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]';
    } else {
      return trendPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-[var(--color-primary-50)]">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-[var(--color-neutral-500)]">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-[var(--color-neutral-900)]">{value}</p>
            {trend && (
              <p className={`ml-2 text-xs font-medium ${getTrendColor()}`}>
                {trend}
                {trendDirection === 'up' ? (
                  <svg className="inline-block w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="inline-block w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;