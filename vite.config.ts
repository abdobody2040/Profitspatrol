import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),

    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files > 1KB
    }),

    // Brotli compression (smaller, preferred by modern browsers + Vercel)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),

    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Profits Patrol: Future Founders',
        short_name: 'Profits Patrol',
        description: 'Learn business, earn money, and build your empire!',
        theme_color: '#FFC800',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['education', 'finance', 'games'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Precache the app shell
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Max file size to precache (5MB — Phaser is large)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          // Google Fonts stylesheets — CacheFirst, 1 year
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts files — CacheFirst, 1 year
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // App static assets (JS, CSS chunks) — StaleWhileRevalidate
          {
            urlPattern: /\/assets\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Remote images — CacheFirst, 60 days
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Supabase API — NetworkFirst, 30s timeout
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 30,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

  server: {
    host: true,
    port: 5000,
    allowedHosts: true,
    hmr: false
  },

  build: {
    // Use Terser for better dead-code elimination in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,       // Remove remaining console.* calls
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info', 'console.warn'],
        passes: 2,                // Two compression passes for better reduction
      },
      mangle: { safari10: true },
      format: { comments: false },
    },
    // Target modern browsers — smaller output, no legacy polyfills
    target: 'es2020',
    // Inline assets smaller than 4KB as base64
    assetsInlineLimit: 4096,
    // Generate sourcemaps for production error tracking (kept separate from bundles)
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Named entry for better debugging in CDN logs
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          // ── Vendor: React core ───────────────────────────────────────────
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }
          // ── Vendor: Phaser (game engine — very large, isolated) ──────────
          if (id.includes('node_modules/phaser')) {
            return 'vendor-phaser';
          }
          // ── Vendor: Google AI ────────────────────────────────────────────
          if (id.includes('node_modules/@google/genai')) {
            return 'vendor-genai';
          }
          // ── Vendor: Stripe ───────────────────────────────────────────────
          if (id.includes('node_modules/@stripe/')) {
            return 'vendor-stripe';
          }
          // ── Vendor: Recharts (only used in admin dashboards) ─────────────
          if (id.includes('node_modules/recharts') ||
              id.includes('node_modules/d3-')) {
            return 'vendor-recharts';
          }
          // ── Vendor: i18n ─────────────────────────────────────────────────
          if (id.includes('node_modules/i18next') ||
              id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
          // ── Vendor: UI utilities ─────────────────────────────────────────
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/howler') ||
              id.includes('node_modules/canvas-confetti')) {
            return 'vendor-utils';
          }
          // ── Vendor: Supabase ─────────────────────────────────────────────
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          // ── Feature: Game components ─────────────────────────────────────
          if (id.includes('/features/game/')) {
            return 'chunk-games';
          }
          // ── Feature: Education ───────────────────────────────────────────
          if (id.includes('/features/education/')) {
            return 'chunk-education';
          }
          // ── Feature: Admin & Dashboards ──────────────────────────────────
          if (id.includes('/features/admin/') ||
              id.includes('/features/dashboard/') ||
              id.includes('/features/social/')) {
            return 'chunk-admin';
          }
          // ── Feature: Ventures & HQ ───────────────────────────────────────
          if (id.includes('/features/venture/') ||
              id.includes('/features/hq/') ||
              id.includes('/features/tank/') ||
              id.includes('/features/scenarios/')) {
            return 'chunk-venture';
          }
          // ── Feature: Marketing pages ─────────────────────────────────────
          if (id.includes('/features/marketing/')) {
            return 'chunk-marketing';
          }
          // ── Feature: Library ─────────────────────────────────────────────
          if (id.includes('/features/library/')) {
            return 'chunk-library';
          }
        },
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // ✅ FIX: @sentry/react is an optional peer dep (not installed).
      // Vite 7 import-analysis fails even on dynamic imports inside try/catch.
      // Alias to a no-op stub so the dev server and build succeed.
      // When you install @sentry/react for real: remove this alias.
      '@sentry/react': path.resolve(__dirname, './src/stubs/sentry-react.ts'),
    },
  },
});
