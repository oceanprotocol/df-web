import { writable } from "svelte/store";

export let lockedOceanAmount = writable(0);
export let veOcean = writable(undefined);
export let veOceanWithDelegations = writable(0);
export let oceanUnlockDate = writable(undefined)