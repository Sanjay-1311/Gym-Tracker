import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'modules',
  },

  server: {
    proxy: {
      // Any request starting with /api will be forwarded
      '/api': {
        target: 'http://localhost:5000', // Your Express server's address
        changeOrigin: true,
      },
    },
  },
});