# Phase 3: Collaboration Requests

> **Goal:** Enable Brands to send collaboration requests to Influencers, and Influencers to view and respond to incoming requests.

---

## 1. Scope

### Features
- Brands can browse influencer list (basic, no filters yet)
- Brands can view influencer profile details
- Brands can send collaboration requests with campaign details
- Influencers receive collaboration requests in their dashboard
- Influencers can accept or reject requests with optional notes
- Request status updates are reflected in real-time

### Pages & Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard/influencers` | Browse influencer list | Brand only |
| `/dashboard/influencers/[id]` | View influencer details | Brand only |
| `/dashboard/requests` | View incoming requests | Influencer only |
| `/dashboard/requests/[id]` | Request details | Both (own requests) |
| `/dashboard/sent-requests` | View sent requests | Brand only |

### Components
- `InfluencerList` – Grid/list of influencer cards
- `InfluencerDetailCard` – Full profile view for brands
- `CollaborationRequestForm` – Request creation form
- `RequestCard` – Request summary card
- `RequestDetailView` – Full request details
- `RequestActions` – Accept/Reject buttons with notes
- `StatusBadge` – Visual status indicator

---

## 2. Continuity

### Builds On
- **Phase 1:** Auth context for user/role verification
- **Phase 2:** Influencer profiles provide data for browsing
- **Phase 2:** Brand profiles are required to send requests
- **Phase 2:** RLS policies for profile visibility

### Prepares For
- **Phase 4:** Accepted requests become active campaigns
- **Phase 5:** Request data feeds into dashboard analytics
- **Phase 5:** Discovery extends the influencer browsing

---

## 3. Technical Implementation

### 3.1 Database Schema

**`collaboration_requests` table**
```sql
CREATE TABLE public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  
  -- Request Details
  campaign_name TEXT NOT NULL,
  campaign_description TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  budget_range TEXT,
  start_date DATE,
  end_date DATE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
  
  -- Response
  influencer_notes TEXT,
  responded_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate pending requests
  UNIQUE (brand_id, influencer_id, status) 
    WHERE status = 'pending'
);

-- Indexes for performance
CREATE INDEX idx_requests_brand ON public.collaboration_requests(brand_id);
CREATE INDEX idx_requests_influencer ON public.collaboration_requests(influencer_id);
CREATE INDEX idx_requests_status ON public.collaboration_requests(status);

-- Enable RLS
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Brands can view own sent requests"
  ON public.collaboration_requests FOR SELECT
  USING (auth.uid() = brand_id);

CREATE POLICY "Influencers can view received requests"
  ON public.collaboration_requests FOR SELECT
  USING (auth.uid() = influencer_id);

CREATE POLICY "Brands can create requests"
  ON public.collaboration_requests FOR INSERT
  WITH CHECK (
    auth.uid() = brand_id
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'brand'
    )
  );

CREATE POLICY "Brands can cancel own pending requests"
  ON public.collaboration_requests FOR UPDATE
  USING (auth.uid() = brand_id AND status = 'pending')
  WITH CHECK (status = 'cancelled');

CREATE POLICY "Influencers can respond to requests"
  ON public.collaboration_requests FOR UPDATE
  USING (auth.uid() = influencer_id AND status = 'pending')
  WITH CHECK (status IN ('accepted', 'rejected'));
```

