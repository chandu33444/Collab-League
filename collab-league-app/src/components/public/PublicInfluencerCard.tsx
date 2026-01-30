import Link from 'next/link';
import React from 'react';

// Using a flexible definition since we might join with other tables later
interface Creator {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    niche?: string;
    primary_platform?: string;
    followers_count?: number;
}

export function PublicInfluencerCard({ creator }: { creator: Creator }) {
    // Safe fallback if username isn't generated yet (though logic suggests it should be)
    const profileLink = creator.username ? `/creator/${creator.username}` : '#';

    return (
        <Link
            href={profileLink}
            className="card p-6 flex flex-col items-center text-center hover:border-[var(--color-primary)] transition-all duration-200 hover:-translate-y-1 group h-full"
        >
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-[var(--color-surface-hover)] relative ring-2 ring-transparent group-hover:ring-[var(--color-primary)] transition-all">
                {creator.avatar_url ? (
                    <img
                        src={creator.avatar_url}
                        alt={creator.full_name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--color-text-muted)] bg-[var(--color-surface-hover)]">
                        {creator.full_name?.[0]?.toUpperCase() || '?'}
                    </div>
                )}
            </div>

            <h3 className="text-lg font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                {creator.full_name}
            </h3>

            <p className="text-sm text-[var(--color-text-muted)] mb-3 line-clamp-2 min-h-[40px]">
                {creator.bio || 'No bio available'}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-4 mt-auto">
                {creator.niche && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        {creator.niche}
                    </span>
                )}
                {creator.primary_platform && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                        {creator.primary_platform}
                    </span>
                )}
            </div>

            <div className="w-full pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-text)]">
                        {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(creator.followers_count || 0)}
                    </strong> Followers
                </span>
                <span className="text-[var(--color-primary)] font-medium group-hover:underline">View Profile &rarr;</span>
            </div>
        </Link>
    );
}
