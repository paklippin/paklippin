'use client';
import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon } from 'lucide-react';

type User = {
  id: number; name: string; email: string; phone: string;
  created_at: string; order_count: number; total_spent: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/users', { cache: 'no-store' });
        const json = await res.json();
        setUsers(Array.isArray(json.users) ? json.users : []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const filtered = users.filter((u) =>
    !search.trim() ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Users</h1>
        <p className="text-sm text-text-secondary">{users.length} registered customer{users.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="relative max-w-[400px] mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-border focus:border-brand-accent outline-none text-sm" />
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading users...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <UsersIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-text-secondary">No users found.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-brand-secondary text-left text-xs uppercase tracking-wider text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Orders</th>
                <th className="px-4 py-3 font-semibold">Total Spent</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-brand-secondary/40">
                  <td className="px-4 py-3 text-sm font-semibold">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{u.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm">{u.order_count}</td>
                  <td className="px-4 py-3 font-bold text-brand-accent text-sm">Rs {u.total_spent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-PK') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
