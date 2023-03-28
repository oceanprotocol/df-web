import { writable } from "svelte/store";

export let dataAllocations = writable();
export let totalUserAllocation = writable(0);
export let veAllocations = writable(null)
export let veUserAllocations = writable(null)