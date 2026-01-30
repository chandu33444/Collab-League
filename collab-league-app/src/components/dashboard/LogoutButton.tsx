'use client';

import { signOut } from '@/app/actions/auth';
import { useState } from 'react';

export function LogoutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        setIsLoggingOut(true);
        await signOut();
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 
        hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 
        disabled:cursor-not-allowed flex items-center gap-2"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
            </svg>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
    );
}
