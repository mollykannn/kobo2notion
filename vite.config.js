import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import eslintPlugin from 'vite-plugin-eslint'
import StylelintPlugin from 'vite-plugin-stylelint'
import postcssNested from 'postcss-nested'
import postcssPresetEnv from 'postcss-preset-env'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import presetWind from '@unocss/preset-wind'
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          plugin: ['vue', 'sql.js'],
        },
      },
    },
  },
  define: {
    'process.env': process.env,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        sourcemap: true,
      },
      mode: 'development',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kobo2Notion',
        short_name: 'Kobo2Notion',
        description: 'Export Kobo Book List and Hightlight to Notion.',
        theme_color: '#0079d2',
        start_url: './index.html',
        lang: 'zh-Hant-HK',
        dir: 'ltr',
        orientation: 'portrait',
        icons: [
          {
            src: 'img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'img/icons/android-chrome-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'img/icons/android-chrome-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    AutoImport({
      imports: [
        'vue'
      ],
      eslintrc: { enabled: true },
      dirs: ['src/assets/js/**', 'src/store'],
    }),
    Components({
      dirs: ['src/components'],
      resolvers: [NaiveUiResolver()],
    }),
    StylelintPlugin({
      fix: true,
    }),
    eslintPlugin({
      include: ['src/**/*.vue', 'src/**/*.js'],
    }),
    Unocss({
      presets: [
        presetWind(),
        presetAttributify(),
      ],
    })
  ],
  css: {
    postcss: {
      plugins: [postcssNested, postcssPresetEnv],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  }
})
