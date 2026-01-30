import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                className={`w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg
          text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
          transition-all duration-200 resize-vertical min-h-[100px] ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
