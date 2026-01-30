'use server'

import { createClient } from '@/utils/supabase/server'

// =============================================
// BUSINESS DASHBOARD STATS
// =============================================

export async function getBrandDashboardStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    // Execute queries in parallel for performance
    const [
        { count: pendingRequests },
        { count: activeCampaigns },
        { count: completedCampaigns },
        { count: totalRequests }
    ] = await Promise.all([
        // Pending Requests
        supabase
            .from('collaboration_requests')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', user.id)
            .eq('status', 'pending'),

        // Active Campaigns
        supabase
            .from('campaigns')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', user.id)
            .eq('status', 'in_progress'),

        // Completed Campaigns
        supabase
            .from('campaigns')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', user.id)
            .eq('status', 'completed'),

        // Total Requests (for acceptance rate)
        supabase
            .from('collaboration_requests')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', user.id)
    ])

    // Calculate acceptance rate
    // (Completed + In Progress) / Total Requests
    const successfulCollaborations = (completedCampaigns || 0) + (activeCampaigns || 0)
    const acceptanceRate = totalRequests
        ? Math.round((successfulCollaborations / totalRequests) * 100)
        : 0

    return {
        pendingRequests: pendingRequests || 0,
        activeCampaigns: activeCampaigns || 0,
        completedCampaigns: completedCampaigns || 0,
        totalRequests: totalRequests || 0,
        acceptanceRate
    }
}

// =============================================
// CREATOR DASHBOARD STATS
// =============================================

export async function getCreatorDashboardStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const [
        { count: pendingRequests },
        { count: activeCampaigns },
        { count: completedCampaigns },
        { count: totalOffers }
    ] = await Promise.all([
        // Pending Requests
        supabase
            .from('collaboration_requests')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', user.id)
            .eq('status', 'pending'),

        // Active Campaigns
        supabase
            .from('campaigns')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', user.id)
            .eq('status', 'in_progress'),

        // Completed Campaigns
        supabase
            .from('campaigns')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', user.id)
            .eq('status', 'completed'),

        // Total Offers (Requests received)
        supabase
            .from('collaboration_requests')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', user.id)
    ])

    return {
        pendingRequests: pendingRequests || 0,
        activeCampaigns: activeCampaigns || 0,
        completedCampaigns: completedCampaigns || 0,
        totalOffers: totalOffers || 0
    }
}

// =============================================
// RECENT ACTIVITY FEED
// =============================================

export async function getRecentActivity(limit = 5) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    // Get user role to determine field names
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile) return []

    const isBusiness = profile.role === 'business'
    const idField = isBusiness ? 'business_id' : 'creator_id'

    // Fetch recent requests updates
    const { data: requests } = await supabase
        .from('collaboration_requests')
        .select('id, campaign_name, status, updated_at')
        .eq(idField, user.id)
        .order('updated_at', { ascending: false })
        .limit(limit)

    // Fetch recent notes
    const { data: notes } = await supabase
        .from('campaign_notes')
        .select(`
      id, 
      content, 
      created_at, 
      campaign:campaigns(campaign_name)
    `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

    // Combine, standardize, and sort
    const activities = [
        ...(requests || []).map(r => ({
            id: `req-${r.id}`,
            type: 'request' as const,
            title: r.campaign_name,
            subtitle: `Status updated to ${r.status.replace('_', ' ')}`,
            time: r.updated_at,
            link: '/dashboard/requests' // Or campaigns if accepted
        })),
        ...(notes || []).map(n => ({
            id: `note-${n.id}`,
            type: 'note' as const,
            title: Array.isArray(n.campaign) ? n.campaign[0]?.campaign_name : (n.campaign as any)?.campaign_name || 'Campaign Note',
            subtitle: `You sent a note: "${n.content.substring(0, 40)}${n.content.length > 40 ? '...' : ''}"`,
            time: n.created_at,
            link: '/dashboard/campaigns' // Ideally deeper link
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return activities.slice(0, limit)
}
