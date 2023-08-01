import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { copyAssets } from '@lukso/web-components/tools/copy-assets'
import { assets } from '@lukso/web-components/tools/assets'

copyAssets('./public', assets)

const isProduction = process.env.NODE_ENV === 'production'

export default {
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
    // ↓ Needed for build if using WalletConnect and other providers
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
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
}
