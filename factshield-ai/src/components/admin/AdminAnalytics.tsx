import React, { useState } from 'react';
import DateRangePicker from '../common/DateRangePicker';
import MetricCard from '../common/MetricCard';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import UserActivityTable from './analytics/UserActivityTable';
import SystemPerformanceMetrics from './analytics/SystemPerformanceMetrics';
import ReportGenerator from './analytics/ReportGenerator';

// Mock data for demonstration
const mockAnalyticsData = {
  totalRequests: 1248756,
  averageResponseTime: 245, // ms
  errorRate: 1.2, // percentage
  userSatisfaction: 92.7, // percentage
  activeUsers: {
    daily: 3426,
    weekly: 12845,
    monthly: 42680
  },
  requestsOverTime: [
    { date: '2025-07-16', count: 42500 },
    { date: '2025-07-17', count: 44200 },
    { date: '2025-07-18', count: 48100 },
    { date: '2025-07-19', count: 46700 },
    { date: '2025-07-20', count: 43200 },
    { date: '2025-07-21', count: 45800 },
    { date: '2025-07-22', count: 47300 },
    { date: '2025-07-23', count: 46900 }
  ],
  contentTypeDistribution: [
    { type: 'News Articles', percentage: 42 },
    { type: 'Social Media', percentage: 28 },
    { type: 'Academic Papers', percentage: 12 },
    { type: 'Blog Posts', percentage: 10 },
    { type: 'Other', percentage: 8 }
  ],
  accuracyByContentType: [
    { type: 'News Articles', accuracy: 94.2 },
    { type: 'Social Media', accuracy: 86.5 },
    { type: 'Academic Papers', accuracy: 97.8 },
    { type: 'Blog Posts', accuracy: 89.3 },
    { type: 'Other', accuracy: 82.1 }
  ],
  userActivityByHour: [
    { hour: '00:00', count: 1245 },
    { hour: '01:00', count: 876 },
    { hour: '02:00', count: 642 },
    { hour: '03:00', count: 524 },
    { hour: '04:00', count: 428 },
    { hour: '05:00', count: 512 },
    { hour: '06:00', count: 828 },
    { hour: '07:00', count: 1242 },
    { hour: '08:00', count: 2145 },
    { hour: '09:00', count: 3245 },
    { hour: '10:00', count: 3876 },
    { hour: '11:00', count: 4125 },
    { hour: '12:00', count: 4356 },
    { hour: '13:00', count: 4287 },
    { hour: '14:00', count: 4512 },
    { hour: '15:00', count: 4328 },
    { hour: '16:00', count: 4125 },
    { hour: '17:00', count: 3876 },
    { hour: '18:00', count: 3542 },
    { hour: '19:00', count: 3124 },
    { hour: '20:00', count: 2845 },
    { hour: '21:00', count: 2456 },
    { hour: '22:00', count: 2124 },
    { hour: '23:00', count: 1756 }
  ],
  topUsers: [
    { id: '1', name: 'Alex Johnson', analysesCount: 342, accuracy: 94.2 },
    { id: '2', name: 'Maria Garcia', analysesCount: 287, accuracy: 92.8 },
    { id: '3', name: 'Sam Wilson', analysesCount: 256, accuracy: 91.5 },
    { id: '4', name: 'Taylor Swift', analysesCount: 234, accuracy: 93.7 },
    { id: '5', name: 'Jordan Lee', analysesCount: 198, accuracy: 90.2 }
  ],
  systemPerformance: {
    cpu: 42, // percentage
    memory: 68, // percentage
    disk: 56, // percentage
    network: 38 // percentage
  },
  modelPerformance: [
    { model: 'Claim Extraction', accuracy: 92.4, latency: 120 },
    { model: 'Credibility Assessment', accuracy: 89.7, latency: 180 },
    { model: 'Source Verification', accuracy: 94.2, latency: 150 },
    { model: 'Translation', accuracy: 96.8, latency: 90 }
  ]
};

const AdminAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState({ startDate: '2025-07-16', endDate: '2025-07-23' });
  const [activeTab, setActiveTab] = useState('overview');

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    // In a real implementation, this would trigger data fetching for the new date range
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'user-activity':
        return renderUserActivityTab();
      case 'performance':
        return renderPerformanceTab();
      case 'reports':
        return renderReportsTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Requests"
          value={mockAnalyticsData.totalRequests.toLocaleString()}
          icon={
            <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          }
          trend="+8.4%"
          trendDirection="up"
        />
        <MetricCard
          title="Avg. Response Time"
          value={`${mockAnalyticsData.averageResponseTime} ms`}
          icon={
            <svg className="w-6 h-6 text-[var(--color-info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend="-12.3%"
          trendDirection="down"
          trendPositive={true}
        />
        <MetricCard
          title="Error Rate"
          value={`${mockAnalyticsData.errorRate}%`}
          icon={
            <svg className="w-6 h-6 text-[var(--color-warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          trend="-0.3%"
          trendDirection="down"
          trendPositive={true}
        />
        <MetricCard
          title="User Satisfaction"
          value={`${mockAnalyticsData.userSatisfaction}%`}
          icon={
            <svg className="w-6 h-6 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend="+1.8%"
          trendDirection="up"
          trendPositive={true}
        />
      </div>

      {/* Active Users */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Active Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--color-neutral-50)] rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[var(--color-primary)]">{mockAnalyticsData.activeUsers.daily.toLocaleString()}</div>
            <div className="text-sm text-[var(--color-neutral-600)] mt-1">Daily Active Users</div>
          </div>
          <div className="bg-[var(--color-neutral-50)] rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[var(--color-primary)]">{mockAnalyticsData.activeUsers.weekly.toLocaleString()}</div>
            <div className="text-sm text-[var(--color-neutral-600)] mt-1">Weekly Active Users</div>
          </div>
          <div className="bg-[var(--color-neutral-50)] rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[var(--color-primary)]">{mockAnalyticsData.activeUsers.monthly.toLocaleString()}</div>
            <div className="text-sm text-[var(--color-neutral-600)] mt-1">Monthly Active Users</div>
          </div>
        </div>
      </div>

      {/* Requests Over Time Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Requests Over Time</h2>
        <div className="h-80">
          <LineChart 
            data={mockAnalyticsData.requestsOverTime}
            xKey="date"
            yKey="count"
            xLabel="Date"
            yLabel="Requests"
            color="var(--color-primary)"
          />
        </div>
      </div>

      {/* Content Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Content Type Distribution</h2>
          <div className="h-64">
            <PieChart 
              data={mockAnalyticsData.contentTypeDistribution}
              nameKey="type"
              valueKey="percentage"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Accuracy by Content Type</h2>
          <div className="h-64">
            <BarChart 
              data={mockAnalyticsData.accuracyByContentType}
              xKey="type"
              yKey="accuracy"
              xLabel="Content Type"
              yLabel="Accuracy (%)"
              color="var(--color-success)"
            />
          </div>
        </div>
      </div>

      {/* User Activity by Hour */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">User Activity by Hour</h2>
        <div className="h-80">
          <BarChart 
            data={mockAnalyticsData.userActivityByHour}
            xKey="hour"
            yKey="count"
            xLabel="Hour of Day"
            yLabel="Number of Requests"
            color="var(--color-info)"
          />
        </div>
      </div>
    </div>
  );

  const renderUserActivityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">User Activity Monitoring</h2>
        <UserActivityTable />
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Top Users by Analysis Count</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Analyses
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Accuracy
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
              {mockAnalyticsData.topUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--color-neutral-50)]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[var(--color-neutral-900)]">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-900)]">
                    {user.analysesCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium 
                        ${user.accuracy > 90 
                          ? 'text-[var(--color-success)]' 
                          : user.accuracy > 80 
                            ? 'text-[var(--color-warning)]' 
                            : 'text-[var(--color-danger)]'
                        }`}
                      >
                        {user.accuracy}%
                      </span>
                      <div className="ml-2 w-16 bg-[var(--color-neutral-100)] rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full 
                            ${user.accuracy > 90 
                              ? 'bg-[var(--color-success)]' 
                              : user.accuracy > 80 
                                ? 'bg-[var(--color-warning)]' 
                                : 'bg-[var(--color-danger)]'
                            }`} 
                          style={{ width: `${user.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-900)]">
                    <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-600)]">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <SystemPerformanceMetrics data={mockAnalyticsData.systemPerformance} />
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">AI Model Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Accuracy
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Avg. Latency (ms)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
              {mockAnalyticsData.modelPerformance.map((model, index) => (
                <tr key={index} className="hover:bg-[var(--color-neutral-50)]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-neutral-900)]">
                    {model.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium 
                        ${model.accuracy > 90 
                          ? 'text-[var(--color-success)]' 
                          : model.accuracy > 80 
                            ? 'text-[var(--color-warning)]' 
                            : 'text-[var(--color-danger)]'
                        }`}
                      >
                        {model.accuracy}%
                      </span>
                      <div className="ml-2 w-16 bg-[var(--color-neutral-100)] rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full 
                            ${model.accuracy > 90 
                              ? 'bg-[var(--color-success)]' 
                              : model.accuracy > 80 
                                ? 'bg-[var(--color-warning)]' 
                                : 'bg-[var(--color-danger)]'
                            }`} 
                          style={{ width: `${model.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-900)]">
                    {model.latency} ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[var(--color-success-100)] text-[var(--color-success-800)]">
                      Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <ReportGenerator />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Analytics Dashboard</h1>
            <p className="mt-1 text-[var(--color-neutral-600)]">
              System-wide analytics and performance metrics
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <DateRangePicker 
              startDate={dateRange.startDate} 
              endDate={dateRange.endDate} 
              onChange={handleDateRangeChange} 
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-1">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'overview'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('user-activity')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'user-activity'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Activity
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'performance'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Performance
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              activeTab === 'reports'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default AdminAnalytics;