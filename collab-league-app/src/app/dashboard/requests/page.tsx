'use client';

import { getIncomingRequests } from '@/app/actions/requests';
import { RequestCard } from '@/components/requests';
import { useState, useEffect } from 'react';

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        const data = await getIncomingRequests();
        setRequests(data);
        setLoading(false);
    }

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(r => r.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)]">Collaboration Requests</h1>
                <p className="text-[var(--color-text-muted)] mt-2">
                    Review and respond to collaboration opportunities
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-[var(--color-border)]">
                {[
                    { value: 'all', label: 'All' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'accepted', label: 'Accepted' },
                    { value: 'rejected', label: 'Rejected' }
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value as any)}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${filter === tab.value
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                            {filter === 'all' ? 'No Requests Yet' : `No ${filter} Requests`}
                        </h3>
                        <p className="text-[var(--color-text-muted)]">
                            {filter === 'all'
                                ? 'You haven\'t received any collaboration requests yet. Make sure your profile is active and public!'
                                : `You don't have any ${filter} requests at the moment.`
                            }
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <RequestCard
                            key={request.id}
                            request={request}
                            viewerRole="creator"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
