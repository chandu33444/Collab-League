'use client';

import { useState } from 'react';

const CREATOR_STEPS = [
    {
        step: '01',
        title: 'Create Your Profile',
        description: 'Showcase your niche, platforms, audience size, and what makes you unique.'
    },
    {
        step: '02',
        title: 'Get Discovered',
        description: 'Businesses find you based on your expertise and content style.'
    },
    {
        step: '03',
        title: 'Accept Collaborations',
        description: 'Review offers, negotiate terms, and accept campaigns that fit your brand.'
    },
    {
        step: '04',
        title: 'Grow Together',
        description: 'Build long-term partnerships and scale your creator business.'
    }
];

const BUSINESS_STEPS = [
    {
        step: '01',
        title: 'Create Your Account',
        description: 'Tell us about your brand, goals, and the type of creators you want to work with.'
    },
    {
        step: '02',
        title: 'Discover Creators',
        description: 'Browse, filter, and find creators that perfectly match your campaign needs.'
    },
    {
        step: '03',
        title: 'Send Requests',
        description: 'Reach out with your campaign details, deliverables, and timeline.'
    },
    {
        step: '04',
        title: 'Track Results',
        description: 'Manage campaigns, communicate with creators, and measure success.'
    }
];

export function HowItWorks() {
    const [activeTab, setActiveTab] = useState<'creator' | 'business'>('creator');
    const steps = activeTab === 'creator' ? CREATOR_STEPS : BUSINESS_STEPS;

    return (
        <section id="how-it-works" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        Simple steps to start collaborating. Choose your path below.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-[var(--color-surface)] rounded-lg p-1 border border-[var(--color-border)]">
                        <button
                            onClick={() => setActiveTab('creator')}
                            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeTab === 'creator'
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            For Creators
                        </button>
                        <button
                            onClick={() => setActiveTab('business')}
                            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeTab === 'business'
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                }`}
                        >
                            For Businesses
                        </button>
                    </div>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((item, index) => (
                        <div
                            key={item.step}
                            className="card card-hover relative group"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Step Number */}
                            <div className="text-5xl font-bold text-[var(--color-primary)] opacity-20 mb-4">
                                {item.step}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-[var(--color-text-muted)] text-sm">
                                {item.description}
                            </p>

                            {/* Connector Line (desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-[var(--color-border)]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
