import nodePolyfills from 'rollup-plugin-polyfill-node'
import { copyAssets } from '@lukso/web-components/tools/copy-assets'
import { assets } from '@lukso/web-components/tools/assets'

copyAssets('./public', assets)

const isProduction = process.env.NODE_ENV === 'production'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: !isProduction },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/images/favicon.png' }],
      title: 'LUKSO Wallet',
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
    '@nuxtjs/device',
    '@nuxtjs/plausible',
  ],
  plausible: {
    domain: 'migrate.lukso.network',
  },
  device: {
    refreshOnResize: true,
  },
  tailwindcss: {
    config: {
      presets: [require('@lukso/web-components/tailwind.config')],
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
    },
    resolve: {
      alias: {
        process: 'process/browser',
        stream: 'stream-browserify',
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
    dirs: ['stores'],
  },
  runtimeConfig: {
    public: {},
  },
  ssr: false,
})
