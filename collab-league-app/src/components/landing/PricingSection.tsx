import Link from 'next/link';

const PLANS = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started',
        features: [
            'Create your profile',
            'Receive up to 5 requests/month',
            'Basic analytics',
            'Email support'
        ],
        cta: 'Get Started',
        href: '/signup',
        highlighted: false
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'For serious creators & businesses',
        features: [
            'Unlimited requests',
            'Advanced analytics',
            'Priority in search results',
            'Campaign templates',
            'Priority support',
            'Early access to features'
        ],
        cta: 'Start Free Trial',
        href: '/signup?plan=pro',
        highlighted: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large teams & agencies',
        features: [
            'Everything in Pro',
            'Multiple team members',
            'Custom integrations',
            'Dedicated account manager',
            'SLA guarantee',
            'Custom contracts'
        ],
        cta: 'Contact Sales',
        href: '/contact',
        highlighted: false
    }
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 px-6 bg-[var(--color-surface)]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Simple, Transparent <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        Start free, upgrade when you need more. No hidden fees.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-8 ${plan.highlighted
                                    ? 'bg-gradient-to-b from-[var(--color-primary)]/20 to-[var(--color-bg)] border-2 border-[var(--color-primary)]'
                                    : 'bg-[var(--color-bg)] border border-[var(--color-border)]'
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-primary)] rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-[var(--color-text-muted)]">{plan.period}</span>
                                    )}
                                </div>
                                <p className="text-[var(--color-text-muted)] mt-2">{plan.description}</p>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Link
                                href={plan.href}
                                className={`block text-center py-3 rounded-lg font-medium transition-all ${plan.highlighted
                                        ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
                                        : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Trust Badge */}
                <p className="text-center text-[var(--color-text-muted)] mt-12">
                    🔒 Secure payments powered by Stripe. Cancel anytime.
                </p>
            </div>
        </section>
    );
}
