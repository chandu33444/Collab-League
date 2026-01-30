import { UserProfile } from '@/types/profile';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ProfileCompletionBarProps {
    profile: UserProfile;
}

export function ProfileCompletionBar({ profile }: ProfileCompletionBarProps) {
    const requiredFields = profile.role === 'creator'
        ? ['full_name', 'primary_platform', 'niche', 'contact_email']
        : ['brand_name', 'industry', 'contact_email'];

    const optionalFields = profile.role === 'creator'
        ? ['bio', 'website', 'followers_count']
        : ['description', 'website', 'company_size'];

    const totalFields = requiredFields.length + optionalFields.length;
    let filledFields = 0;

    // Count required fields (always filled if profile exists)
    filledFields += requiredFields.length;

    // Count optional fields
    optionalFields.forEach(field => {
        const value = (profile as any)[field];
        if (value && value !== 0 && value !== '') {
            filledFields++;
        }
    });

    const percentage = Math.round((filledFields / totalFields) * 100);

    return (
        <div className="card p-4">
            <ProgressBar
                value={percentage}
                label="Profile Completion"
                showPercentage={true}
            />
            {percentage < 100 && (
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    Complete your profile to increase your visibility
                </p>
            )}
        </div>
    );
}
