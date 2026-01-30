'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthCard, RoleLoginTabs, LoginForm } from '@/components/auth';

export default function LoginPage() {
    const [role, setRole] = useState<'creator' | 'business'>('creator');

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
            <AuthCard
                title="Welcome back"
                subtitle="Sign in to continue to your dashboard"
            >
                <RoleLoginTabs activeRole={role} onRoleChange={setRole} />
                <LoginForm role={role} />

                <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                    Don&apos;t have an account?{' '}
                    <Link href={`/signup/${role}`} className="text-[var(--color-primary)] hover:underline font-medium">
                        Sign up as {role === 'creator' ? 'Creator' : 'Business'}
                    </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center">
                    <Link href="/login/admin" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Admin Login →
                    </Link>
                </div>
            </AuthCard>
        </div>
    );
}
