import nodePolyfills from 'rollup-plugin-polyfill-node'
import { copyAssets } from '@lukso/web-components/tools/copy-assets'
// @ts-ignore
import { assets } from '@lukso/web-components/tools/assets'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { sentryVitePlugin } from '@sentry/vite-plugin'

import siteMeta from './site.meta.json'

copyAssets('./public', assets)

const isProduction = process.env.NODE_ENV === 'production'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: siteMeta,
  },
  typescript: {
    strict: true,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/plausible',
    '@nuxtjs/algolia',
    '@pinia-orm/nuxt',
    '@nuxt/test-utils/module',
  ],
  ...({
    plausible: {
      domain: 'wallet.universalprofile.cloud',
    },
  } as any),
  device: {
    refreshOnResize: true,
  },
  tailwindcss: {
    config: {
      presets: [require('./tailwind.config')],
      content: [], // it already merges with nuxt default config https://tailwindcss.nuxt.dev/tailwind/config#merging-strategy
    },
    cssPath: '~/assets/styles/main.scss',
  },
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
    plugins: [
      // ↓ Needed for development mode
      !isProduction &&
        nodePolyfills({
          include: [
            'node_modules/**/*.js',
            new RegExp('node_modules/.vite/.*js'),
          ],
        }),
      sentryVitePlugin({
        authToken: process.env.NUXT_PUBLIC_SENTRY_AUTH_TOKEN,
        debug: true,
        org: 'lukso',
        project: 'wallet-universalprofile-cloud',
        sourcemaps: {
          assets: ['./.nuxt/dist/client/**'],
        },
        telemetry: false,
      }),
    ],
    build: {
      rollupOptions: {
        plugins: [
          // ↓ Needed for build
          nodePolyfills(),
        ],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      sourcemap: true,
    },
    resolve: {
      alias: {
        process: 'process/browser',
        stream: 'stream-browserify',
        http: 'stream-http',
        https: 'agent-base',
        zlib: 'browserify-zlib',
        util: 'util',
        buffer: 'buffer',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          // @ts-ignore
          NodeGlobalsPolyfillPlugin({
            buffer: true, // fixes `Buffer is not defined` error
          }),
        ],
      },
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => {
        return tag.startsWith('lukso-')
      },
    },
  },
  imports: {
    dirs: [
      'stores/**',
      'shared/**',
      'models/**',
      'repositories/**',
      'utils/**',
      'types/**',
    ],
  },
  ssr: false,
  spaLoadingTemplate: 'public/loading-template.html',
  piniaPersistedstate: {
    storage: 'localStorage',
  },
  runtimeConfig: {
    public: {
      SENTRY_ENABLED: process.env.NUXT_PUBLIC_SENTRY_ENABLED,
      SENTRY_DSN: process.env.NUXT_PUBLIC_SENTRY_DSN,
      SENTRY_ENVIRONMENT: process.env.NUXT_PUBLIC_SENTRY_ENVIRONMENT,
      TRANSAK_API_KEY: process.env.NUXT_PUBLIC_TRANSAK_API_KEY,
      BUILD_VERSION: process.env.NUXT_PUBLIC_BUILD_VERSION || 'debug',
    },
  },
})
