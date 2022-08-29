import { writable } from "svelte/store";

export let lockedOceanAmount = writable(undefined);
export let veOcean = writable(undefined);
export let veOceanWithDelegations = writable(undefined);
export let oceanUnlockDate = writable(undefined)