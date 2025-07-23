import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { HistoryItem } from '../../types/history';
import * as historyService from '../../services/historyService';

const RecentActivity: React.FC = () => {
    const { authState } = useAuth();
    const [recentItems, setRecentItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRecentActivity = async () => {
            if (!authState.user) return;

            setIsLoading(true);
            try {
                // Get the first 3 items from history
                const result = await historyService.getUserHistory(
                    authState.user.id,
                    1, // page 1
                    3, // 3 items per page
                    {} // no filters
                );

                setRecentItems(result.items);
            } catch (error) {
                console.error('Error loading recent activity:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadRecentActivity();
    }, [authState.user]);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric'
            }).format(date);
        }
    };

    // Get source icon based on type
    const getSourceIcon = (type: string) => {
        switch (type) {
            case 'url':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                );
            case 'document':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'text':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
        }
    };

    // Format source content for display
    const formatSourceContent = (item: HistoryItem) => {
        if (item.source.type === 'url') {
            try {
                const url = new URL(item.source.content);
                return url.hostname;
            } catch {
                return item.source.content;
            }
        }
        return item.source.content;
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
                <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Recent Activity</h3>
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                </div>
            </div>
        );
    }

    if (recentItems.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
                <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[var(--color-neutral-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-[var(--color-neutral-600)] mb-2">No analyses yet</p>
                    <p className="text-sm text-[var(--color-neutral-500)]">Start by analyzing your first piece of content</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
            <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {recentItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => {
                            // Use window.dispatchEvent to communicate with the DashboardPage
                            window.dispatchEvent(new CustomEvent('viewHistoryItem', { detail: item }));
                        }}
                        className="flex items-start p-3 rounded-lg border border-[var(--color-neutral-200)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 transition-all duration-200 cursor-pointer"
                    >
                        <div className="p-2 bg-[var(--color-neutral-100)] rounded-lg mr-3 flex-shrink-0">
                            <div className="text-[var(--color-neutral-600)]">
                                {getSourceIcon(item.source.type)}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-[var(--color-neutral-900)] truncate">
                                    {formatSourceContent(item)}
                                </p>
                                <span className="text-xs text-[var(--color-neutral-500)] flex-shrink-0 ml-2">
                                    {formatDate(item.timestamp)}
                                </span>
                            </div>
                            <p className="text-xs text-[var(--color-neutral-600)] line-clamp-1">
                                {item.summary}
                            </p>
                            <div className="flex items-center mt-1">
                                <div
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mr-2"
                                    style={{
                                        backgroundColor: `${item.credibilityScore >= 0.8
                                            ? 'var(--color-secondary)/10'
                                            : item.credibilityScore >= 0.6
                                                ? 'var(--color-warning)/10'
                                                : 'var(--color-danger)/10'
                                            }`,
                                        color: `${item.credibilityScore >= 0.8
                                            ? 'var(--color-secondary)'
                                            : item.credibilityScore >= 0.6
                                                ? 'var(--color-warning)'
                                                : 'var(--color-danger)'
                                            }`
                                    }}
                                >
                                    {Math.round(item.credibilityScore * 100)}%
                                </div>
                                <span className="text-xs text-[var(--color-neutral-500)]">
                                    {item.claimsCount} {item.claimsCount === 1 ? 'claim' : 'claims'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => {
                        // Use window.dispatchEvent to communicate with the DashboardPage
                        window.dispatchEvent(new CustomEvent('viewAllHistory'));
                    }}
                    className="block w-full text-center text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 font-medium mt-2"
                >
                    View all history
                </button>
            </div>
        </div>
    );
};

export default RecentActivity;