import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { watchSchema, WatchInput } from '../schemas/watch.schema';
import { useAuth } from '../store/auth';
import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface Watch {
  uid: string;
  code: string;
  createdAt: string;
  latestPrice?: number;
  yieldPercent?: number;
}

export const WatchlistPage: React.FC = () => {
  const { clearToken, token } = useAuth();
  const queryClient = useQueryClient();
  const uid = token ? jwtDecode<{ sub: string }>(token).sub : '';

  const fetchWatches = async (): Promise<Watch[]> => {
    const res = await fetch(`/users/${uid}/watches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('failed');
    return res.json();
  };

  const { data: watches = [] } = useQuery({
    queryKey: ['watches', uid],
    queryFn: fetchWatches,
    enabled: !!uid,
    refetchInterval: 30000,
  });

  const addMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch(`/users/${uid}/watches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error();
      return res.json() as Promise<Watch>;
    },
    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: ['watches', uid] });
      const prev = queryClient.getQueryData<Watch[]>(['watches', uid]) || [];
      const optimistic: Watch = {
        uid,
        code,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData(['watches', uid], [...prev, optimistic]);
      return { prev };
    },
    onError: (_e, _c, ctx) => {
      if (ctx) queryClient.setQueryData(['watches', uid], ctx.prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['watches', uid] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (code: string) => {
      await fetch(`/users/${uid}/watches`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
    },
    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: ['watches', uid] });
      const prev = queryClient.getQueryData<Watch[]>(['watches', uid]) || [];
      queryClient.setQueryData(
        ['watches', uid],
        prev.filter((w) => w.code !== code),
      );
      return { prev };
    },
    onError: (_e, _c, ctx) => {
      if (ctx) queryClient.setQueryData(['watches', uid], ctx.prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['watches', uid] }),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WatchInput>({ resolver: zodResolver(watchSchema) });

  const onAdd = handleSubmit(async ({ code }) => {
    await addMutation.mutateAsync(code);
    toast.success('追加しました');
    reset();
    setModalOpen(false);
  });

  const columns: ColumnDef<Watch>[] = [
    { accessorKey: 'code', header: '銘柄コード' },
    { accessorKey: 'createdAt', header: '登録日' },
    {
      accessorKey: 'latestPrice',
      header: '最新株価',
      cell: ({ getValue }) =>
        getValue<number | undefined>()?.toLocaleString() ?? '-',
    },
    {
      accessorKey: 'yieldPercent',
      header: '利回り%',
      cell: ({ getValue }) => {
        const v = getValue<number | undefined>();
        return v !== undefined ? v.toFixed(2) : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <button
          className="text-blue-500"
          onClick={() => removeMutation.mutate(row.original.code)}
        >
          削除
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: watches,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Watchlist</h2>
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          + Add
        </button>
        <button
          onClick={clearToken}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
      <table className="w-full table-auto border-collapse mb-4">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
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

      {modalOpen && (
        <form onSubmit={onAdd} className="space-y-2">
          <input
            className="border p-1 w-full"
            placeholder="Code"
            {...register('code')}
          />
          {errors.code && (
            <p className="text-red-600 text-sm">{errors.code.message}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white rounded px-3 py-1"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 bg-gray-300 rounded px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
