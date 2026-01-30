import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { PublicInfluencerProfile } from '@/components/public/PublicInfluencerProfile';
import Link from 'next/link';

interface Props {
    params: { username: string }
}

async function getCreator(username: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .eq('is_public', true)
        .single();

    if (error || !data) {
        return null;
    }
    return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const creator = await getCreator(params.username);

    if (!creator) {
        return { title: 'Creator Not Found | Collab League' };
    }

    return {
        title: `${creator.full_name} | Collab League`,
        description: creator.bio || `Check out ${creator.full_name}, a ${creator.niche || 'content'} creator on Collab League.`,
        openGraph: {
            title: creator.full_name,
            description: creator.bio || '',
            images: creator.avatar_url ? [creator.avatar_url] : [],
            type: 'profile'
        },
        twitter: {
            card: 'summary_large_image',
            title: creator.full_name,
            description: creator.bio || '',
        }
    };
}

export default async function PublicProfilePage({ params }: Props) {
    const creator = await getCreator(params.username);

    if (!creator) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Simple Nav */}
            <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/creators" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                        Collab League
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/login" className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">
                            Login
                        </Link>
                        <Link href="/signup" className="btn btn-primary text-sm py-1.5 px-4">
                            Join
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 md:py-12">
                <PublicInfluencerProfile creator={creator} />
            </main>
        </div>
    );
}
