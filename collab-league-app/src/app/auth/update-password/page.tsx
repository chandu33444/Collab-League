'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const supabase = createClient();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' });
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
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
                    <h1 className="text-2xl font-bold mb-2">Update Password</h1>
                    <p className="text-[var(--color-text-muted)]">
                        Enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                            minLength={8}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
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
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
