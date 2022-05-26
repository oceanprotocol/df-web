import { writable } from "svelte/store";
import { ethers } from "ethers";
import { getRPCProvider } from "./web3";
import * as TokenABI from "../utils/abis/tokenABI";

export let userBalances = writable("");
export let tokenContracts = writable("");

export async function getTokenContract(chainId, address) {
  const provider = getRPCProvider(chainId);
  const contracts = $tokenContracts;
  if( contracts[chainId] === undefined ) {
    contracts[chainId] = {};
    tokenContracts.set(contracts);
  }

  if( contracts[chainId][address] === undefined ) {
    contracts[chainId][address] = new ethers.Contract(address, TokenABI.default, provider);
    tokenContracts.set(contracts);
  }

  return contracts[chainId][address];
}

export async function balanceOf(chainId, tokenAddress, account) {
  const tokenContract = getTokenContract(chainId, tokenAddress);
  const userBalance = tokenContract.balanceOf(account);

  const balances = $userBalances;
  if( balances[chainId] === undefined ) {
    balances[chainId] = {};
  }

  balances[chainId][tokenAddress] = userBalance;
  userBalances.set(balances);

  return balances[chainId][tokenAddress];
}
