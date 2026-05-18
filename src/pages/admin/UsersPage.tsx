import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAdminUsersQuery, useUpdateUserStatusMutation } from '@/features/admin/api/adminApi';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { UserStatus, AdminUser } from '@/features/admin/types';
import { cn } from '@/shared/utils/cn';

const ROLE_COLORS: Record<string, string> = {
  customer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  vendor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  admin: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  banned: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

interface ConfirmState {
  userId: string;
  userName: string;
  newStatus: UserStatus;
}

const ROLE_TABS = ['all', 'customer', 'vendor', 'admin'] as const;

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const debouncedSearch = useDebounce(search, 350);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const { data, isLoading } = useGetAdminUsersQuery({
    search: debouncedSearch || undefined,
    role: roleFilter === 'all' ? undefined : roleFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: 10,
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleRoleChange(role: string) {
    setRoleFilter(role);
    setPage(1);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value);
    setPage(1);
  }

  function requestStatusChange(user: AdminUser, newStatus: UserStatus) {
    setConfirm({ userId: user.id, userName: user.name, newStatus });
  }

  async function confirmStatusChange() {
    if (!confirm) return;
    await updateStatus({ id: confirm.userId, status: confirm.newStatus });
    setConfirm(null);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / 10)) : 1;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {data ? `${data.total} users` : 'Loading…'}
        </p>
      </div>

      {/* Confirmation banner */}
      {confirm && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Set <strong>{confirm.userName}</strong> to{' '}
            <strong className="capitalize">{confirm.newStatus}</strong>?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirm(null)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmStatusChange}
              disabled={isUpdating}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Role tabs */}
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleRoleChange(tab)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                roleFilter === tab
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search name or email…"
              aria-label="Search users"
              className="w-56 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Role</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Joined</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 rounded bg-slate-200 dark:bg-slate-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{user.name}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', ROLE_COLORS[user.role])}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_COLORS[user.status])}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{fmtDate(user.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        {user.role === 'admin' ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : (
                          <div className="flex justify-end gap-1">
                            {user.status !== 'active' && (
                              <button
                                onClick={() => requestStatusChange(user, 'active')}
                                className="rounded px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                              >
                                Activate
                              </button>
                            )}
                            {user.status === 'active' && (
                              <button
                                onClick={() => requestStatusChange(user, 'suspended')}
                                className="rounded px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              >
                                Suspend
                              </button>
                            )}
                            {user.status !== 'banned' && (
                              <button
                                onClick={() => requestStatusChange(user, 'banned')}
                                className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                Ban
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && data && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {data.total} user{data.total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
