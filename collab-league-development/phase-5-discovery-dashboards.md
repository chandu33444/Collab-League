# Phase 5: Discovery & Dashboards

> **Goal:** Build comprehensive search/filter capabilities for influencer discovery and data-driven dashboards for both user roles.

---

## 1. Scope

### Features
- Advanced influencer search with filters
- Influencer discovery with sorting options
- Brand dashboard with analytics overview
- Influencer dashboard with analytics overview
- Quick-access widgets and stats

### Pages & Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard` | Role-specific dashboard | Authenticated |
| `/dashboard/discover` | Advanced influencer discovery | Brand only |

### Components
- `BrandDashboard` – Brand-specific dashboard view
- `InfluencerDashboard` – Influencer-specific dashboard view
- `StatsCard` – Metric display card
- `QuickActions` – Common action shortcuts
- `RecentActivity` – Activity feed
- `SearchBar` – Text search input
- `FilterPanel` – Filter controls
- `SortDropdown` – Sort options
- `Pagination` – Results pagination

---

## 2. Continuity

### Builds On
- **Phase 2:** Influencer profiles with searchable fields (niche, platform, followers)
- **Phase 3:** Request data for analytics
- **Phase 4:** Campaign data for analytics
- **Phase 1:** Auth context for role-specific views

### Prepares For
- **Phase 6:** Public profiles leverage search infrastructure
- **Phase 6:** Analytics foundation for future advanced metrics

---

## 3. Technical Implementation

### 3.1 Enhanced Database Indexes

```sql
-- Full-text search on influencer profiles
ALTER TABLE public.influencers 
ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(bio, '') || ' ' || coalesce(niche, ''))
) STORED;

CREATE INDEX idx_influencers_search ON public.influencers USING gin(search_vector);

-- Additional filters
CREATE INDEX idx_influencers_niche ON public.influencers(niche);
CREATE INDEX idx_influencers_platform ON public.influencers(primary_platform);
CREATE INDEX idx_influencers_followers ON public.influencers(followers_count);
```

### 3.2 Folder Structure Additions

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Role-aware dashboard
│   │   ├── discover/
│   │   │   └── page.tsx         # Advanced discovery (brand)
├── components/
│   ├── dashboard/
│   │   ├── BrandDashboard.tsx
│   │   ├── InfluencerDashboard.tsx
│   │   ├── StatsCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentActivity.tsx
│   ├── discovery/
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── SortDropdown.tsx
│   │   └── Pagination.tsx
```

### 3.3 Server Actions

**`app/actions/dashboard.ts`**
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

// Brand Dashboard Stats
export async function getBrandDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const [
    { count: pendingRequests },
    { count: activesCampaigns },
    { count: completedCampaigns },
    { count: totalRequests }
  ] = await Promise.all([
    supabase
      .from('collaboration_requests')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', user.id)
      .eq('status', 'pending'),
    supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', user.id)
      .eq('status', 'in_progress'),
    supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', user.id)
      .eq('status', 'completed'),
    supabase
      .from('collaboration_requests')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', user.id)
  ])
  
  return {
    pendingRequests: pendingRequests || 0,
    activeCampaigns: activesCampaigns || 0,
    completedCampaigns: completedCampaigns || 0,
    totalRequests: totalRequests || 0,
    acceptanceRate: totalRequests 
      ? Math.round(((completedCampaigns || 0) + (activesCampaigns || 0)) / totalRequests * 100)
      : 0
  }
}

// Influencer Dashboard Stats
export async function getInfluencerDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const [
    { count: pendingRequests },
    { count: activeCampaigns },
    { count: completedCampaigns },
    { count: totalRequests }
  ] = await Promise.all([
    supabase
      .from('collaboration_requests')
      .select('*', { count: 'exact', head: true })
      .eq('influencer_id', user.id)
      .eq('status', 'pending'),
    supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('influencer_id', user.id)
      .eq('status', 'in_progress'),
    supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('influencer_id', user.id)
      .eq('status', 'completed'),
    supabase
      .from('collaboration_requests')
      .select('*', { count: 'exact', head: true })
      .eq('influencer_id', user.id)
  ])
  
  return {
    pendingRequests: pendingRequests || 0,
    activeCampaigns: activeCampaigns || 0,
    completedCampaigns: completedCampaigns || 0,
    totalOffers: totalRequests || 0
  }
}

// Get recent activity
export async function getRecentActivity(limit = 5) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  const idField = profile?.role === 'brand' ? 'brand_id' : 'influencer_id'
  
  const { data: requests } = await supabase
    .from('collaboration_requests')
    .select('id, campaign_name, status, updated_at')
    .eq(idField, user.id)
    .order('updated_at', { ascending: false })
    .limit(limit)
  
  const { data: notes } = await supabase
    .from('campaign_notes')
    .select('id, content, created_at, campaign:campaigns(campaign_name)')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  // Combine and sort
  const activities = [
    ...(requests || []).map(r => ({
      type: 'request',
      title: r.campaign_name,
      subtitle: `Status: ${r.status}`,
      time: r.updated_at
    })),
    ...(notes || []).map(n => ({
      type: 'note',
      title: n.campaign?.campaign_name || 'Campaign',
      subtitle: n.content.substring(0, 50),
      time: n.created_at
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  
  return activities.slice(0, limit)
}
```

