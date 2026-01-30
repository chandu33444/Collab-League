'use client';

import { useState } from 'react';
import { createBusinessProfile } from '@/app/actions/profile';
import { Input } from '@/components/auth';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { INDUSTRIES, COMPANY_SIZES } from '@/lib/constants/industries';

interface BusinessProfileFormProps {
    userEmail?: string;
}

export function BusinessProfileForm({ userEmail }: BusinessProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await createBusinessProfile(formData);

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
                label="Brand Name"
                name="brandName"
                type="text"
                placeholder="Your company or brand name"
                required
            />

            <Select
                label="Industry"
                name="industry"
                options={INDUSTRIES}
                required
            />

            <Textarea
                label="Description"
                name="description"
                placeholder="Tell us about your brand and what you're looking for..."
                maxLength={500}
            />

            <Input
                label="Website"
                name="website"
                type="url"
                placeholder="https://yourbrand.com"
            />

            <Input
                label="Contact Email"
                name="contactEmail"
                type="email"
                placeholder="contact@yourbrand.com"
                defaultValue={userEmail}
                required
            />

            <Select
                label="Company Size"
                name="companySize"
                options={COMPANY_SIZES}
            />

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
