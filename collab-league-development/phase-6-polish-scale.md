# Phase 6: Polish & Scale

> **Goal:** Finalize the platform with public profiles, performance optimization, and future-ready architecture for enhancements.

---

## 1. Scope

### Features
- Public influencer profile pages (SEO-optimized)
- Shareable influencer URLs
- Performance optimization (caching, lazy loading)
- Loading states and error boundaries
- Toast notifications system
- Future hooks: payments, email notifications, analytics

### Pages & Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/creator/[username]` | Public influencer profile | Public |
| `/creators` | Public influencer directory | Public |

### Components
- `PublicInfluencerProfile` – SEO-optimized public view
- `PublicInfluencerCard` – Directory listing card
- `Toast` – Notification system
- `ErrorBoundary` – Graceful error handling
- `LoadingSkeletons` – Content placeholders
- `SEOHead` – Meta tags component

---

## 2. Continuity

### Builds On
- **Phase 2:** Influencer profiles with `is_public` flag
- **Phase 5:** Discovery infrastructure and search
- **All Phases:** UI components and design system

### Prepares For
- Payment integration (Stripe/Razorpay)
- Email notifications (Supabase Edge Functions / Resend)
- Advanced analytics dashboard
- Mobile app (React Native)

---

## 3. Technical Implementation

### 3.1 Database Updates

**Add username to influencers**
```sql
ALTER TABLE public.influencers
ADD COLUMN username TEXT UNIQUE;

-- Trigger to auto-generate username from full_name
CREATE OR REPLACE FUNCTION generate_username()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  base_username := lower(regexp_replace(NEW.full_name, '[^a-zA-Z0-9]', '', 'g'));
  final_username := base_username;
  
  WHILE EXISTS (SELECT 1 FROM public.influencers WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter;
  END LOOP;
  
  NEW.username := final_username;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_username
  BEFORE INSERT ON public.influencers
  FOR EACH ROW
  WHEN (NEW.username IS NULL)
  EXECUTE FUNCTION generate_username();

-- RLS for public access
CREATE POLICY "Anyone can view public profiles"
  ON public.influencers FOR SELECT
  USING (is_active = true AND is_public = true);
```

### 3.2 Folder Structure Additions

```
src/
├── app/
│   ├── creator/
│   │   └── [username]/
│   │       └── page.tsx           # Public profile
│   ├── creators/
│   │   └── page.tsx               # Public directory
├── components/
│   ├── public/
│   │   ├── PublicInfluencerProfile.tsx
│   │   └── PublicInfluencerCard.tsx
│   ├── feedback/
│   │   ├── Toast.tsx
│   │   ├── ToastProvider.tsx
│   │   └── ErrorBoundary.tsx
│   ├── loading/
│   │   ├── PageSkeleton.tsx
│   │   ├── CardSkeleton.tsx
│   │   └── TableSkeleton.tsx
├── lib/
│   └── hooks/
│       └── useToast.ts
```

### 3.3 Public Profile Page with SEO

**`app/creator/[username]/page.tsx`**
```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PublicInfluencerProfile } from '@/components/public/PublicInfluencerProfile'

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  
  const { data: influencer } = await supabase
    .from('influencers')
    .select('full_name, bio, niche, primary_platform')
    .eq('username', params.username)
    .eq('is_active', true)
    .eq('is_public', true)
    .single()
  
  if (!influencer) {
    return { title: 'Creator Not Found | Collab League' }
  }
  
  return {
    title: `${influencer.full_name} | Collab League`,
    description: influencer.bio || `${influencer.full_name} is a ${influencer.niche} creator on ${influencer.primary_platform}`,
    openGraph: {
      title: influencer.full_name,
      description: influencer.bio || '',
      type: 'profile'
    },
    twitter: {
      card: 'summary_large_image',
      title: influencer.full_name
    }
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const supabase = await createClient()
  
  const { data: influencer } = await supabase
    .from('influencers')
    .select('*')
    .eq('username', params.username)
    .eq('is_active', true)
    .eq('is_public', true)
    .single()
  
  if (!influencer) {
    notFound()
  }
  
  return <PublicInfluencerProfile influencer={influencer} />
}

// Static generation for known profiles
export async function generateStaticParams() {
  const supabase = await createClient()
  
  const { data: influencers } = await supabase
    .from('influencers')
    .select('username')
    .eq('is_active', true)
    .eq('is_public', true)
    .limit(100)
  
  return (influencers || []).map((i) => ({
    username: i.username
  }))
}
```

