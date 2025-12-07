import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        // Proxy API requests to the backend server
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [react()],
    // SECURITY: Only expose VITE_ prefixed environment variables to client
    // Never expose API keys or secrets to the client bundle
    define: {
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'GaragePilot'),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3001'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'i18n-vendor': ['i18next', 'react-i18next'],
          }
        }
      }
    }
  };
});
