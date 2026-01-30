'use client'

import React from 'react';

interface Note {
    id: string;
    content: string;
    created_at: string;
    author: {
        id: string;
        role: 'business' | 'creator';
        name: string;
    };
}

interface CampaignNotesProps {
    notes: Note[];
    currentUserId: string;
}

export function CampaignNotes({ notes, currentUserId }: CampaignNotesProps) {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else if (diffInHours < 48) {
            return 'Yesterday at ' + date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
    };

    if (notes.length === 0) {
        return (
            <div className="text-center py-8 text-[var(--color-text-muted)]">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">No notes yet. Start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notes.map((note) => {
                const isOwnNote = note.author.id === currentUserId;

                return (
                    <div
                        key={note.id}
                        className={`flex ${isOwnNote ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] ${isOwnNote ? 'order-2' : 'order-1'}`}>
                            {/* Author & Time */}
                            <div className={`flex items-center gap-2 mb-1 ${isOwnNote ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                                    {isOwnNote ? 'You' : note.author.name}
                                </span>
                                <span className="text-xs text-[var(--color-text-faint)]">
                                    {formatTime(note.created_at)}
                                </span>
                            </div>

                            {/* Note Content */}
                            <div className={`
                px-4 py-3 rounded-lg
                ${isOwnNote
                                    ? 'bg-[var(--color-primary)] text-white rounded-tr-none'
                                    : 'bg-[var(--color-surface-hover)] text-[var(--color-text)] rounded-tl-none'
                                }
              `}>
                                <p className="text-sm whitespace-pre-line break-words">
                                    {note.content}
                                </p>
                            </div>

                            {/* Role Badge */}
                            <div className={`flex ${isOwnNote ? 'justify-end' : 'justify-start'} mt-1`}>
                                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                  ${note.author.role === 'business'
                                        ? 'bg-[var(--color-info)]/20 text-[var(--color-info)]'
                                        : 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]'
                                    }
                `}>
                                    {note.author.role === 'business' ? 'Business' : 'Creator'}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
