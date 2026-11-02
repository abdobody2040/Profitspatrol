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

    // Asynchronous non-critical CSS loader to eliminate render-blocking CSS
    {
      name: 'async-css-loader',
      transformIndexHtml(html: string) {
        return html.replace(
          /<link rel="stylesheet" crossorigin href="([^"]*chunk-games[^"]*)">/g,
          '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" crossorigin href="$1"></noscript>'
        );
      }
    },

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
        // Precache only the essential app shell (no images, audio, or Phaser in precache)
        globPatterns: ['**/*.{js,css,html}'],
        globIgnores: ['**/vendor-phaser-*.js', '**/chunk-education-*.js', '**/chunk-games-*.js'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
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
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
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
    modulePreload: {
      polyfill: false,
      resolveDependencies(filename, deps) {
        // Exclude heavy lazy chunks from preloading into index.html
        return deps.filter(dep =>
          !dep.includes('phaser') &&
          !dep.includes('recharts') &&
          !dep.includes('education') &&
          !dep.includes('games') &&
          !dep.includes('admin') &&
          !dep.includes('curriculum') &&
          !dep.includes('dashboard') &&
          !dep.includes('venture') &&
          !dep.includes('social') &&
          !dep.includes('library')
        );
      }
    },
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
          // ── Vendor: Zustand State Management ────────────────────────────
          if (id.includes('node_modules/zustand')) {
            return 'vendor-state';
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
          // ── Shared Store / State ─────────────────────────────────────────
          if (id.includes('/src/store/')) {
            return 'chunk-store';
          }
          // ── Data: Heavy curriculum dataset (200 lessons) ─────────────────
          if (id.includes('/features/education/data/')) {
            return 'chunk-curriculum-data';
          }
          // ── Data: Arcade Games Registry dataset ──────────────────────────
          if (id.includes('/features/games/data/')) {
            return 'chunk-games-data';
          }
          // ── Feature: Game components ─────────────────────────────────────
          if ((id.includes('/features/game/') || id.includes('/features/games/')) && !id.includes('/data/')) {
            return 'chunk-games';
          }
          // ── Feature: Education ───────────────────────────────────────────
          if (id.includes('/features/education/') && !id.includes('/data/')) {
            return 'chunk-education';
          }
          // ── Feature: Admin ───────────────────────────────────────────────
          if (id.includes('/features/admin/')) {
            return 'chunk-admin';
          }
          // ── Feature: Dashboards ──────────────────────────────────────────
          if (id.includes('/features/dashboard/')) {
            return 'chunk-dashboard';
          }
          // ── Feature: Social ──────────────────────────────────────────────
          if (id.includes('/features/social/')) {
            return 'chunk-social';
          }
          // ── Feature: Ventures & HQ ───────────────────────────────────────
          if ((id.includes('/features/venture/') ||
              id.includes('/features/hq/') ||
              id.includes('/features/tank/') ||
              id.includes('/features/scenarios/')) && !id.includes('/data/')) {
            return 'chunk-venture';
          }
          // ── Feature: Marketing pages ─────────────────────────────────────
          if (id.includes('/features/marketing/')) {
            return 'chunk-marketing';
          }
          // ── Feature: Library ─────────────────────────────────────────────
          if (id.includes('/features/library/') && !id.includes('/data/')) {
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
