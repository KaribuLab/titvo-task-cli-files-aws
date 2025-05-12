import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.spec.ts']
  },
  resolve: {
    alias: {
        '@auth': path.resolve(__dirname, './auth/src'),
        '@titvo/auth': path.resolve(__dirname, './auth'),
        '@shared': path.resolve(__dirname, './shared/src'),
        '@titvo/shared': path.resolve(__dirname, './shared'),
        '@aws': path.resolve(__dirname, './lib/aws/src'),
        '@titvo/aws': path.resolve(__dirname, './lib/aws'),
        '@trigger': path.resolve(__dirname, './trigger/src'),
        '@titvo/trigger': path.resolve(__dirname, './trigger'),
        '@infrastructure': path.resolve(__dirname, './src/infrastructure')
    }
  }
}) 