import { getCreator } from '@/app/actions/requests';
import { CreatorDetailCard } from '@/components/creators';
import { CollaborationRequestForm } from '@/components/requests';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function CreatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const creator = await getCreator(id);

    if (!creator) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/dashboard/creators"
                className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline"
            >
                ← Back to Creators
            </Link>

            {/* Creator Profile */}
            <CreatorDetailCard creator={creator} />

            {/* Request Form */}
            <CollaborationRequestForm
                creatorId={creator.id}
                creatorName={creator.full_name}
            />
        </div>
    );
}
