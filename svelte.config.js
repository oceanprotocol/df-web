import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess({
    // Disable typing errors (typeCheck: false) if using TypeScript
    typescript: {
      // turn off type checking
      typeCheck: false,
    },
  }),
};
