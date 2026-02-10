import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        process: true,
        global: true,
      },
      protocolImports: true,
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
    },
  },

  define: {
    global: 'globalThis',
    'process.env': JSON.stringify({}),
  },

  // Expose environment variables to the client
  envPrefix: 'VITE_',

  optimizeDeps: {
    include: [
      'buffer',
      'process',
      '@tonconnect/ui-react',
      '@ton/ton',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // ← Важно: polyfills грузится ПЕРВЫМ
        manualChunks: (id) => {
          if (id.includes('buffer') || id.includes('process')) {
            return 'polyfills'; // ← TON ждёт Buffer из этого чанка
          }
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@ton') || id.includes('tonconnect')) {
              return 'ton-vendor'; // ← TON после polyfills
            }
            if (id.includes('framer-motion') || id.includes('recharts') || id.includes('lucide')) {
              return 'ui-vendor';
            }
          }
        },
        // ← Заставляем polyfills грузиться первым
        inlineDynamicImports: false,
      },
    },
    // ← Увеличиваем лимит чанка, чтобы Vercel не ругался
    chunkSizeWarningLimit: 1600,
  },
})