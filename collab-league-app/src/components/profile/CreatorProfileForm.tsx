'use client';

import { useState } from 'react';
import { createCreatorProfile } from '@/app/actions/profile';
import { Input } from '@/components/auth';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { PLATFORMS } from '@/lib/constants/platforms';
import { NICHES } from '@/lib/constants/niches';

interface CreatorProfileFormProps {
    userEmail?: string;
}

export function CreatorProfileForm({ userEmail }: CreatorProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await createCreatorProfile(formData);

            if (result?.error) {
                setError(result.error);
                setIsSubmitting(false);
            }
            // On success, the action will redirect
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create profile');
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}

            <Input
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Your full name"
                required
            />

            <Textarea
                label="Bio"
                name="bio"
                placeholder="Tell us about yourself and your content..."
                maxLength={500}
            />

            <Select
                label="Primary Platform"
                name="primaryPlatform"
                options={PLATFORMS}
                required
            />

            <Select
                label="Primary Niche"
                name="niche"
                options={NICHES}
                required
            />

            <Input
                label="Follower Count"
                name="followersCount"
                type="number"
                placeholder="10000"
                min="0"
            />

            <Input
                label="Contact Email"
                name="contactEmail"
                type="email"
                placeholder="your@email.com"
                defaultValue={userEmail}
                required
            />

            <Input
                label="Website / Portfolio"
                name="website"
                type="url"
                placeholder="https://yourwebsite.com"
            />

            <div className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                <input
                    type="checkbox"
                    name="isPublic"
                    id="isPublic"
                    value="true"
                    className="w-4 h-4 text-[var(--color-primary)] bg-[var(--color-bg)] border-[var(--color-border)] 
            rounded focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="isPublic" className="text-sm text-[var(--color-text)]">
                    Make my profile public (businesses can discover me)
                </label>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
            </button>
        </form>
    );
}
