import React from 'react';
import { StatusBadge } from './StatusBadge';

interface RequestDetailViewProps {
    request: {
        id: string;
        campaign_name: string;
        campaign_description: string;
        deliverables: string;
        budget_range?: string;
        start_date?: string;
        end_date?: string;
        status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired';
        creator_notes?: string;
        responded_at?: string;
        created_at: string;
        business: {
            brand_name: string;
            logo_url?: string;
            industry: string;
            contact_email: string;
            website?: string;
        };
        creator: {
            full_name: string;
            avatar_url?: string;
            niche: string;
            primary_platform: string;
            contact_email: string;
            bio?: string;
        };
    };
    viewerRole: 'business' | 'creator';
}

export function RequestDetailView({ request, viewerRole }: RequestDetailViewProps) {
    const isCreatorView = viewerRole === 'creator';
    const otherParty = isCreatorView ? request.business : request.creator;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text)] mb-3">
                        {request.campaign_name}
                    </h1>
                    <StatusBadge status={request.status} />
                </div>
                <div className="text-right">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Sent on {formatDate(request.created_at)}
                    </p>
                    {request.responded_at && (
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Responded on {formatDate(request.responded_at)}
                        </p>
                    )}
                </div>
            </div>

            {/* Parties */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* From (Business) */}
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-4">
                        From
                    </h3>
                    <div className="flex items-start gap-4">
                        {request.business.logo_url && (
                            <img
                                src={request.business.logo_url}
                                alt={request.business.brand_name}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                        )}
                        <div>
                            <h4 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                                {request.business.brand_name}
                            </h4>
                            <p className="text-sm text-[var(--color-text-muted)] mb-2">
                                {request.business.industry}
                            </p>
                            <a
                                href={`mailto:${request.business.contact_email}`}
                                className="text-sm text-[var(--color-primary)] hover:underline"
                            >
                                {request.business.contact_email}
                            </a>
                            {request.business.website && (
                                <>
                                    <br />
                                    <a
                                        href={request.business.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[var(--color-primary)] hover:underline"
                                    >
                                        {request.business.website}
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* To (Creator) */}
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-4">
                        To
                    </h3>
                    <div className="flex items-start gap-4">
                        {request.creator.avatar_url && (
                            <img
                                src={request.creator.avatar_url}
                                alt={request.creator.full_name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        )}
                        <div>
                            <h4 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                                {request.creator.full_name}
                            </h4>
                            <p className="text-sm text-[var(--color-text-muted)] mb-1">
                                {request.creator.niche} • {request.creator.primary_platform}
                            </p>
                            <a
                                href={`mailto:${request.creator.contact_email}`}
                                className="text-sm text-[var(--color-primary)] hover:underline"
                            >
                                {request.creator.contact_email}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Details */}
            <div className="card p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                        Campaign Description
                    </h3>
                    <p className="text-[var(--color-text-muted)] whitespace-pre-wrap">
                        {request.campaign_description}
                    </p>
                </div>

                <div className="border-t border-[var(--color-border)] pt-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                        Deliverables
                    </h3>
                    <p className="text-[var(--color-text-muted)] whitespace-pre-wrap">
                        {request.deliverables}
                    </p>
                </div>

                {request.budget_range && (
                    <div className="border-t border-[var(--color-border)] pt-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                            Budget Range
                        </h3>
                        <p className="text-[var(--color-text-muted)]">
                            {request.budget_range}
                        </p>
                    </div>
                )}

                {(request.start_date || request.end_date) && (
                    <div className="border-t border-[var(--color-border)] pt-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                            Timeline
                        </h3>
                        <div className="flex gap-8">
                            {request.start_date && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-muted)] mb-1">
                                        Start Date
                                    </p>
                                    <p className="text-[var(--color-text)]">
                                        {formatDate(request.start_date)}
                                    </p>
                                </div>
                            )}
                            {request.end_date && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-muted)] mb-1">
                                        End Date
                                    </p>
                                    <p className="text-[var(--color-text)]">
                                        {formatDate(request.end_date)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {request.creator_notes && (
                    <div className="border-t border-[var(--color-border)] pt-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                            Response Notes
                        </h3>
                        <p className="text-[var(--color-text-muted)] whitespace-pre-wrap">
                            {request.creator_notes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
