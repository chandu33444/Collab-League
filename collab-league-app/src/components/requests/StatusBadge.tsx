import React from 'react';

type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired';

interface StatusBadgeProps {
    status: RequestStatus;
}

const STATUS_STYLES = {
    pending: {
        bg: 'bg-[var(--color-warning-bg)]',
        text: 'text-[var(--color-warning)]',
        label: 'Pending'
    },
    accepted: {
        bg: 'bg-[var(--color-success-bg)]',
        text: 'text-[var(--color-success)]',
        label: 'Accepted'
    },
    rejected: {
        bg: 'bg-[var(--color-error-bg)]',
        text: 'text-[var(--color-error)]',
        label: 'Rejected'
    },
    cancelled: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        label: 'Cancelled'
    },
    expired: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        label: 'Expired'
    }
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const style = STATUS_STYLES[status];

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
        >
            {style.label}
        </span>
    );
}
