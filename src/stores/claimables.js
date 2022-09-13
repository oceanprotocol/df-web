import { writable } from "svelte/store";

export let veEstimate = writable(undefined);
export let veClaimables = writable(undefined);
export let dfEstimate = writable(undefined);
export let dfClaimables = writable(undefined);