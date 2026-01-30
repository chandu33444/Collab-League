import { createClient } from '@/utils/supabase/server'
import { discoverCreators } from '@/app/actions/discovery'
import {
    FilterWrapper,
    SearchWrapper,
    SortWrapper,
    PaginationWrapper
} from '@/components/discovery'
import Link from 'next/link'

interface SearchParams {
    search?: string
    niche?: string
    platform?: string
    minFollowers?: string
    maxFollowers?: string
    sortBy?: string
    page?: string
}

export default async function DiscoveryPage({
    searchParams
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams

    // Parse params
    const page = parseInt(params.page || '1')

    // Parse sort param (e.g. "followers_count_desc")
    const sortParam = params.sortBy || 'followers_count_desc'
    let sortBy = 'followers_count'
    let sortOrder: 'asc' | 'desc' = 'desc'

    if (sortParam === 'followers_count_asc') {
        sortBy = 'followers_count'
        sortOrder = 'asc'
    } else if (sortParam === 'created_at_desc') {
        sortBy = 'created_at'
        sortOrder = 'desc'
    } else if (sortParam === 'full_name_asc') {
        sortBy = 'full_name'
        sortOrder = 'asc'
    } else {
        // Default or followers_count_desc
        sortBy = 'followers_count'
        sortOrder = 'desc'
    }

    const filters = {
        search: params.search,
        niche: params.niche,
        platform: params.platform,
        minFollowers: params.minFollowers ? parseInt(params.minFollowers) : undefined,
        maxFollowers: params.maxFollowers ? parseInt(params.maxFollowers) : undefined,
        sortBy: sortBy as any,
        sortOrder,
        page
    }

    // Fetch creators
    const { creators, total, totalPages, error } = await discoverCreators(filters)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)]">Discover Creators</h1>
                <p className="text-[var(--color-text-muted)] mt-1">
                    Find the perfect partners for your next campaign
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <FilterWrapper initialFilters={filters} />
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Search & Sort */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <SearchWrapper initialValue={filters.search || ''} />
                        </div>
                        <SortWrapper initialValue={filters.sortBy || ''} />
                    </div>

                    {/* Results Grid */}
                    {error ? (
                        <div className="p-8 text-center text-[var(--color-error)] bg-[var(--color-error)]/10 rounded-lg">
                            Error loading creators: {error}
                        </div>
                    ) : creators.length === 0 ? (
                        <div className="text-center py-12 card">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-surface-hover)] mb-4">
                                <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No creators found</h3>
                            <p className="text-[var(--color-text-muted)]">
                                Try adjusting your search or filters to find more results.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {creators.map((creator: any) => (
                                <Link
                                    key={creator.id}
                                    href={`/creators/${creator.username || creator.id}`}
                                    className="card p-6 flex flex-col items-center text-center hover:border-[var(--color-primary)] transition-all duration-200 hover:-translate-y-1 group"
                                >
                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-[var(--color-surface-hover)] relative">
                                        {creator.avatar_url ? (
                                            <img
                                                src={creator.avatar_url}
                                                alt={creator.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--color-text-muted)]">
                                                {creator.full_name?.[0] || '?'}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                                        {creator.full_name}
                                    </h3>

                                    <p className="text-sm text-[var(--color-text-muted)] mb-3 line-clamp-2 min-h-[40px]">
                                        {creator.bio || 'No bio available'}
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                            {creator.niche || 'General'}
                                        </span>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                                            {creator.primary_platform || 'Platform'}
                                        </span>
                                    </div>

                                    <div className="w-full pt-4 border-t border-[var(--color-border)] mt-auto flex items-center justify-between text-sm">
                                        <span className="text-[var(--color-text-muted)]">
                                            <strong className="text-[var(--color-text)]">
                                                {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(creator.followers_count || 0)}
                                            </strong> Followers
                                        </span>
                                        <span className="text-[var(--color-primary)] font-medium">View Profile</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <PaginationWrapper
                        currentPage={page}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </div>
    )
}
