import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// Patch mdast-util-gfm-autolink-literal: it uses a lookbehind assertion (?<=...)
// and Unicode property escapes (\p{P}, \p{S}) that crash Safari/WebKit < 16.4.
// The findEmail() function already calls previous() which validates the preceding
// character, so stripping the lookbehind from the regex is safe.
function patchSafariGfm() {
  return {
    name: 'patch-safari-gfm',
    transform(code, id) {
      if (!id.includes('mdast-util-gfm-autolink-literal')) return
      return {
        code: code.replace(
          '/(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)/gu',
          '/([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)/g'
        ),
        map: null,
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    patchSafariGfm(),
    react(),
    svgr(),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
    visualizer({ open: false, filename: 'dist/stats.html', gzipSize: true }),
    sentryVitePlugin({
      org: "medpal-project",
      project: "medpal"
    }),
  ],
  // Exclude from esbuild pre-bundling so patchSafariGfm runs in dev mode too
  optimizeDeps: {
    exclude: ['mdast-util-gfm-autolink-literal'],
  },
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

    sourcemap: true
  },
})
