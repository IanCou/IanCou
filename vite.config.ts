import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/__metrics': {
        target: 'https://metrics.iancoutinho.net',
        changeOrigin: true,
        rewrite: () => '/v1/overview.json',
      },
    },
  },
})
