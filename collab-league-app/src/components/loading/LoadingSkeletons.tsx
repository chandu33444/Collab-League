import React from 'react';

export function CardSkeleton() {
    return (
        <div className="card p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-hover)]" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-[var(--color-surface-hover)] rounded" />
                    <div className="h-4 w-24 bg-[var(--color-surface-hover)] rounded" />
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-[var(--color-surface-hover)] rounded" />
                <div className="h-4 w-3/4 bg-[var(--color-surface-hover)] rounded" />
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--color-border)]">
                <div className="h-6 w-20 bg-[var(--color-surface-hover)] rounded-full" />
                <div className="h-6 w-20 bg-[var(--color-surface-hover)] rounded-full" />
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            {/* Header */}
            <div className="card p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="w-32 h-32 rounded-full bg-[var(--color-surface-hover)] shrink-0" />
                <div className="flex-1 space-y-4 w-full">
                    <div className="h-8 w-64 mx-auto md:mx-0 bg-[var(--color-surface-hover)] rounded" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-[var(--color-surface-hover)] rounded" />
                        <div className="h-4 w-5/6 bg-[var(--color-surface-hover)] rounded" />
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                        <div className="h-8 w-24 bg-[var(--color-surface-hover)] rounded" />
                        <div className="h-8 w-24 bg-[var(--color-surface-hover)] rounded" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card p-4 text-center space-y-2">
                        <div className="h-6 w-12 mx-auto bg-[var(--color-surface-hover)] rounded" />
                        <div className="h-4 w-20 mx-auto bg-[var(--color-surface-hover)] rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="card overflow-hidden animate-pulse">
            <div className="p-4 border-b border-[var(--color-border)]">
                <div className="h-6 w-48 bg-[var(--color-surface-hover)] rounded" />
            </div>
            <div className="divide-y divide-[var(--color-border)]">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 flex gap-4">
                        <div className="h-4 w-1/4 bg-[var(--color-surface-hover)] rounded" />
                        <div className="h-4 w-1/4 bg-[var(--color-surface-hover)] rounded" />
                        <div className="h-4 w-1/4 bg-[var(--color-surface-hover)] rounded" />
                        <div className="h-4 w-1/4 bg-[var(--color-surface-hover)] rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
