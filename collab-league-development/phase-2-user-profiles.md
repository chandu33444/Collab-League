# Phase 2: User Profiles

> **Goal:** Implement role-based onboarding and complete profile management for both Influencers and Brands.

---

## 1. Scope

### Features
- Role-based onboarding flow after signup
- Influencer profile creation & editing
- Brand profile creation & editing
- Profile visibility controls for influencers
- Profile completion status indicators

### Pages & Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/onboarding` | Role-specific profile setup wizard | Authenticated (incomplete profile) |
| `/dashboard/profile` | View/edit own profile | Authenticated |
| `/dashboard/settings` | Account settings | Authenticated |

### Components
- `OnboardingWizard` – Multi-step profile setup
- `InfluencerProfileForm` – Influencer-specific fields
- `BrandProfileForm` – Brand-specific fields
- `ProfileCard` – Display profile summary
- `AvatarUpload` – Profile image upload
- `NicheSelector` – Multi-select for niches
- `PlatformSelector` – Social platform picker
- `ProfileCompletionBar` – Progress indicator

---

## 2. Continuity

### Builds On
- **Phase 1:** Uses authenticated user context and role from `profiles` table
- **Phase 1:** Extends base layout with onboarding redirect logic
- **Phase 1:** Uses design system tokens for consistent UI

### Prepares For
- **Phase 3:** Brands need complete profiles to send collaboration requests
- **Phase 3:** Influencers need complete profiles to receive/display to brands
- **Phase 5:** Discovery requires influencer profiles with searchable fields

---

## 3. Technical Implementation

### 3.1 Database Schema

**`influencers` table**
```sql
CREATE TABLE public.influencers (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  primary_platform TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  niche TEXT NOT NULL,
  niches TEXT[] DEFAULT '{}',
  followers_count INTEGER DEFAULT 0,
  contact_email TEXT NOT NULL,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Influencers can read own profile"
  ON public.influencers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Influencers can update own profile"
  ON public.influencers FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Influencers can insert own profile"
  ON public.influencers FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Brands can view active public influencers"
  ON public.influencers FOR SELECT
  USING (
    is_active = true 
    AND is_public = true
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'brand'
    )
  );
```

**`brands` table**
```sql
CREATE TABLE public.brands (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email TEXT NOT NULL,
  company_size TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Brands can read own profile"
  ON public.brands FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Brands can update own profile"
  ON public.brands FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Brands can insert own profile"
  ON public.brands FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Influencers can view brands"
  ON public.brands FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'influencer'
    )
  );
```

### 3.2 Folder Structure Additions

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
├── components/
│   ├── profile/
│   │   ├── OnboardingWizard.tsx
│   │   ├── InfluencerProfileForm.tsx
│   │   ├── BrandProfileForm.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── AvatarUpload.tsx
│   │   └── ProfileCompletionBar.tsx
│   ├── ui/
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── MultiSelect.tsx
│   │   └── ProgressBar.tsx
├── lib/
│   ├── constants/
│   │   ├── platforms.ts
│   │   ├── niches.ts
│   │   └── industries.ts
```

### 3.3 Server Actions

**`app/actions/profile.ts`**
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Get current user's profile with role-specific data
export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile) return null
  
  if (profile.role === 'influencer') {
    const { data: influencer } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', user.id)
      .single()
    return { ...profile, ...influencer }
  }
  
  if (profile.role === 'brand') {
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .eq('id', user.id)
      .single()
    return { ...profile, ...brand }
  }
  
  return profile
}

// Create influencer profile
export async function createInfluencerProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const profileData = {
    id: user.id,
    full_name: formData.get('fullName') as string,
    bio: formData.get('bio') as string,
    primary_platform: formData.get('primaryPlatform') as string,
    niche: formData.get('niche') as string,
    followers_count: parseInt(formData.get('followersCount') as string) || 0,
    contact_email: formData.get('contactEmail') as string,
    website: formData.get('website') as string || null
  }
  
  const { error } = await supabase.from('influencers').insert(profileData)
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// Create brand profile
export async function createBrandProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const profileData = {
    id: user.id,
    brand_name: formData.get('brandName') as string,
    industry: formData.get('industry') as string,
    description: formData.get('description') as string,
    website: formData.get('website') as string || null,
    contact_email: formData.get('contactEmail') as string,
    company_size: formData.get('companySize') as string || null
  }
  
  const { error } = await supabase.from('brands').insert(profileData)
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// Update influencer profile
export async function updateInfluencerProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const updates = {
    full_name: formData.get('fullName') as string,
    bio: formData.get('bio') as string,
    primary_platform: formData.get('primaryPlatform') as string,
    niche: formData.get('niche') as string,
    followers_count: parseInt(formData.get('followersCount') as string) || 0,
    is_active: formData.get('isActive') === 'true',
    is_public: formData.get('isPublic') === 'true',
    updated_at: new Date().toISOString()
  }
  
  const { error } = await supabase
    .from('influencers')
    .update(updates)
    .eq('id', user.id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/profile')
  return { success: true }
}

// Update brand profile
export async function updateBrandProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const updates = {
    brand_name: formData.get('brandName') as string,
    industry: formData.get('industry') as string,
    description: formData.get('description') as string,
    website: formData.get('website') as string || null,
    updated_at: new Date().toISOString()
  }
  
  const { error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', user.id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/profile')
  return { success: true }
}
```

### 3.4 Onboarding Redirect Logic

**Update `middleware.ts`**
```typescript
// Add to middleware after auth check
if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
  const supabase = createServerClient(/* ... */)
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile) {
    const table = profile.role === 'brand' ? 'brands' : 'influencers'
    const { data: roleProfile } = await supabase
      .from(table)
      .select('id')
      .eq('id', user.id)
      .single()
    
    // Redirect to onboarding if profile incomplete
    if (!roleProfile && !request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }
}
```

### 3.5 Constants

**`lib/constants/platforms.ts`**
```typescript
export const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'X (Twitter)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'other', label: 'Other' }
] as const
```

**`lib/constants/niches.ts`**
```typescript
export const NICHES = [
  { value: 'fashion', label: 'Fashion & Style' },
  { value: 'tech', label: 'Technology' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food & Cooking' },
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'beauty', label: 'Beauty & Skincare' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'business', label: 'Business & Finance' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'other', label: 'Other' }
] as const
```

---

## 4. Acceptance Criteria

- [ ] New users are redirected to onboarding after signup
- [ ] Influencers can complete profile with all required fields
- [ ] Brands can complete profile with all required fields
- [ ] Users can edit their profile from dashboard
- [ ] Influencers can toggle profile visibility (active/public)
- [ ] Profile completion indicator shows progress
- [ ] Completed profiles redirect to dashboard
- [ ] RLS prevents cross-user profile access

---

## 5. Deliverables

| Type | Items |
|------|-------|
| Pages | Onboarding, Profile, Settings |
| Components | OnboardingWizard, ProfileForms, ProfileCard, AvatarUpload |
| Database | `influencers`, `brands` tables with RLS |
| Server Actions | getProfile, createProfile, updateProfile (role-specific) |
| UI Components | Select, Textarea, MultiSelect, ProgressBar |
