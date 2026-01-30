import { Navbar, Footer } from '@/components/landing';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <Navbar />
            <main className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        About <span className="gradient-text">Collab League</span>
                    </h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-xl text-[var(--color-text-muted)] mb-8">
                            We&apos;re on a mission to make creator-business collaborations simple,
                            transparent, and successful for everyone.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-12">
                            <div className="card">
                                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                                <p className="text-[var(--color-text-muted)]">
                                    To democratize influencer marketing by creating a platform where
                                    creators of all sizes can connect with businesses, and where
                                    businesses can find authentic partnerships.
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                                <p className="text-[var(--color-text-muted)]">
                                    A world where every creator can turn their passion into a
                                    sustainable career, and every business can find the perfect
                                    voice to share their story.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-4 mt-12">Why Collab League?</h2>
                        <ul className="space-y-4 text-[var(--color-text-muted)]">
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-[var(--color-success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span><strong className="text-[var(--color-text)]">Transparency First:</strong> No hidden fees, clear communication, honest metrics.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-[var(--color-success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span><strong className="text-[var(--color-text)]">Creator-Centric:</strong> Built by creators, for creators. We understand your needs.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-[var(--color-success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span><strong className="text-[var(--color-text)]">Business-Friendly:</strong> Streamlined workflows that save time and deliver results.</span>
                            </li>
                        </ul>

                        <div className="mt-12 text-center">
                            <Link href="/signup" className="btn btn-primary btn-lg">
                                Join Collab League Today
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
