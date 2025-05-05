import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Prevent multiple chunks with the same code
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Create a chunk for each polkadot package to avoid duplicates
            if (id.includes('@polkadot')) {
              return `polkadot-${id.split('@polkadot/')[1].split('/')[0]}`;
            }
          }
        },
      },
    },
  },
});
