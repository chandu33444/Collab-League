'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, updateCreatorProfile, updateBusinessProfile } from '@/app/actions/profile';
import { UserProfile } from '@/types/profile';
import { ProfileCard, ProfileCompletionBar } from '@/components/profile';
import { Input } from '@/components/auth';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { PLATFORMS } from '@/lib/constants/platforms';
import { NICHES } from '@/lib/constants/niches';
import { INDUSTRIES, COMPANY_SIZES } from '@/lib/constants/industries';

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        const data = await getProfile();
        if (!data) {
            router.push('/dashboard/onboarding');
            return;
        }
        setProfile(data);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData(e.currentTarget);
            const action = profile?.role === 'creator' ? updateCreatorProfile : updateBusinessProfile;
            const result = await action(formData);

            if (result?.success) {
                await loadProfile();
                setEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Profile</h1>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="btn-secondary"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <ProfileCompletionBar profile={profile} />

            {editing ? (
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {profile.role === 'creator' ? (
                            <>
                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    type="text"
                                    defaultValue={profile.full_name}
                                    required
                                />
                                <Textarea
                                    label="Bio"
                                    name="bio"
                                    defaultValue={profile.bio || ''}
                                    maxLength={500}
                                />
                                <Select
                                    label="Primary Platform"
                                    name="primaryPlatform"
                                    options={PLATFORMS}
                                    defaultValue={profile.primary_platform}
                                    required
                                />
                                <Select
                                    label="Primary Niche"
                                    name="niche"
                                    options={NICHES}
                                    defaultValue={profile.niche}
                                    required
                                />
                                <Input
                                    label="Follower Count"
                                    name="followersCount"
                                    type="number"
                                    defaultValue={profile.followers_count?.toString() || '0'}
                                    min="0"
                                />
                                <Input
                                    label="Website"
                                    name="website"
                                    type="url"
                                    defaultValue={profile.website || ''}
                                />
                                <div className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        id="isActive"
                                        value="true"
                                        defaultChecked={profile.is_active}
                                        className="w-4 h-4 text-[var(--color-primary)] bg-[var(--color-bg)] border-[var(--color-border)] 
                      rounded focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-[var(--color-text)]">
                                        Profile is active (available for collaborations)
                                    </label>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                                    <input
                                        type="checkbox"
                                        name="isPublic"
                                        id="isPublic"
                                        value="true"
                                        defaultChecked={profile.is_public}
                                        className="w-4 h-4 text-[var(--color-primary)] bg-[var(--color-bg)] border-[var(--color-border)] 
                      rounded focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                    <label htmlFor="isPublic" className="text-sm text-[var(--color-text)]">
                                        Make my profile public (businesses can discover me)
                                    </label>
                                </div>
                            </>
                        ) : (
                            <>
                                <Input
                                    label="Brand Name"
                                    name="brandName"
                                    type="text"
                                    defaultValue={profile.brand_name}
                                    required
                                />
                                <Select
                                    label="Industry"
                                    name="industry"
                                    options={INDUSTRIES}
                                    defaultValue={profile.industry}
                                    required
                                />
                                <Textarea
                                    label="Description"
                                    name="description"
                                    defaultValue={profile.description || ''}
                                    maxLength={500}
                                />
                                <Input
                                    label="Website"
                                    name="website"
                                    type="url"
                                    defaultValue={profile.website || ''}
                                />
                                <Select
                                    label="Company Size"
                                    name="companySize"
                                    options={COMPANY_SIZES}
                                    defaultValue={profile.company_size}
                                />
                            </>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary flex-1 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="btn-secondary flex-1"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <ProfileCard profile={profile} />
            )}
        </div>
    );
}
