import Link from 'next/link';
import { AuthCard, SignupForm } from '@/components/auth';

export default function CreatorSignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
            <AuthCard
                title="Join as Creator"
                subtitle="Start receiving collaboration opportunities"
            >
                <SignupForm role="creator" />

                <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                    Already have an account?{' '}
                    <Link href="/login/creator" className="text-[var(--color-primary)] hover:underline font-medium">
                        Sign in
                    </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center">
                    <Link href="/signup/business" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Want to find creators? Sign up as Business →
                    </Link>
                </div>
            </AuthCard>
        </div>
    );
}
