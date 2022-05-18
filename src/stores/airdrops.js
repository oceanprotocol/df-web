import { writable } from "svelte/store";
import { airdrops as airdropData} from "../utils/airdrops"
import {web3Provider} from "./web3";

export let contracts = writable("");
export let airdrops = writable("");

// TODO - Move contract initialization from airdrops.js to here
export const initValues = () => {
    airdrops.set(airdropData);
}
