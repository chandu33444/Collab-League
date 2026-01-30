import React, { Suspense } from 'react';
import { PublicInfluencerCard } from '@/components/public/PublicInfluencerCard';
import { CardSkeleton } from '@/components/loading/LoadingSkeletons';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Discover Creators | Collab League',
    description: 'Find and collaborate with top influencers and creators across various niches.',
};

import { unstable_cache } from 'next/cache';
import { createClient as createPublicClient } from '@supabase/supabase-js';

// Data fetching with caching (1 hour revalidation)
const getPublicCreators = unstable_cache(
    async () => {
        // Use a stateless client for public data to avoid cookie errors in cache
        const supabase = createPublicClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Ensure we only show profiles that have a username AND are public
        const { data, error } = await supabase
            .from('creators')
            .select('*')
            .eq('is_active', true)
            .eq('is_public', true)
            .not('username', 'is', null)
            .order('followers_count', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching public creators:', error.message);
            return [];
        }

        return data || [];
    },
    ['public-creators-directory'],
    { revalidate: 3600, tags: ['creators'] }
);

export default async function PublicCreatorsDirectory() {
    const creators = await getPublicCreators();

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Header */}
            <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                        Discover Top Creators
                    </h1>
                    <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8">
                        Connect with influential voices in Tech, Lifestyle, Gaming, and more.
                        Build authentic partnerships that scale.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/dashboard/discover" className="btn btn-primary">
                            Advanced Search
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 max-w-7xl py-12">
                <Suspense fallback={<CreatorsSkeletonGrid />}>
                    {creators.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">No public profiles yet</h3>
                            <p className="text-[var(--color-text-muted)]">Check back soon or create your own profile!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {creators.map((creator) => (
                                <PublicInfluencerCard key={creator.id} creator={creator} />
                            ))}
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
}

function CreatorsSkeletonGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
