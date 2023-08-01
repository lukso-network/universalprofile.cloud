// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
    domain: 'wallet.lukso.network',
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
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
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
