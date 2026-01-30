import React from 'react';

interface ProgressBarProps {
    value: number; // 0-100
    label?: string;
    showPercentage?: boolean;
    className?: string;
}

export function ProgressBar({
    value,
    label,
    showPercentage = true,
    className = ''
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, value));

    return (
        <div className={`w-full ${className}`}>
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
                    )}
                    {showPercentage && (
                        <span className="text-sm text-[var(--color-text-muted)]">{percentage}%</span>
                    )}
                </div>
            )}
            <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] 
            transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
