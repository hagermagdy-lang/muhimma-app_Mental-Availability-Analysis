import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/muhimma-app_Mental-Availability-Analysis/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/ai': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/openai/v1/chat/completions',
      }
    }
  }
})
