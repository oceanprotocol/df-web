import { writable } from "svelte/store";
import { ethers } from "ethers";
import { getJsonRpcProvider } from "./web3";
import * as TokenABI from "../utils/abis/tokenABI";

export let userBalances = writable({});
export let tokenContracts = writable({});

export async function getTokenContract(chainId, address) {
  try {
    const provider = getJsonRpcProvider(chainId);
    if( tokenContracts[chainId] === undefined ) {
      tokenContracts[chainId] = {};
      tokenContracts.set(tokenContracts);
    }

    if( tokenContracts[chainId][address] === undefined ) {
      console.log("address is: ", address);
      console.log("TokenABI.default is: ", TokenABI.default);
      console.log("jsonRpcProvider is: ", provider);

      tokenContracts[chainId][address] = new ethers.Contract(address, TokenABI.default, provider);
      tokenContracts.set(tokenContracts);
    }

    return tokenContracts[chainId][address];
  } catch (err) {
    console.error(err);
  }
}

export async function balanceOf(chainId, tokenAddress, account) {
  try {
    console.log("Token address is: ", tokenAddress);
    const tokenContract = await getTokenContract(chainId, tokenAddress);
    console.log("Token contract is: ", tokenContract);

    if (userBalances[chainId] === undefined) {
      userBalances[chainId] = {};
    }

    userBalances[chainId][tokenAddress] = await tokenContract.balanceOf(account);
    userBalances.set(userBalances);

    return userBalances[chainId][tokenAddress];
  } catch(err) {
    console.error(err);
  }
}
