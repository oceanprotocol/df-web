import { writable } from "svelte/store";
import { ethers } from "ethers";
import * as networksDataArray from "../networks-metadata.json";
import {networkSigner, userAddress, web3} from "./web3";

export let contracts = writable("");

// TODO - Move contract initialization from airdrops.js to here
