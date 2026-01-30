import React from 'react';
import Link from 'next/link';

interface CreatorProfile {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    niche?: string;
    primary_platform?: string;
    followers_count?: number;
    engagement_rate?: number;
    location?: string;
    website?: string;
    email?: string; // Show only if public contact is enabled (future)
}

export function PublicInfluencerProfile({ creator }: { creator: CreatorProfile }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="card overflow-hidden relative">
                <div className="h-32 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20" />
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                        <div className="w-32 h-32 rounded-full ring-4 ring-[var(--color-surface)] bg-[var(--color-surface)] overflow-hidden">
                            {creator.avatar_url ? (
                                <img
                                    src={creator.avatar_url}
                                    alt={creator.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[var(--color-text-muted)] bg-[var(--color-surface-hover)]">
                                    {creator.full_name?.[0]?.toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">{creator.full_name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[var(--color-text-muted)]">
                                {creator.niche && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                        {creator.niche}
                                    </span>
                                )}
                                {creator.location && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {creator.location}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="pb-2">
                            <button className="btn btn-primary shadow-lg shadow-[var(--color-primary)]/20">
                                Collaborate
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">About</h3>
                                <p className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap">
                                    {creator.bio || "This creator hasn't added a bio yet."}
                                </p>
                            </div>

                            {/* Social Links would go here */}
                        </div>

                        <div className="md:col-span-1 space-y-6">
                            <div className="space-y-4 p-4 rounded-lg bg-[var(--color-surface-hover)]/30 border border-[var(--color-border)]">
                                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Stats</h3>

                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--color-text-muted)]">Followers</span>
                                    <span className="font-bold text-[var(--color-text)]">
                                        {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(creator.followers_count || 0)}
                                    </span>
                                </div>

                                {creator.primary_platform && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--color-text-muted)]">Platform</span>
                                        <span className="font-bold text-[var(--color-text)] capitalize">{creator.primary_platform}</span>
                                    </div>
                                )}

                                {creator.engagement_rate && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--color-text-muted)]">Engagement</span>
                                        <span className="font-bold text-[var(--color-text)]">{creator.engagement_rate}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
