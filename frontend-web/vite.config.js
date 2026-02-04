import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '@components': path.resolve(__dirname, './src/components/'),
      '@config': path.resolve(__dirname, './src/config/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@routes': path.resolve(__dirname, './src/routes/'),
      '@middleware': path.resolve(__dirname, './src/middleware/'),
      '@store': path.resolve(__dirname, './src/store/'),
      '@hooks': path.resolve(__dirname, './src/hooks/'),
      '@services': path.resolve(__dirname, './src/services/'),
      '@mockups': path.resolve(__dirname, './src/mockups/'),
    },
  },
})
