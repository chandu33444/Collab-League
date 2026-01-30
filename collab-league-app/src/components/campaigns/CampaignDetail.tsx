import React from 'react';

interface Business {
    brand_name: string;
    logo_url?: string;
    industry: string;
    contact_email?: string;
    website?: string;
}

interface Creator {
    full_name: string;
    avatar_url?: string;
    niche: string;
    primary_platform: string;
    contact_email?: string;
    bio?: string;
}

interface CampaignDetailProps {
    campaign: {
        id: string;
        campaign_name: string;
        campaign_description: string;
        deliverables: string;
        budget_range?: string;
        start_date?: string;
        end_date?: string;
        status: 'in_progress' | 'completed' | 'cancelled';
        created_at: string;
        completed_at?: string;
        business?: Business;
        creator?: Creator;
        business_id: string;
        creator_id: string;
    };
    currentUserId: string;
}

export function CampaignDetail({ campaign, currentUserId }: CampaignDetailProps) {
    const isBusinessView = currentUserId === campaign.business_id;
    const partner = isBusinessView ? campaign.creator : campaign.business;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Campaign Info */}
            <div className="card p-6">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">
                    {campaign.campaign_name}
                </h2>

                <div className="prose prose-invert max-w-none">
                    <p className="text-[var(--color-text-muted)]">
                        {campaign.campaign_description}
                    </p>
                </div>

                {/* Deliverables */}
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">
                        Deliverables
                    </h3>
                    <p className="text-[var(--color-text-muted)] whitespace-pre-line">
                        {campaign.deliverables}
                    </p>
                </div>

                {/* Budget & Dates */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {campaign.budget_range && (
                        <div>
                            <h4 className="text-xs font-medium text-[var(--color-text-muted)] mb-1">
                                Budget Range
                            </h4>
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                                {campaign.budget_range}
                            </p>
                        </div>
                    )}

                    {campaign.start_date && (
                        <div>
                            <h4 className="text-xs font-medium text-[var(--color-text-muted)] mb-1">
                                Start Date
                            </h4>
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                                {formatDate(campaign.start_date)}
                            </p>
                        </div>
                    )}

                    {campaign.end_date && (
                        <div>
                            <h4 className="text-xs font-medium text-[var(--color-text-muted)] mb-1">
                                End Date
                            </h4>
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                                {formatDate(campaign.end_date)}
                            </p>
                        </div>
                    )}
                </div>

                {campaign.completed_at && campaign.status === 'completed' && (
                    <div className="mt-6 p-4 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-lg">
                        <p className="text-sm text-[var(--color-success)]">
                            ✓ Completed on {formatDate(campaign.completed_at)}
                        </p>
                    </div>
                )}
            </div>

            {/* Partner Info */}
            {partner && (
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                        {isBusinessView ? 'Creator' : 'Business'} Information
                    </h3>

                    <div className="flex items-start gap-4">
                        {(('logo_url' in partner && partner.logo_url) || ('avatar_url' in partner && partner.avatar_url)) && (
                            <img
                                src={(('logo_url' in partner ? partner.logo_url : '') || ('avatar_url' in partner ? partner.avatar_url : '')) || ''}
                                alt={'brand_name' in partner ? partner.brand_name : 'full_name' in partner ? partner.full_name : ''}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        )}

                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-[var(--color-text)]">
                                {'brand_name' in partner ? partner.brand_name : 'full_name' in partner ? partner.full_name : ''}
                            </h4>

                            <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                {('industry' in partner && partner.industry) || ('niche' in partner && `${partner.niche} creator on ${partner.primary_platform}`)}
                            </p>

                            {'bio' in partner && partner.bio && (
                                <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                    {partner.bio}
                                </p>
                            )}

                            {partner.contact_email && (
                                <p className="text-sm text-[var(--color-primary)] mt-2">
                                    <a href={`mailto:${partner.contact_email}`} className="hover:underline">
                                        {partner.contact_email}
                                    </a>
                                </p>
                            )}

                            {'website' in partner && partner.website && (
                                <p className="text-sm text-[var(--color-primary)] mt-1">
                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {partner.website} ↗
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
