'use client';

import { useState, useEffect } from 'react';

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Lifestyle Creator',
        avatar: '/testimonials/sarah.jpg',
        content: 'Collab League transformed how I work with brands. The platform made it so easy to manage multiple campaigns and the businesses I work with are always professional.',
        rating: 5,
        platform: 'Instagram'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Tech Reviewer',
        avatar: '/testimonials/michael.jpg',
        content: 'Finally, a platform that understands creators! The campaign management tools are incredible and I love how transparent everything is.',
        rating: 5,
        platform: 'YouTube'
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Marketing Director at TechCorp',
        avatar: '/testimonials/emily.jpg',
        content: 'We found amazing creators for our campaigns within days. The filtering and discovery features saved us countless hours.',
        rating: 5,
        platform: 'Business'
    },
    {
        id: 4,
        name: 'David Kim',
        role: 'Fitness Influencer',
        avatar: '/testimonials/david.jpg',
        content: 'The best platform for serious creators. I\'ve grown my business significantly since joining Collab League.',
        rating: 5,
        platform: 'TikTok'
    }
];

export function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Loved by <span className="gradient-text">Creators & Businesses</span>
                    </h2>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        Join thousands of successful partnerships.
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    {/* Cards Container */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TESTIMONIALS.slice(0, 3).map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className="card p-6 flex flex-col"
                            >
                                {/* Rating Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-[var(--color-text-muted)] flex-1 mb-6">
                                    &ldquo;{testimonial.content}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-[var(--color-text-muted)]">{testimonial.role}</div>
                                    </div>
                                    <span className="ml-auto px-2 py-1 text-xs rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
                                        {testimonial.platform}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots Navigation */}
                    <div className="flex justify-center gap-2 mt-8">
                        {[0, 1, 2].map((index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${currentIndex === index
                                        ? 'w-8 bg-[var(--color-primary)]'
                                        : 'bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
