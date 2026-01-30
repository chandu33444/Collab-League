'use client'

import React, { useEffect, useState } from 'react';
import { getCreatorDashboardStats, getRecentActivity } from '@/app/actions/dashboard';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';

export function CreatorDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [statsData, activityData] = await Promise.all([
                    getCreatorDashboardStats(),
                    getRecentActivity(5)
                ]);
                setStats(statsData);
                setActivity(activityData);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)]">Creator Dashboard</h1>
                <p className="text-[var(--color-text-muted)] mt-1">Track your growth and collaborations</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Pending Requests"
                    value={stats?.pendingRequests || 0}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Active Campaigns"
                    value={stats?.activeCampaigns || 0}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Completed"
                    value={stats?.completedCampaigns || 0}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Total Offers"
                    value={stats?.totalOffers || 0}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" />
                        </svg>
                    }
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity - Takes up 2 columns */}
                <div className="lg:col-span-2">
                    <RecentActivity activities={activity} />
                </div>

                {/* Quick Actions - Takes up 1 column */}
                <div className="lg:col-span-1">
                    <QuickActions role="creator" />
                </div>
            </div>
        </div>
    );
}
