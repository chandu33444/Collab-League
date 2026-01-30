import { createClient } from '@/utils/supabase/server';
import { getCampaign, getCampaignNotes } from '@/app/actions/campaigns';
import {
    CampaignDetail,
    CampaignTimeline,
    CampaignNotes,
    NoteInput,
    CampaignActions
} from '@/components/campaigns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CampaignDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in</div>;
    }

    // Get campaign and notes
    const campaign = await getCampaign(id);

    if (!campaign) {
        notFound();
    }

    const notes = await getCampaignNotes(id);

    // Get user's role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isBusinessView = user.id === campaign.business_id;

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link
                href="/dashboard/campaigns"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Campaigns
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
                    Campaign Details
                </h1>
                <p className="text-[var(--color-text-muted)]">
                    {isBusinessView ? 'Collaborate with creator' : 'Collaborate with business'}
                </p>
            </div>

            {/* Campaign Timeline */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                    Campaign Progress
                </h2>
                <CampaignTimeline status={campaign.status} />
            </div>

            {/* Campaign Details */}
            <CampaignDetail campaign={campaign} currentUserId={user.id} />

            {/* Campaign Actions (only for in-progress campaigns) */}
            {campaign.status === 'in_progress' && (
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                        Campaign Actions
                    </h3>
                    <CampaignActions campaignId={campaign.id} currentStatus={campaign.status} />
                </div>
            )}

            {/* Campaign Notes */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                    Campaign Notes
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-6">
                    Communicate with your partner about campaign details, progress, and updates.
                </p>

                {/* Notes Thread */}
                <div className="mb-6">
                    <CampaignNotes notes={notes} currentUserId={user.id} />
                </div>

                {/* Note Input */}
                {campaign.status !== 'cancelled' && (
                    <div className="pt-6 border-t border-[var(--color-border)]">
                        <NoteInput campaignId={campaign.id} />
                    </div>
                )}

                {campaign.status === 'cancelled' && (
                    <div className="pt-6 border-t border-[var(--color-border)] text-center">
                        <p className="text-sm text-[var(--color-text-faint)]">
                            This campaign has been cancelled. No new notes can be added.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
