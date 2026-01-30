import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: readonly { readonly value: string; readonly label: string }[] | { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                className={`w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg
          text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
          transition-all duration-200 ${className}`}
                {...props}
            >
                <option value="">Select {label || 'option'}...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
