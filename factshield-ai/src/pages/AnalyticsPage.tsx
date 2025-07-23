import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('analytics');

    return (
        <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Analytics Dashboard</h1>
                    <p className="text-[var(--color-neutral-600)] mt-2">
                        View insights and trends from your fact-checking analyses.
                    </p>
                </div>

                <AnalyticsDashboard />
            </div>
        </DashboardLayout>
    );
};

export default AnalyticsPage;