### 3.2 Folder Structure Additions

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── influencers/
│   │   │   ├── page.tsx           # Browse influencers (brand)
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Influencer detail (brand)
│   │   ├── requests/
│   │   │   ├── page.tsx           # Incoming requests (influencer)
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Request detail (both)
│   │   └── sent-requests/
│   │       └── page.tsx           # Sent requests (brand)
├── components/
│   ├── requests/
│   │   ├── CollaborationRequestForm.tsx
│   │   ├── RequestCard.tsx
│   │   ├── RequestDetailView.tsx
│   │   ├── RequestActions.tsx
│   │   └── StatusBadge.tsx
│   ├── influencers/
│   │   ├── InfluencerList.tsx
│   │   ├── InfluencerCard.tsx
│   │   └── InfluencerDetailCard.tsx
```

### 3.3 Server Actions

**`app/actions/requests.ts`**
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Get influencers for brand browsing
export async function getInfluencers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('influencers')
    .select('*')
    .eq('is_active', true)
    .eq('is_public', true)
    .order('followers_count', { ascending: false })
  
  if (error) throw error
  return data
}

// Get single influencer profile
export async function getInfluencer(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('influencers')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .eq('is_public', true)
    .single()
  
  if (error) return null
  return data
}

// Send collaboration request (Brand only)
export async function sendCollaborationRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  // Verify user is a brand
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'brand') {
    return { error: 'Only brands can send requests' }
  }
  
  const requestData = {
    brand_id: user.id,
    influencer_id: formData.get('influencerId') as string,
    campaign_name: formData.get('campaignName') as string,
    campaign_description: formData.get('campaignDescription') as string,
    deliverables: formData.get('deliverables') as string,
    budget_range: formData.get('budgetRange') as string || null,
    start_date: formData.get('startDate') as string || null,
    end_date: formData.get('endDate') as string || null
  }
  
  const { error } = await supabase
    .from('collaboration_requests')
    .insert(requestData)
  
  if (error) {
    if (error.code === '23505') {
      return { error: 'You already have a pending request with this influencer' }
    }
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/sent-requests')
  return { success: true }
}

// Get incoming requests (Influencer only)
export async function getIncomingRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('collaboration_requests')
    .select(`
      *,
      brand:brands(brand_name, logo_url, industry)
    `)
    .eq('influencer_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Get sent requests (Brand only)
export async function getSentRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('collaboration_requests')
    .select(`
      *,
      influencer:influencers(full_name, avatar_url, niche, primary_platform)
    `)
    .eq('brand_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Respond to request (Influencer only)
export async function respondToRequest(
  requestId: string,
  status: 'accepted' | 'rejected',
  notes?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('collaboration_requests')
    .update({
      status,
      influencer_notes: notes || null,
      responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .eq('influencer_id', user.id)
    .eq('status', 'pending')
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/requests')
  return { success: true }
}

// Cancel request (Brand only)
export async function cancelRequest(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('collaboration_requests')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .eq('brand_id', user.id)
    .eq('status', 'pending')
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/sent-requests')
  return { success: true }
}
```

### 3.4 Status Badge Component

**`components/requests/StatusBadge.tsx`**
```typescript
const STATUS_STYLES = {
  pending: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    label: 'Pending'
  },
  accepted: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    label: 'Accepted'
  },
  rejected: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    label: 'Rejected'
  },
  cancelled: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    label: 'Cancelled'
  },
  expired: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    label: 'Expired'
  }
}

export function StatusBadge({ status }: { status: keyof typeof STATUS_STYLES }) {
  const style = STATUS_STYLES[status]
  return (
    <span className={`px-2 py-1 rounded-full text-sm ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}
```

### 3.5 Route Protection by Role

**Add to `middleware.ts`**
```typescript
// Role-based route protection
const brandOnlyRoutes = ['/dashboard/influencers', '/dashboard/sent-requests']
const influencerOnlyRoutes = ['/dashboard/requests']

if (brandOnlyRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
  if (profile?.role !== 'brand') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}

if (influencerOnlyRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
  if (profile?.role !== 'influencer') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
```

---

## 4. Acceptance Criteria

- [ ] Brands can browse list of public, active influencers
- [ ] Brands can view detailed influencer profiles
- [ ] Brands can send collaboration requests with required fields
- [ ] Duplicate pending requests are prevented
- [ ] Influencers see incoming requests in dashboard
- [ ] Influencers can accept requests with optional notes
- [ ] Influencers can reject requests with optional notes
- [ ] Status changes reflect immediately for both parties
- [ ] Brands can cancel pending requests
- [ ] Role-based routes are enforced

---

## 5. Deliverables

| Type | Items |
|------|-------|
| Pages | Influencers list, Influencer detail, Requests, Sent requests |
| Components | InfluencerList, RequestCard, RequestForm, StatusBadge |
| Database | `collaboration_requests` table with RLS |
| Server Actions | sendRequest, getRequests, respondToRequest, cancelRequest |
| Middleware | Role-based route protection |
