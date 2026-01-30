import { createClient } from '@/utils/supabase/server';
import { BrandDashboard, CreatorDashboard } from '@/components/dashboard';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in</div>;
    }

    // Get user's role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role;

    if (role === 'business') {
        return <BrandDashboard />;
    } else if (role === 'creator') {
        return <CreatorDashboard />;
    } else if (role === 'admin') {
        // We need to redirect to the admin dashboard or render it here? 
        // Admin dashboard is at /dashboard/admin. 
        // But dashboard/page.tsx is the root dashboard. 
        // Middleware handles redirect, but if we render here, we should render something valid.
        // Let's redirect properly or show a basic link.
        // Actually, middleware should have redirected admins to /dashboard/admin.
        // If we are here, maybe middleware failed or this is a flicker.
        // Let's return the AdminDashboardPage component (imported dynamically or effectively).
        // For now, let's just redirect server-side if not handled by middleware.
        // Better yet, just return the Admin Dashboard content.
        // NOTE: AdminDashboard is a separate page component.
        // Let's just create a simple redirect here to be safe.
        // Actually, importing AdminDashboardPage might be circular or complex if it's a page.
        // Let's use the explicit redirect component.

        return (
            <div className="p-8">
                <h1 className="text-xl">Admin Account Detected</h1>
                <p className="mb-4">Redirecting to Admin Panel...</p>
                <meta httpEquiv="refresh" content="0;url=/dashboard/admin" />
            </div>
        )
    } else {
        return <div>Unknown role: {role}</div>;
    }
}
