# Product Requirements Document (PRD)

**Project:** Influencer & Brand Collaboration Platform

---

## 1. Product Overview

### 1.1 Product Vision

To build a simple, scalable platform where brands can discover influencers, initiate collaborations, and manage campaigns, while influencers can review, accept, and track collaboration opportunities transparently.

### 1.2 Problem Statement

- Brands struggle to find relevant influencers and track collaborations.
- Influencers lack a centralized place to manage brand requests.
- Existing platforms are either expensive, complex, or lack transparency.

### 1.3 Solution

A lightweight web platform that:
- Connects brands and influencers
- Manages collaboration workflows
- Tracks campaign lifecycle end-to-end

---

## 2. Target Users

### 2.1 Influencers

- Micro, macro, and niche influencers
- Platforms: Instagram, YouTube, X (Twitter), LinkedIn, etc.

### 2.2 Brands

- Startups, SMEs, agencies
- Marketing teams looking for influencer partnerships

---

## 3. User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Influencer** | Create profile, view requests, accept/reject campaigns |
| **Brand** | Browse influencers, send requests, manage campaigns |
| **Admin** *(Future)* | Moderate profiles, manage disputes |

---

## 4. Core Functional Requirements

### 4.1 Authentication & Authorization

#### Functional Requirements
- Email-based authentication using Supabase Auth
- Role-based onboarding (Brand / Influencer)

#### User Stories
- As a user, I can sign up as a Brand or Influencer
- As a user, I can securely log in and log out

#### Acceptance Criteria
- User role is immutable post-signup
- Session persists across refresh
- Unauthorized access is blocked

---

## 5. Influencer Module

### 5.1 Influencer Profile

#### Fields
| Field | Description |
|-------|-------------|
| Full Name | Display name of the influencer |
| Primary Platform | Instagram, YouTube, etc. |
| Niche | Fashion, Tech, Travel, etc. |
| Followers Count | Number of followers |
| Bio | Short description |
| Contact Email | Hidden from public |
| Profile Status | Active / Inactive |

#### User Stories
- As an influencer, I can create and update my profile
- As an influencer, I can control profile visibility

### 5.2 Collaboration Requests

#### Features
- View incoming collaboration requests
- Accept or Reject requests
- Add optional notes when responding

#### Acceptance Criteria
- Influencer can only act on their own requests
- Status updates reflect in brand dashboard

---

## 6. Brand Module

### 6.1 Brand Profile & Dashboard

#### Fields
| Field | Description |
|-------|-------------|
| Brand Name | Company/brand name |
| Industry | Business category |
| Description | About the brand |
| Website | Optional URL |

#### Dashboard Components
- Sent Requests
- Active Campaigns
- Completed Campaigns

### 6.2 Influencer Discovery

#### Features
- Browse influencer list
- View detailed influencer profiles
- Send collaboration request

#### Request Fields
| Field | Required |
|-------|----------|
| Campaign Name | Yes |
| Campaign Description | Yes |
| Expected Deliverables | Yes |
| Budget | No *(Future)* |
| Start & End Dates | Yes |

---

## 7. Campaign Management

### 7.1 Campaign Lifecycle

#### Statuses
```
Requested → Accepted → In Progress → Completed
```

#### Campaign Data Model
| Field | Description |
|-------|-------------|
| Campaign ID | Unique identifier |
| Brand ID | Reference to brand |
| Influencer ID | Reference to influencer |
| Status | Current state |
| Created At | Timestamp |
| Updated At | Timestamp |

### 7.2 Notes & Communication

- Internal notes per campaign
- Visible to both brand and influencer
- Timestamped messages

---

## 8. Dashboard Requirements

### Influencer Dashboard
- Pending Requests
- Active Campaigns
- Completed Campaigns

### Brand Dashboard
- Requests Sent
- Accepted Campaigns
- Campaign Progress Overview

---

## 9. Optional / Phase-2 Features

### Search & Filters
- Search influencers by niche
- Filter by follower count range
- Filter by platform

### Public Influencer Profiles
- SEO-friendly public profile pages
- Shareable influencer URLs

---

## 10. Non-Functional Requirements

### Performance
- Page load < 2 seconds
- Optimized queries using Supabase indexes

### Security
- Supabase Row Level Security (RLS)
- Role-based access
- No exposure of private emails publicly

### Scalability
- PostgreSQL relational schema
- Modular frontend components

---

## 11. Tech Stack (Mandatory)

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js (preferred for SSR & SEO) OR React.js |
| **Backend & Database** | Supabase (Auth, PostgreSQL, Storage) |
| **Version Control** | GitHub (Public Repository) |
| **Deployment** | Frontend: Vercel, Backend & DB: Supabase |

---

## 12. Database Design (High-Level)

### Tables

| Table | Description |
|-------|-------------|
| `users` | Managed by Supabase Auth |
| `profiles` | User profile data |
| `brands` | Brand-specific information |
| `influencers` | Influencer-specific information |
| `campaigns` | Campaign records |
| `campaign_notes` | Notes/messages per campaign |