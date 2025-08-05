import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Resume-Filter/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Create 404.html as a copy of index.html
        entryFileNames: assetInfo => assetInfo.name === '404' ? '404.html' : 'assets/[name]-[hash].js',
      }
    }
  }
});
