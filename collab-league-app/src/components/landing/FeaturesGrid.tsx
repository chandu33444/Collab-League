const FEATURES = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        title: 'Professional Profiles',
        description: 'Showcase your work with rich profiles featuring your niche, platforms, and portfolio.',
        forCreator: 'Stand out to businesses',
        forBusiness: 'Company presence'
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
        title: 'Smart Discovery',
        description: 'Find perfect matches with advanced search, filters, and smart recommendations.',
        forCreator: 'Get found easily',
        forBusiness: 'Find ideal creators'
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
        title: 'Seamless Requests',
        description: 'Send and receive collaboration requests with all details in one place.',
        forCreator: 'One-click accept',
        forBusiness: 'Quick outreach'
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        title: 'Campaign Management',
        description: 'Track deliverables, deadlines, and progress all in one dashboard.',
        forCreator: 'Track deliverables',
        forBusiness: 'Monitor progress'
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
        ),
        title: 'Built-in Communication',
        description: 'Internal notes and messaging keep all conversations organized.',
        forCreator: 'In-app messaging',
        forBusiness: 'Centralized notes'
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Analytics & Insights',
        description: 'Track your performance and campaign results with detailed analytics.',
        forCreator: 'View your stats',
        forBusiness: 'Campaign insights'
    }
];

export function FeaturesGrid() {
    return (
        <section id="features" className="py-24 px-6 bg-[var(--color-surface)]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Everything You Need to <span className="gradient-text">Succeed</span>
                    </h2>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        Powerful features designed for both creators and businesses.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="group p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-[var(--color-text-muted)] mb-4">{feature.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                                    {feature.forCreator}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                    {feature.forBusiness}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
