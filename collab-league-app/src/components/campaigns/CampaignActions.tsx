'use client'

import React, { useState } from 'react';
import { updateCampaignStatus } from '@/app/actions/campaigns';
import { useRouter } from 'next/navigation';

interface CampaignActionsProps {
    campaignId: string;
    currentStatus: 'in_progress' | 'completed' | 'cancelled';
}

export function CampaignActions({ campaignId, currentStatus }: CampaignActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState<'completed' | 'cancelled' | null>(null);

    if (currentStatus !== 'in_progress') {
        return null; // No actions for completed or cancelled campaigns
    }

    const handleStatusUpdate = async (status: 'completed' | 'cancelled') => {
        setLoading(true);

        const result = await updateCampaignStatus(campaignId, status);

        if (result.error) {
            alert(result.error);
            setLoading(false);
            setShowConfirm(null);
        } else {
            router.refresh();
            setLoading(false);
            setShowConfirm(null);
        }
    };

    return (
        <div className="space-y-3">
            {/* Confirmation Dialog */}
            {showConfirm && (
                <div className="p-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg">
                    <p className="text-sm text-[var(--color-text)] mb-3">
                        Are you sure you want to mark this campaign as {showConfirm}? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusUpdate(showConfirm)}
                            disabled={loading}
                            className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${showConfirm === 'completed'
                                    ? 'bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white'
                                    : 'bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 text-white'
                                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
                        >
                            {loading ? 'Updating...' : `Yes, mark as ${showConfirm}`}
                        </button>
                        <button
                            onClick={() => setShowConfirm(null)}
                            disabled={loading}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {!showConfirm && (
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowConfirm('completed')}
                        className="btn-primary flex-1"
                    >
                        ✓ Mark as Completed
                    </button>

                    <button
                        onClick={() => setShowConfirm('cancelled')}
                        className="px-4 py-2 rounded-lg border border-[var(--color-error)] text-[var(--color-error)]
                     hover:bg-[var(--color-error)]/10 transition-colors text-sm font-medium"
                    >
                        Cancel Campaign
                    </button>
                </div>
            )}
        </div>
    );
}
