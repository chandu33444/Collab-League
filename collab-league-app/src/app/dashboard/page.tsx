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
    } else {
        return <div>Unknown role</div>;
    }
}