**`app/actions/discovery.ts`**
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

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

export async function discoverInfluencers(filters: DiscoveryFilters = {}) {
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
  
  let query = supabase
    .from('influencers')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_public', true)
  
  // Apply filters
  if (search) {
    query = query.textSearch('search_vector', search)
  }
  
  if (niche) {
    query = query.eq('niche', niche)
  }
  
  if (platform) {
    query = query.eq('primary_platform', platform)
  }
  
  if (minFollowers) {
    query = query.gte('followers_count', minFollowers)
  }
  
  if (maxFollowers) {
    query = query.lte('followers_count', maxFollowers)
  }
  
  // Sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  
  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)
  
  const { data, error, count } = await query
  
  if (error) throw error
  
  return {
    influencers: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}
```

### 3.4 Dashboard Page (Role-Aware)

**`app/(dashboard)/dashboard/page.tsx`**
```typescript
import { createClient } from '@/lib/supabase/server'
import { BrandDashboard } from '@/components/dashboard/BrandDashboard'
import { InfluencerDashboard } from '@/components/dashboard/InfluencerDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()
  
  if (profile?.role === 'brand') {
    return <BrandDashboard />
  }
  
  return <InfluencerDashboard />
}
```

### 3.5 Stats Card Component

**`components/dashboard/StatsCard.tsx`**
```typescript
interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    positive: boolean
  }
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-surface rounded-lg p-6 border border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-success' : 'text-error'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="text-primary opacity-80">{icon}</div>
      </div>
    </div>
  )
}
```

### 3.6 Filter Panel Component

**`components/discovery/FilterPanel.tsx`**
```typescript
'use client'

import { NICHES } from '@/lib/constants/niches'
import { PLATFORMS } from '@/lib/constants/platforms'

interface FilterPanelProps {
  filters: {
    niche?: string
    platform?: string
    minFollowers?: number
    maxFollowers?: number
  }
  onChange: (filters: FilterPanelProps['filters']) => void
}

const FOLLOWER_RANGES = [
  { label: 'Any', min: undefined, max: undefined },
  { label: '1K - 10K', min: 1000, max: 10000 },
  { label: '10K - 100K', min: 10000, max: 100000 },
  { label: '100K - 1M', min: 100000, max: 1000000 },
  { label: '1M+', min: 1000000, max: undefined }
]

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <div className="bg-surface rounded-lg p-4 border border-border space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Niche</label>
        <select
          value={filters.niche || ''}
          onChange={(e) => onChange({ ...filters, niche: e.target.value || undefined })}
          className="input w-full"
        >
          <option value="">All Niches</option>
          {NICHES.map(n => (
            <option key={n.value} value={n.value}>{n.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Platform</label>
        <select
          value={filters.platform || ''}
          onChange={(e) => onChange({ ...filters, platform: e.target.value || undefined })}
          className="input w-full"
        >
          <option value="">All Platforms</option>
          {PLATFORMS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Followers</label>
        <div className="space-y-1">
          {FOLLOWER_RANGES.map((range, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="followers"
                checked={filters.minFollowers === range.min && filters.maxFollowers === range.max}
                onChange={() => onChange({ 
                  ...filters, 
                  minFollowers: range.min, 
                  maxFollowers: range.max 
                })}
              />
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 4. Acceptance Criteria

- [ ] Brand dashboard shows: pending requests, active campaigns, completed, acceptance rate
- [ ] Influencer dashboard shows: pending requests, active campaigns, completed, total offers
- [ ] Recent activity shows latest updates
- [ ] Discovery page has search functionality
- [ ] Filter by niche works correctly
- [ ] Filter by platform works correctly
- [ ] Filter by follower range works correctly
- [ ] Sort by followers/date works
- [ ] Pagination functions correctly
- [ ] Empty states are handled gracefully

---

## 5. Deliverables

| Type | Items |
|------|-------|
| Pages | Enhanced Dashboard, Discovery page |
| Components | StatsCard, RecentActivity, SearchBar, FilterPanel, Pagination |
| Database | Full-text search index, additional indexes |
| Server Actions | getDashboardStats, discoverInfluencers, getRecentActivity |
