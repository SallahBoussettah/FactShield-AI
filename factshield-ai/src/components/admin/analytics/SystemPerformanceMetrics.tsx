import React from 'react';

interface SystemPerformanceMetricsProps {
  data: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

const SystemPerformanceMetrics: React.FC<SystemPerformanceMetricsProps> = ({ data }) => {
  // Helper function to determine color based on usage percentage
  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'var(--color-success)';
    if (percentage < 80) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">System Performance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Usage */}
        <div className="bg-[var(--color-neutral-50)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[var(--color-neutral-700)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <h3 className="text-sm font-medium text-[var(--color-neutral-700)]">CPU Usage</h3>
            </div>
            <span 
              className="text-lg font-semibold"
              style={{ color: getUsageColor(data.cpu) }}
            >
              {data.cpu}%
            </span>
          </div>
          <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${data.cpu}%`,
                backgroundColor: getUsageColor(data.cpu)
              }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-[var(--color-neutral-500)]">
            {data.cpu < 50 ? 'Normal' : data.cpu < 80 ? 'Moderate' : 'High'} CPU utilization
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-[var(--color-neutral-50)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[var(--color-neutral-700)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm font-medium text-[var(--color-neutral-700)]">Memory Usage</h3>
            </div>
            <span 
              className="text-lg font-semibold"
              style={{ color: getUsageColor(data.memory) }}
            >
              {data.memory}%
            </span>
          </div>
          <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${data.memory}%`,
                backgroundColor: getUsageColor(data.memory)
              }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-[var(--color-neutral-500)]">
            {data.memory < 50 ? 'Normal' : data.memory < 80 ? 'Moderate' : 'High'} memory utilization
          </div>
        </div>

        {/* Disk Usage */}
        <div className="bg-[var(--color-neutral-50)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[var(--color-neutral-700)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              <h3 className="text-sm font-medium text-[var(--color-neutral-700)]">Disk Usage</h3>
            </div>
            <span 
              className="text-lg font-semibold"
              style={{ color: getUsageColor(data.disk) }}
            >
              {data.disk}%
            </span>
          </div>
          <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${data.disk}%`,
                backgroundColor: getUsageColor(data.disk)
              }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-[var(--color-neutral-500)]">
            {data.disk < 50 ? 'Normal' : data.disk < 80 ? 'Moderate' : 'High'} disk utilization
          </div>
        </div>

        {/* Network Usage */}
        <div className="bg-[var(--color-neutral-50)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[var(--color-neutral-700)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              <h3 className="text-sm font-medium text-[var(--color-neutral-700)]">Network Usage</h3>
            </div>
            <span 
              className="text-lg font-semibold"
              style={{ color: getUsageColor(data.network) }}
            >
              {data.network}%
            </span>
          </div>
          <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${data.network}%`,
                backgroundColor: getUsageColor(data.network)
              }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-[var(--color-neutral-500)]">
            {data.network < 50 ? 'Normal' : data.network < 80 ? 'Moderate' : 'High'} network utilization
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[var(--color-neutral-50)] rounded-lg">
        <h3 className="text-sm font-medium text-[var(--color-neutral-700)] mb-2">System Health Summary</h3>
        <p className="text-sm text-[var(--color-neutral-600)]">
          {Math.max(data.cpu, data.memory, data.disk, data.network) < 70 ? (
            <>
              <span className="text-[var(--color-success)] font-medium">Good</span> - All systems are operating within normal parameters.
            </>
          ) : Math.max(data.cpu, data.memory, data.disk, data.network) < 90 ? (
            <>
              <span className="text-[var(--color-warning)] font-medium">Warning</span> - Some system resources are under moderate load. Consider optimizing resource usage.
            </>
          ) : (
            <>
              <span className="text-[var(--color-danger)] font-medium">Critical</span> - System resources are under heavy load. Immediate attention required.
            </>
          )}
        </p>
        
        <div className="mt-4 flex justify-end">
          <button className="px-3 py-1 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-600)]">
            View Detailed Metrics
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemPerformanceMetrics;