import Link from 'next/link';
import { AuthCard, AdminLoginForm } from '@/components/auth';

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
            <AuthCard
                title="Admin Access"
                subtitle="Restricted area for platform administrators"
            >
                <AdminLoginForm />

                <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                    <Link href="/login" className="text-[var(--color-primary)] hover:underline">
                        ← Back to user login
                    </Link>
                </div>
            </AuthCard>
        </div>
    );
}