### 3.4 Toast Notification System

**`components/feedback/ToastProvider.tsx`**
```typescript
'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from './Toast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  
  const toast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])
  
  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])
  
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
```

**`components/feedback/Toast.tsx`**
```typescript
const STYLES = {
  success: 'bg-green-500/20 border-green-500/50 text-green-400',
  error: 'bg-red-500/20 border-red-500/50 text-red-400',
  warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  info: 'bg-blue-500/20 border-blue-500/50 text-blue-400'
}

interface ToastProps {
  type: keyof typeof STYLES
  message: string
  onDismiss: () => void
}

export function Toast({ type, message, onDismiss }: ToastProps) {
  return (
    <div 
      className={`
        px-4 py-3 rounded-lg border flex items-center gap-3 
        animate-slide-in ${STYLES[type]}
      `}
    >
      <span>{message}</span>
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  )
}
```

### 3.5 Loading Skeletons

**`components/loading/CardSkeleton.tsx`**
```typescript
export function CardSkeleton() {
  return (
    <div className="bg-surface rounded-lg p-6 border border-border animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-hover" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-surface-hover rounded" />
          <div className="h-3 w-24 bg-surface-hover rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full bg-surface-hover rounded" />
        <div className="h-3 w-3/4 bg-surface-hover rounded" />
      </div>
    </div>
  )
}
```

### 3.6 Performance Optimizations

**Next.js Config (`next.config.js`)**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js']
  }
}

module.exports = nextConfig
```

**Caching Strategy**
```typescript
// In server actions, use unstable_cache for read operations
import { unstable_cache } from 'next/cache'

export const getCachedInfluencers = unstable_cache(
  async () => {
    const supabase = await createClient()
    const { data } = await supabase
      .from('influencers')
      .select('*')
      .eq('is_active', true)
      .eq('is_public', true)
      .order('followers_count', { ascending: false })
      .limit(50)
    return data
  },
  ['public-influencers'],
  { revalidate: 300 } // 5 minutes
)
```

### 3.7 Future-Ready Hooks

**Payments (Placeholder)**
```typescript
// lib/payments/index.ts
export interface PaymentConfig {
  provider: 'stripe' | 'razorpay'
  webhookSecret: string
}

export async function initializePayment(/* config */) {
  // Placeholder for Stripe/Razorpay integration
  throw new Error('Payments not implemented. Enable in Phase 7.')
}
```

**Email Notifications (Placeholder)**
```typescript
// lib/notifications/email.ts
export async function sendEmail(to: string, template: string, data: object) {
  // Placeholder for Resend/Supabase Edge Function
  console.log('Email notification:', { to, template, data })
  throw new Error('Email notifications not implemented. Enable in Phase 7.')
}

// Future triggers:
// - New collaboration request → notify influencer
// - Request accepted → notify brand
// - Campaign completed → notify both
```

---

## 4. Acceptance Criteria

- [ ] Public profile pages render correctly
- [ ] SEO meta tags are generated dynamically
- [ ] Public profiles are shareable via URL
- [ ] Public directory lists active, public influencers
- [ ] Toast notifications appear and auto-dismiss
- [ ] Loading skeletons display during data fetch
- [ ] Error boundaries catch and display errors gracefully
- [ ] Performance: Page load < 2 seconds
- [ ] Caching reduces redundant database queries

---

## 5. Deliverables

| Type | Items |
|------|-------|
| Pages | Public profile, Public directory |
| Components | PublicProfile, Toast, ErrorBoundary, Skeletons |
| Database | Username column, public access RLS |
| Config | Next.js optimization, caching strategy |
| Hooks | Payment placeholder, Email placeholder |

---

## 6. Future Enhancements (Phase 7+)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Payments** | Stripe/Razorpay for campaign budgets | High |
| **Email Notifications** | Transactional emails via Resend | High |
| **Analytics Dashboard** | Campaign performance metrics | Medium |
| **File Uploads** | Deliverable attachments | Medium |
| **Rating System** | Post-campaign reviews | Medium |
| **Mobile App** | React Native companion app | Low |
| **Admin Panel** | Content moderation & disputes | Low |
