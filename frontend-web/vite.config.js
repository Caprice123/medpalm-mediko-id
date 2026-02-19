import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
    visualizer({ open: false, filename: 'dist/stats.html', gzipSize: true }),
  ],
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-blocknote': [
            '@blocknote/core', '@blocknote/react', '@blocknote/mantine', '@blocknote/xl-docx-exporter',
            '@tiptap/react', '@tiptap/starter-kit', '@tiptap/extensions',
            '@mantine/core', '@mantine/hooks', '@mantine/dates',
          ],
          'vendor-editor': ['docx', 'katex'],
          'vendor-misc': ['axios', 'redux', '@reduxjs/toolkit', 'react-redux', 'formik', 'yup'],
        },
      },
    },
  },
})
