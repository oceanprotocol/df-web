import { writable, get } from "svelte/store";
import {userAddress, web3Provider}from "./web3"
import {balanceOf} from "../utils/tokens"
import {getVeOceanBalance} from "../utils/ve"
import {ethers} from "ethers"
import {getAddressByChainIdKey} from "../utils/address/address";

export let userBalances = writable({});
export let tokenContracts = writable({});

const updateUserBalances = (tokenAddress, newBalance) => {
  let newUserBalances = get(userBalances);
    newUserBalances[tokenAddress] = newBalance;
    userBalances.update(() => newUserBalances);
}

export const addUserBalanceToBalances = async (chainId, tokenAddress) => {
    const balanceInWei = await balanceOf(
      get(userBalances),
      chainId,
      tokenAddress,
      get(userAddress),
      get(web3Provider)
    );
    const balance = ethers.utils.formatEther(BigInt(balanceInWei).toString(10));
    updateUserBalances(tokenAddress, balance)
};

export const addUserOceanBalanceToBalances = async (chainId) => {
    const oceanContractAddress = getAddressByChainIdKey(chainId, "Ocean")
    await addUserBalanceToBalances(chainId, oceanContractAddress.toLowerCase())
}

export const addUserVeOceanBalanceToBalances = async (userAddress, provider) => {
  const veOceanBalance = await getVeOceanBalance(userAddress, provider)
  updateUserBalances(
    getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veOCEAN"),
    veOceanBalance
  )
}

export const getOceanBalance = (chainId) => {
  if(!getAddressByChainIdKey(chainId, "Ocean")) return undefined
  return get(userBalances)[
    getAddressByChainIdKey(chainId, "Ocean").toLowerCase()
  ]
}
  