'use client';

import React, { useState } from 'react';
import { respondToRequest, cancelRequest } from '@/app/actions/requests';
import { useRouter } from 'next/navigation';

interface RequestActionsProps {
    requestId: string;
    requestStatus: string;
    viewerRole: 'business' | 'creator';
}

export function RequestActions({ requestId, requestStatus, viewerRole }: RequestActionsProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    // Only show actions for pending requests
    if (requestStatus !== 'pending') {
        return null;
    }

    const handleAccept = async () => {
        if (viewerRole !== 'creator') return;

        setIsSubmitting(true);
        setError('');

        const result = await respondToRequest(requestId, 'accepted', notes);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            router.refresh();
        }
    };

    const handleReject = async () => {
        if (viewerRole !== 'creator') return;

        setIsSubmitting(true);
        setError('');

        const result = await respondToRequest(requestId, 'rejected', notes);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            router.refresh();
        }
    };

    const handleCancel = async () => {
        if (viewerRole !== 'business') return;

        if (!confirm('Are you sure you want to cancel this request?')) {
            return;
        }

        setIsSubmitting(true);
        setError('');

        const result = await cancelRequest(requestId);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            router.push('/dashboard/sent-requests');
        }
    };

    // Creator actions
    if (viewerRole === 'creator') {
        return (
            <div className="card p-6 space-y-4">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                    Respond to Request
                </h3>

                {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Add a note (optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any comments or questions..."
                        className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] 
              rounded-lg text-[var(--color-text)] placeholder-[var(--color-text-muted)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        rows={4}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleAccept}
                        disabled={isSubmitting}
                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Processing...' : 'Accept Request'}
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed
              bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                    >
                        {isSubmitting ? 'Processing...' : 'Reject Request'}
                    </button>
                </div>
            </div>
        );
    }

    // Business actions
    if (viewerRole === 'business') {
        return (
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                    Request Actions
                </h3>

                {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg mb-4">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed
            bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                >
                    {isSubmitting ? 'Cancelling...' : 'Cancel Request'}
                </button>
            </div>
        );
    }

    return null;
}
