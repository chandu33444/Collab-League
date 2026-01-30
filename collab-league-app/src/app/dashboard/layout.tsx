import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { LogoutButton } from '@/components/dashboard/LogoutButton';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Get user's role
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userRole: 'business' | 'creator' | null = null;

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        userRole = profile?.role === 'business' ? 'business' :
            profile?.role === 'creator' ? 'creator' : null;
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] hidden md:block">
                <div className="p-6">
                    <div className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                        Collab League
                    </div>
                </div>
                <nav className="px-4 py-2 space-y-2">
                    <Link href="/dashboard" className="block px-2 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-primary)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Dashboard
                    </Link>

                    {/* Business-only Navigation */}
                    {userRole === 'business' && (
                        <>
                            <Link href="/dashboard/creators" className="block px-2 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-primary)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                                Discover Creators
                            </Link>
                            <Link href="/dashboard/sent-requests" className="block px-2 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-primary)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                                Sent Requests
                            </Link>
                        </>
                    )}

                    {/* Creator-only Navigation */}
                    {userRole === 'creator' && (
                        <Link href="/dashboard/requests" className="block px-2 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-primary)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                            Requests
                        </Link>
                    )}

                    {/* Common Navigation */}
                    <Link href="/dashboard/campaigns" className="block px-2 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-primary)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Campaigns
                    </Link>

                    <Link href="/dashboard/profile" className="block px-2 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-primary)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Profile
                    </Link>
                    <Link href="/dashboard/settings" className="block px-2 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-primary)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="md:ml-64">
                {/* Header */}
                <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {userRole && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)]/20 text-[var(--color-primary)] capitalize">
                                {userRole}
                            </span>
                        )}
                        <LogoutButton />
                    </div>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
