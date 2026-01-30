import Link from 'next/link';
import { AuthCard, SignupForm } from '@/components/auth';

export default function BusinessSignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
            <AuthCard
                title="Join as Business"
                subtitle="Find and collaborate with amazing creators"
            >
                <SignupForm role="business" />

                <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                    Already have an account?{' '}
                    <Link href="/login/business" className="text-[var(--color-primary)] hover:underline font-medium">
                        Sign in
                    </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center">
                    <Link href="/signup/creator" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Are you a Creator? Sign up here →
                    </Link>
                </div>
            </AuthCard>
        </div>
    );
}
