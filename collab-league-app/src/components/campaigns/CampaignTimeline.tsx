import React from 'react';

const STEPS = [
    { key: 'requested', label: 'Requested' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
];

interface CampaignTimelineProps {
    status: 'in_progress' | 'completed' | 'cancelled';
}

export function CampaignTimeline({ status }: CampaignTimelineProps) {
    // Map status to step index
    const getStepIndex = () => {
        if (status === 'cancelled') return 1; // Show as accepted but highlight cancelled
        if (status === 'in_progress') return 2;
        if (status === 'completed') return 3;
        return 0;
    };

    const currentIndex = getStepIndex();

    return (
        <div className="w-full">
            {status === 'cancelled' && (
                <div className="mb-4 p-3 bg-[var(--color-text-faint)]/10 border border-[var(--color-text-faint)]/20 rounded-lg">
                    <p className="text-sm text-[var(--color-text-faint)] text-center">
                        ⚠️ This campaign has been cancelled
                    </p>
                </div>
            )}

            <div className="flex items-center justify-between">
                {STEPS.map((step, i) => (
                    <div key={step.key} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                transition-all duration-200
                ${i <= currentIndex && status !== 'cancelled'
                                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30'
                                    : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'}
                ${status === 'cancelled' && i > 1
                                    ? 'bg-[var(--color-text-faint)]/20 text-[var(--color-text-faint)]'
                                    : ''}
              `}>
                                {i < currentIndex || (i === currentIndex && status === 'completed') ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    i + 1
                                )}
                            </div>
                            <span className={`mt-2 text-xs font-medium whitespace-nowrap
                ${i <= currentIndex && status !== 'cancelled'
                                    ? 'text-[var(--color-text)]'
                                    : 'text-[var(--color-text-muted)]'}
                ${status === 'cancelled' && i > 1
                                    ? 'text-[var(--color-text-faint)]'
                                    : ''}
              `}>
                                {step.label}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {i < STEPS.length - 1 && (
                            <div className={`
                flex-1 h-0.5 mx-2 transition-all duration-200
                ${i < currentIndex && status !== 'cancelled'
                                    ? 'bg-[var(--color-primary)]'
                                    : 'bg-[var(--color-border)]'}
                ${status === 'cancelled' && i >= 1
                                    ? 'bg-[var(--color-text-faint)]/30'
                                    : ''}
              `} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
