import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// @ts-ignore
import { assets } from '@lukso/web-components/tools/assets'
import { copyAssets } from '@lukso/web-components/tools/copy-assets'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import nodePolyfills from 'rollup-plugin-polyfill-node'

import siteMeta from './site.meta.json'

copyAssets('./public', assets)

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  console.log('🚢 🚢 Building for Production')
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: !isProduction },
  app: {
    head: siteMeta,
  },
  components: {
    dirs: [
      // Use this to find all the dirs `find . -name "*.vue" -exec dirname {} \; | sort -u`
      { path: '~/components', sourcemap: true }, // Enable source map generation for components
      {
        path: '~/node_modules/vue-instantsearch/src/components',
        sourcemap: true,
      },
      {
        path: '~/domains/rpc/components',
        sourcemap: true,
      },
      {
        path: '~/domains/graph/components',
        sourcemap: true,
      },
      {
        path: '~/layouts',
        sourcemap: true,
      },
    ],
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
    '@pinia-orm/nuxt',
    '@nuxt/test-utils/module',
    '@vite-pwa/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/algolia',
    'nuxt-graphql-client',
    'nuxt-swiper',
  ],
  ...({
    plausible: {
      domain: 'universalprofile.cloud',
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
          include: ['node_modules/**/*.js', /node_modules\/.vite\/.*js/],
        }),
      ...(process.env.NUXT_PUBLIC_SENTRY_AUTH_TOKEN
        ? [
            sentryVitePlugin({
              authToken: process.env.NUXT_PUBLIC_SENTRY_AUTH_TOKEN,
              debug: true,
              org: 'lukso',
              project: 'universalprofile-cloud',
              sourcemaps: {
                assets: ['./.nuxt/dist/client/**'],
                deleteFilesAfterUpload: '**/*.map',
              },
              telemetry: false,
            }),
          ]
        : []),
    ],
    build: {
      rollupOptions: {
        plugins: [
          // ↓ Needed for build
          nodePolyfills(),
        ],
        sourcemap: true,
        onwarn(warning, warn) {
          // If we can't show which files have bad source map then we might as well not show the error/warning
          if (warning.message.includes('Sourcemap is likely to be incorrect')) {
            if (warning.loc?.file || warning.id) {
              console.warn(
                `${warning.message} ${warning.loc?.file || warning.id || 'unknown file'}`
              )
            }
            return
          }
          warn(warning) // Default behavior
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        sourceMap: true,
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
      // Don't generate source maps for vue files in node_modules.
      exclude: isProduction ? ['node_modules/**/*.vue'] : [],
      esbuildOptions: {
        sourcemap: true,
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
      sourceMap: true,
      isCustomElement: (tag: string) => {
        return tag.startsWith('lukso-')
      },
    },
  },
  imports: {
    dirs: [
      'stores/**',
      'shared/**',
      'utils/**',
      'types/**',
      'composables/**',
      'domains/**',
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
      RAMP_API_KEY: process.env.NUXT_PUBLIC_RAMP_API_KEY,
      BUILD_VERSION: process.env.GITHUB_SHA || 'debug',
      API_SHARED_SECRET: process.env.NUXT_PUBLIC_API_SHARED_SECRET,
    },
  },
  pwa: {
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    manifest: {
      name: 'UP dApp Caching PWA',
      short_name: 'up-dapp-pwa',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/favicon.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: '/apple-touch-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
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
    devOptions: isProduction
      ? {}
      : {
          enabled: true,
          disableDevLogs: true,
          suppressWarnings: true,
          navigateFallback: '/',
          navigateFallbackAllowlist: [/^\/$/],
          type: 'module',
        },
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    sourceMaps: true,
  },
  'graphql-client': {
    watch: true,
    autoImport: true,
    functionPrefix: 'Gql',
    documentPaths: ['./'],
    preferGETQueries: false,
    codegen: true,
    clients: {
      default: {
        host: 'https://envio.lukso-mainnet.universal.tech/v1/graphql',
      },
    },
  },
  extends: ['./domains/rpc', './domains/graph', './domains/grid'],
})
