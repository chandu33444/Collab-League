import React from 'react';

interface CreatorDetailCardProps {
    creator: {
        id: string;
        full_name: string;
        avatar_url?: string;
        bio?: string;
        primary_platform: string;
        platforms?: string[];
        niche: string;
        niches?: string[];
        followers_count: number;
        contact_email: string;
        website?: string;
    };
}

export function CreatorDetailCard({ creator }: CreatorDetailCardProps) {
    const formatFollowers = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className="card p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-6">
                {creator.avatar_url ? (
                    <img
                        src={creator.avatar_url}
                        alt={creator.full_name}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/20 
            flex items-center justify-center text-[var(--color-primary)] text-4xl font-bold">
                        {creator.full_name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[var(--color-text)] mb-3">
                        {creator.full_name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                            {creator.niche}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]">
                            {creator.primary_platform}
                        </span>
                    </div>
                    <div className="flex gap-6">
                        <div>
                            <p className="text-sm text-[var(--color-text-muted)] mb-1">Followers</p>
                            <p className="text-2xl font-bold text-[var(--color-text)]">
                                {formatFollowers(creator.followers_count)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            {creator.bio && (
                <div className="border-t border-[var(--color-border)] pt-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                        About
                    </h3>
                    <p className="text-[var(--color-text-muted)] whitespace-pre-wrap">
                        {creator.bio}
                    </p>
                </div>
            )}

            {/* Platforms */}
            {creator.platforms && creator.platforms.length > 0 && (
                <div className="border-t border-[var(--color-border)] pt-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                        Platforms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {creator.platforms.map((platform) => (
                            <span
                                key={platform}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium
                  bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]"
                            >
                                {platform}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Niches */}
            {creator.niches && creator.niches.length > 0 && (
                <div className="border-t border-[var(--color-border)] pt-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                        Content Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {creator.niches.map((niche) => (
                            <span
                                key={niche}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium
                  bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]"
                            >
                                {niche}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact */}
            <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                    Contact Information
                </h3>
                <div className="space-y-2">
                    <a
                        href={`mailto:${creator.contact_email}`}
                        className="block text-[var(--color-primary)] hover:underline"
                    >
                        {creator.contact_email}
                    </a>
                    {creator.website && (
                        <a
                            href={creator.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[var(--color-primary)] hover:underline"
                        >
                            {creator.website}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
