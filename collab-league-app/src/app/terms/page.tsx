import { Navbar, Footer } from '@/components/landing';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <Navbar />
            <main className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-[var(--color-text-muted)] mb-8">
                        Last updated: January 2026
                    </p>

                    <div className="card space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-[var(--color-text-muted)]">
                                By accessing or using Collab League, you agree to be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
                            <p className="text-[var(--color-text-muted)]">
                                Collab League is a platform that connects content creators with businesses for
                                collaboration opportunities. We provide tools for discovery, communication, and
                                campaign management.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                            <ul className="list-disc list-inside text-[var(--color-text-muted)] space-y-2">
                                <li>You must provide accurate and complete information when creating an account</li>
                                <li>You are responsible for maintaining the security of your account</li>
                                <li>You must be at least 18 years old to use our services</li>
                                <li>One person or entity may not maintain more than one account</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">4. User Conduct</h2>
                            <p className="text-[var(--color-text-muted)] mb-4">You agree not to:</p>
                            <ul className="list-disc list-inside text-[var(--color-text-muted)] space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Post false, misleading, or deceptive content</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Use the platform for any fraudulent purpose</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
                            <p className="text-[var(--color-text-muted)]">
                                All content on Collab League, including but not limited to text, graphics, logos, and
                                software, is the property of Collab League or its content suppliers and is protected
                                by intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
                            <p className="text-[var(--color-text-muted)]">
                                Collab League shall not be liable for any indirect, incidental, special, consequential,
                                or punitive damages resulting from your use of or inability to use the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
                            <p className="text-[var(--color-text-muted)]">
                                We reserve the right to modify these terms at any time. We will notify users of any
                                significant changes via email or through the platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
                            <p className="text-[var(--color-text-muted)]">
                                For questions about these Terms of Service, please contact us at{' '}
                                <a href="mailto:legal@collableague.com" className="text-[var(--color-primary)] hover:underline">
                                    legal@collableague.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
