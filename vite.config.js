import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { terser } from 'rollup-plugin-terser';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}

  return defineConfig({
  
  plugins: [svelte(), nodePolyfills({
    include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
  })],
  optimizeDeps:{
    include: [
      'node_modules/**/*.js'
    ]
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
