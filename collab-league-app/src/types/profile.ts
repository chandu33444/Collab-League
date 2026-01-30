import { Platform } from '@/lib/constants/platforms';
import { Niche } from '@/lib/constants/niches';
import { Industry, CompanySize } from '@/lib/constants/industries';

// Base profile from auth
export interface BaseProfile {
    id: string;
    role: 'creator' | 'business' | 'admin';
    username?: string;
    avatar_url?: string;
    updated_at?: string;
}

// Creator-specific profile
export interface CreatorProfile extends BaseProfile {
    role: 'creator';
    full_name: string;
    bio?: string;
    primary_platform: Platform | string;
    platforms?: Platform[] | string[];
    niche: Niche | string;
    niches?: Niche[] | string[];
    followers_count?: number;
    contact_email: string;
    website?: string;
    is_active?: boolean;
    is_public?: boolean;
    created_at?: string;
}

// Business-specific profile
export interface BusinessProfile extends BaseProfile {
    role: 'business';
    brand_name: string;
    industry: Industry | string;
    description?: string;
    logo_url?: string;
    website?: string;
    contact_email: string;
    company_size?: CompanySize | string;
    is_verified?: boolean;
    created_at?: string;
}

// Admin-specific profile
export interface AdminProfile extends BaseProfile {
    role: 'admin';
    full_name?: string; // Optional, might just be email in auth
}

// Union type for all profiles
export type UserProfile = CreatorProfile | BusinessProfile | AdminProfile;

// Form data types
export interface CreatorProfileFormData {
    fullName: string;
    bio?: string;
    primaryPlatform: string;
    platforms?: string[];
    niche: string;
    niches?: string[];
    followersCount?: number;
    contactEmail: string;
    website?: string;
    isActive?: boolean;
    isPublic?: boolean;
}

export interface BusinessProfileFormData {
    brandName: string;
    industry: string;
    description?: string;
    website?: string;
    contactEmail: string;
    companySize?: string;
}
