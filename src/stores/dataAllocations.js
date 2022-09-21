import { writable } from "svelte/store";

export let dataAllocations = writable([]);
export let totalUserAllocation = writable(0);