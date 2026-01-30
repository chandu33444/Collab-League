# UI/UX Design Guidelines

> **Unified design system for Collab League** — Apply these guidelines consistently across all phases.

---

## 🎯 Design Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Clarity First** | Every element has a purpose. Remove unnecessary clutter. |
| **Trust-Forward** | Professional aesthetics that instill confidence in businesses |
| **Creator-Friendly** | Warm, approachable feel that empowers creators |
| **Action-Oriented** | Clear CTAs guide users toward their goals |
| **Responsive Always** | Seamless experience across all devices |

### Brand Personality

```
Professional ←——●——→ Playful
                ↑
         (Slightly right of center)
         
Modern, trustworthy, yet approachable
```

---

## 🎨 Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#6366f1` | Primary actions, links, focus states |
| `--color-primary-hover` | `#4f46e5` | Hover state for primary |
| `--color-primary-light` | `#818cf8` | Highlights, tags, badges |
| `--color-secondary` | `#ec4899` | Accents, creator-focused elements |
| `--color-secondary-hover` | `#db2777` | Hover state for secondary |

### Neutral Palette (Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#0f0f13` | Page background |
| `--color-surface` | `#1a1a23` | Cards, modals, panels |
| `--color-surface-hover` | `#252532` | Hover state for surfaces |
| `--color-surface-active` | `#2f2f3d` | Active/pressed state |
| `--color-border` | `#2e2e3a` | Borders, dividers |
| `--color-border-light` | `#3d3d4d` | Subtle borders |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text` | `#f4f4f5` | Primary text |
| `--color-text-muted` | `#a1a1aa` | Secondary text, labels |
| `--color-text-faint` | `#71717a` | Disabled, placeholder |

### Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#22c55e` | Success states, accepted |
| `--color-success-bg` | `rgba(34, 197, 94, 0.15)` | Success backgrounds |
| `--color-warning` | `#eab308` | Warnings, pending |
| `--color-warning-bg` | `rgba(234, 179, 8, 0.15)` | Warning backgrounds |
| `--color-error` | `#ef4444` | Errors, rejected |
| `--color-error-bg` | `rgba(239, 68, 68, 0.15)` | Error backgrounds |
| `--color-info` | `#3b82f6` | Informational |
| `--color-info-bg` | `rgba(59, 130, 246, 0.15)` | Info backgrounds |

### Gradients

```css
/* Hero gradient */
--gradient-hero: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, transparent 50%, rgba(236, 72, 153, 0.1) 100%);

/* Card highlight */
--gradient-card: linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);

/* Text gradient (for headings) */
--gradient-text: linear-gradient(90deg, #6366f1, #ec4899);
```

---

## 📐 Spacing System

Use consistent spacing multiples of 4px:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.25rem` (4px) | Tight spacing, inline elements |
| `--space-sm` | `0.5rem` (8px) | Small gaps, button padding |
| `--space-md` | `1rem` (16px) | Default spacing, card padding |
| `--space-lg` | `1.5rem` (24px) | Section spacing |
| `--space-xl` | `2rem` (32px) | Large gaps |
| `--space-2xl` | `3rem` (48px) | Section margins |
| `--space-3xl` | `4rem` (64px) | Page sections |

### Layout Spacing

```css
/* Page container */
max-width: 1280px;
padding-inline: 1.5rem; /* Mobile: 1rem */

/* Section spacing */
padding-block: 4rem; /* Mobile: 2rem */

/* Card padding */
padding: 1.5rem; /* Mobile: 1rem */
```

---

## 🔤 Typography

### Font Stack

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-xs` | 0.75rem | 400 | 1.5 | Labels, captions |
| `--text-sm` | 0.875rem | 400 | 1.5 | Secondary text |
| `--text-base` | 1rem | 400 | 1.6 | Body text |
| `--text-lg` | 1.125rem | 500 | 1.5 | Subheadings |
| `--text-xl` | 1.25rem | 600 | 1.4 | Card titles |
| `--text-2xl` | 1.5rem | 600 | 1.3 | Section headings |
| `--text-3xl` | 2rem | 700 | 1.2 | Page titles |
| `--text-4xl` | 2.5rem | 700 | 1.1 | Hero headings |
| `--text-5xl` | 3.5rem | 800 | 1 | Landing hero |

### Text Styling

```css
/* Gradient text for headings */
.gradient-text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Truncate long text */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 🔲 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.375rem` (6px) | Small elements, tags |
| `--radius-md` | `0.5rem` (8px) | Buttons, inputs |
| `--radius-lg` | `0.75rem` (12px) | Cards, modals |
| `--radius-xl` | `1rem` (16px) | Large cards |
| `--radius-2xl` | `1.5rem` (24px) | Hero sections |
| `--radius-full` | `9999px` | Avatars, pills |

---

## 🌑 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.3)` | Cards |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.3)` | Dropdowns, modals |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.3)` | Floating elements |
| `--shadow-glow` | `0 0 20px rgba(99,102,241,0.3)` | Focus glow |

---

## 🔘 Component Patterns

### Buttons

```
┌─────────────────────────────────────────────────────────┐
│  PRIMARY          SECONDARY        GHOST        DANGER  │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐   ┌──────┐ │
│  │ Action  │     │ Action  │     │ Action  │   │ Del  │ │
│  └─────────┘     └─────────┘     └─────────┘   └──────┘ │
│  bg-primary      bg-surface      transparent  bg-error  │
│  text-white      border-border   text-muted   text-wht  │
└─────────────────────────────────────────────────────────┘
```

