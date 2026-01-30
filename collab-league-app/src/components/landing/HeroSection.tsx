import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[128px] opacity-20" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-[128px] opacity-15" />
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                    <span className="text-sm text-[var(--color-text-muted)]">Now connecting 10,000+ creators & businesses</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Where Creators & Businesses{' '}
                    <span className="gradient-text">Build Winning Partnerships</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-muted)] mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Connect with top creators or discover business collaborations that match your niche.
                    Simple, transparent, powerful.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <Link
                        href="/signup/creator"
                        className="btn btn-primary btn-lg group"
                    >
                        <span>I&apos;m a Creator</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <Link
                        href="/signup/business"
                        className="btn btn-secondary btn-lg group"
                    >
                        <span>I&apos;m a Business</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>

                {/* Sign In Link */}
                <p className="mt-8 text-[var(--color-text-muted)] text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
                        Sign in
                    </Link>
                </p>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    {[
                        { value: '10K+', label: 'Creators' },
                        { value: '2K+', label: 'Businesses' },
                        { value: '50K+', label: 'Collaborations' },
                        { value: '98%', label: 'Satisfaction' }
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                            <div className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
