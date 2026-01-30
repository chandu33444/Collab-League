'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { UserProfile, CreatorProfile, BusinessProfile } from '@/types/profile'

/**
 * Get current user's profile with role-specific data
 */
export async function getProfile(): Promise<UserProfile | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) return null

    // Fetch role-specific data
    if (profile.role === 'creator') {
        const { data: creator } = await supabase
            .from('creators')
            .select('*')
            .eq('id', user.id)
            .single()

        if (creator) {
            return { ...profile, ...creator } as CreatorProfile
        }
    }

    if (profile.role === 'business') {
        const { data: business } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', user.id)
            .single()

        if (business) {
            return { ...profile, ...business } as BusinessProfile
        }
    }

    return profile as UserProfile
}

/**
 * Check if user has completed their role-specific profile
 */
export async function hasCompletedProfile(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile) return false

    const table = profile.role === 'creator' ? 'creators' : 'businesses'
    const { data } = await supabase
        .from(table)
        .select('id')
        .eq('id', user.id)
        .single()

    return !!data
}

/**
 * Create creator profile
 */
export async function createCreatorProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const profileData = {
        id: user.id,
        full_name: formData.get('fullName') as string,
        bio: formData.get('bio') as string || null,
        primary_platform: formData.get('primaryPlatform') as string,
        niche: formData.get('niche') as string,
        followers_count: parseInt(formData.get('followersCount') as string) || 0,
        contact_email: formData.get('contactEmail') as string,
        website: formData.get('website') as string || null,
        is_active: true,
        is_public: formData.get('isPublic') === 'true'
    }

    const { error } = await supabase.from('creators').insert(profileData)

    if (error) {
        console.error('Error creating creator profile:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

/**
 * Create business profile
 */
export async function createBusinessProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const profileData = {
        id: user.id,
        brand_name: formData.get('brandName') as string,
        industry: formData.get('industry') as string,
        description: formData.get('description') as string || null,
        website: formData.get('website') as string || null,
        contact_email: formData.get('contactEmail') as string,
        company_size: formData.get('companySize') as string || null
    }

    const { error } = await supabase.from('businesses').insert(profileData)

    if (error) {
        console.error('Error creating business profile:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

/**
 * Update creator profile
 */
export async function updateCreatorProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const updates = {
        full_name: formData.get('fullName') as string,
        bio: formData.get('bio') as string || null,
        primary_platform: formData.get('primaryPlatform') as string,
        niche: formData.get('niche') as string,
        followers_count: parseInt(formData.get('followersCount') as string) || 0,
        website: formData.get('website') as string || null,
        is_active: formData.get('isActive') === 'true',
        is_public: formData.get('isPublic') === 'true',
        updated_at: new Date().toISOString()
    }

    const { error } = await supabase
        .from('creators')
        .update(updates)
        .eq('id', user.id)

    if (error) {
        console.error('Error updating creator profile:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/profile')
    return { success: true }
}

/**
 * Update business profile
 */
export async function updateBusinessProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const updates = {
        brand_name: formData.get('brandName') as string,
        industry: formData.get('industry') as string,
        description: formData.get('description') as string || null,
        website: formData.get('website') as string || null,
        company_size: formData.get('companySize') as string || null,
        updated_at: new Date().toISOString()
    }

    const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', user.id)

    if (error) {
        console.error('Error updating business profile:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/profile')
    return { success: true }
}
