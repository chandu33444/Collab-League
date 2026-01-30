'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export function AdminLoginForm() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                return;
            }

            // Redirect to dashboard on success
            router.push('/dashboard');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Notice */}
            <div className="p-3 rounded-lg bg-[var(--color-warning-bg)] text-[var(--color-warning)] text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>This area is restricted to administrators only.</span>
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium mb-2">
                    Admin Email
                </label>
                <input
                    id="adminEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="admin@collableague.com"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium mb-2">
                    Password
                </label>
                <input
                    id="adminPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 rounded-lg bg-[var(--color-error-bg)] text-[var(--color-error)] text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-md w-full"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Authenticating...
                    </span>
                ) : (
                    'Access Admin Panel'
                )}
            </button>
        </form>
    );
}
