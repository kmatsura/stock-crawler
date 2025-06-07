'use client';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RealLoginForm } from './RealLoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const isPreview = import.meta.env.NEXT_PUBLIC_ENV === 'preview'; // preview-only

  // preview-only: mock login handler
  const handlePreviewLogin = () => {
    const payload = {
      sub: 'preview-user',
      name: 'Preview User',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    };
    const base64url = (obj: unknown) =>
      btoa(JSON.stringify(obj))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    const mockJwt = `${base64url({ alg: 'none', typ: 'JWT' })}.${base64url(payload)}.`;
    localStorage.setItem('token', mockJwt);
    navigate('/app/watchlist');
  };

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/app/watchlist');
  }, [navigate]);

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto py-16">
      <Toaster position="top-center" reverseOrder={false} />
      {isPreview && (
        <button
          onClick={handlePreviewLogin}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
        >
          🔑 プレビュー用にログイン
        </button>
      )}
      {!isPreview && (
        <>
          <h2 className="text-2xl mb-4 text-center">ログイン</h2>
          <RealLoginForm />
        </>
      )}
    </div>
  );
};
