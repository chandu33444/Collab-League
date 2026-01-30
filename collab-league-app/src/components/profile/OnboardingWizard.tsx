'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CreatorProfileForm } from './CreatorProfileForm';
import { BusinessProfileForm } from './BusinessProfileForm';

export function OnboardingWizard() {
    const [role, setRole] = useState<'creator' | 'business' | null>(null);
    const [userEmail, setUserEmail] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserData() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserEmail(user.email || '');

                // Fetch user role from profiles table
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setRole(profile.role as 'creator' | 'business');
                }
            }

            setLoading(false);
        }

        loadUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]" />
            </div>
        );
    }

    if (!role) {
        return (
            <div className="text-center">
                <p className="text-red-500">Unable to determine your account type. Please contact support.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                <p className="text-[var(--color-text-muted)]">
                    {role === 'creator'
                        ? "Let's set up your creator profile so businesses can discover you"
                        : "Tell us about your brand to start finding creators"}
                </p>
            </div>

            <div className="card p-8">
                {role === 'creator' ? (
                    <CreatorProfileForm userEmail={userEmail} />
                ) : (
                    <BusinessProfileForm userEmail={userEmail} />
                )}
            </div>
        </div>
    );
}