**Button Sizes:**
| Size | Padding | Font Size | Height |
|------|---------|-----------|--------|
| `sm` | `0.5rem 1rem` | 0.875rem | 32px |
| `md` | `0.75rem 1.5rem` | 1rem | 40px |
| `lg` | `1rem 2rem` | 1.125rem | 48px |

**Button States:**
```css
/* Hover: scale + brightness */
transform: translateY(-1px);
filter: brightness(1.1);

/* Active: pressed effect */
transform: translateY(0);
filter: brightness(0.95);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

### Cards

```
┌────────────────────────────────────────┐
│  bg-surface                            │
│  border: 1px solid var(--color-border) │
│  border-radius: var(--radius-lg)       │
│  padding: var(--space-lg)              │
│                                        │
│  Hover:                                │
│  - border-color: var(--color-primary)  │
│  - transform: translateY(-2px)         │
│  - box-shadow: var(--shadow-md)        │
└────────────────────────────────────────┘
```

### Inputs

```
┌────────────────────────────────────────┐
│  bg: var(--color-surface)              │
│  border: 1px solid var(--color-border) │
│  border-radius: var(--radius-md)       │
│  padding: 0.75rem 1rem                 │
│  height: 44px (touch-friendly)         │
│                                        │
│  Focus:                                │
│  - border-color: var(--color-primary)  │
│  - box-shadow: var(--shadow-glow)      │
│                                        │
│  Error:                                │
│  - border-color: var(--color-error)    │
└────────────────────────────────────────┘
```

### Badges & Status

```css
/* Status Badge */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

/* Colors per status */
.badge-pending  { background: var(--color-warning-bg); color: var(--color-warning); }
.badge-accepted { background: var(--color-success-bg); color: var(--color-success); }
.badge-rejected { background: var(--color-error-bg);   color: var(--color-error);   }
.badge-active   { background: var(--color-info-bg);    color: var(--color-info);    }
```

---

## ✨ Animation Guidelines

### Timing

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--transition-fast` | 150ms | ease-out | Hover states |
| `--transition-base` | 200ms | ease-in-out | General transitions |
| `--transition-slow` | 300ms | ease-in-out | Page transitions |
| `--transition-spring` | 400ms | cubic-bezier(0.34, 1.56, 0.64, 1) | Bouncy effects |

### Micro-Animations

```css
/* Subtle hover lift */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform var(--transition-fast);
}

/* Scale on hover */
.hover-scale:hover {
  transform: scale(1.02);
  transition: transform var(--transition-fast);
}

/* Fade in on load */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide in from right (for toasts) */
@keyframes slide-in {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

/* Pulse (for loading) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Animation Rules

> ⚠️ **Performance First**
> - Only animate `transform` and `opacity`
> - Use `will-change` sparingly
> - Disable animations if `prefers-reduced-motion` is set

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Breakpoints

| Token | Width | Target |
|-------|-------|--------|
| `--bp-sm` | 640px | Mobile landscape |
| `--bp-md` | 768px | Tablets |
| `--bp-lg` | 1024px | Small laptops |
| `--bp-xl` | 1280px | Desktops |
| `--bp-2xl` | 1536px | Large screens |

### Mobile-First Approach

```css
/* Base: Mobile */
.container { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: 1.5rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { padding: 2rem; }
}
```

---

## ♿ Accessibility

### Focus States

```css
/* Visible focus for keyboard users */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast

- **Text on background:** Minimum 4.5:1 ratio
- **Large text (18px+):** Minimum 3:1 ratio
- **Interactive elements:** Minimum 3:1 ratio

### Interactive Elements

- Minimum touch target: **44x44px**
- Clear hover/focus states
- Descriptive ARIA labels
- Keyboard navigable

---

## 🧩 Layout Patterns

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (fixed, h-16)                                   │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   SIDEBAR    │         MAIN CONTENT                     │
│   (w-64)     │         (flex-1, overflow-auto)          │
│              │                                          │
│   - Nav      │    ┌────────────────────────────────┐   │
│   - Links    │    │  Page Header                   │   │
│              │    ├────────────────────────────────┤   │
│              │    │                                │   │
│              │    │  Content Area                  │   │
│              │    │                                │   │
│              │    └────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────┘
```

### Card Grid

```css
/* Responsive grid */
.card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
```

### Stats Row

```css
/* 4-column stats on desktop, 2 on tablet, 1 on mobile */
.stats-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
}
```

---

## 📋 Checklist Per Phase

Use this checklist when building any phase:

- [ ] Colors use design tokens (no hardcoded hex)
- [ ] Spacing follows the spacing scale
- [ ] Typography uses the type scale
- [ ] Buttons have hover/focus/active states
- [ ] Cards have consistent padding and borders
- [ ] Inputs are 44px tall (touch-friendly)
- [ ] Focus states are visible
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Mobile-first responsive design
- [ ] Loading states for async operations
- [ ] Error states with clear messaging

---

## 🔗 Quick Reference

### CSS Variables Import

```css
/* globals.css - paste at top */
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-secondary: #ec4899;
  --color-bg: #0f0f13;
  --color-surface: #1a1a23;
  --color-surface-hover: #252532;
  --color-border: #2e2e3a;
  --color-text: #f4f4f5;
  --color-text-muted: #a1a1aa;
  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-error: #ef4444;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.3);
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-in-out;
}
```

---

> **Remember:** Consistency > Creativity. When in doubt, follow the system.
