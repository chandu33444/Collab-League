import React from 'react';
import { CampaignCard } from './CampaignCard';

interface CampaignListProps {
    campaigns: any[];
    viewerRole: 'business' | 'creator';
}

export function CampaignList({ campaigns, viewerRole }: CampaignListProps) {
    if (campaigns.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-surface-hover)] mb-4">
                    <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                    No Campaigns Yet
                </h3>
                <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                    {viewerRole === 'business'
                        ? 'When creators accept your collaboration requests, campaigns will appear here.'
                        : 'When you accept collaboration requests, campaigns will appear here.'
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
                <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    viewerRole={viewerRole}
                />
            ))}
        </div>
    );
}
