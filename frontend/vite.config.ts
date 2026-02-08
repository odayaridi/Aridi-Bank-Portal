// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // frontend dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // NestJS backend
        changeOrigin: true,
        secure: false, // because we are using HTTP
        // rewrite: path => path.replace(/^\/api/, '') // optional if backend expects no /api prefix
      },
    },
  },
});
