'use client';

import React, { useState } from 'react';
import { sendCollaborationRequest } from '@/app/actions/requests';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/auth';
import { Textarea } from '@/components/ui/Textarea';

interface CollaborationRequestFormProps {
    creatorId: string;
    creatorName: string;
}

export function CollaborationRequestForm({ creatorId, creatorName }: CollaborationRequestFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await sendCollaborationRequest(formData);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            router.push('/dashboard/sent-requests');
        }
    }

    return (
        <div className="card p-8">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                Send Collaboration Request
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
                Send a collaboration request to {creatorName}
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="creatorId" value={creatorId} />

                <Input
                    label="Campaign Name"
                    name="campaignName"
                    type="text"
                    placeholder="e.g., Summer Product Launch"
                    required
                    disabled={isSubmitting}
                />

                <Textarea
                    label="Campaign Description"
                    name="campaignDescription"
                    placeholder="Describe your campaign, goals, and what you're looking for..."
                    required
                    disabled={isSubmitting}
                    rows={4}
                />

                <Textarea
                    label="Deliverables"
                    name="deliverables"
                    placeholder="e.g., 3 Instagram feed posts, 5 stories, product review video..."
                    required
                    disabled={isSubmitting}
                    rows={3}
                />

                <Input
                    label="Budget Range (Optional)"
                    name="budgetRange"
                    type="text"
                    placeholder="e.g., $500 - $1000"
                    disabled={isSubmitting}
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Start Date (Optional)"
                        name="startDate"
                        type="date"
                        disabled={isSubmitting}
                    />

                    <Input
                        label="End Date (Optional)"
                        name="endDate"
                        type="date"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Request'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                        className="btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
