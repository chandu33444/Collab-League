'use client';

type Role = 'creator' | 'business';

interface RoleLoginTabsProps {
    activeRole: Role;
    onRoleChange: (role: Role) => void;
}

export function RoleLoginTabs({ activeRole, onRoleChange }: RoleLoginTabsProps) {
    return (
        <div className="flex bg-[var(--color-bg)] rounded-lg p-1 mb-6 border border-[var(--color-border)]">
            <button
                type="button"
                onClick={() => onRoleChange('creator')}
                className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${activeRole === 'creator'
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
            >
                Creator
            </button>
            <button
                type="button"
                onClick={() => onRoleChange('business')}
                className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${activeRole === 'business'
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
            >
                Business
            </button>
        </div>
    );
}
