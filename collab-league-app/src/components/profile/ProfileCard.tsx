import { UserProfile, CreatorProfile, BusinessProfile } from '@/types/profile';

interface ProfileCardProps {
    profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
    if (profile.role === 'creator') {
        return <CreatorProfileCard profile={profile as CreatorProfile} />;
    }

    if (profile.role === 'business') {
        return <BusinessProfileCard profile={profile as BusinessProfile} />;
    }

    return null;
}

function CreatorProfileCard({ profile }: { profile: CreatorProfile }) {
    return (
        <div className="card p-6 space-y-6">
            <div className="flex items-start gap-4">
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] 
            flex items-center justify-center text-2xl font-bold text-white">
                        {profile.full_name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                    <p className="text-[var(--color-text-muted)] mt-1">@{profile.username || 'creator'}</p>
                    <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] 
              rounded-full text-sm font-medium">
                            {profile.primary_platform}
                        </span>
                        <span className="px-3 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] 
              rounded-full text-sm font-medium">
                            {profile.niche}
                        </span>
                    </div>
                </div>
            </div>

            {profile.bio && (
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">Bio</h3>
                    <p className="text-[var(--color-text)]">{profile.bio}</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Followers</h3>
                    <p className="text-xl font-bold">{(profile.followers_count || 0).toLocaleString()}</p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Status</h3>
                    <p className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${profile.is_active ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className="text-sm">{profile.is_active ? 'Active' : 'Inactive'}</span>
                    </p>
                </div>
            </div>

            {profile.website && (
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Website</h3>
                    <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:underline"
                    >
                        {profile.website}
                    </a>
                </div>
            )}

            <div className="pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {profile.is_public ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        )}
                    </svg>
                    <span>{profile.is_public ? 'Public profile' : 'Private profile'}</span>
                </div>
            </div>
        </div>
    );
}

function BusinessProfileCard({ profile }: { profile: BusinessProfile }) {
    return (
        <div className="card p-6 space-y-6">
            <div className="flex items-start gap-4">
                {profile.logo_url ? (
                    <img
                        src={profile.logo_url}
                        alt={profile.brand_name}
                        className="w-20 h-20 rounded-lg object-cover"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] 
            flex items-center justify-center text-2xl font-bold text-white">
                        {profile.brand_name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{profile.brand_name}</h2>
                    <p className="text-[var(--color-text-muted)] mt-1">
                        {profile.industry} {profile.company_size && `• ${profile.company_size}`}
                    </p>
                    {profile.is_verified && (
                        <div className="flex items-center gap-1 mt-2 text-[var(--color-primary)]">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Verified</span>
                        </div>
                    )}
                </div>
            </div>

            {profile.description && (
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">About</h3>
                    <p className="text-[var(--color-text)]">{profile.description}</p>
                </div>
            )}

            {profile.website && (
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Website</h3>
                    <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:underline"
                    >
                        {profile.website}
                    </a>
                </div>
            )}

            <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Contact</h3>
                <p className="text-[var(--color-text)]">{profile.contact_email}</p>
            </div>
        </div>
    );
}
