# Phase 0: Landing Page & Public Experience

> **Goal:** Create a stunning, conversion-focused landing page with clear user journeys for Creators, Businesses, and Admins.

---

## 1. Scope

### Features
- Hero section with value proposition
- How it works section (for both user types)
- Features showcase
- Testimonials/social proof
- Pricing section (placeholder for future)
- FAQ section
- Footer with navigation
- Role-specific login/signup flows
- Mobile-responsive design

### Pages & Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/login` | Unified login with role tabs | Public |
| `/login/creator` | Direct creator login | Public |
| `/login/business` | Direct business login | Public |
| `/login/admin` | Admin login (separate) | Public |
| `/signup` | Unified signup with role selection | Public |
| `/signup/creator` | Direct creator signup | Public |
| `/signup/business` | Direct business signup | Public |
| `/about` | About the platform | Public |
| `/contact` | Contact form | Public |
| `/privacy` | Privacy policy | Public |
| `/terms` | Terms of service | Public |

### Components
- `HeroSection` – Main banner with CTA
- `HowItWorks` – Step-by-step flow
- `FeaturesGrid` – Feature cards
- `TestimonialsCarousel` – Social proof
- `PricingSection` – Plans comparison
- `FAQAccordion` – Frequently asked questions
- `Footer` – Links and social
- `Navbar` – Public navigation
- `RoleLoginTabs` – Creator/Business toggle
- `AuthCard` – Login/signup container

---

## 2. Continuity

### Builds On
- Nothing — this is the first phase.

### Prepares For
- **Phase 1:** Auth system connects to login/signup pages
- **Phase 2:** Onboarding flow after signup
- **Phase 6:** Public creator profiles link from landing

---

## 3. Technical Implementation

### 3.1 Landing Page Sections

#### Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│                        NAVBAR                                │
│  Logo    How It Works   Features   Pricing   Login  Sign Up  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     Where Creators & Brands                                  │
│     Build Winning Partnerships                               │
│                                                              │
│     Connect with top creators or discover brand              │
│     collaborations that match your niche.                    │
│                                                              │
│     [I'm a Creator]     [I'm a Business]                     │
│                                                              │
│                    ↓ Scroll to explore                       │
└─────────────────────────────────────────────────────────────┘
```

#### How It Works (Dual Flow)
```
FOR CREATORS                          FOR BUSINESSES
─────────────                         ────────────────
1. Create Profile                     1. Create Account
   Set up your niche,                    Tell us about your
   platforms & rates                     brand & goals

2. Get Discovered                     2. Discover Creators
   Brands find you based                 Browse, filter, and
   on your expertise                     find perfect matches

3. Collaborate                        3. Send Requests
   Accept offers, manage                 Reach out with your
   campaigns, get paid                   campaign details

4. Grow Together                      4. Track Results
   Build long-term brand                 Manage campaigns and
   partnerships                          measure success
```

#### Features Grid
| Feature | For Creators | For Businesses |
|---------|--------------|----------------|
| **Profile** | Showcase your work | Company presence |
| **Discovery** | Get found easily | Advanced search |
| **Requests** | One-click accept | Quick outreach |
| **Campaigns** | Track deliverables | Monitor progress |
| **Communication** | In-app messaging | Centralized notes |
| **Analytics** | View your stats | Campaign insights |

### 3.2 Folder Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── page.tsx            # Unified login
│   │   │   ├── creator/page.tsx    # Creator login
│   │   │   ├── business/page.tsx   # Business login
│   │   │   └── admin/page.tsx      # Admin login
│   │   └── signup/
│   │       ├── page.tsx            # Unified signup
│   │       ├── creator/page.tsx    # Creator signup
│   │       └── business/page.tsx   # Business signup
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FeaturesGrid.tsx
│   │   ├── TestimonialsCarousel.tsx
│   │   ├── PricingSection.tsx
│   │   ├── FAQAccordion.tsx
│   │   └── Footer.tsx
│   ├── auth/
│   │   ├── AuthCard.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── RoleLoginTabs.tsx
│   │   └── AdminLoginForm.tsx
```

### 3.3 Landing Page Component

**`app/page.tsx`**
```typescript
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { TestimonialsCarousel } from '@/components/landing/TestimonialsCarousel'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQAccordion } from '@/components/landing/FAQAccordion'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturesGrid />
        <TestimonialsCarousel />
        <PricingSection />
        <FAQAccordion />
      </main>
      <Footer />
    </div>
  )
}
```

### 3.4 Hero Section Component

**`components/landing/HeroSection.tsx`**
```typescript
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg to-secondary/10" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Where Creators & Brands Build Winning Partnerships
        </h1>
        
        <p className="text-xl md:text-2xl text-muted mb-12 max-w-2xl mx-auto">
          Connect with top creators or discover brand collaborations that match your niche.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup/creator"
            className="px-8 py-4 bg-primary hover:bg-primary-hover rounded-lg text-lg font-semibold transition-all hover:scale-105"
          >
            I'm a Creator
          </Link>
          <Link
            href="/signup/business"
            className="px-8 py-4 bg-surface hover:bg-surface-hover border border-border rounded-lg text-lg font-semibold transition-all hover:scale-105"
          >
            I'm a Business
          </Link>
        </div>
        
        <p className="mt-8 text-muted text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="text-muted">↓</span>
      </div>
    </section>
  )
}
```

