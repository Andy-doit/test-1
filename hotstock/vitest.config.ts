import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.tsx'],
    include: [
      'src/**/*.spec.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
      'lib/**/*.spec.{ts,tsx}',
      'lib/**/*.test.{ts,tsx}',
      'hooks/**/*.spec.{ts,tsx}',
      'hooks/**/*.test.{ts,tsx}',
      'components/**/*.spec.{ts,tsx}',
      'components/**/*.test.{ts,tsx}',
      'app/**/*.spec.{ts,tsx}',
      'app/**/*.test.{ts,tsx}'
    ],
    pool: 'forks',
  },
  resolve: {
    alias: {
      // Align with tsconfig.json: "@/*" maps to project root
      '@': path.resolve(__dirname),
    },
  },
});
