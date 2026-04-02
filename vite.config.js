import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/datagolf': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/weather':  { target: 'http://localhost:3000', changeOrigin: true },
      '/api/chat':     { target: 'http://localhost:3000', changeOrigin: true },
      '/api': {
        target: 'https://feeds.datagolf.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/weather': {
        target: 'https://api.open-meteo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weather/, '')
      }
    }
  }
})