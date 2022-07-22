import { writable, get } from "svelte/store";
import {userAddress}from "./web3"
import {balanceOf,getOceanTokenAddressByChainId} from "../utils/tokens"
import {ethers} from "ethers"

export let userBalances = writable({});
export let tokenContracts = writable({});

export const addUserBalanceToBalances = async (chainId, tokenAddress) => {
    const balanceInWei = await balanceOf(
      get(userBalances),
      chainId,
      tokenAddress,
      get(userAddress)
    );
    const balance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
    let newUserBalances = get(userBalances);
    newUserBalances[tokenAddress] = balance;
    userBalances.update(() => newUserBalances);
};

export const addUserOceanBalanceToBalances = async (chainId) => {
    const oceanContractAddress = getOceanTokenAddressByChainId(chainId)
    await addUserBalanceToBalances(chainId, oceanContractAddress.toLowerCase())
}

export const getOceanBalance = (chainId) => {
  console.log(get(userBalances))
  return get(userBalances)[
    getOceanTokenAddressByChainId(chainId).toLowerCase()
  ]
}
  