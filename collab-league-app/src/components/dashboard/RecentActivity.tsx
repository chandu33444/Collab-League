import React from 'react';
import Link from 'next/link';

interface ActivityItem {
    id: string;
    type: 'request' | 'note' | 'campaign';
    title: string;
    subtitle: string;
    time: string;
    link: string;
}

interface RecentActivityProps {
    activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    if (activities.length === 0) {
        return (
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Recent Activity</h3>
                <div className="text-center py-8 text-[var(--color-text-muted)]">
                    <p>No recent activity</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link}
                        className="block group"
                    >
                        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
                            <div className={`
                p-2 rounded-full mt-1 shrink-0
                ${item.type === 'request' ? 'bg-[var(--color-info)]/10 text-[var(--color-info)]' :
                                    item.type === 'note' ? 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]' :
                                        'bg-[var(--color-success)]/10 text-[var(--color-success)]'}
              `}>
                                {item.type === 'request' && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {item.type === 'note' && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                )}
                                {item.type === 'campaign' && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                                    {item.title}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                                    {item.subtitle}
                                </p>
                            </div>

                            <span className="text-xs text-[var(--color-text-faint)] whitespace-nowrap shrink-0">
                                {formatTime(item.time)}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
