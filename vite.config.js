import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}

  return defineConfig({
  
  plugins: [svelte(), nodePolyfills({
    include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
  })],
  server: {
    port: 3000, // Replace with the port number you want to use
    host: 'localhost' // Replace with the host name you want to use
  },
  define: {
    "global": {},
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
}
