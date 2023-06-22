import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import vitePreprocess from "svelte-preprocess";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
    }),
  ],
});
