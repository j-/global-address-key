import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: '/global-address-key',
  plugins: [react(), nodePolyfills()],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
    port: 3080,
  },
});
