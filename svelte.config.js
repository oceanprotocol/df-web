import sveltePreprocess from "svelte-preprocess";

export default {
  preprocess: sveltePreprocess({
    // Disable typing errors (typeCheck: false) if using TypeScript
    typescript: {
      // turn off type checking
      typeCheck: false,
    },
  }),
};
