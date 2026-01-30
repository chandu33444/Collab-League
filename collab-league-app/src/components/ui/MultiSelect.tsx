import React, { useState } from 'react';

interface MultiSelectProps {
    label?: string;
    options: { value: string; label: string }[];
    value: string[];
    onChange: (selected: string[]) => void;
    error?: string;
    placeholder?: string;
    maxSelections?: number;
}

export function MultiSelect({
    label,
    options,
    value = [],
    onChange,
    error,
    placeholder = 'Select options...',
    maxSelections
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter(v => v !== optionValue));
        } else {
            if (maxSelections && value.length >= maxSelections) return;
            onChange([...value, optionValue]);
        }
    };

    const getSelectedLabels = () => {
        return value.map(v => options.find(o => o.value === v)?.label).filter(Boolean).join(', ');
    };

    return (
        <div className="w-full relative">
            {label && (
                <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg
            text-left text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
            transition-all duration-200 flex justify-between items-center"
                >
                    <span className={value.length === 0 ? 'text-[var(--color-text-muted)]' : ''}>
                        {value.length === 0 ? placeholder : getSelectedLabels()}
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute z-20 w-full mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] 
              rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {options.map((option) => {
                                const isSelected = value.includes(option.value);
                                const isDisabled = !isSelected && maxSelections !== undefined && value.length >= maxSelections;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => !isDisabled && toggleOption(option.value)}
                                        disabled={isDisabled}
                                        className={`w-full px-4 py-2 text-left hover:bg-[var(--color-bg)] transition-colors
                      flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                      ${isSelected ? 'bg-[var(--color-bg)]' : ''}`}
                                    >
                                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center
                      ${isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border)]'}`}
                                        >
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-[var(--color-text)]">{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}

            {maxSelections && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {value.length}/{maxSelections} selected
                </p>
            )}
        </div>
    );
}
