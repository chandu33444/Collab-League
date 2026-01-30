import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg
          text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none 
          focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-200 ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
