// frontend/app/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Vite がこの関数を呼ぶときに必ず出る！
  console.log('🐶 proxy config loaded', { command, mode });

  return {
    server: {
      port: 5173,
      proxy: {
        '/auth': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        '/users': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    envPrefix: ['NEXT_PUBLIC_'], // preview-only
  };
});
