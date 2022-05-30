import { writable } from "svelte/store";
import { ethers } from "ethers";
import {getJsonRpcProvider, getRpcUrlByChainId} from "./web3";
import * as TokenABI from "../utils/abis/tokenABI";

export let userBalances = writable({});
export let tokenContracts = writable({});

export async function getTokenContract(chainId, address) {
  try {
    const rpcURL = getRpcUrlByChainId(chainId);
    if( rpcURL ) {
      const provider = new ethers.providers.JsonRpcProvider(rpcURL);
      return new ethers.Contract(address, TokenABI.default, provider);
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

export async function balanceOf(balances, chainId, tokenAddress, account) {
  try {
    const tokenContract = await getTokenContract(chainId, tokenAddress);
    if (balances[chainId] === undefined) {
      balances[chainId] = {};
    }

    const balance = await tokenContract.balanceOf(account);
    balances[chainId][tokenAddress] = balance;
    userBalances.set(balances);

    return balances[chainId][tokenAddress];
  } catch(err) {
    console.error(err);
  }
}
