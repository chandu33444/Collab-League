'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
    {
        question: 'What is Collab League?',
        answer: 'Collab League is a platform that connects creators (influencers, content creators) with businesses looking for collaboration opportunities. We simplify the entire process from discovery to campaign management.'
    },
    {
        question: 'Is it free to join as a creator?',
        answer: 'Yes! Creating a profile and receiving collaboration requests is completely free. We offer premium features for creators who want enhanced visibility and advanced analytics.'
    },
    {
        question: 'How do businesses find creators?',
        answer: 'Businesses can browse our creator directory, filter by niche, platform, follower count, and more. Our smart discovery system also recommends creators based on campaign goals.'
    },
    {
        question: 'How does the collaboration process work?',
        answer: 'Businesses send collaboration requests with campaign details. Creators review and accept or decline. Once accepted, both parties manage the campaign through our dashboard with built-in communication tools.'
    },
    {
        question: 'Is my information secure?',
        answer: 'Absolutely. We use industry-standard encryption and security practices. Your contact information is only shared with parties you approve for collaborations.'
    },
    {
        question: 'What types of creators can join?',
        answer: 'All types! Whether you\'re on Instagram, YouTube, TikTok, LinkedIn, Twitter, or any other platform, you\'re welcome to join. We support creators across all niches and audience sizes.'
    }
];

export function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>
                    <p className="text-lg text-[var(--color-text-muted)]">
                        Got questions? We&apos;ve got answers.
                    </p>
                </div>

                {/* Accordion */}
                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, index) => (
                        <div
                            key={index}
                            className="card p-0 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface-hover)] transition-colors"
                                aria-expanded={openIndex === index}
                            >
                                <span className="font-medium pr-8">{item.question}</span>
                                <svg
                                    className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="p-5 pt-0 text-[var(--color-text-muted)]">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-[var(--color-text-muted)] mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline font-medium"
                    >
                        Contact our support team
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
