export default function DashboardPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">Active Collaborations</h3>
                    <p className="text-3xl font-bold text-[var(--color-primary)]">0</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
                    <p className="text-3xl font-bold text-[var(--color-secondary)]">0</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
                    <p className="text-3xl font-bold text-green-500">$0.00</p>
                </div>
            </div>
        </div>
    );
}
