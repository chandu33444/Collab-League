# Phase 7: Admin System

> **Goal:** Establish a secure and powerful administration layer to manage users, monitor platform health, and control access permissions.

---

## 1. Scope

### Features
- **Admin Role Implementation**: Secure role separation in database and auth.
- **Admin Dashboard**: High-level metrics (Total Users, Campaigns, etc.).
- **User Management**: List view of all Creators and Businesses.
- **Access Control**: Ability to Ban/Activate users.
- **Route Protection**: Middleware and Layouts to secure Admin pages.

### Pages & Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard/admin` | Admin Overview & Stats | Admin Only |
| `/dashboard/admin/users` | User List & Management | Admin Only |
| `/dashboard/admin/campaigns` | All Campaigns (Future) | Admin Only |

### Components
- `AdminSidebar` – Dedicated navigation for admins.
- `AdminLayout` – Wrapper for admin routes.
- `StatsCard` – Reused for platform-wide metrics.
- `UserManagementTable` – Interactive table for user control.

---

## 2. Continuity

### Builds On
- **Phase 2:** User Profiles (`profiles` table, Roles).
- **Phase 5:** Dashboard components (`StatsCard`).
- **All Phases:** Middleware and Auth flow.

### Prepares For
- Content Moderation (Campaign/Profile approval).
- Dispute Resolution.
- Platform-wide Analytics & Financial Reporting.

---

## 3. Technical Implementation

### 3.1 Database Updates

**Update Roles & Constraints**
```sql
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('creator', 'business', 'admin'));
```

**Admin RLS Policies**
Admins are granted broad access via Row Level Security:
```sql
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
```
*Note: Policies replicated for `creators` and `businesses` tables.*

### 3.2 Type Safety

**Types (`src/types/profile.ts`)**
```typescript
export interface AdminProfile extends BaseProfile {
    role: 'admin';
    full_name?: string;
}

export type UserProfile = CreatorProfile | BusinessProfile | AdminProfile;
```

### 3.3 Middleware Security

**`src/middleware.ts`**
- **Admin Access**: Explicitly allows `role = 'admin'` to access `/dashboard/admin`.
- **Redirects**: 
  - Admins attempting to visit regular `/dashboard` are redirected to `/dashboard/admin`.
  - Non-admins attempting to visit `/dashboard/admin/*` are kicked back to their respective dashboards.

### 3.4 Admin UI

**Sidebar (`AdminSidebar`)**
- Distinct menu options ("User Management", "All Campaigns").
- Simplified layout compared to main app.

**User Management Page**
- Server Action based "Ban/Activate" toggle.
- Fetches joined data from `profiles`, `creators`, and `businesses`.

---

## 4. Acceptance Criteria

- [ ] **Data Integrity**: 'admin' is a valid role in the database.
- [ ] **Security**: 
    - [ ] Admins CAN read/update all user data.
    - [ ] Regular users CANNOT access Admin Dashboard.
- [ ] **Functionality**:
    - [ ] Admin can see platform stats (counts of users/recents).
    - [ ] Admin can ban a user (flipping `is_active` to false).
    - [ ] Banned users are reflected in the UI instantly.
- [ ] **UX**: Admin interface is consistent with the rest of the app but distinct enough to indicate privileged access.

---

## 5. Deliverables

| Type | Items |
|------|-------|
| Pages | Admin Overview, User Management |
| Components | AdminSidebar, AdminLayout |
| Database | Migration `007_admin_system.sql`, Helper `promote_admin.sql` |
| Config | Middleware updates, Type definitions |

---

## 6. Deployment Notes

### Promoting an Admin
Since there is no public sign-up for Admins, the first admin must be promoted via SQL:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'target_email@example.com');
```

---

## 7. Future Enhancements (Phase 8+)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Campaign Moderation** | Approve/Reject campaigns before they go live | High |
| **Dispute Center** | Admin interface to resolve conflicts between brands and creators | Medium |
| **Audit Logs** | Track admin actions (who banned whom) | Medium |
| **System Settings** | Toggle platform features (Maintenance mode, new signups) | Low |
