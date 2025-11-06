<script>
    import { useTinyRouter } from "svelte-tiny-router";
    import { onMount } from "svelte";

    export let to = "/rewards";
    
    const router = useTinyRouter();
    
    onMount(() => {
        const currentPath = router?.fullPath || router?.path || window.location.pathname;
        // Always redirect to the specified path if it's different from current
        if (to && to !== currentPath) {
            if (router) {
                router.navigate(to, { replace: true });
            } else {
                window.location.replace(to);
            }
        }
    });
</script>
  