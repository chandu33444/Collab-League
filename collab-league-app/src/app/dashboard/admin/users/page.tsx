import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const metadata = {
    title: 'User Management | Admin',
};

async function getUsers() {
    const supabase = await createClient();

    // Fetch profiles joined with role-specific tables involves complex querying.
    // For simplicity MVP: Fetch profiles and then fetch details or just use profiles info.
    // Ideally, we'd have a view for this. Let's just list profiles for now.

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, role, created_at, updated_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }

    // Enrich with names from specific tables
    const users = await Promise.all(profiles.map(async (p) => {
        let details: any = {};
        if (p.role === 'creator') {
            const { data } = await supabase.from('creators').select('full_name, is_active, is_public').eq('id', p.id).single();
            details = data || {};
        } else if (p.role === 'business') {
            const { data } = await supabase.from('businesses').select('brand_name, is_verified').eq('id', p.id).single();
            details = { full_name: data?.brand_name, ...data };
        } else if (p.role === 'admin') {
            details = { full_name: 'System Admin' };
        }

        return {
            ...p,
            name: details.full_name || 'Unknown',
            isActive: details.is_active !== false, // Default true unless explicitly false (businesses lack is_active currently in schema? Need to check)
            details
        };
    }));

    return users;
}

export default async function UsersManagementPage() {
    const users = await getUsers();

    async function toggleStatus(userId: string, currentStatus: boolean, role: string) {
        'use server';
        const supabase = await createClient();
        const table = role === 'creator' ? 'creators' : 'businesses'; // Businesses might need is_active col added? 
        // Checking schema: Creators has is_active. Businesses does NOT have is_active in migration 002.
        // We should add is_active to businesses if we want to ban them using that flag.
        // For now, let's only support toggling creators.

        if (role === 'creator') {
            await supabase.from('creators').update({ is_active: !currentStatus }).eq('id', userId);
            revalidatePath('/dashboard/admin/users');
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--color-text)]">User Management</h1>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-[var(--color-surface-hover)]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-[var(--color-text)]">{user.name}</div>
                                        <div className="text-xs text-[var(--color-text-muted)] font-mono">{user.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${user.role === 'creator' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'creator' ? (
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${user.isActive
                                                    ? 'bg-green-500/10 text-green-600'
                                                    : 'bg-red-500/10 text-red-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {user.isActive ? 'Active' : 'Banned'}
                                            </span>
                                        ) : (
                                            <span className="text-[var(--color-text-muted)]">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-text-muted)]">
                                        {new Date(user.created_at || '').toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.role === 'creator' && (
                                            <form action={async () => {
                                                'use server';
                                                await toggleStatus(user.id, user.isActive, user.role);
                                            }}>
                                                <button className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${user.isActive
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    }`}>
                                                    {user.isActive ? 'Ban User' : 'Activate'}
                                                </button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
