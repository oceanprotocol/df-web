import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import nodePolyfills from "rollup-plugin-node-polyfills";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      svelte(),
      commonjs({
        transformMixedEsModules: true,
      }),
      nodePolyfills(),
      {
        ...nodeResolve(),
        enforce: "post", // Run after other plugins
      },
    ],
    server: {
      port: 3000, // Replace with the port number you want to use
      host: "localhost", // Replace with the host name you want to use
    },
    define: {
      "window.global": {},
    },
    build: {
      target: "es2020", // Set the target to ES2020
      polyfillDynamicImport: false, // Disable dynamic import polyfill
    },
  });
};
