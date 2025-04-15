import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['wagmi', 'viem'],
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    // Only use preprocessorOptions if you're using .scss files
    // If using variables.css instead of variables.scss, you don't need this
    /* 
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`,
      },
    },
    */
  },
  // Remove assetsInclude for CSS files since they should be processed, not included as assets
});