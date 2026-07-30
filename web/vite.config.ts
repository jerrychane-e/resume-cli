import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心单独分片，保持长期缓存友好
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // recharts 体量大且仅评分页使用，独立分片按需加载
          'vendor-recharts': ['recharts'],
        },
      },
    },
  },
});
