import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '../schemas/login.schema';
import { useAuth } from '../store/auth';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setToken = useAuth((s) => s.setToken);

  // react-hook-form + zod の組み合わせ
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      if (!res.ok) {
        throw new Error(`ステータス ${res.status}`);
      }
      const { access_token } = await res.json();
      setToken(access_token);           // Zustand + localStorage に保存
      toast.success('ログイン成功！');   // 成功トースト
      navigate('/app/watchlist');       // 遷移先（例）
    } catch (err) {
      console.error(err);
      toast.error('ログインに失敗しました');
    }
  };

  const handlePreviewLogin = () => {
    setToken('preview-token');
    navigate('/app/watchlist');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow-lg rounded-lg">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl mb-4 text-center">ログイン</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isSubmitting ? '送信中…' : 'ログイン'}
        </button>
      </form>
      <button
        type="button"
        onClick={handlePreviewLogin}
        className="mt-4 w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        プレビュー用にログイン
      </button>
    </div>
  );
};
