'use client';

import React from 'react';

interface SortDropdownProps {
    value: string;
    onChange: (value: any) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[var(--color-text-muted)] whitespace-nowrap">Sort by</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input text-sm h-10 min-w-[160px]"
            >
                <option value="followers_count_desc">Most Followers</option>
                <option value="followers_count_asc">Least Followers</option>
                <option value="created_at_desc">Newest First</option>
                <option value="full_name_asc">Name (A-Z)</option>
            </select>
        </div>
    );
}
