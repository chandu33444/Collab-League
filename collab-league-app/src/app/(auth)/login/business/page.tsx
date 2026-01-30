import Link from 'next/link';
import { AuthCard, LoginForm } from '@/components/auth';

export default function BusinessLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
            <AuthCard
                title="Business Login"
                subtitle="Welcome back! Sign in to manage your campaigns."
            >
                <LoginForm role="business" />

                <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup/business" className="text-[var(--color-primary)] hover:underline font-medium">
                        Sign up as Business
                    </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center">
                    <Link href="/login/creator" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Are you a Creator? Login here →
                    </Link>
                </div>
            </AuthCard>
        </div>
    );
}
