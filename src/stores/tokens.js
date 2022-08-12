import { writable, get } from "svelte/store";
import {userAddress}from "./web3"
import {balanceOf,getOceanTokenAddressByChainId} from "../utils/tokens"
import {getVeOceanBalance} from "../utils/ve"
import {ethers} from "ethers"

export let userBalances = writable({});
export let tokenContracts = writable({});

const updateUserBalances = (tokenAddress, newBalane) => {
  let newUserBalances = get(userBalances);
    newUserBalances[tokenAddress] = newBalane;
    userBalances.update(() => newUserBalances);
}

export const addUserBalanceToBalances = async (chainId, tokenAddress) => {
    const balanceInWei = await balanceOf(
      get(userBalances),
      chainId,
      tokenAddress,
      get(userAddress)
    );
    const balance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
    updateUserBalances(tokenAddress, balance)
};

export const addUserOceanBalanceToBalances = async (chainId) => {
    const oceanContractAddress = getOceanTokenAddressByChainId(chainId)
    await addUserBalanceToBalances(chainId, oceanContractAddress.toLowerCase())
}

export const addUserVeOceanBalanceToBalances = async (userAddress) => {
  const veOceanBalance = await getVeOceanBalance(userAddress)
  updateUserBalances(process.env.VE_OCEAN_CONTRACT, veOceanBalance)
}

export const getOceanBalance = (chainId) => {
  if(!getOceanTokenAddressByChainId(chainId)) return undefined
  return get(userBalances)[
    getOceanTokenAddressByChainId(chainId).toLowerCase()
  ]
}
  