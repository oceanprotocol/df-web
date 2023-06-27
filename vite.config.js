import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import vitePreprocess from "svelte-preprocess";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: "/",
    plugins: [
      svelte({
        preprocess: vitePreprocess(),
      }),
    ],
  });
};
