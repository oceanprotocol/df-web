import { writable } from "svelte/store";
import { ethers } from "ethers";
import { getRPCProvider } from "./web3";
import * as BPoolABI from "../utils/abis/BPoolABI";

export let poolContracts = writable("");

export async function getPoolContract(chainId, address) {
  const provider = getRPCProvider(chainId);
  let contracts = $poolContracts;
  if( contracts[chainId] === undefined ) {
    contracts[chainId] = {};
    poolContracts.set(contracts);
  }

  if( contracts[chainId][address] === undefined ) {
    contracts[chainId][address] = new ethers.Contract(address, BPoolABI.default, provider);
    poolContracts.set(contracts)
  }
  return contracts[chainId][address];
}
