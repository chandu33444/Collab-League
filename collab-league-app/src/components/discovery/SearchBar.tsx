'use client';

import React, { useState, useEffect } from 'react';

interface SearchBarProps {
    initialValue: string;
    onSearch: (value: string) => void;
}

export function SearchBar({ initialValue, onSearch }: SearchBarProps) {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    // Trigger search when debounced value changes
    useEffect(() => {
        if (debouncedValue !== initialValue) {
            onSearch(debouncedValue);
        }
    }, [debouncedValue, initialValue, onSearch]);

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                className="input w-full !pl-10 h-10" // Force left padding to accommodate icon
                placeholder="Search by name, bio, or niche..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {value && (
                <button
                    onClick={() => { setValue(''); onSearch(''); }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
