'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Logo/logo-v3.png"
            alt="Collab League"
            width={50}
            height={50}
            className="h-12 w-auto"
            priority
          />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Collab League
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm font-medium"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn btn-primary btn-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[var(--color-text)] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] py-4 px-6 space-y-4 animate-fade-in">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="block text-[var(--color-text-muted)] hover:text-[var(--color-text)] py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
            <Link
              href="/login"
              className="block text-center py-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="block text-center py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
