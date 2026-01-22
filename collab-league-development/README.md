# Collab League - Development Blueprint

> A 7-phase development guide for building a modern Creator & Business Collaboration Platform.

---

## 🎯 Project Overview

**Collab League** is a platform where businesses discover creators, initiate collaborations, and manage campaigns, while creators review, accept, and track collaboration opportunities transparently.

### Core Value Propositions
- **For Businesses:** Find relevant creators, manage campaigns, track progress
- **For Creators:** Centralized request management, professional collaboration workflow

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14+ (App Router) |
| **Styling** | Tailwind CSS with custom design tokens |
| **Backend** | Next.js Server Actions & API Routes |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth (Email-based) |
| **Security** | Row Level Security (RLS) |
| **Deployment** | Vercel (Frontend) + Supabase (Backend) |
| **Version Control** | GitHub (Public Repository) |

---

## 📦 Phase Summary

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
   ↓         ↓         ↓         ↓         ↓         ↓         ↓
Landing    Auth    Profiles  Requests  Campaigns  Discovery  Polish
```

### Phase Breakdown

| Phase | Name | Focus | Key Deliverables |
|-------|------|-------|------------------|
| **0** | [Landing Page](./phase-0-landing-page.md) | First Impression | Landing page, login/signup flows, public navigation |
| **1** | [Foundation](./phase-1-foundation.md) | Infrastructure | Next.js project, Supabase config, auth middleware |
| **2** | [User Profiles](./phase-2-user-profiles.md) | Identity | Role-based onboarding, creator & business profiles |
| **3** | [Collaboration Requests](./phase-3-collaboration-requests.md) | Connection | Request workflow, accept/reject |
| **4** | [Campaign Management](./phase-4-campaign-management.md) | Execution | Campaign lifecycle, notes, status tracking |
| **5** | [Discovery & Dashboards](./phase-5-discovery-dashboards.md) | Insight | Search/filters, analytics dashboards |
| **6** | [Polish & Scale](./phase-6-polish-scale.md) | Production | Public profiles, SEO, performance, future hooks |

---

## 🔗 Phase Dependencies

### Phase 0 → Phase 1
- **Extends:** Nothing — Phase 0 is the starting point
- **Required for:** Login/signup pages connect to auth middleware
- **Why order matters:** Public pages and auth UI must exist before backend auth logic

### Phase 1 → Phase 2
- **Extends:** Authentication context, user session, Phase 0 auth flows
- **Required for:** Role assignment, profile creation
- **Why order matters:** Profiles need authenticated users with assigned roles

### Phase 2 → Phase 3
- **Extends:** Creator profiles (browsable), Business profiles (request sender)
- **Required for:** Businesses to discover and select creators
- **Why order matters:** Requests reference both party profiles

### Phase 3 → Phase 4
- **Extends:** Accepted requests trigger campaign creation
- **Required for:** Campaign entity and lifecycle management
- **Why order matters:** Campaigns are born from accepted requests

### Phase 4 → Phase 5
- **Extends:** Request/campaign data for analytics
- **Required for:** Dashboard stats, activity feeds
- **Why order matters:** Dashboards aggregate data from previous phases

### Phase 5 → Phase 6
- **Extends:** Discovery infrastructure, profile data
- **Required for:** Public-facing pages, SEO optimization
- **Why order matters:** Public profiles leverage private discovery logic

---

## 🎨 Design System

All phases follow a consistent design language:

### Visual Style
- **Theme:** Modern SaaS + Creator Economy hybrid
- **Mode:** Dark-first with premium aesthetics
- **Approach:** Trust-first for brands, friendly for creators

### Design Tokens
```css
/* Colors */
--color-primary: #6366f1;     /* Indigo */
--color-secondary: #ec4899;   /* Pink */
--color-bg: #0f0f13;
--color-surface: #1a1a23;

/* Spacing */
--space-md: 1rem;
--space-lg: 1.5rem;

/* Radius */
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
```

### Component Patterns
- Rounded cards with subtle borders
- Clear primary/secondary CTAs
- Hover & active states on all interactive elements
- Subtle micro-animations (no heavy motion)

---

## 📂 Project Structure

```
collab-league/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login, Signup
│   │   ├── (dashboard)/      # Protected routes
│   │   ├── creator/          # Public profiles
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/               # Primitives
│   │   ├── auth/             # Auth forms
│   │   ├── profile/          # Profile forms
│   │   ├── requests/         # Request components
│   │   ├── campaigns/        # Campaign components
│   │   ├── dashboard/        # Dashboard widgets
│   │   └── public/           # Public-facing
│   ├── lib/
│   │   ├── supabase/         # DB clients
│   │   ├── constants/        # Enums, options
│   │   └── hooks/            # Custom hooks
│   └── types/
└── supabase/
    └── migrations/           # SQL migrations
```

---

## 🔐 Security Model

Row Level Security (RLS) is enforced across all tables:

| Table | Read Policy | Write Policy |
|-------|-------------|--------------|
| `profiles` | Own profile only | Own profile only |
| `creators` | Own + public profiles | Own profile only |
| `businesses` | Own + visible to creators | Own profile only |
| `collaboration_requests` | Participants only | Role-restricted |
| `campaigns` | Participants only | Participants only |
| `campaign_notes` | Campaign participants | Own notes only |

---

## 🚀 Deployment Flow

1. **Development:** `npm run dev` with local Supabase
2. **Staging:** Deploy to Vercel preview + Supabase staging project
3. **Production:** 
   - Push to `main` → Vercel auto-deploy
   - Apply migrations to Supabase production

---

## ✅ Why This Phased Approach

### Scalability
- Each phase is independently deployable
- Features can be tested in isolation
- Easy to onboard additional developers

### Maintainability
- Clear separation of concerns
- Incremental database schema evolution
- Consistent patterns across phases

### Risk Mitigation
- Core functionality validated before advanced features
- No premature optimization
- Solid foundation for future enhancements

### Future-Ready
- Payment hooks prepared in Phase 6
- Email notification placeholders
- Analytics foundation in dashboards
- Mobile app-ready API structure

---

## 📋 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/your-org/collab-league.git
cd collab-league

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Add your Supabase credentials

# 4. Run development server
npm run dev

# 5. Apply database migrations
npx supabase db push
```

---

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| [Phase 0: Landing Page](./phase-0-landing-page.md) | Landing, login/signup flows |
| [Phase 1: Foundation](./phase-1-foundation.md) | Auth middleware, design system |
| [Phase 2: User Profiles](./phase-2-user-profiles.md) | Onboarding, profiles |
| [Phase 3: Collaboration Requests](./phase-3-collaboration-requests.md) | Request workflow |
| [Phase 4: Campaign Management](./phase-4-campaign-management.md) | Campaign lifecycle |
| [Phase 5: Discovery & Dashboards](./phase-5-discovery-dashboards.md) | Search, analytics |
| [Phase 6: Polish & Scale](./phase-6-polish-scale.md) | SEO, performance |

---

> **Built with Clarity. Structured for Scale.**