### 3.5 Role-Based Login Tabs

**`components/auth/RoleLoginTabs.tsx`**
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'

type Role = 'creator' | 'business'

interface RoleLoginTabsProps {
  activeRole: Role
  onRoleChange: (role: Role) => void
}

export function RoleLoginTabs({ activeRole, onRoleChange }: RoleLoginTabsProps) {
  return (
    <div className="flex bg-surface rounded-lg p-1 mb-6">
      <button
        onClick={() => onRoleChange('creator')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeRole === 'creator'
            ? 'bg-primary text-white'
            : 'text-muted hover:text-text'
        }`}
      >
        Creator
      </button>
      <button
        onClick={() => onRoleChange('business')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeRole === 'business'
            ? 'bg-primary text-white'
            : 'text-muted hover:text-text'
        }`}
      >
        Business
      </button>
    </div>
  )
}
```

### 3.6 Unified Login Page

**`app/(auth)/login/page.tsx`**
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { RoleLoginTabs } from '@/components/auth/RoleLoginTabs'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const [role, setRole] = useState<'creator' | 'business'>('creator')
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to continue to your dashboard"
      >
        <RoleLoginTabs activeRole={role} onRoleChange={setRole} />
        <LoginForm role={role} />
        
        <div className="mt-6 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link href={`/signup/${role}`} className="text-primary hover:underline">
            Sign up as {role === 'creator' ? 'Creator' : 'Business'}
          </Link>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border text-center">
          <Link href="/login/admin" className="text-xs text-muted hover:text-text">
            Admin Login →
          </Link>
        </div>
      </AuthCard>
    </div>
  )
}
```

### 3.7 Admin Login (Separate Flow)

**`app/(auth)/login/admin/page.tsx`**
```typescript
import { AuthCard } from '@/components/auth/AuthCard'
import { AdminLoginForm } from '@/components/auth/AdminLoginForm'
import Link from 'next/link'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <AuthCard
        title="Admin Access"
        subtitle="Restricted area for platform administrators"
      >
        <AdminLoginForm />
        
        <div className="mt-6 text-center text-sm text-muted">
          <Link href="/login" className="text-primary hover:underline">
            ← Back to user login
          </Link>
        </div>
      </AuthCard>
    </div>
  )
}
```

### 3.8 Public Navbar

**`components/landing/Navbar.tsx`**
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' }
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          Collab League
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted hover:text-text transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-muted hover:text-text transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-text"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-border py-4 px-6 space-y-4">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="block text-muted">
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-border space-y-2">
            <Link href="/login" className="block text-center py-2 text-muted">
              Log in
            </Link>
            <Link href="/signup" className="block text-center py-2 bg-primary rounded-lg">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
```

### 3.9 Footer Component

**`components/landing/Footer.tsx`**
```typescript
import Link from 'next/link'

const FOOTER_LINKS = {
  Platform: [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' }
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' }
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' }
  ],
  Connect: [
    { href: '#', label: 'Twitter' },
    { href: '#', label: 'LinkedIn' },
    { href: '#', label: 'Instagram' }
  ]
}

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo & tagline */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-xl font-bold text-primary">
            Collab League
          </Link>
          <p className="mt-2 text-sm text-muted">
            Connecting creators and brands for powerful collaborations.
          </p>
        </div>
        
        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-semibold mb-4">{title}</h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-text">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-muted">
        © {new Date().getFullYear()} Collab League. All rights reserved.
      </div>
    </footer>
  )
}
```

---

## 4. Naming Convention

| Original | Renamed | Reason |
|----------|---------|--------|
| Influencer Login | **Creator Login** | More inclusive, modern terminology |
| Brand Login | **Business Login** | Easier to pronounce, broader scope |
| Admin Login | **Admin Login** | Clear and distinct |

---

## 5. Acceptance Criteria

- [ ] Landing page loads with all sections visible
- [ ] Hero section has two CTAs: Creator and Business
- [ ] "How It Works" shows dual flows
- [ ] Features grid displays all key features
- [ ] Navbar is fixed and scrolls smoothly to sections
- [ ] Mobile menu works correctly
- [ ] `/login` shows unified login with role tabs
- [ ] `/login/creator` goes directly to creator login
- [ ] `/login/business` goes directly to business login
- [ ] `/login/admin` shows admin-specific login
- [ ] `/signup` shows unified signup with role selection
- [ ] Footer has all navigation links
- [ ] All pages are mobile responsive

---

## 6. Deliverables

| Type | Items |
|------|-------|
| Pages | Landing, Login (unified + role-specific), Signup, About, Contact, Privacy, Terms |
| Components | Navbar, Hero, HowItWorks, Features, Testimonials, Pricing, FAQ, Footer |
| Auth | RoleLoginTabs, AuthCard, LoginForm, SignupForm, AdminLoginForm |
| Layouts | Public layout (for landing), Auth layout (for login/signup) |
