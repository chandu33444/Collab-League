import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
                <a href="/" className="inline-flex items-center justify-center">
                    <Image
                        src="/Logo/logo-v3.png"
                        alt="Collab League"
                        width={240}
                        height={80}
                        className="h-20 w-auto"
                        priority
                    />
                </a>
            </div>

            {/* Card */}
            <div className="card p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">{title}</h1>
                    <p className="text-[var(--color-text-muted)]">{subtitle}</p>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    );
}
