export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            {/* Sidebar Placeholder */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] hidden md:block">
                <div className="p-6">
                    <div className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                        Collab League
                    </div>
                </div>
                <nav className="px-4 py-2 space-y-2">
                    <div className="px-2 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white">
                        Dashboard
                    </div>
                    <div className="px-2 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Messages
                    </div>
                    <div className="px-2 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        Settings
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="md:ml-64">
                {/* Header */}
                <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] opacity-20"></div>
                    </div>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
