'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// =============================================
// CAMPAIGN RETRIEVAL
// =============================================

/**
 * Get all campaigns for current user
 */
export async function getCampaigns() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    // Get user's role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return []
    }

    const isCreator = profile.role === 'creator'
    const idField = isCreator ? 'creator_id' : 'business_id'
    const joinTable = isCreator ? 'businesses' : 'creators'
    const joinFields = isCreator
        ? 'brand_name, logo_url, industry'
        : 'full_name, avatar_url, niche'

    const { data, error } = await supabase
        .from('campaigns')
        .select(`
      *,
      partner:${joinTable}(${joinFields})
    `)
        .eq(idField, user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching campaigns:', error)
        return []
    }

    return data || []
}

/**
 * Get single campaign with full details
 */
export async function getCampaign(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data, error } = await supabase
        .from('campaigns')
        .select(`
      *,
      business:businesses(brand_name, logo_url, industry, contact_email, website),
      creator:creators(full_name, avatar_url, niche, primary_platform, contact_email, bio)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching campaign:', error)
        return null
    }

    // Verify user is participant (RLS + application layer)
    if (data.business_id !== user.id && data.creator_id !== user.id) {
        console.log('User not authorized to view campaign:', { campaignId: id, userId: user.id })
        return null
    }

    return data
}

// =============================================
// CAMPAIGN NOTES
// =============================================

/**
 * Get all notes for a campaign
 */
export async function getCampaignNotes(campaignId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('campaign_notes')
        .select(`
      *,
      author:profiles!author_id(
        id,
        role,
        username
      )
    `)
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching campaign notes:', error)
        return []
    }

    // Enrich with author name based on role
    const enrichedNotes = await Promise.all(
        (data || []).map(async (note) => {
            if (!note.author) return note

            const authorId = note.author.id
            const role = note.author.role

            if (role === 'business') {
                const { data: business } = await supabase
                    .from('businesses')
                    .select('brand_name')
                    .eq('id', authorId)
                    .single()

                return {
                    ...note,
                    author: {
                        ...note.author,
                        name: business?.brand_name || 'Business User'
                    }
                }
            } else {
                const { data: creator } = await supabase
                    .from('creators')
                    .select('full_name')
                    .eq('id', authorId)
                    .single()

                return {
                    ...note,
                    author: {
                        ...note.author,
                        name: creator?.full_name || 'Creator User'
                    }
                }
            }
        })
    )

    return enrichedNotes
}

/**
 * Add a new note to a campaign
 */
export async function addCampaignNote(campaignId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    if (!content || content.trim().length === 0) {
        return { error: 'Note content cannot be empty' }
    }

    const { error } = await supabase
        .from('campaign_notes')
        .insert({
            campaign_id: campaignId,
            author_id: user.id,
            content: content.trim()
        })

    if (error) {
        console.error('Error adding campaign note:', error)
        return { error: 'Failed to add note. Please try again.' }
    }

    revalidatePath(`/dashboard/campaigns/${campaignId}`)
    return { success: true }
}

// =============================================
// CAMPAIGN STATUS UPDATES
// =============================================

/**
 * Update campaign status
 */
export async function updateCampaignStatus(
    campaignId: string,
    status: 'completed' | 'cancelled'
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString()
    }

    if (status === 'completed') {
        updates.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId)

    if (error) {
        console.error('Error updating campaign status:', error)
        return { error: 'Failed to update campaign status. Please try again.' }
    }

    revalidatePath('/dashboard/campaigns')
    revalidatePath(`/dashboard/campaigns/${campaignId}`)
    return { success: true }
}
