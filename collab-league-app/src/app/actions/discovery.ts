'use server'

import { createClient } from '@/utils/supabase/server'

interface DiscoveryFilters {
    search?: string
    niche?: string
    platform?: string
    minFollowers?: number
    maxFollowers?: number
    sortBy?: 'followers_count' | 'created_at' | 'full_name'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
}

// =============================================
// DISCOVER CREATORS
// =============================================

export async function discoverCreators(filters: DiscoveryFilters = {}) {
    const supabase = await createClient()

    const {
        search,
        niche,
        platform,
        minFollowers,
        maxFollowers,
        sortBy = 'followers_count',
        sortOrder = 'desc',
        page = 1,
        limit = 12
    } = filters

    // Base query: active and public creators only
    let query = supabase
        .from('creators')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .eq('is_public', true)

    // 1. Text Search
    if (search && search.trim()) {
        // ranking uses search_vector created in migration 005
        query = query.textSearch('search_vector', search.trim(), {
            type: 'websearch',
            config: 'english'
        })
    }

    // 2. Niche Filter
    if (niche) {
        query = query.eq('niche', niche)
    }

    // 3. Platform Filter
    if (platform) {
        query = query.eq('primary_platform', platform)
    }

    // 4. Follower Range
    if (minFollowers !== undefined) {
        query = query.gte('followers_count', minFollowers)
    }

    if (maxFollowers !== undefined) {
        query = query.lte('followers_count', maxFollowers)
    }

    // 5. Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // 6. Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
        console.error('Error discovering creators:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        })
        return {
            creators: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
            error: error.message
        }
    }

    return {
        creators: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
    }
}
