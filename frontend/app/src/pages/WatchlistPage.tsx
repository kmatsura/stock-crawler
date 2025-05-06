import React from 'react';
import { useAuth } from '../store/auth';
import toast from 'react-hot-toast';

export const WatchlistPage: React.FC = () => {
  const { clearToken } = useAuth();

  const handleLogout = () => {
    clearToken();
    toast('ログアウトしました');
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">📝 Watchlist（ダミー）</h2>
      <button
        onClick={handleLogout}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        ログアウト
      </button>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">銘柄コード</th>
            <th className="border px-2 py-1 text-left">銘柄名</th>
            <th className="border px-2 py-1 text-left">最新価格</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">7203</td>
            <td className="border px-2 py-1">トヨタ自動車</td>
            <td className="border px-2 py-1">¥2,000</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">9984</td>
            <td className="border px-2 py-1">ソフトバンクグループ</td>
            <td className="border px-2 py-1">¥8,000</td>
          </tr>
          {/* ここにさらにダミーデータを追加できます */}
        </tbody>
      </table>
    </div>
  );
};
