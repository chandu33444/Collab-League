'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/auth/update-password`,
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({
                    type: 'success',
                    text: 'Check your email for the password reset link.'
                });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
            <div className="card max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                    <p className="text-[var(--color-text-muted)]">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="you@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full justify-center"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/login" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
