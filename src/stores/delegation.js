import { writable } from "svelte/store";

export let delegationExpiry = writable(null);
export let delegationReceived = writable(null);
