import React from 'react';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        positive: boolean;
    };
    className?: string;
}

export function StatsCard({ title, value, icon, trend, className = '' }: StatsCardProps) {
    return (
        <div className={`card p-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[var(--color-text-muted)] text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-2 text-[var(--color-text)]">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 font-medium flex items-center gap-1 ${trend.positive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                            <span>{trend.positive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
