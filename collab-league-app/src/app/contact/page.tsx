'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components/landing';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <Navbar />
            <main className="pt-24 pb-16 px-6">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                        Get in <span className="gradient-text">Touch</span>
                    </h1>

                    <p className="text-center text-[var(--color-text-muted)] mb-12">
                        Have questions? We&apos;d love to hear from you. Send us a message and
                        we&apos;ll respond as soon as possible.
                    </p>

                    {submitted ? (
                        <div className="card text-center py-12">
                            <svg className="w-16 h-16 text-[var(--color-success)] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                            <p className="text-[var(--color-text-muted)]">
                                Thank you for reaching out. We&apos;ll get back to you soon.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="card space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="input"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="input min-h-[150px] resize-y"
                                    placeholder="Tell us more..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary btn-md w-full"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}

                    <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                        <div className="card">
                            <svg className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-[var(--color-text-muted)]">hello@collableague.com</p>
                        </div>
                        <div className="card">
                            <svg className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm text-[var(--color-text-muted)]">San Francisco, CA</p>
                        </div>
                        <div className="card">
                            <svg className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-[var(--color-text-muted)]">24/7 Support</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
