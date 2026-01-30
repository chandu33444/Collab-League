import { createClient } from '@/utils/supabase/server';
import { getIncomingRequests, getSentRequests } from '@/app/actions/requests';
import Link from 'next/link';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in</div>;
    }

    // Get user's role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, username')
        .eq('id', user.id)
        .single();

    const isCreator = profile?.role === 'creator';
    const isBusiness = profile?.role === 'business';

    // Get requests based on role
    let pendingCount = 0;
    let totalRequests = 0;
    let acceptedCount = 0;

    if (isCreator) {
        const requests = await getIncomingRequests();
        totalRequests = requests.length;
        pendingCount = requests.filter(r => r.status === 'pending').length;
        acceptedCount = requests.filter(r => r.status === 'accepted').length;
    } else if (isBusiness) {
        const requests = await getSentRequests();
        totalRequests = requests.length;
        pendingCount = requests.filter(r => r.status === 'pending').length;
        acceptedCount = requests.filter(r => r.status === 'accepted').length;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back{profile?.username ? `, ${profile.username}` : ''}!</h2>
                <p className="text-[var(--color-text-muted)]">
                    {isCreator ? 'Manage your collaboration requests and partnerships' :
                        isBusiness ? 'Discover creators and manage your campaigns' :
                            'Your dashboard overview'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Requests */}
                <Link
                    href={isCreator ? '/dashboard/requests' : '/dashboard/sent-requests'}
                    className="card p-6 hover:border-[var(--color-primary)] transition-all duration-200 hover:-translate-y-1"
                >
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">
                        {isCreator ? 'Pending Requests' : 'Pending Sent'}
                    </h3>
                    <p className="text-3xl font-bold text-[var(--color-warning)] mb-1">{pendingCount}</p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                        {isCreator ? 'Awaiting your response' : 'Awaiting creator response'}
                    </p>
                </Link>

                {/* Active/Accepted Collaborations */}
                <Link
                    href={isCreator ? '/dashboard/requests' : '/dashboard/sent-requests'}
                    className="card p-6 hover:border-[var(--color-primary)] transition-all duration-200 hover:-translate-y-1"
                >
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">
                        Active Collaborations
                    </h3>
                    <p className="text-3xl font-bold text-[var(--color-success)] mb-1">{acceptedCount}</p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                        Accepted partnerships
                    </p>
                </Link>

                {/* Total Requests */}
                <Link
                    href={isCreator ? '/dashboard/requests' : '/dashboard/sent-requests'}
                    className="card p-6 hover:border-[var(--color-primary)] transition-all duration-200 hover:-translate-y-1"
                >
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">
                        Total Requests
                    </h3>
                    <p className="text-3xl font-bold text-[var(--color-primary)] mb-1">{totalRequests}</p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                        All time
                    </p>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isCreator && (
                        <>
                            <Link href="/dashboard/requests" className="btn-primary text-center">
                                View Collaboration Requests
                            </Link>
                            <Link href="/dashboard/profile" className="btn-secondary text-center">
                                Edit Profile
                            </Link>
                        </>
                    )}
                    {isBusiness && (
                        <>
                            <Link href="/dashboard/creators" className="btn-primary text-center">
                                Discover Creators
                            </Link>
                            <Link href="/dashboard/sent-requests" className="btn-secondary text-center">
                                View Sent Requests
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity Section */}
            {pendingCount > 0 && (
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Pending Actions</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-warning)]/20 text-[var(--color-warning)]">
                            {pendingCount} pending
                        </span>
                    </div>
                    <p className="text-[var(--color-text-muted)] mb-4">
                        {isCreator
                            ? `You have ${pendingCount} collaboration ${pendingCount === 1 ? 'request' : 'requests'} waiting for your response.`
                            : `You have ${pendingCount} pending ${pendingCount === 1 ? 'request' : 'requests'} awaiting creator response.`
                        }
                    </p>
                    <Link
                        href={isCreator ? '/dashboard/requests' : '/dashboard/sent-requests'}
                        className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-2"
                    >
                        View {isCreator ? 'Requests' : 'Sent Requests'} →
                    </Link>
                </div>
            )}
        </div>
    );
}
