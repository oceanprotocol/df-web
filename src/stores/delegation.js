import { writable } from "svelte/store";

export let delegated = writable(null)
export let delegationExpiry = writable(null);
export let delegationReceived = writable(null);
