import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminCampaignsPage() {
    const supabase = await createClient();

    // Fetch all campaigns
    const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching campaigns:', JSON.stringify(error, null, 2));
        return (
            <div className="p-8 text-center text-red-500">
                Error loading campaigns. Please check console.
            </div>
        );
    }

    // Enrich with names
    const enrichedCampaigns = await Promise.all((campaigns || []).map(async (c) => {
        // Fetch creator name
        const { data: creator } = await supabase
            .from('creators')
            .select('full_name')
            .eq('id', c.creator_id)
            .single();

        // Fetch brand name
        const { data: business } = await supabase
            .from('businesses')
            .select('brand_name')
            .eq('id', c.business_id)
            .single();

        return {
            ...c,
            creator_name: creator?.full_name || 'Unknown Creator',
            brand_name: business?.brand_name || 'Unknown Brand'
        };
    }));

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--color-text)]">All Campaigns</h1>
                <p className="text-[var(--color-text-muted)]">Monitor all platform collaborations</p>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)]">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-muted)]">Campaign</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-muted)]">Brand</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-muted)]">Creator</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-muted)]">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-muted)]">Start Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {enrichedCampaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                                        No campaigns found.
                                    </td>
                                </tr>
                            ) : (
                                enrichedCampaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[var(--color-text)]">{campaign.title}</div>
                                            <div className="text-xs text-[var(--color-text-muted)]">ID: {campaign.id.slice(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4 text-[var(--color-text)]">
                                            {campaign.brand_name}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--color-text)]">
                                            {campaign.creator_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    campaign.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                                            {new Date(campaign.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
