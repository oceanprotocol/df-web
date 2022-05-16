import { writable } from "svelte/store";
import { airdrops as airdropData} from "../utils/airdrops"

export let contracts = writable("");
export let airdrops = writable("");

// TODO - Move contract initialization from airdrops.js to here
