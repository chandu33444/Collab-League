'use client'

import React, { useState } from 'react';
import { addCampaignNote } from '@/app/actions/campaigns';

interface NoteInputProps {
    campaignId: string;
}

export function NoteInput({ campaignId }: NoteInputProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Please enter a note');
            return;
        }

        setLoading(true);
        setError('');

        const result = await addCampaignNote(campaignId, content);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            setContent('');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a note to this campaign..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg
                   text-[var(--color-text)] placeholder-[var(--color-text-faint)]
                   focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                   transition-colors resize-none"
                    disabled={loading}
                />

                {error && (
                    <p className="mt-2 text-sm text-[var(--color-error)]">
                        {error}
                    </p>
                )}

                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[var(--color-text-faint)]">
                        {content.length} characters
                    </span>

                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            'Send Note'
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
