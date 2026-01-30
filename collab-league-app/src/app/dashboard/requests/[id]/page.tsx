import { getRequestDetails } from '@/app/actions/requests';
import { RequestDetailView, RequestActions } from '@/components/requests';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const request = await getRequestDetails(id);

    if (!request) {
        notFound();
    }

    // Get current user's role
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

    const viewerRole = profile?.role === 'business' ? 'business' : 'creator';

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href={viewerRole === 'business' ? '/dashboard/sent-requests' : '/dashboard/requests'}
                className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline"
            >
                ← Back to {viewerRole === 'business' ? 'Sent Requests' : 'Requests'}
            </Link>

            {/* Request Details */}
            <RequestDetailView request={request} viewerRole={viewerRole} />

            {/* Actions */}
            <RequestActions
                requestId={request.id}
                requestStatus={request.status}
                viewerRole={viewerRole}
            />
        </div>
    );
}
