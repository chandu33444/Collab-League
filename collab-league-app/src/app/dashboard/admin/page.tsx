import { createClient } from '@/utils/supabase/server';
import { StatsCard } from '@/components/dashboard/StatsCard';

export const metadata = {
    title: 'Admin Dashboard | Collab League',
};

async function getAdminStats() {
    const supabase = await createClient();

    // Fetch counts
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: creatorsCount } = await supabase.from('creators').select('*', { count: 'exact', head: true });
    const { count: businessesCount } = await supabase.from('businesses').select('*', { count: 'exact', head: true });
    const { count: campaignsCount } = await supabase.from('campaigns').select('*', { count: 'exact', head: true });

    return {
        usersCount: usersCount || 0,
        creatorsCount: creatorsCount || 0,
        businessesCount: businessesCount || 0,
        campaignsCount: campaignsCount || 0,
    };
}

export default async function AdminDashboardPage() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Platform Overview</h1>
                <p className="text-[var(--color-text-muted)]">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Users"
                    value={stats.usersCount}
                    icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <StatsCard
                    title="Creators"
                    value={stats.creatorsCount}
                    icon={<svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                />
                <StatsCard
                    title="Businesses"
                    value={stats.businessesCount}
                    icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
                <StatsCard
                    title="Campaigns"
                    value={stats.campaignsCount}
                    icon={<svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>}
                />
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    {/* Add admin actions here */}
                    <div className="p-4 bg-[var(--color-surface-hover)] rounded-lg text-[var(--color-text-muted)] text-sm">
                        Use the sidebar to manage users and view detailed reports.
                    </div>
                </div>
            </div>
        </div>
    );
}
