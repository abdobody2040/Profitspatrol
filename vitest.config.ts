/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts', './tests/setup.ts'],
    css: true,
    // ✅ Mock optional peer deps that aren't installed in the test environment
    server: {
      deps: {
        // @sentry/react is an optional dep used via dynamic import inside a try/catch.
        // Vitest's transform step still tries to resolve it — stub it out.
        inline: [],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Stub @sentry/react so dynamic import in sentry.ts never throws
      '@sentry/react': path.resolve(__dirname, './tests/__mocks__/@sentry/react.ts'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

