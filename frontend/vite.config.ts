import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: [
        "**/*",
      ],
      manifest: {
        "theme_color": "#f69435",
        "background_color": "#f69435",
        "display": "standalone",
        "scope": "/",
        "start_url": "/",
        "short_name": "Profile sync",
        "description": "Profile sync pwa",
        "name": "Profile sync",
        "icons": [
          {
            "src": "/vite.svg",
            "sizes": "192x192",
            "type": "image/svg"
          },
        ],
      }
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    watch: false
  },
})
