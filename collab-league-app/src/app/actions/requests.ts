'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// =============================================
// CREATOR DISCOVERY (Business only)
// =============================================

/**
 * Get all public, active creators for business browsing
 */
export async function getCreators() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('is_active', true)
        .eq('is_public', true)
        .order('followers_count', { ascending: false })

    if (error) {
        console.error('Error fetching creators:', error)
        return []
    }

    return data
}

/**
 * Get single creator profile by ID
 */
export async function getCreator(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching creator:', {
            errorCode: error.code,
            errorMessage: error.message,
            errorDetails: error.details,
            creatorId: id
        })
        return null
    }

    // Return null if creator is not active or public
    if (!data || !data.is_active || !data.is_public) {
        console.log('Creator not available:', { id, is_active: data?.is_active, is_public: data?.is_public })
        return null
    }

    return data
}

// =============================================
// COLLABORATION REQUESTS
// =============================================

/**
 * Send collaboration request (Business only)
 */
export async function sendCollaborationRequest(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Verify user is a business
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'business') {
        return { error: 'Only businesses can send collaboration requests' }
    }

    const requestData = {
        business_id: user.id,
        creator_id: formData.get('creatorId') as string,
        campaign_name: formData.get('campaignName') as string,
        campaign_description: formData.get('campaignDescription') as string,
        deliverables: formData.get('deliverables') as string,
        budget_range: formData.get('budgetRange') as string || null,
        start_date: formData.get('startDate') as string || null,
        end_date: formData.get('endDate') as string || null
    }

    // Validate required fields
    if (!requestData.creator_id || !requestData.campaign_name ||
        !requestData.campaign_description || !requestData.deliverables) {
        return { error: 'Please fill in all required fields' }
    }

    const { error } = await supabase
        .from('collaboration_requests')
        .insert(requestData)

    if (error) {
        console.error('Error creating request:', error)

        // Handle duplicate pending request
        if (error.code === '23505') {
            return { error: 'You already have a pending request with this creator' }
        }

        return { error: 'Failed to send collaboration request. Please try again.' }
    }

    revalidatePath('/dashboard/sent-requests')
    return { success: true }
}

/**
 * Get incoming requests (Creator only)
 */
export async function getIncomingRequests() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('collaboration_requests')
        .select(`
      *,
      business:businesses(brand_name, logo_url, industry, contact_email)
    `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching incoming requests:', error)
        return []
    }

    return data
}

/**
 * Get sent requests (Business only)
 */
export async function getSentRequests() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('collaboration_requests')
        .select(`
      *,
      creator:creators(full_name, avatar_url, niche, primary_platform, contact_email)
    `)
        .eq('business_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching sent requests:', error)
        return []
    }

    return data
}

/**
 * Get request details by ID (Both roles, RLS enforced)
 */
export async function getRequestDetails(requestId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('collaboration_requests')
        .select(`
      *,
      business:businesses(brand_name, logo_url, industry, contact_email, website),
      creator:creators(full_name, avatar_url, niche, primary_platform, contact_email, bio)
    `)
        .eq('id', requestId)
        .single()

    if (error) {
        console.error('Error fetching request details:', error)
        return null
    }

    return data
}

/**
 * Respond to request (Creator only)
 */
export async function respondToRequest(
    requestId: string,
    status: 'accepted' | 'rejected',
    notes?: string
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Verify user is a creator
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'creator') {
        return { error: 'Only creators can respond to requests' }
    }

    const { error } = await supabase
        .from('collaboration_requests')
        .update({
            status,
            creator_notes: notes || null,
            responded_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('creator_id', user.id)
        .eq('status', 'pending')

    if (error) {
        console.error('Error responding to request:', error)
        return { error: 'Failed to update request. Please try again.' }
    }

    revalidatePath('/dashboard/requests')
    revalidatePath(`/dashboard/requests/${requestId}`)
    return { success: true }
}

/**
 * Cancel request (Business only)
 */
export async function cancelRequest(requestId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Verify user is a business
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'business') {
        return { error: 'Only businesses can cancel requests' }
    }

    const { error } = await supabase
        .from('collaboration_requests')
        .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('business_id', user.id)
        .eq('status', 'pending')

    if (error) {
        console.error('Error cancelling request:', error)
        return { error: 'Failed to cancel request. Please try again.' }
    }

    revalidatePath('/dashboard/sent-requests')
    revalidatePath(`/dashboard/requests/${requestId}`)
    return { success: true }
}
