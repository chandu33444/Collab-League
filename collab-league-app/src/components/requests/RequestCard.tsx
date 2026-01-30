import React from 'react';
import Link from 'next/link';
import { StatusBadge } from './StatusBadge';

interface RequestCardProps {
    request: {
        id: string;
        campaign_name: string;
        status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired';
        created_at: string;
        deliverables: string;
        creator_notes?: string;
        responded_at?: string;
        business?: {
            brand_name: string;
            logo_url?: string;
            industry: string;
        };
        creator?: {
            full_name: string;
            avatar_url?: string;
            niche: string;
            primary_platform: string;
        };
    };
    viewerRole: 'business' | 'creator';
}

export function RequestCard({ request, viewerRole }: RequestCardProps) {
    const isCreatorView = viewerRole === 'creator';
    const otherParty = isCreatorView ? request.business : request.creator;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link href={`/dashboard/requests/${request.id}`}>
            <div className="card p-6 hover:border-[var(--color-primary)] transition-all duration-200 
        hover:-translate-y-1 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                            {request.campaign_name}
                        </h3>
                        <StatusBadge status={request.status} />
                    </div>
                    {otherParty && (
                        <div className="flex items-center gap-3 ml-4">
                            {((isCreatorView && 'logo_url' in otherParty && otherParty.logo_url) ||
                                (!isCreatorView && 'avatar_url' in otherParty && otherParty.avatar_url)) && (
                                    <img
                                        src={(isCreatorView && 'logo_url' in otherParty ? otherParty.logo_url :
                                            !isCreatorView && 'avatar_url' in otherParty ? otherParty.avatar_url : '') || ''}
                                        alt={(isCreatorView && 'brand_name' in otherParty ? otherParty.brand_name :
                                            !isCreatorView && 'full_name' in otherParty ? otherParty.full_name : '') || ''}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                )}
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text)]">
                                    {isCreatorView && 'brand_name' in otherParty ? otherParty.brand_name :
                                        !isCreatorView && 'full_name' in otherParty ? otherParty.full_name : ''}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                    {isCreatorView && 'industry' in otherParty ? otherParty.industry :
                                        !isCreatorView && 'niche' in otherParty ? otherParty.niche : ''}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
                    {request.deliverables}
                </p>

                {/* Creator Notes Preview */}
                {request.creator_notes && request.status !== 'pending' && (
                    <div className="mb-4 p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg">
                        <p className="text-xs font-medium text-[var(--color-primary)] mb-1">Creator's Response:</p>
                        <p className="text-sm text-[var(--color-text)] line-clamp-2">
                            {request.creator_notes}
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-[var(--color-text-faint)]">
                    <span>Sent {formatDate(request.created_at)}</span>
                    <span className="text-[var(--color-primary)] hover:underline">
                        View Details →
                    </span>
                </div>
            </div>
        </Link>
    );
}
