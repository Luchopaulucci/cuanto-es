import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['og.png', 'favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '¿Cuánto es?',
        short_name: '¿Cuánto es?',
        description:
          'Adiviná cuánto pesa, cuánto mide o en qué año pasó, deslizando tu número. Preguntas raras, argentinas y picantes. De 2 a 8 jugadores en un solo celu: el que queda más cerca suma.',
        theme_color: '#1e1446',
        background_color: '#1e1446',
        display: 'standalone',
        lang: 'es',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webmanifest}'],
      },
    }),
  ],
  server: {
    host: true,
    port: 4721,
  },
  preview: {
    host: true,
    port: 4721,
  },
})
