#!/bin/bash
# This script performs a complete cleanup and reinstallation to fix dependency issues

# Step 1: Save the new package.json file
echo "Creating new package.json file..."
cat > package.json << 'EOL'
{
  "name": "polka-evm-lib",
  "version": "0.1.0",
  "description": "A frontend React library to interact with EVM smart contracts on Moonbeam/Polkadot.",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "author": "Your Name",
  "license": "MIT",
  "private": false,
  "dependencies": {
    "@polkadot/api": "15.9.2",
    "@polkadot/api-contract": "15.9.2",
    "@polkadot/extension-dapp": "0.58.8",
    "@polkadot/keyring": "12.6.2",
    "@polkadot/util": "12.6.2",
    "@polkadot/util-crypto": "12.6.2",
    "@rainbow-me/rainbowkit": "^2.2.4",
    "@tanstack/react-query": "^5.72.2",
    "ethers": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "viem": "^2.26.3",
    "wagmi": "^2.14.16"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/css": "^0.0.38",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.1.3",
    "typescript": "^5.8.3",
    "vite": "^6.2.6"
  }
}
EOL

# Step 2: Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Step 3: Remove node_modules and package-lock.json
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Step 4: Install dependencies
echo "Installing dependencies..."
npm install

# Step 5: Create or update vite.config.ts
echo "Updating vite.config.ts..."
cat > vite.config.ts << 'EOL'
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
EOL

echo "Done! Try running npm run dev now."