import React from 'react';
import Link from 'next/link';

interface CreatorCardProps {
    creator: {
        id: string;
        full_name: string;
        avatar_url?: string;
        bio?: string;
        primary_platform: string;
        niche: string;
        followers_count: number;
    };
}

export function CreatorCard({ creator }: CreatorCardProps) {
    const formatFollowers = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <Link href={`/dashboard/creators/${creator.id}`}>
            <div className="card p-6 hover:border-[var(--color-primary)] transition-all duration-200 
        hover:-translate-y-1 cursor-pointer h-full">
                <div className="flex items-start gap-4 mb-4">
                    {creator.avatar_url ? (
                        <img
                            src={creator.avatar_url}
                            alt={creator.full_name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 
              flex items-center justify-center text-[var(--color-primary)] text-2xl font-bold">
                            {creator.full_name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-1 truncate">
                            {creator.full_name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                                {creator.niche}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]">
                                {creator.primary_platform}
                            </span>
                        </div>
                    </div>
                </div>

                {creator.bio && (
                    <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-3">
                        {creator.bio}
                    </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                    <div>
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">Followers</p>
                        <p className="text-lg font-semibold text-[var(--color-text)]">
                            {formatFollowers(creator.followers_count)}
                        </p>
                    </div>
                    <span className="text-sm text-[var(--color-primary)] hover:underline">
                        View Profile →
                    </span>
                </div>
            </div>
        </Link>
    );
}
