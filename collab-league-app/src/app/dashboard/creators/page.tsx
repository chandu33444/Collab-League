import { getCreators } from '@/app/actions/requests';
import { CreatorList } from '@/components/creators';

export default async function CreatorsPage() {
    const creators = await getCreators();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">Discover Creators</h1>
                    <p className="text-[var(--color-text-muted)] mt-2">
                        Browse and connect with talented creators for your campaigns
                    </p>
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                    {creators.length} {creators.length === 1 ? 'Creator' : 'Creators'}
                </div>
            </div>

            <CreatorList creators={creators} />
        </div>
    );
}
