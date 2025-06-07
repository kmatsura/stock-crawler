import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../store/auth';
import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';

interface Watch {
  uid: string;
  code: string;
  createdAt: string;
}

export const WatchlistPage: React.FC = () => {
  const { token, clearToken } = useAuth();
  const uid = token ? (jwtDecode<{ sub: string }>(token).sub as string) : '';
  const queryClient = useQueryClient();

  const { data: watches = [] } = useQuery({
    queryKey: ['watches', uid],
    queryFn: async () => {
      const res = await fetch(`/users/${uid}/watches`);
      if (!res.ok) throw new Error('fetch failed');
      return (await res.json()) as Watch[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch(`/users/${uid}/watches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error('add failed');
      return (await res.json()) as Watch;
    },
    onMutate: async (code: string) => {
      await queryClient.cancelQueries({ queryKey: ['watches', uid] });
      const prev = queryClient.getQueryData<Watch[]>(['watches', uid]) ?? [];
      queryClient.setQueryData(
        ['watches', uid],
        [...prev, { uid, code, createdAt: new Date().toISOString() }],
      );
      return { prev };
    },
    onError: (_err, _code, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['watches', uid], ctx.prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['watches', uid] }),
  });

  const delMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch(`/users/${uid}/watches/${code}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('delete failed');
    },
    onMutate: async (code: string) => {
      await queryClient.cancelQueries({ queryKey: ['watches', uid] });
      const prev = queryClient.getQueryData<Watch[]>(['watches', uid]) ?? [];
      queryClient.setQueryData(
        ['watches', uid],
        prev.filter((w) => w.code !== code),
      );
      return { prev };
    },
    onError: (_e, _code, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['watches', uid], ctx.prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['watches', uid] }),
  });

  const columns = useMemo<ColumnDef<Watch>[]>(
    () => [
      { accessorKey: 'code', header: 'Code' },
      { accessorKey: 'createdAt', header: 'Added' },
      {
        id: 'actions',
        cell: ({ row }) => (
          <button
            className="text-red-500"
            onClick={() => delMutation.mutate(row.original.code)}
          >
            Delete
          </button>
        ),
      },
    ],
    [delMutation],
  );

  const table = useReactTable({
    data: watches,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [showAdd, setShowAdd] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ code: string }>();

  const onSubmit = handleSubmit((data) => {
    addMutation.mutate(data.code);
    reset();
    setShowAdd(false);
  });

  const handleLogout = () => {
    clearToken();
    toast('ログアウトしました');
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 shadow rounded-lg">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">📝 Watchlist</h2>
        <div>
          <button
            onClick={() => setShowAdd(true)}
            className="mr-2 px-4 py-1 bg-blue-500 text-white rounded"
          >
            + Add
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <table className="w-full table-auto border-collapse mb-4">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="bg-gray-100">
              {hg.headers.map((h) => (
                <th key={h.id} className="border px-2 py-1 text-left">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showAdd && (
        <form onSubmit={onSubmit} className="space-x-2">
          <input
            {...register('code')}
            placeholder="code"
            className="border px-2 py-1"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(false)}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};
