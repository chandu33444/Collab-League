export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>

            <div className="card p-8 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                    <p className="text-[var(--color-text-muted)]">
                        Additional account settings will be available in future updates.
                    </p>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        Email notification preferences (coming soon)
                    </p>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold mb-2">Privacy</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        Privacy and data management settings (coming soon)
                    </p>
                </div>
            </div>
        </div>
    );
}
