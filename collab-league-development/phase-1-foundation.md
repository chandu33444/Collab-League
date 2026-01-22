# Phase 1: Foundation

> **Goal:** Establish the core infrastructure — Next.js project, Supabase integration, authentication, and base UI framework.

---

## 1. Scope

### Features
- Next.js App Router project initialization
- Supabase SDK configuration
- Email-based authentication (signup, login, logout)
- Role selection during signup (Creator / Business)
- Admin role support
- Protected route middleware
- Dashboard layout with navigation shell
- Design system tokens & global styles

### Pages & Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard` | Protected dashboard shell | Authenticated |
| `/admin` | Admin dashboard | Admin only |

> **Note:** Landing page, login, and signup pages are implemented in **Phase 0**.

### Components
- `DashboardNavbar` – Top navigation with auth state
- `Sidebar` – Dashboard navigation
- `Button`, `Input`, `Card` – Base UI primitives

> **Note:** Auth components (`AuthForm`, `RoleLoginTabs`) are defined in **Phase 0**.

---

## 2. Continuity

### Builds On
- **Phase 0:** Landing page, login/signup flows, public navbar, footer
- **Phase 0:** Auth components (`AuthCard`, `LoginForm`, `RoleLoginTabs`)

### Prepares For
- **Phase 2:** User profiles require authenticated users with assigned roles.
- **Phase 3+:** All features depend on auth context and dashboard layout.

---

## 3. Technical Implementation

### 3.1 Project Setup

```bash
npx create-next-app@latest collab-league --typescript --tailwind --eslint --app --src-dir
cd collab-league
npm install @supabase/supabase-js @supabase/ssr
```

### 3.2 Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── dashboard/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── auth/
│   │   ├── AuthForm.tsx
│   │   └── RoleSelector.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── lib/
│   └── supabase/
│       ├── client.ts      # Browser client
│       ├── server.ts      # Server client
│       └── middleware.ts  # Auth middleware helper
├── hooks/
│   └── useUser.ts
└── types/
    └── database.types.ts
```

### 3.3 Supabase Configuration

**Environment Variables (`.env.local`)**
```env
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

**Browser Client (`lib/supabase/client.ts`)**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

**Server Client (`lib/supabase/server.ts`)**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => 
          cookieStore.set(name, value, options))
      }
    }
  )
}
```

### 3.4 Middleware (Route Protection)

**`middleware.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      }
    }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Redirect unauthenticated users from protected routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
}
```

### 3.5 Database Schema

**`users` table (extends Supabase auth.users)**
```sql
-- Profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('creator', 'business', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 3.6 Server Actions

**`app/actions/auth.ts`**
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'creator' | 'business'
  
  const { data, error } = await supabase.auth.signUp({ email, password })
  
  if (error) return { error: error.message }
  
  // Create profile with role
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      role
    })
  }
  
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string
  })
  
  if (error) return { error: error.message }
  
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### 3.7 Design System Tokens

**`globals.css`**
```css
:root {
  /* Colors - Brand */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-secondary: #ec4899;
  
  /* Colors - Neutral */
  --color-bg: #0f0f13;
  --color-surface: #1a1a23;
  --color-surface-hover: #252532;
  --color-border: #2e2e3a;
  --color-text: #f4f4f5;
  --color-text-muted: #a1a1aa;
  
  /* Colors - Status */
  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-error: #ef4444;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
}
```

---

## 4. Acceptance Criteria

- [ ] User can sign up with email, password, and role selection
- [ ] User can log in and log out
- [ ] Session persists across page refresh
- [ ] Unauthenticated users are redirected from `/dashboard`
- [ ] Authenticated users are redirected from `/login` and `/signup`
- [ ] Role is stored in `profiles` table
- [ ] Base layout renders with Navbar
- [ ] Design tokens are applied globally

---

## 5. Deliverables

| Type | Items |
|------|-------|
| Pages | Landing, Login, Signup, Dashboard shell |
| Components | AuthForm, RoleSelector, Navbar, Button, Input, Card |
| Database | `profiles` table with RLS |
| Server Actions | signUp, signIn, signOut |
| Config | Supabase clients, middleware, env setup |
