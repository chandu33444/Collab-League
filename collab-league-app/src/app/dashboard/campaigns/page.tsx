import { createClient } from '@/utils/supabase/server';
import { getCampaigns } from '@/app/actions/campaigns';
import { CampaignList } from '@/components/campaigns';
import Link from 'next/link';

type FilterStatus = 'all' | 'in_progress' | 'completed';

export default async function CampaignsPage({
    searchParams
}: {
    searchParams: Promise<{ filter?: FilterStatus }>
}) {
    const params = await searchParams;
    const currentFilter = (params.filter || 'all') as FilterStatus;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in</div>;
    }

    // Get user's role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const viewerRole = profile?.role as 'business' | 'creator';

    // Get all campaigns
    const allCampaigns = await getCampaigns();

    // Filter campaigns
    const filteredCampaigns = currentFilter === 'all'
        ? allCampaigns
        : allCampaigns.filter(c => c.status === currentFilter);

    const filters = [
        { key: 'all' as const, label: 'All Campaigns', count: allCampaigns.length },
        { key: 'in_progress' as const, label: 'In Progress', count: allCampaigns.filter(c => c.status === 'in_progress').length },
        { key: 'completed' as const, label: 'Completed', count: allCampaigns.filter(c => c.status === 'completed').length }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
                    Campaigns
                </h1>
                <p className="text-[var(--color-text-muted)]">
                    Manage your active collaborations and track progress
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-[var(--color-border)]">
                <nav className="flex gap-6">
                    {filters.map((filter) => (
                        <Link
                            key={filter.key}
                            href={`/dashboard/campaigns${filter.key !== 'all' ? `?filter=${filter.key}` : ''}`}
                            className={`
                pb-3 px-1 border-b-2 text-sm font-medium transition-colors
                ${currentFilter === filter.key
                                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-light)]'
                                }
              `}
                        >
                            {filter.label}
                            <span className={`
                ml-2 px-2 py-0.5 rounded-full text-xs
                ${currentFilter === filter.key
                                    ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                                    : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
                                }
              `}>
                                {filter.count}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Campaigns List */}
            {filteredCampaigns.length === 0 && currentFilter !== 'all' ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-surface-hover)] mb-4">
                        <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                        No {currentFilter.replace('_', ' ')} campaigns
                    </h3>
                    <p className="text-[var(--color-text-muted)]">
                        Try selecting a different filter
                    </p>
                </div>
            ) : (
                <CampaignList campaigns={filteredCampaigns} viewerRole={viewerRole} />
            )}
        </div>
    );
}
