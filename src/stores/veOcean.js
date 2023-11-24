import { writable } from "svelte/store";

export let lockedOceanAmount = writable(0);
export let veOcean = writable(0);
export let veOceanWithDelegations = writable(0);
export let oceanUnlockDate = writable(null)
export let veBalances = writable(null)
export let veUserBalances = writable(null)
export let totalVeOceanSupply = writable(null)