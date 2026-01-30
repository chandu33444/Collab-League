import React from 'react';
import { CreatorCard } from './CreatorCard';

interface CreatorListProps {
    creators: Array<{
        id: string;
        full_name: string;
        avatar_url?: string;
        bio?: string;
        primary_platform: string;
        niche: string;
        followers_count: number;
    }>;
}

export function CreatorList({ creators }: CreatorListProps) {
    if (creators.length === 0) {
        return (
            <div className="card p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                        No Creators Found
                    </h3>
                    <p className="text-[var(--color-text-muted)]">
                        There are no active public creators available at the moment.
                        Please check back later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
            ))}
        </div>
    );
}
