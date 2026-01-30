import React from 'react';
import Link from 'next/link';

interface Partner {
    brand_name?: string;
    logo_url?: string;
    industry?: string;
    full_name?: string;
    avatar_url?: string;
    niche?: string;
}

interface CampaignCardProps {
    campaign: {
        id: string;
        campaign_name: string;
        status: 'in_progress' | 'completed' | 'cancelled';
        created_at: string;
        start_date?: string;
        end_date?: string;
        partner?: Partner | null;
    };
    viewerRole: 'business' | 'creator';
}

const STATUS_STYLES = {
    in_progress: {
        bg: 'bg-[var(--color-info)]/20',
        text: 'text-[var(--color-info)]',
        label: 'In Progress'
    },
    completed: {
        bg: 'bg-[var(--color-success)]/20',
        text: 'text-[var(--color-success)]',
        label: 'Completed'
    },
    cancelled: {
        bg: 'bg-[var(--color-text-faint)]/20',
        text: 'text-[var(--color-text-faint)]',
        label: 'Cancelled'
    }
};

export function CampaignCard({ campaign, viewerRole }: CampaignCardProps) {
    const isCreatorView = viewerRole === 'creator';
    const partner = campaign.partner;
    const statusStyle = STATUS_STYLES[campaign.status];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link href={`/dashboard/campaigns/${campaign.id}`}>
            <div className="card p-6 hover:border-[var(--color-primary)] transition-all duration-200 hover:-translate-y-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] pr-4">
                        {campaign.campaign_name}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} whitespace-nowrap`}>
                        {statusStyle.label}
                    </span>
                </div>

                {/* Partner Info */}
                {partner && (
                    <div className="flex items-center gap-3 mb-4">
                        {((isCreatorView && 'logo_url' in partner && partner.logo_url) ||
                            (!isCreatorView && 'avatar_url' in partner && partner.avatar_url)) && (
                                <img
                                    src={(isCreatorView && 'logo_url' in partner ? partner.logo_url :
                                        !isCreatorView && 'avatar_url' in partner ? partner.avatar_url : '') || ''}
                                    alt={(isCreatorView && 'brand_name' in partner ? partner.brand_name :
                                        !isCreatorView && 'full_name' in partner ? partner.full_name : '') || ''}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            )}
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text)]">
                                {isCreatorView && 'brand_name' in partner ? partner.brand_name :
                                    !isCreatorView && 'full_name' in partner ? partner.full_name : 'Partner'}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                {isCreatorView && 'industry' in partner ? partner.industry :
                                    !isCreatorView && 'niche' in partner ? partner.niche : ''}
                            </p>
                        </div>
                    </div>
                )}

                {/* Dates */}
                {campaign.start_date && campaign.end_date && (
                    <div className="mb-4 text-sm text-[var(--color-text-muted)]">
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                        </span>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-[var(--color-text-faint)] pt-4 border-t border-[var(--color-border)]">
                    <span>Started {formatDate(campaign.created_at)}</span>
                    <span className="text-[var(--color-primary)] hover:underline">
                        View Details →
                    </span>
                </div>
            </div>
        </Link>
    );
}
