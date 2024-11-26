import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pokemon-tcg-marketplace/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'chart-vendor': ['@nivo/core', '@nivo/line', '@nivo/pie', 'recharts'],
          'payment-vendor': ['@paypal/react-paypal-js', '@stripe/stripe-js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
