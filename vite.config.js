import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        secure: false,
      },
      '/api/ai': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/openai/v1/chat/completions',
      }
    }
  }
})
