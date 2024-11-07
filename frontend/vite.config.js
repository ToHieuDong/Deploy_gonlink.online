import dotenv from 'dotenv';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
    'process.env': process.env
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.gonlink.online', // Địa chỉ của backend server
        changeOrigin: true,
        secure: true // Đảm bảo proxy sử dụng HTTPS
      }
    }
  }
})
