'use client'

import React from 'react';
import { NICHES } from '@/lib/constants/niches';
import { PLATFORMS } from '@/lib/constants/platforms';

interface FilterPanelProps {
    filters: {
        niche?: string
        platform?: string
        minFollowers?: number
        maxFollowers?: number
    }
    onChange: (filters: FilterPanelProps['filters']) => void
}

const FOLLOWER_RANGES = [
    { label: 'Any count', min: undefined, max: undefined },
    { label: '1K - 10K', min: 1000, max: 10000 },
    { label: '10K - 100K', min: 10000, max: 100000 },
    { label: '100K - 1M', min: 100000, max: 1000000 },
    { label: '1M+', min: 1000000, max: undefined }
]

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
    const handleChange = (key: keyof FilterPanelProps['filters'], value: any) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <div className="card p-4 space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Filters</h3>

                {/* Niche Filter */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Niche</label>
                    <select
                        value={filters.niche || ''}
                        onChange={(e) => handleChange('niche', e.target.value || undefined)}
                        className="input w-full text-sm"
                    >
                        <option value="">All Niches</option>
                        {NICHES.map(n => (
                            <option key={n.value} value={n.value}>{n.label}</option>
                        ))}
                    </select>
                </div>

                {/* Platform Filter */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Platform</label>
                    <select
                        value={filters.platform || ''}
                        onChange={(e) => handleChange('platform', e.target.value || undefined)}
                        className="input w-full text-sm"
                    >
                        <option value="">All Platforms</option>
                        {PLATFORMS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

                {/* Followers Filter */}
                <div>
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Follower Count</label>
                    <div className="space-y-2">
                        {FOLLOWER_RANGES.map((range, i) => {
                            const checked = filters.minFollowers === range.min && filters.maxFollowers === range.max;
                            return (
                                <label key={i} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`
                    w-4 h-4 rounded-full border flex items-center justify-center
                    ${checked ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)] group-hover:border-[var(--color-text-muted)]'}
                  `}>
                                        {checked && <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="followers"
                                        className="sr-only"
                                        checked={checked}
                                        onChange={() => onChange({
                                            ...filters,
                                            minFollowers: range.min,
                                            maxFollowers: range.max
                                        })}
                                    />
                                    <span className={`text-sm ${checked ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-muted)]'}`}>
                                        {range.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <button
                onClick={() => onChange({})}
                className="w-full py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
            >
                Reset Filters
            </button>
        </div>
    );
}
