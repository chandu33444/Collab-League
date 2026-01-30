'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthCard, RoleLoginTabs, SignupForm } from '@/components/auth';

export default function SignupPage() {
    const [role, setRole] = useState<'creator' | 'business'>('creator');

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
            <AuthCard
                title="Create your account"
                subtitle="Join thousands of creators and businesses"
            >
                <RoleLoginTabs activeRole={role} onRoleChange={setRole} />
                <SignupForm role={role} />

                <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                    Already have an account?{' '}
                    <Link href={`/login/${role}`} className="text-[var(--color-primary)] hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </AuthCard>
        </div>
    );
}
