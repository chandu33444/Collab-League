import { Navbar, Footer } from '@/components/landing';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <Navbar />
            <main className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-[var(--color-text-muted)] mb-8">
                        Last updated: January 2026
                    </p>

                    <div className="card space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                            <p className="text-[var(--color-text-muted)]">
                                We collect information you provide directly to us, such as when you create an account,
                                fill out a form, or communicate with us. This may include your name, email address,
                                and profile information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-[var(--color-text-muted)] space-y-2">
                                <li>To provide, maintain, and improve our services</li>
                                <li>To process transactions and send related information</li>
                                <li>To send you technical notices and support messages</li>
                                <li>To respond to your comments and questions</li>
                                <li>To communicate with you about products, services, and events</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
                            <p className="text-[var(--color-text-muted)]">
                                We do not sell, trade, or otherwise transfer your personal information to outside parties.
                                This does not include trusted third parties who assist us in operating our website,
                                conducting our business, or servicing you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                            <p className="text-[var(--color-text-muted)]">
                                We implement a variety of security measures to maintain the safety of your personal
                                information. Your data is stored on secure servers and protected using industry-standard
                                encryption.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                            <p className="text-[var(--color-text-muted)]">
                                You have the right to access, update, or delete your personal information at any time.
                                You can do this through your account settings or by contacting us directly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
                            <p className="text-[var(--color-text-muted)]">
                                If you have any questions about this Privacy Policy, please contact us at{' '}
                                <a href="mailto:privacy@collableague.com" className="text-[var(--color-primary)] hover:underline">
                                    privacy@collableague.com
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
