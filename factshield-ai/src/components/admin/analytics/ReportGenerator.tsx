import React, { useState } from 'react';

const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('system-performance');
  const [dateRange, setDateRange] = useState({ startDate: '2025-07-01', endDate: '2025-07-23' });
  const [format, setFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<Array<{
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
  }>>([
    { id: '1', name: 'System Performance Report - July 2025', type: 'system-performance', date: '2025-07-23', size: '1.2 MB' },
    { id: '2', name: 'User Activity Report - June 2025', type: 'user-activity', date: '2025-07-01', size: '3.5 MB' },
    { id: '3', name: 'Content Analysis Report - Q2 2025', type: 'content-analysis', date: '2025-06-30', size: '4.8 MB' }
  ]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const newReport = {
        id: Math.random().toString(36).substring(2, 9),
        name: `${getReportTypeName(reportType)} - ${formatDate(dateRange.startDate)} to ${formatDate(dateRange.endDate)}`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`
      };
      
      setGeneratedReports([newReport, ...generatedReports]);
      setIsGenerating(false);
    }, 2000);
  };

  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'system-performance': return 'System Performance Report';
      case 'user-activity': return 'User Activity Report';
      case 'content-analysis': return 'Content Analysis Report';
      case 'model-performance': return 'AI Model Performance Report';
      case 'security-audit': return 'Security Audit Report';
      default: return 'Custom Report';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Generate Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                Report Type
              </label>
              <select
                className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="system-performance">System Performance Report</option>
                <option value="user-activity">User Activity Report</option>
                <option value="content-analysis">Content Analysis Report</option>
                <option value="model-performance">AI Model Performance Report</option>
                <option value="security-audit">Security Audit Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--color-neutral-500)] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-neutral-500)] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                Format
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[var(--color-primary)]"
                    name="format"
                    value="pdf"
                    checked={format === 'pdf'}
                    onChange={() => setFormat('pdf')}
                  />
                  <span className="ml-2 text-sm text-[var(--color-neutral-700)]">PDF</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[var(--color-primary)]"
                    name="format"
                    value="excel"
                    checked={format === 'excel'}
                    onChange={() => setFormat('excel')}
                  />
                  <span className="ml-2 text-sm text-[var(--color-neutral-700)]">Excel</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[var(--color-primary)]"
                    name="format"
                    value="csv"
                    checked={format === 'csv'}
                    onChange={() => setFormat('csv')}
                  />
                  <span className="ml-2 text-sm text-[var(--color-neutral-700)]">CSV</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                Options
              </label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-[var(--color-primary)]"
                    checked={includeCharts}
                    onChange={() => setIncludeCharts(!includeCharts)}
                  />
                  <span className="ml-2 text-sm text-[var(--color-neutral-700)]">Include charts and visualizations</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-[var(--color-primary)]"
                    checked={includeRawData}
                    onChange={() => setIncludeRawData(!includeRawData)}
                  />
                  <span className="ml-2 text-sm text-[var(--color-neutral-700)]">Include raw data tables</span>
                </label>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md flex items-center justify-center
                  ${isGenerating 
                    ? 'bg-[var(--color-primary-400)] cursor-not-allowed' 
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-600)]'
                  }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-neutral-200)]">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Generated Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Report Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
              {generatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-[var(--color-neutral-50)]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-neutral-900)]">
                    {report.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${report.type === 'system-performance' 
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-800)]' 
                        : report.type === 'user-activity'
                          ? 'bg-[var(--color-info-100)] text-[var(--color-info-800)]'
                          : report.type === 'content-analysis'
                            ? 'bg-[var(--color-success-100)] text-[var(--color-success-800)]'
                            : report.type === 'model-performance'
                              ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
                              : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)]'
                      }`}
                    >
                      {getReportTypeName(report.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-600)]">
                    {formatDate(report.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-600)]">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-600)]">
                    <div className="flex space-x-2">
                      <button className="p-1 rounded-md text-[var(--color-primary)] hover:bg-[var(--color-primary-50)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button className="p-1 rounded-md text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-1 rounded-md text-[var(--color-danger)] hover:bg-[var(--color-danger-50)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;