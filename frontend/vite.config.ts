import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_URL': JSON.stringify(process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api'),
  }
})
